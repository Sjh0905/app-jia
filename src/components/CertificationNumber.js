/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image, BackHandler} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import StyleConfigs from '../style/styleConfigs/StyleConfigs';
import BaseButton from '../components/baseComponent/BaseButton';
import dashedLine from '../assets/BaseAssets/dashed-line.png';
import smallImage from '../assets/CertificationNumber/small-image.png';
import MyConfirm from './baseComponent/MyConfirm'
import Toast from "react-native-root-toast";


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    // 专用loading
    @observable
    uploading = false;

    @observable
    loadingText = '';

    @observable
    cardType = 1; // 0 人像面 1 国徽面

    // 是否显示退出框 0 不显示 1 显示
    @observable
    showExit = 0

    @observable
    randomNumber = null;

    @observable
    tokenRandomNumber = null;

    @observable
    form = null;

    // 显示重新获取按钮
    @observable
    showErrorButton = true;


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount();
        this.from = this.$beforeParams && this.$beforeParams.from || ''; // 传进来的身份证类型
        this.addListenBack();
        this.getRandomNumber();
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
        this.removeListenBack();
    }

    /*----------------------- 函数 -------------------------*/

    // 后退
    @action
    goBack = () => {
        this.notify({key: 'GET_IDENTITY_INFO'})
        this.$router.goBackToRoute(this.from);
    }

    @action
    // 监听返回键
    addListenBack = ()=>{
        BackHandler.addEventListener("hardwareBackPress", this.onPressBack);
    }
    @action
    removeListenBack = ()=>{
        BackHandler.addEventListener("hardwareBackPress", this.onPressBack);
    }

    @action
    onPressBack = ()=>{
        let routers = this.$router.state.routes;
        if(routers[routers.length - 1].routeName !== 'CertificationNumber'){
            // 不是自己不处理
            return false;
        }
        this.goBack();
        return true;
    }

    // 获取朗读随机数
    @action
    getRandomNumber = ()=>{
        this.loading = true;
        this.showErrorButton = false;
        let bizNumber = new Date().getTime() + this.$store.state.authMessage.userId + '' + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
        this.$http.send('AUTH_RANDOM_NUMBER', {
            bind: this, params: {
                biz_no: bizNumber
            },
            callBack: this.re_getRandomNumber,
            errorHandler: this.err_getRandomNumber,
            timeoutHandler:this.timeout_getRandomNumber,
        })
    }

    // 获取朗读随机数结果
    @action
    re_getRandomNumber = (data)=>{
        this.loading = false;
        console.log('获取朗读随机数结果',data)
        if(data && data.result === 'SUCCESS'){
            data.dataMap && data.dataMap.random_number && (this.randomNumber = data.dataMap.random_number);
            data.dataMap && data.dataMap.token_random_number && (this.tokenRandomNumber = data.dataMap.token_random_number);
            if(this.randomNumber == null || this.tokenRandomNumber == null){
                this.showErrorButton = true;
            }
        }else{
            this.showErrorButton = true;
            // 让用户重新点击按钮 不再抛出错误信息了
            return;
            // let errMessage = '请重试';
            // switch (data.errCode.toString()){
            //     case '1': errMessage = '用户未登录';break;
            //     case '10': errMessage = '某个参数解析出错(比如必须是数字,但是输入的是非数字字符串; 或者长度过长,或者照片无法解析)';break;
            //     case '11': errMessage = '缺少某个必选参数';break;
            //     case '12': errMessage = 'api_key和api_secret不匹配';break;
            //     case '13': errMessage = '并发数超过限制';break;
            //     case '14': errMessage = '所调用的API不存在';break;
            //     case '16': errMessage = '服务器内部错误，当此类错误发生时请再次请求，如果持续出现此类错误，请及时联系 FaceID 客服或商务';break;
            //     case '18': errMessage = '图片的像素不符合要求，图片像素过大或者过小';break;
            //     case '29': errMessage = 'token不存在、过期、或格式错误、或不是同一个API Key调用的所返回的token';break;
            //     case '36': errMessage = 'api_key被停用、调用次数超限、没有调用此API的权限，或者没有以当前方式调用此API的权限。';break;
            // }
            // this.$globalFunc.toast(errMessage);
        }
    }

    // 获取朗读随机数报错了
    @action
    err_getRandomNumber = (err)=>{
        this.loading = false;
        this.showErrorButton = true;
        console.log('获取朗读随机数报错了',err)
    }

    // 获取朗读随机数超时
    @action
    timeout_getRandomNumber = ()=>{
        this.loading = false;
        this.showErrorButton = true;
        console.log('获取朗读随机数超时')
    }

    @action
    onPressTips = ()=>{
        this.$router.push('VideoRecordingInstructions');
    }

    @action
    onPressNext = ()=>{
        if(this.showErrorButton){
            return;
        }
        if(this.tokenRandomNumber === null){
            return;
        }

        this.$router.push('VideoCertification',{
            from: this.from,
            tokenRandomNumber: this.tokenRandomNumber
        });
    }

    // 点击退出
    @action
    onPressExit = ()=>{
        this.showExit = 1;
    }

    // 继续验证
    @action
    onContinue = ()=>{
        this.showExit = 0;
    }

    // 确认退出
    @action
    onExit = ()=>{
        this.showExit = 0;
        // 启动动画loading
        this.loadingText = '正在退出';
        this.uploading = true;
        this.$http.send('EXIT_AUTHENTICATION', {
            bind: this,
            timeoutHandler: this.timeout_exitCertification,
            callBack: this.re_exitCertification,
            errorHandler: this.error_exitCertification
        })
    }

    // 退出超时
    @action
    timeout_exitCertification = ()=>{
        this.uploading = false;
        console.log('退出验证超时');
    }

    // 退出回调
    @action
    re_exitCertification = (data)=>{
        this.uploading = false;
        console.log('退出验证',data);
        if(data.result === 'SUCCESS'){
            this.goBack();
        }else{
            let errMessage = '请重试';
            switch (data.errorCode.toString()){
                case '1':errMessage = '用户未登录'; break;
                case '2':errMessage = '该用户已经通过身份验证'; break;
            }
            Toast.show(errMessage, {
                duration: 3000,
                position: Toast.positions.CENTER
            })
        }
    }

    error_exitCertification = (ex)=>{
        this.uploading = false;
        console.log('退出验证异常',ex);
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.container]}>
                <View style={styles.topSplit}></View>
                <NavHeader headerTitle={'人脸识别'} goBack={this.goBack}/>
                <View style={styles.box}>
                    <View style={[styles.titleBox,styles.rowItem]}>
                        <View><Text allowFontScaling={false} style={styles.title}>录制一段自己朗读如下数字的视频</Text></View>
                        {/*<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onPressTips}><Text allowFontScaling={false} style={styles.tipText}>录制小贴士</Text></TouchableOpacity>*/}
                    </View>
                    <View style={[styles.vadioImageBox]}>
                        <Image
                            source={smallImage}
                            style={styles.smallImage}
                        />
                        <View style={styles.NumberBox}>
                            <View style={styles.rowBox}>
                                {/*<Text allowFontScaling={false} style={styles.cycleBlue}>●</Text>*/}
                                <Text allowFontScaling={false} style={styles.discribeText}>请使用</Text>
                                <Text allowFontScaling={false} style={[styles.discribeText,styles.textRed]}>前置摄像头</Text>
                            </View>
                            <View style={styles.rowBox}>
                                {/*<Text allowFontScaling={false} style={styles.cycleBlue}>●</Text>*/}
                                <Text allowFontScaling={false} style={styles.discribeText}>请用</Text>
                                <Text allowFontScaling={false} style={[styles.discribeText,styles.textRed]}>普通话读一遍</Text>
                            </View>
                            <View style={styles.rowBox}>
                                {/*<Text allowFontScaling={false} style={styles.cycleBlue}>●</Text>*/}
                                <Text allowFontScaling={false} style={styles.discribeText}>视频时长</Text>
                                <Text allowFontScaling={false} style={[styles.discribeText,styles.textRed]}>3~5秒</Text>
                            </View>
                        </View>
                    </View>

                    {!this.showErrorButton &&
                        <View style={[styles.randomNumberBox]}>
                            <Text style={styles.textNumber}>{this.randomNumber}</Text>
                        </View>
                    }
                    {!!this.showErrorButton &&
                        <View style={[styles.randomNumberBox]}>
                            <Text style={styles.textError}>{'获取数字失败'}</Text>
                            <BaseButton
                                onPress={this.getRandomNumber}
                                style={[baseStyles.btnBlue,styles.getNumberBtn]}
                                textStyle={[baseStyles.textWhite,styles.smallButton]}
                                text={'重新获取'}/>
                        </View>
                    }
                    {/*<View style={[styles.line,styles.rowItem]}>*/}
                        {/*<Image source={dashedLine} style={styles.image} resizeMode={'stretch'}/>*/}
                    {/*</View>*/}
                    {/*<View style={[styles.line]}>*/}
                        {/*<View style={styles.cycleLeft}>*/}

                        {/*</View>*/}
                        {/*<View style={styles.cycleRight}>*/}

                        {/*</View>*/}
                    {/*</View>*/}
                    {/*<View style={[styles.bottomBox,styles.rowItem]}>*/}
                        {/**/}
                        {/*<BaseButton*/}
                            {/*onPress={this.onPressExit}*/}
                            {/*style={[baseStyles.btnWhite,styles.button,styles.splitTop]}*/}
                            {/*textStyle={[baseStyles.btnTextColorWhite,styles.smallButton]}*/}
                            {/*text={'退出验证'}/>*/}
                    {/*</View>*/}

                </View>
                <BaseButton
                    onPress={this.onPressNext}
                    style={[styles.btnbot]}
                    textStyle={[baseStyles.textWhite,styles.bigButton]}
                    text={'开始录制视频'}/>
                {!!this.showExit && <MyConfirm title={'确认退出'} message={'请确认是否退出验证流程~'} okText={'继续验证'} cancelText={'退出验证'} close={false} onSure={this.onContinue} onCancel={this.onExit}/>}
                {/*{*/}
                    {/*!!this.uploading && <View style={styles.loadingBox}>*/}
                        {/*<View style={[styles.loadingBox,styles.loadingBackground]}></View>*/}
                        {/*<View style={styles.loading}>*/}
                            {/*<Text allowFontScaling={false} style={styles.loadingTextBig}>{this.loadingText}</Text>*/}
                            {/*<View style={styles.loadingImageBox}>*/}
                                {/*<Image style={styles.loadingImage} source={null} resizeMode={'contain'}/>*/}
                            {/*</View>*/}
                            {/*<Text allowFontScaling={false} style={styles.loadingTextSmall}>{this.loadingText}</Text>*/}
                            {/*<View style={styles.leftTopBox}></View>*/}
                            {/*<View style={styles.leftBottomBox}></View>*/}
                            {/*<View style={styles.rightTopBox}></View>*/}
                            {/*<View style={styles.rightBottomBox}></View>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                {/*}*/}
                {/*加载中*/}
                {
                    !!this.uploading && <Loading leaveNav={false}/>
                }
                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'red'
        backgroundColor: StyleConfigs.bgColor,
        paddingBottom: getDeviceBottom()
    },
    topSplit: {
        backgroundColor: StyleConfigs.navBgColor0602,
        height: getDeviceTop()
    },
    box:{
        backgroundColor: '#fff',
        marginTop: getHeight(42),
        marginLeft: getHeight(20),
        marginRight: getHeight(20),
        borderRadius: 6,
        paddingTop: getHeight(34),
        paddingBottom: getHeight(20)
    },
    rowItem:{
        marginLeft: getWidth(36),
        marginRight: getWidth(36),
    },
    titleBox:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title:{
        fontSize: 15,
        fontWeight: 'bold',
        color:StyleConfigs.txt172A4D
    },
    tipText:{
        fontSize: 12,
        color: StyleConfigs.txtBlue,
        marginTop:5,
        marginBottom: 5,
        fontWeight: 'bold'
        // marginRight: getWidth(-14)
    },
    vadioImageBox:{
        height: getWidth(200),
        marginTop: getHeight(74),
        marginBottom: getHeight(114),
        marginLeft: getWidth(20),
        marginRight: getWidth(20),
        // backgroundColor:'green'
        // borderRadius: 4,
        // borderColor: '#E3E3E3',
        // borderStyle: 'dashed',
        // borderWidth: 1
    },
    smallImage:{
        position: 'absolute',
        bottom: -1,
        left: getWidth(20),
        width: getWidth(164),
        height: getWidth(154)
    },
    image:{
        width: '100%',
        height: '100%'
    },
    bottomBox:{
        paddingTop: getHeight(54),
    },
    button:{
        width: getWidth(560),
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    splitTop:{
        marginTop: 5,
    },
    line:{
        height: 3,
    },
    cycleLeft:{
        height: 20,
        width: 10,
        backgroundColor: StyleConfigs.bgColor,
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        position: 'absolute',
        top: -11,
        left: 0
    },
    cycleRight:{
        height: 20,
        width: 10,
        backgroundColor: StyleConfigs.bgColor,
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        position: 'absolute',
        top: -11,
        right: 0
    },
    bigButton:{
        fontSize: 18,
    },
    smallButton:{
        fontSize: 14
    },
    NumberBox:{
        marginTop:getHeight(40),
        marginLeft: getWidth(364),
        // flex: 1,
        // backgroundColor:'yellow'
    },
    cycleBlue:{
        fontSize: 9,
        color: StyleConfigs.txtBlue,
        marginRight: getWidth(10)
    },
    rowBox:{
        height: getHeight(40),
        marginBottom: getHeight(22),
        flexDirection: 'row',
        alignItems: 'center'
    },
    discribeText:{
        fontSize:14,
        color: StyleConfigs.txt172A4D,
        fontWeight:'bold',
        fontFamily: 'PingFangSC-Semibold'
    },
    textRed:{
        color: StyleConfigs.txtBlue
    },
    textNumber:{
        fontSize: 72,
        // marginTop: getHeight(38),
        color: StyleConfigs.txtB5BCC6,
        fontWeight: 'bold',
        fontFamily: 'PingFangSC-Semibold'
    },

    loadingBox:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        alignItems:'center'
    },
    loadingBackground:{
        backgroundColor: '#000',
        opacity: 0.5
    },
    loading:{
        backgroundColor: '#fff',
        width: getWidth(480),
        height: getWidth(450),
        marginTop: getHeight(326),
        alignItems: 'center',
    },
    loadingTextBig:{
        fontSize: 20,
        color: '#333',
        marginTop: getHeight(72)
    },
    loadingTextSmall:{
        fontSize: 14,
        color: '#666',
        marginBottom: getHeight(74)
    },
    loadingImageBox:{
        flex: 1
    },
    leftTopBox:{
        position: 'absolute',
        width: getWidth(20),
        height: getWidth(20),
        top: getWidth(13),
        left: getWidth(13),
        borderColor: '#979797',
        borderLeftWidth: 1,
        borderTopWidth: 1
    },
    leftBottomBox:{
        position: 'absolute',
        width: getWidth(20),
        height: getWidth(20),
        bottom: getWidth(13),
        left: getWidth(13),
        borderColor: '#979797',
        borderLeftWidth: 1,
        borderBottomWidth: 1
    },
    rightTopBox:{
        position: 'absolute',
        width: getWidth(20),
        height: getWidth(20),
        top: getWidth(13),
        right: getWidth(13),
        borderColor: '#979797',
        borderRightWidth: 1,
        borderTopWidth: 1
    },
    rightBottomBox:{
        position: 'absolute',
        width: getWidth(20),
        height: getWidth(20),
        bottom: getWidth(13),
        right: getWidth(13),
        borderColor: '#979797',
        borderRightWidth: 1,
        borderBottomWidth: 1
    },
    loadingImage:{
        flex: 1
    },
    getNumberBtn:{
        marginTop: getHeight(14),
        width: getWidth(96 * 2),
        // marginLeft: getWidth(-100),
        paddingTop: getHeight(20),
        paddingBottom: getHeight(20),
        borderRadius: StyleConfigs.borderRadius1o5
    },
    btnbot: {
        position:'absolute',
        left:getWidth(30),
        bottom:getWidth(30),
        width:getWidth(DefaultWidth-60),
        height: getHeight(88),
        backgroundColor: StyleConfigs.btnBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: StyleConfigs.borderRadius1o5,
    },
    randomNumberBox:{
        marginLeft: -getHeight(20),
        width:getWidth(DefaultWidth),
        height:100,
        backgroundColor:StyleConfigs.bgF6F6F6,
        justifyContent:'center',
        alignItems:'center'
    },
    textError:{
        fontSize:StyleConfigs.fontSize12,
        color:StyleConfigs.txtBlue
    }
})