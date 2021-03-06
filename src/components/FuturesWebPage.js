/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View, WebView, Text, Image, Alert, TouchableOpacity, Keyboard, Platform, CameraRoll} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/WebPageStyle'
import Recharge from "./AssetRecharge";
import device from "../configs/device/device";
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import router from "../configs/navigationConfigs/StackRouterConfigs";
import NavHeaderCloseIcon from '../assets/BaseAssets/navheader-close.png'
import env from "../configs/environmentConfigs/env";
import RefreshIcon from "../../src/assets/BaseAssets/refresh-icon.png"
import AndroidModule from "../../native/AndroidUtil";
import GetAndroidUpdate from "../../native/GetAndroidUpdate";
import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";

const patchPostMessageFunction = function() {
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';
@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/
    @computed get userId() {
        return this.$store.state.authMessage.userId
    }

    @observable
    renderUrl = '';

    // 加载中
    @observable
    loading = false

    @observable
    url = ''

    @observable
    navHide = false

    @observable
    isTransparentNav= false

    @observable
    headerWidth = DeviceWidth

    @observable
    goBackIconHidden = false

    @observable
    title = ''

    @observable
    navColor = null;

    @observable
    navMarginTop = 0;

    canGoBack = false;//组件自带API的返回结果

    @observable
    canGoH5Back = false;//通过H5传过来的参数判断

    @observable
    WebViewMarginBottom = 0

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        this.url = this.$beforeParams && this.$beforeParams.url || '';
        this.navHide = this.$beforeParams && this.$beforeParams.navHide || false
        this.isTransparentNav = this.$beforeParams && this.$beforeParams.isTransparentNav || false
        this.title = this.$beforeParams && this.$beforeParams.title || '合约'
        this.rightCloseBtn = this.$beforeParams && this.$beforeParams.rightCloseBtn || false
        this.url = env.networkConfigs.futuresUrl + '?isApp=true&isWhite=true';
        // this.url = 'http://zpy.2020-ex.com:8085?isApp=true&isWhite=true';
        // this.url = 'http://192.168.1.19:8085/index/mobileTradingHallDetail?isApp=true&isWhite=true';
        this.renderUrl = (this.url.indexOf('?') > -1)
            && (this.url + '&isIOS=true&iosLogin=' + !!this.userId + '&userId=' + this.userId + '&isIPhoneX=' + isIPhoneX())
            || (this.url + '?isIOS=true&iosLogin=' + !!this.userId + '&userId=' + this.userId + '&isIPhoneX=' + isIPhoneX());
        //this.url = 'http://localhost:8080/static/H5BiShiJieActivity'
        this.renderUrl = this.$globalFunc.unescapeUrl(this.renderUrl)
        console.log('this is renderUrl',this.renderUrl);


        this.listen({key:'WEBPAGE_BACK',func:(url)=>{
            if(url.indexOf('mobileWebTransferContract') > -1){
                this.reloadPage();
            }
        }});
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()

        this.listen({key:'NEW_LOGIN',func:()=>{
            setTimeout(()=>{
                //为了保证登录信息缓存成功，延迟1s执行
                this.reloadPage();
                // alert('延迟1s执行')
            },1000)
        }});

        this.listen({key:'LOG_OUT_RE__H5',func:()=>{
            //为了保证退出登录成功，回到第一页，延迟1s执行刷新
            this.refs.win.goBack();
            setTimeout(()=>{
                this.reloadPage();
                // alert('延迟1s执行')
            },1000)
        }});

    }

    componentDidMount() {
        super.componentDidMount()
        if(PlatformOS == 'android'){
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        }
        // if(this.isTransparentNav){
        //     this.title = ''
        //     this.offsetTop = PlatformOS == 'android' ? getHeight(-108) : getHeight(-128)
        //     this.setColor('transparent')
        //     this.setWidth(true)
        // }
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
        if(PlatformOS == 'android') {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    /*----------------------- 函数 -------------------------*/


    _keyboardDidShow (e) {

        this.WebViewMarginBottom = e.endCoordinates && (e.endCoordinates.height-30) || 0
    }

    _keyboardDidHide (e) {

        this.WebViewMarginBottom = 0
    }

    initAndroidStatusBar = ()=>{
        // (PlatformOS == 'android' && this.navMarginTop > 0) && this.notify({key:'CHANGE_ANDROID_STATUS_BAR'},'init');
    }

    reloadPage =()=>{
        this.refs.win.reload();
    }

    // 后退
    @action
    goBack = () => {
        //webview内部H5页面的返回跳转
        if(this.canGoH5Back){
            this.refs.win.goBack();
            return;
        }
        // if(this.canGoBack){
        //     this.refs.win.goBack();
        //     return;
        // }
        // this.initAndroidStatusBar();
        this.$router.goBack()
    }

    // 后退
    @action
    goHome = () => {
        this.$router.goBack()
    }

    saveImageIOS = (imgUrl)=>{
        let me = this;
        let img = imgUrl;

        if(!img){
            me.$globalFunc.toast('请重试');
            return;
        }
        var promise = CameraRoll.saveToCameraRoll(img,'photo');
        promise.then(function(result) {
            me.$globalFunc.toast('保存成功')
        }).catch(function(error) {
            console.log(error)
            if(error.message == 'User denied access'){
                Alert.alert('无法保存','请在iPhone的“设置-隐私-照片”选项中，允许二零二零访问您的照片。')
                return;
            }
            me.$globalFunc.toast('请重试');
            return;
        });
    }

    saveImageAndroid = (imgUrl)=>{
        globalFunc.downloadImage(imgUrl,(img,res)=>{
            if(res && res.code === 'ENOENT'){
                /*Alert.alert(
                    '无法保存',
                    '当前状态无法保存图片，请在设置中打开存储权限。'  ,
                    [
                        {text: '下次吧', style: 'cancel'},
                        {text: '去设置', onPress: this.androidSetting}
                    ],
                    { cancelable: false });*/

                Alert.alert("提示", "当前状态无法保存图片，请在设置中打开存储权限。", [{
                    text: "我知道了", onPress: () => {console.log("点了我知道了");}
                }])

                return;
            }
            if(!img){
                this.$globalFunc.toast('请重试');
                return;
            }
            GetAndroidUpdate.UpdateCamera(img);
            this.$globalFunc.toast('保存成功');
        });
    }

    saveImage = async (imgUrl)=>{
        Platform.OS === 'android' && this.saveImageAndroid(imgUrl);
        Platform.OS === 'ios' && this.saveImageIOS(imgUrl);
    }

    @action
    androidSetting = ()=>{
        try{
            AndroidModule.openAndroidPermission();
        }catch(ex){
            console.log('跳转设置失败',ex);
        }
    }

    onMessage = (event)=>{
        try{
            let data = JSON.parse(event.nativeEvent.data);
            let method = data.method;
            let parameters = data.parameters;
            try{
                parameters = JSON.parse(parameters);
            }catch (e) {

            }
            console.log('send============',method, parameters)

            if(typeof(this['IOSClientMethod'][method]) == 'function'){
                this.IOSClientMethod[method].call(this, parameters);
            }
        }catch(ex){
            console.log(ex);
        }
    }

    sendCookies = (event)=>{
        // console.log('this is WebView onLoad',event,new Date().getTime());
        if(this.isTransparentNav){
            this.title = ''
            this.offsetTop = PlatformOS == 'android' ? getHeight(-108) : getHeight(-128)
            this.setColor('transparent')
            this.setWidth(true)
            // this.headerWidth = 0
            // this.goBackIconHidden = false;
        }
        //是否登录
        this.promise_sendCookies = new Promise((resolve,reject)=>{
            console.log('判断条件',this.$store.state.authMessage.userId)
            if(this.$store.state.authMessage.userId){
                this.$http.send('GET_COOKIES', {
                    bind: this,
                    callBack: function(res){
                        resolve(res);
                    }
                })
            }else{
                resolve('');
            }
        })
        return this.promise_sendCookies;
    }


    onLoadEnd = (event)=>{
        // console.log('this is WebView onLoadEnd',event,new Date().getTime());
        // if(this.$route.query.isApp){
        //     window.postMessage(JSON.stringify({
        //         method: 'toHomePage'
        //     }))
        //     return
        // }
    }

    renderError = (event)=>{
        // console.log('this is WebView renderError',event,new Date());
    }

    @action
    setColor = (color)=>{
        if(!color)return
        this.refs.nav.setColor(color || null);
        //this.navColor = color;
    }
    @observable
    offsetTop = 0;
    @action
    setHeight = (bl,xMarginTop)=>{

        if(PlatformOS == 'ios' && xMarginTop < 0){//iPhoneX 系列处理


            this.offsetTop = getHeight(xMarginTop)
            return;
        }
        if(PlatformOS == 'android'){//暂时作为改变androidstatusbar的一种替代方案
            this.offsetTop = getHeight(bl && -108 || 0);
            return;
        }

        this.offsetTop = getHeight(bl && -128 || 0);

        // if(PlatformOS == 'android'){
        //     this.notify({key:'CHANGE_ANDROID_STATUS_BAR'},'transparent',true);
        //     this.navMarginTop = getHeight(40);
        // }

    }

    @action
    setWidth = (bl)=>{
        this.headerWidth = bl && getWidth(100) || DeviceWidth
        this.goBackIconHidden = bl || false;
    }

    @action
    setWidthTo0 = ()=>{
        console.log('send=========setWidthTo0');
        this.headerWidth = 0
        this.goBackIconHidden = false;
    }

    onNavigationStateChange = (data)=>{
        console.log(data);
        this.canGoBack = data.canGoBack;
    }

    goWebView = (()=>{
        let last = 0;
        return (params={
            url: '',
            loading: false,
            navHide: false,
            title: ''
        },type) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            if(!params.url){
                return;
            }
            params.url.length && (params.url.indexOf('http') === -1) && (params.url = env.networkConfigs.downloadUrl + params.url.replace(/^\//,''));
            return this.$router.push('WebPage',params)
        }
    })()

    promise_sendCookies = null;

    IOSClientMethod = {
        clientLoad: function(){
            this.promise_sendCookies
            &&
            (this.promise_sendCookies.then(res=>{
                let data = JSON.stringify({
                    method: 'getCookies',
                    parameters: res
                })
                console.log('发过去到数据',data)
                this.refs.win.postMessage(data);
            }))
        },
        //获取登录cookie
        toLogin: function(...arg){
            this.initAndroidStatusBar();
            this.$router.push('Login',{
                backTo: 'Home',
                closeCallback: function () {
                    let me = this;
                    this.sendCookies().then((res)=>{
                        let data = JSON.stringify({
                            method: 'getCookies',
                            parameters: res
                        })
                        me.refs.win.postMessage(data);
                    })
                }.bind(this)
            })
        },

        //转到注册
        toRegister: function(){
            this.initAndroidStatusBar();
            this.$router.push('Register');
        },

        //转到充值
        toRecharge: function(...arg){
            if(typeof(arg[0] == 'string')){
                this.initAndroidStatusBar();
                this.$router.push('Recharge',{
                    currency: arg[0]
                })
            }
        },

        //转到交易
        toDeal: function (...arg) {
            if(typeof(arg[0]) == 'string'){
                //跳转路由
                this.$store.commit('SET_SYMBOL',arg[0])
                this.initAndroidStatusBar();
                this.$router.goBackToRoute('Home');
                this.notify({key: 'CHANGE_TAB'}, 2);
            }
        },

        //转到资产
        toAsset: function (...arg) {
            this.initAndroidStatusBar();
            this.$router.goBackToRoute('Home');
            this.notify({key: 'CHANGE_TAB'}, 3);
        },

        //隐藏头部
        transparentHeader: function (...arg) {
            let color = '#fff';
            let hiddenRight = false;
            let xMarginTop = 0;
            if(typeof arg[0] === 'string'){
                color = arg[0];
            }
            if(typeof arg[0] === 'object'){
                arg[0]['color'] && (color = arg[0].color);
                arg[0]['hiddenRight'] && (hiddenRight = arg[0]['hiddenRight']);
                (arg[0]['xMarginTop'] && isIPhoneX()) && (xMarginTop = -170);
            }
            this.setColor(color);
            this.setHeight(true,xMarginTop);
            this.setWidth(hiddenRight);
        },

        //隐藏头部宽度为0
        setHeaderWithTo0: function (...arg) {
            this.setWidthTo0();
        },

        //显示头部
        revertHeader: function(...arg){
            let color = '#fff';
            this.setColor(color);
            this.setHeight(false);
            this.setWidth(false);
        },

        //去推荐
        goMyRecommend: function(...arg){
            // this.initAndroidStatusBar();
            // this.$router.push('MyRecommend')
        },

        goBDBBurnReward: function(...arg){
            // this.initAndroidStatusBar();
            // this.$router.push('AdditionalRewards')
        },

        @action
        setTitle: function (...arg) {
            if(typeof(arg[0] == 'string')){
                this.title = arg[0];
            }
        },
        // 退回首页
        toHomePage: function(...arg){
            // this.initAndroidStatusBar();
            this.$router.goBack();
        },
        @action
        setH5Back: function (...arg) {
            let canGoH5Back = false
            if(typeof arg[0] === 'object'){
                arg[0]['canGoH5Back'] && (canGoH5Back = arg[0].canGoH5Back);
            }
            this.canGoH5Back = canGoH5Back
        },
        //H5指定跳转对应的路由
        toH5Route:function (...arg) {
            console.log(arg);

            let paras = arg && arg[0] || null
            if(!paras || Object.prototype.toString.call(paras) != '[object Object]' || Object.keys(paras).length == 0){
                Alert.alert("提示", "H5传参错误，请刷新后重试", [{
                    text: "我知道了", onPress: () => {console.log("点了我知道了");}
                }])
            }
            this.goWebView(paras);
        },
        //H5指定跳转对应的路由
        toSaveImage:function (...arg) {
            console.log(arg);

            let paras = arg && arg[0] || null
            if(!paras){
                Alert.alert("提示", "H5传参错误，请刷新后重试", [{
                    text: "我知道了", onPress: () => {console.log("点了我知道了");}
                }])
            }

            this.saveImage(paras);
        }

    }

    //限制点击刷新频率
    clickReloadPage = (()=>{
        let last = 0;
        return () => {
            if (Date.now() - last < 1500) return;
            last = Date.now();
            this.reloadPage();
        }
    })()


    // 渲染刷新按钮
    @action
    renderRefreshIcon = () => {
        return (
            <TouchableOpacity
                onPress={this.clickReloadPage}
                activeOpacity={StyleConfigs.activeOpacity}
            >
                <Image
                    style={styles.headRefreshIcon}
                    source={RefreshIcon}
                />
            </TouchableOpacity>
        )
    }
    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, {
                flexDirection: 'column-reverse',
                backgroundColor:StyleConfigs.navBgColor0602,
                paddingTop: 0,
                paddingBottom:this.WebViewMarginBottom
                }]}>
                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
                <WebView
                    ref={'win'}
                    source={{uri: this.renderUrl}}
                    // source={require('../assets/chart/index2.html')}
                    style={[styles.webView,{
                        marginTop: this.offsetTop
                    }]}
                    injectedJavaScript={patchPostMessageJsCode}
                    onMessage={this.onMessage}
                    //onLoadStart={this.initIOS}
                    onLoad={this.sendCookies}
                    onLoadEnd={this.onLoadEnd}
                    renderError={this.renderError}
                    onNavigationStateChange={this.onNavigationStateChange}
                    mixedContentMode={'always'}
                />
                {
                    !this.navHide && <View style={{
                        overflow: 'hidden',
                        width: this.headerWidth,
                        // TODO: 这里不知道为什么 如果只有以上两个 会导致overflow在安卓失效 所以就有了这个东西 如果有影响 可以随便换成什么别的东西
                        borderWidth :0
                    }}>
                        {/*右上角增加closeBtn*/}
                        {false &&
                        <NavHeader
                            navStyle={{
                                width: DeviceWidth,
                                marginTop:this.navMarginTop
                            }}
                            navColor={this.navColor}
                            ref={'nav'}
                            headerTitle={this.title}
                            goBack={this.goBack}
                            touchCompRight={<Image style={{width: getWidth(28), height: getWidth(28)}}
                                                   source={NavHeaderCloseIcon}
                                                   resizeMode={'contain'}
                            />}
                            touchCompRightClick={this.goHome}
                        >
                            <Text>{this.navColor}</Text>
                        </NavHeader>
                        ||
                        <NavHeader
                            navStyle={{
                                width: DeviceWidth,
                                marginTop:this.navMarginTop
                            }}
                            navColor={this.navColor}
                            ref={'nav'}
                            headerTitle={this.title}
                            goBackIconHidden={this.goBackIconHidden}
                            // goBack={this.goBack}
                            headerRight={this.renderRefreshIcon()}
                        >
                            <Text>{this.navColor}</Text>
                        </NavHeader>
                        }
                    </View>
                }
            </View>
        )
    }
}
