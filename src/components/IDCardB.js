/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, BackHandler} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import StyleConfigs from '../style/styleConfigs/StyleConfigs';
import BaseButton from '../components/baseComponent/BaseButton';
import dashedLine from '../assets/BaseAssets/dashed-line.png';
import device from "../configs/device/device";
import MyConfirm from './baseComponent/MyConfirm';
import Toast from "react-native-root-toast";


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 滚动状态 0 不显示 1 显示
    @observable
    scrollState = 0;

    // 是否显示退出框 0 不显示 1 显示
    @observable
    showExit = 0

    // 加载中
    @observable
    loading = false

    // 专用loading
    @observable
    uploading = false;

    @observable
    loadingText = '';

    @observable
    imageBoxHeight = 0;

    @observable
    cardType = 0; // 0 人像面 1 国徽面

    @observable
    from = null;

    @observable
    IDCardData = {

    }


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super();
        this.cardType = this.$beforeParams && this.$beforeParams.cardType || 0; // 传进来的身份证类型
        this.from = this.$beforeParams && this.$beforeParams.from || ''; // 传进来的身份证类型
        this.IDCardData = this.$beforeParams && this.$beforeParams.data || {};
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.addListenBack();
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
        this.removeListenBack();
    }

    /*----------------------- 函数 -------------------------*/

    // 监听返回键
    addListenBack = ()=>{
        BackHandler.addEventListener("hardwareBackPress", this.onPressBack);
    }
    removeListenBack = ()=>{
        BackHandler.addEventListener("hardwareBackPress", this.onPressBack);
    }

    onPressBack = ()=>{
        let routers = this.$router.state.routes;
        if(routers[routers.length - 1].routeName !== 'IDCardB'){
            // 不是自己不处理
            return false;
        }
        this.goBack();
        return true;
    }

    // 后退
    @action
    goBack = () => {
        this.notify({key: 'GET_IDENTITY_INFO'})
        this.$router.goBackToRoute(this.from);
        // this.$router.goBack()
    }

    @action
    onLayoutImageBox = (e)=>{
        let width = e.nativeEvent.layout.width;
        this.imageBoxHeight = width * 394/614;
    }

    // 点击了拍摄小贴士
    @action
    onPressTips = ()=>{
        this.$router.push('ShootingInstructions');
    }

    @action
    onShootPhoto = ()=>{
        this.uploadIDCard('openCamera')
    }

    @action
    onChoosePhoto = ()=>{
        this.uploadIDCard('openPicker')
    }

    // 当滚动结束
    @action
    onScrollEnd = (e)=>{
        console.log(e.nativeEvent)
        if(e.nativeEvent && e.nativeEvent.contentOffset && e.nativeEvent.contentOffset.y === 0){
            this.scrollState = 0;
        }
    }

    // 点击上传按钮后的空白区域隐藏按钮
    @action
    scrollBack = ()=>{
        if(this.scrollState === 0){
            return;
        }
        this.refs.scrollView.scrollTo({
            y: 0,
            animated: true
        });
        setTimeout(()=>{
            this.scrollState = 0;
        },100)
    }

    // 点击上传按钮
    @action
    pressBackButton = ()=>{
        this.$router.goBack();

        // this.scrollState = 1;
        // setTimeout(()=>{
        //     this.refs.scrollView.scrollToEnd();
        // })
    }

    @action
    onPressNext = ()=>{
        if(this.cardType === 0){
            this.$router.push('IDCardA',{
                cardType: 1,
                from : this.from
            });
            return;
        }
        if(this.cardType === 1){
            this.$router.push('CertificationNumber',{
                from : this.from
            });
            return;
        }
    }

    // 点击退出
    @action
    onPressExit = ()=>{
        this.showExit = 1;
    }

    // 继续认证
    @action
    onContinue = ()=>{
        this.showExit = 0;
    }

    // 确认退出
    @action
    onExit = ()=>{
        this.showExit = 0;
        this.loadingText = '正在退出';
        this.uploading = true;
        // 启动动画loading
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
        console.log('退出认证超时');
    }

    // 退出回调
    @action
    re_exitCertification = (data)=>{
        this.uploading = false;
        console.log('退出认证',data);
        if(data.result === 'SUCCESS'){
            this.goBack();
        }else{
            let errMessage = '请重试';
            switch (data.errorCode.toString()){
                case '1':errMessage = '用户未登录'; break;
                case '2':errMessage = '该用户已经通过身份认证'; break;
            }
            Toast.show(errMessage, {
                duration: 3000,
                position: Toast.positions.CENTER
            })
        }
    }

    error_exitCertification = (ex)=>{
        this.uploading = false;
        console.log('退出认证异常',ex);
    }


    // 重新上传
    @action
    onUploadAlign = ()=>{
        this.loading = true;
        // 启动动画loading
        this.$http.send('UPLOADA_AGAIN', {
            bind: this,
            params:{
                type: this.cardType && 'reverse' || 'front',
            },
            timeoutHandler: this.timeout_uploadAlign,
            callBack: this.re_uploadAlign,
            errorHandler: this.error_uploadAlign
        })
    }

    // 退出超时
    @action
    timeout_uploadAlign = ()=>{
        this.loading = false;
        console.log('重新上传超时');
    }

    // 退出回调
    @action
    re_uploadAlign = (data)=>{
        this.loading = false;
        console.log('重新上传',data);
        if(data.result === 'SUCCESS'){
            this.$router.goBack();
        }else{
            let errMessage = '请重试';
            switch (data.errorCode.toString()){
                case '1':errMessage = '用户未登录'; break;
                case '2':errMessage = '该用户已经通过身份认证'; break;
            }
            Toast.show(errMessage, {
                duration: 3000,
                position: Toast.positions.CENTER
            })
        }
    }

    error_uploadAlign = (ex)=>{
        this.loading = false;
        console.log('重新上传',ex);
    }

    formitDate = (dateStr)=>{
        let resArr = [];
        for(let i =0; i< dateStr.length; i++){
            resArr.push(dateStr[i]);
            if(i == 3 || i == 5){
                resArr.push('.');
            }
        }
        return resArr.join('');
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.container]}>
                <NavHeader headerTitle={'身份证认证'} goBack={this.goBack}/>
                <View style={styles.box}>
                    {/*<View style={[styles.titleBox,styles.rowItem]}>*/}
                        {/*<View style={styles.rowText}><Text allowFontScaling={false} style={styles.title}>中国大陆公民本人有效</Text><Text allowFontScaling={false} style={[styles.title,styles.textRed]}>二代身份证</Text></View>*/}
                        {/*/!*<BaseButton onPress={this.onPressTips} textStyle={styles.tipText} text={'拍摄小贴士'}/>*!/*/}
                    {/*</View>*/}
                    <View
                        style={[styles.cardImageBox,styles.rowItem,{height: this.imageBoxHeight}]}
                        onLayout={this.onLayoutImageBox}>
                        {
                            !!this.IDCardData.image && <Image style={styles.cardImage} resizeMode={'contain'} source={{
                            uri: this.IDCardData.image
                        }}/>
                        }
                    </View>
                    <View style={styles.center}>
                        {/*<BaseButton onPress={this.onUploadAlign} textStyle={[baseStyles.textBlue,styles.middleButton]} text={'点击重新上传'}/>*/}
                    </View>
                    {
                        this.cardType && <View style={[styles.detailBox,styles.rowItem]}>
                            <Text style={styles.detail}>签发机关：{this.IDCardData.issued_by}</Text>
                            <Text style={styles.detail}>有效期：{this.formitDate(this.IDCardData.valid_date_start) + '-' + this.formitDate(this.IDCardData.valid_date_end)}</Text>
                        </View> || <View style={[styles.detailBox,styles.rowItem]}>
                            <Text style={styles.detail}>姓名：{this.IDCardData.name}</Text>
                            <Text style={styles.detail}>身份证号：{this.IDCardData.idcard_number}</Text>
                        </View>
                    }
                    {/*<View style={[styles.line,styles.rowItem]}>*/}
                        {/*<Image source={dashedLine} style={styles.cardImage} resizeMode={'stretch'}/>*/}
                    {/*</View>*/}
                    <View style={[styles.line]}>
                        <View style={styles.cycleLeft}>

                        </View>
                        <View style={styles.cycleRight}>

                        </View>
                    </View>
                    {/*<View style={[styles.bottomBox,styles.rowItem]}>*/}
                        {/**/}
                        {/*<BaseButton*/}
                            {/*onPress={this.onPressExit}*/}
                            {/*style={[baseStyles.btnWhite,styles.button,styles.splitTop]}*/}
                            {/*textStyle={[baseStyles.btnTextColorWhite,styles.smallButton]}*/}
                            {/*text={'退出认证'}/>*/}
                    {/*</View>*/}
                </View>
                <BaseButton
                    onPress={this.onPressNext}
                    style={[styles.btnbot]}
                    textStyle={[baseStyles.textWhite,styles.bigButton]}
                    text={'继续认证'}/>
                {
                    !!this.showExit && <MyConfirm title={'确认退出'} message={'请确认是否退出认证流程~'} okText={'继续认证'} cancelText={'退出认证'} close={false} onSure={this.onContinue} onCancel={this.onExit}/>
                }
                {
                    !!this.scrollState && <ScrollView
                        ref={'scrollView'}
                        scrollEnabled={false}
                        // onMomentumScrollEnd={this.onScrollEnd}
                        style={styles.scrollView}>
                        <TouchableOpacity
                            onPress={this.scrollBack}
                            activeOpecity={1}
                            style={{
                                height: RealWindowHeight
                            }}/>
                        <View style={styles.scrollBtnBox}>
                            <BaseButton
                                style={[{
                                    backgroundColor: StyleConfigs.btnBlue,
                                },styles.scrollBtn]}
                                textStyle={{
                                    color: StyleConfigs.txtWhite,
                                    fontSize: 16
                                }}
                                text={'拍摄'}
                                onPress={this.onShootPhoto}
                            />
                            <View style={{
                                width: getWidth(20)
                            }}/>
                            <BaseButton
                                style={[{
                                    backgroundColor: StyleConfigs.btnWhite,
                                },styles.scrollBtn]}
                                textStyle={{
                                    color: StyleConfigs.txtBlue,
                                    fontSize: 16
                                }}
                                text={'从相册选择一张'}
                                onPress={this.onChoosePhoto}
                            />
                        </View>
                    </ScrollView>
                }
                {
                    !!this.uploading && <View style={styles.loadingBox}>
                        <View style={[styles.loadingBox,styles.loadingBackground]}></View>
                        <View style={styles.loading}>
                            <Text allowFontScaling={false} style={styles.loadingTextBig}>{this.loadingText}</Text>
                            <View style={styles.loadingImageBox}>
                                <Image style={styles.loadingImage} source={null} resizeMode={'contain'}/>
                            </View>
                            <Text allowFontScaling={false} style={styles.loadingTextSmall}>{this.loadingText}</Text>
                            <View style={styles.leftTopBox}></View>
                            <View style={styles.leftBottomBox}></View>
                            <View style={styles.rightTopBox}></View>
                            <View style={styles.rightBottomBox}></View>
                        </View>
                    </View>
                }
                {/*加载中*/}
                {
                    !!this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleConfigs.bgColor,
        paddingTop: getDeviceTop(),
        paddingBottom: getDeviceBottom()
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
        justifyContent: 'space-between'
    },
    title:{
        fontSize: 15,
        fontWeight: 'bold'
    },
    tipText:{
        fontSize: 12,
        color: StyleConfigs.txtBlue,
        // marginRight: getWidth(-14)
    },
    cardImageBox:{
        marginTop: getHeight(38),
        marginBottom: getHeight(34),
    },
    cardImage:{
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
        fontSize: 16,
        fontWeight:'bold'
    },
    middleButton:{
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5
    },
    smallButton:{
        fontSize: 14
    },
    center:{
        alignItems:'center',
        justifyContent:'center'
    },
    detailBox:{
        marginTop: getHeight(50),
        marginBottom:getHeight(32),
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
    },
    detail:{
        fontSize:15,
        color: StyleConfigs.txt172A4D,
        marginTop: 4,
        marginBottom: 4
    },

    scrollView:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    scrollBtnBox:{
        height: getHeight(190),
        paddingLeft: getWidth(40),
        paddingRight: getWidth(40),
        // paddingBottom: 20,
        // paddingTop: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollBtn:{
        borderColor: StyleConfigs.btnBlue,
        borderWidth: 1,
        borderRadius: 6,
        alignItems:'center',
        justifyContent: 'center',
        height: getHeight(70),
        flex: 1
    },
    textRed:{
        color: '#F60076'
    },
    rowText:{
        flexDirection: 'row'
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
})