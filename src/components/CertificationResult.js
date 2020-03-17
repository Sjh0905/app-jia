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
import faild from '../assets/CertificationResult/faild.png';
import success from '../assets/CertificationResult/success.png';


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    @observable
    imageBoxHeight = 0;

    @observable
    result = 1; // 0 success 1 faild

    @observable
    from = '';

    // 专用loading
    @observable
    uploading = false;

    @observable
    loadingText = '';

    @observable
    errorMessage = '';

    @observable
    name = '';

    @observable
    idCardNo = '';

    @observable
    fromDate = '';

    @observable
    toDate = '';

    @observable
    area = '';

    @observable
    errorCode = '';

    timer = null;

    // 默认5s自动跳转
    @observable
    autoRoute = 4;

    // TODO:不知道为什么睡了一觉就不能第二次录像了 所以直接回退到数字界面 让用户重新点击跳转到录制视频页面 来保证用户可以重复录像 如果问起来了 还可以解释成为让用户看清楚数字是多少 哈哈哈
    @observable
    backTo = '';


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.addListenBack();
        this.from = (this.$beforeParams && this.$beforeParams.from || '');
        this.result = Number(this.$beforeParams && this.$beforeParams.result);
        this.errorMessage = (this.$beforeParams && this.$beforeParams.errorMessage || '');
        this.name = (this.$beforeParams && this.$beforeParams.name || '');
        this.area = (this.$beforeParams && this.$beforeParams.area || '');
        this.fromDate = (this.$beforeParams && this.$beforeParams.fromDate || '');
        this.toDate = (this.$beforeParams && this.$beforeParams.toDate || '');
        this.idCardNo = (this.$beforeParams && this.$beforeParams.idCardNo || '');
        this.errorCode = (this.$beforeParams && this.$beforeParams.errorCode || '');
        this.backTo = (this.$beforeParams && this.$beforeParams.backTo || '');
        this.checkBack();
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
        this.removeListenBack();
        this.removeCheckBack();
    }

    /*----------------------- 函数 -------------------------*/

    // 监听返回键
    addListenBack = ()=>{
        BackHandler.addEventListener("hardwareBackPress", this.onPressBack);
    }
    removeListenBack = ()=>{
        BackHandler.addEventListener("hardwareBackPress", this.onPressBack);
    }

    @action
    onPressBack = ()=>{
        let routers = this.$router.state.routes;
        if(routers[routers.length - 1].routeName !== 'CertificationResult'){
            // 不是自己不处理
            return false;
        }
        this.goBack();
        return true;
    }

    @action
    onPressNext = ()=>{
        // 如果是特殊情况 则需要返回到最初的页面
        this.notify({key: 'GET_IDENTITY_INFO'});
        if(this.errorCode === '99'){
            // 转到IDCardA
            this.$router.popToTop();
            setTimeout(()=>{
                this.$router.push('IDCardA',{
                    from: this.from,
                    cardType: 0,
                });
            })
            return;
        }
        if(this.backTo){
            this.$router.goBackToRoute(this.backTo);
            return;
        }
        this.$router.goBack();
    }

    // 确认退出
    @action
    onExit = ()=>{
        this.showExit = 0;
        this.loadingText = '正在退出';
        this.uploading = true;
        // 启动动画loading
        this.get_exitCertification();
    }

    @action
    get_exitCertification = ()=>{
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
            this.$globalFunc.toast(errMessage);
        }
    }

    error_exitCertification = (ex)=>{
        this.uploading = false;
        console.log('退出验证异常',ex);
    }


    // 后退
    @action
    goBack = () => {
        this.notify({key: 'GET_IDENTITY_INFO'})
        this.$router.goBackToRoute(this.from);
    }

    @action
    onLayoutImageBox = (e)=>{
        let width = e.nativeEvent.layout.width;
        this.imageBoxHeight = width * 396/656;
    }

    @action
    checkBack = ()=>{
        // 当出现了预料之外的情况
        if(this.errorCode === '99' || this.result === 0){
            if(this.errorCode === '99'){
                this.get_exitCertification();
            }
            this.timer = setInterval(()=>{
                if(this.autoRoute === 0){
                    // 自动帮忙点击继续认证
                    if(this.result === 0){
                        this.goBack();
                    }
                    if(this.result === 1){
                        this.onPressNext();
                    }
                    this.removeCheckBack();
                }
                if(this.autoRoute > 0){
                    this.autoRoute--;
                }
            },1000);
        }
    }

    @action
    removeCheckBack = ()=>{
        clearInterval(this.timer);
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.container]}>
                <View style={styles.topSplit}></View>
                <NavHeader headerTitle={'身份证认证'} goBack={this.goBack}/>
                <View style={styles.box}>
                    {
                        /*this.result === 1 && <View style={styles.splitTop}></View> || null*/
                    }
                    <View
                        style={[styles.resultBox,styles.rowItem]}
                    >
                        <View style={styles.resultImageBox}>
                            <Image style={styles.image} source={this.result === 1 && faild || success} resizeMode={'contain'}/>
                        </View>
                        {this.result === 0 && <View style={styles.splitMiddle}></View> || null}
                        <View style={styles.resultTextBox}>
                            <Text allowFontScaling={false} style={[styles.resultText,this.result === 1 && styles.errorText || styles.successText]}>{this.result === 1 && '认证失败' || '认证成功'}</Text>
                        </View>
                    </View>
                    {this.result === 1 &&  <View style={[styles.detailBox,styles.rowItem]}>
                        <Text allowFontScaling={false} style={[styles.detail,styles.errorText,styles.bolder]}>失败原因：</Text><Text allowFontScaling={false} style={[styles.detail,styles.errorText]}>{this.errorMessage + (this.errorCode === '99' && (' ' + (this.autoRoute + 1) + 's') || '')}</Text>
                    </View> || <View style={styles.splitBottom}></View>}
                    {/*<View style={[styles.line,styles.rowItem]}>*/}
                        {/*<Image source={dashedLine} style={styles.image} resizeMode={'stretch'}/>*/}
                    {/*</View>*/}
                    {/*<View style={[styles.line]}>*/}
                        {/*<View style={styles.cycleLeft}>*/}

                        {/*</View>*/}
                        {/*<View style={styles.cycleRight}>*/}

                        {/*</View>*/}
                    {/*</View>*/}
                    {this.result === 0 &&
                        <View style={styles.resultData}>
                        <View style={styles.resultRow}>
                            <Text style={styles.dataLabel}>国籍</Text>
                            <Text style={styles.dataMessage}>{this.area}</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.dataLabel}>证件号</Text>
                            <Text style={styles.dataMessage}>{this.idCardNo}</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.dataLabel}>姓名</Text>
                            <Text style={styles.dataMessage}>{this.name}</Text>
                        </View>
                        <View style={styles.resultRow}>
                            <Text style={styles.dataLabel}>有效期</Text>
                            <Text style={styles.dataMessage}>{this.fromDate + '-' + this.toDate}</Text>
                        </View>
                        <BaseButton
                            onPress={this.goBack}
                            style={[baseStyles.btnBlue,styles.button,styles.marginTop]}
                            textStyle={[baseStyles.textWhite,styles.bigButton]}
                            text={'完成 ' + (this.autoRoute + 1) + 's'}/>
                    </View>}
                </View>

                {this.result === 1 &&
                <BaseButton
                    onPress={this.onPressNext}
                    style={[styles.btnbot]}
                    textStyle={[baseStyles.textWhite,styles.bigButton]}
                    text={'重新认证'}/> || null
                }


                {
                    /*!!this.uploading && <View style={styles.loadingBox}>
                        <View style={[styles.loadingBox,styles.loadingBackground]}></View>
                        <View style={styles.loading}>
                            <Text allowFontScaling={false} style={styles.loadingTextBig}>{this.loadingText}</Text>
                            <View style={styles.loadingImageBox}>
                                <Image style={styles.loadingImage} source={loadingTriangle} resizeMode={'contain'}/>
                            </View>
                            <Text allowFontScaling={false} style={styles.loadingTextSmall}>{this.loadingText}</Text>
                            <View style={styles.leftTopBox}></View>
                            <View style={styles.leftBottomBox}></View>
                            <View style={styles.rightTopBox}></View>
                            <View style={styles.rightBottomBox}></View>
                        </View>
                    </View>*/
                }
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
        paddingTop: getHeight(34)
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
        marginRight: getWidth(-14)
    },
    resultImageBox:{
        marginBottom: getHeight(42),
        height: getHeight(302),
        alignItems: 'center'
    },
    resultTextBox:{
        height: getHeight(48),
        alignItems: 'center'
    },
    resultText:{
        fontSize: 20
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
        fontSize: 16,
        fontWeight:'bold'
    },
    middleButton:{
        fontSize: 15,
    },
    smallButton:{
        fontSize: 14
    },
    center:{
        alignItems:'center',
        justifyContent:'center'
    },
    detailBox:{
        marginTop: getHeight(192),
        marginBottom:getHeight(32),
        paddingLeft: getWidth(80),
        paddingRight: getWidth(80),
        // alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    detail:{
        fontSize:14,
        color: '#333',
        marginTop: 4,
        marginBottom: 4
    },
    resultBox:{
        marginTop: getHeight(98)
    },
    errorText:{
        color: StyleConfigs.txtBlue
    },
    successText:{
        color: StyleConfigs.txtBlue
    },
    splitTop:{
        height: getHeight(124)
    },
    splitMiddle:{
        height: getHeight(18)
    },
    splitBottom:{
        height: getHeight(88)
    },
    resultData:{
        marginTop: getHeight(72),
        marginBottom: getHeight(72),
        justifyContent: 'space-around'
    },
    resultRow:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:getHeight(14)
    },
    dataLabel:{
        width: getWidth(216),
        marginRight:getWidth(48),
        fontSize: 15,
        textAlign: 'right'
    },
    dataMessage:{
        flex:1,
        fontSize: 15,
        textAlign: 'left'
    },
    bolder:{
        fontWeight: 'bold'
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
    marginTop:{
        marginTop: getHeight(100)
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