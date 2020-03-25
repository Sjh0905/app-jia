/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View, WebView,Text} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/WebPageStyle'
import Recharge from "./AssetRecharge";
import device from "../configs/device/device";
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import router from "../configs/navigationConfigs/StackRouterConfigs";


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
    headerWidth = DeviceWidth

    @observable
    title = ''

    @observable
    navColor = null;

    @observable
    navMarginTop = 0;

    canGoBack = false;

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        this.url = this.$beforeParams && this.$beforeParams.url || '';
        this.navHide = this.$beforeParams && this.$beforeParams.navHide || false
        this.title = this.$beforeParams && this.$beforeParams.title || ''
        // this.url = 'http://192.168.2.173:8082/static/H5RechargeActivity';
        // this.url = 'http://192.168.2.173:8082/index/mobileCombinedVotePage';
        // this.url = 'http://zpy.2020.exchange:8084/index/mobileNotice';
        this.renderUrl = (this.url.indexOf('?') > -1)
            && (this.url + '&isIOS=true&iosLogin=' + !!this.$store.state.authMessage.userId + '&isIPhoneX=' + isIPhoneX())
            || (this.url + '?isIOS=true&iosLogin=' + !!this.$store.state.authMessage.userId + '&isIPhoneX=' + isIPhoneX());
        //this.url = 'http://localhost:8080/static/H5BiShiJieActivity'
        this.renderUrl = this.$globalFunc.unescapeUrl(this.renderUrl)
        console.log('this is renderUrl',this.renderUrl);
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    initAndroidStatusBar = ()=>{
        // (PlatformOS == 'android' && this.navMarginTop > 0) && this.notify({key:'CHANGE_ANDROID_STATUS_BAR'},'init');
    }

    // 后退
    @action
    goBack = () => {

        //webview内部H5页面的返回跳转
        if(this.canGoBack){
            this.refs.win.goBack();
            return;
        }
        this.initAndroidStatusBar();
        this.$router.goBack()
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

    sendCookies = ()=>{
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

    renderError = (e)=>{

    }

    @action
    setColor = (color)=>{
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
    }

    onNavigationStateChange = (data)=>{
        console.log(data);
        this.canGoBack = data.canGoBack;
    }

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
                backTo: 'WebPage',
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

        //显示头部
        revertHeader: function(...arg){
            this.setColor();
            this.setHeight(false);
        },

        //去推荐
        goMyRecommend: function(...arg){
            this.initAndroidStatusBar();
            this.$router.push('MyRecommend')
        },

        goBDBBurnReward: function(...arg){
            this.initAndroidStatusBar();
            this.$router.push('AdditionalRewards')
        },

        @action
        setTitle: function (...arg) {
            if(typeof(arg[0] == 'string')){
                this.title = arg[0];
            }
        },
        // 退回首页
        toHomePage: function(...arg){
            this.initAndroidStatusBar();
            this.$router.goBack();
        },
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, {flexDirection: 'column-reverse',backgroundColor:StyleConfigs.navBgColor0602,paddingTop: getDeviceTop()}]}>
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
                        <NavHeader navStyle={{
                            width: DeviceWidth,
                            marginTop:this.navMarginTop
                        }} navColor={this.navColor} ref={'nav'} headerTitle={this.title} goBack={this.goBack} ><Text>{this.navColor}</Text></NavHeader>
                    </View>
                }
            </View>
        )
    }
}
