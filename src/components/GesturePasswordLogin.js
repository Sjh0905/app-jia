import React from 'react'
import {
    Alert,
    View,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    AsyncStorage
} from 'react-native'
import {action,observable} from "mobx";
import RNComponent from "../configs/classConfigs/ReactNativeComponent";
import GesturePassword from './baseComponent/gesturePassword/GesturePassword'
import Button from 'react-native-smart-button'
import styles from '../style/GesturePasswordSetStyle'
import device from "../configs/device/device";
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import baseStyles from "../style/BaseStyle";
import logo from '../assets/SignLogin/login-logo.png'
import BaseButton from './baseComponent/BaseButton'
import MyConfirm from './baseComponent/MyConfirm'

const POINTNUM = 5;
var paddingTop = 20 + 44;

if(PlatformOS == "ios"){
    PlatformiOSPlus && (paddingTop += 28);
    getDeviceTop()>0 && (paddingTop += 38);
}
if(PlatformOS == "android"){
    DeviceDealHeight == 567 && (paddingTop -= 30);
}

export default class GesturePasswordLogin extends RNComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isWarning: false,
            message: '请绘制手势密码',
            messageColor: StyleConfigs.txt9FA7B8,
            password: '',
            thumbnails: [],
            showConfirm:false,
            showCountDialog:false
        };
        this._cachedPassword = ''
    }

    componentDidMount() {
        this._cachedPassword = '0124' //get cached gesture password
        var userId = this.$store.state.authMessage.userId + '';
        AsyncStorage.getItem(userId).then((data)=> {
            typeof(data) == 'string' && (data = JSON.parse(data));
            this._cachedPassword = data.password;
            this.errorCount = data.errorCount || 0;
            POINTNUM == this.errorCount &&
            this.setState({
                showCountDialog:true,
                message : '手势密码错误，还有'+(POINTNUM-this.errorCount)+'次机会',
                messageColor : StyleConfigs.txtRed
            });
        })
    }

    // @observable
    // showConfirm = false;

    @observable
    errorCount = 0;


    render() {

        // let showConfirm = !!this.showConfirm;
        return (
            <View style={[styles.container, baseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602}]}>

                <View style={[{backgroundColor:StyleConfigs.bgColor, flex:1,paddingTop: getDeviceTop()}]}>
                    <GesturePassword
                        style={{paddingTop:paddingTop}}
                        pointBackgroundColor={StyleConfigs.bgColor}
                        // gestureAreaTop={48}
                        isWarning={this.state.isWarning}
                        color={'#2d2d2d'}
                        activeColor={'#C43E4E'}
                        warningColor={StyleConfigs.txtRed}
                        warningDuration={500}
                        allowCross={true}
                        topComponent={this._renderDescription()}
                        bottomComponent={this._renderActions()}
                        onFinish={this._onFinish}
                        // onReset={this._onReset}
                    />
                </View>
                {this.state.showConfirm &&
                <MyConfirm
                    // style={{marginTop:250+getDeviceTop()}}
                    okText={'账号密码登录'}
                    cancelText={'取消'}
                    title={'提示'}
                    message={'   忘记手势，可使用账号密码登录，\n         登录后需要重新绘制手势'}
                    close={null}
                    onSure={this.onSure}
                    // onClose={this.onCancel}
                    onCancel={this.onCancel}
                />
                }
                {this.state.showCountDialog &&
                <MyConfirm
                    // style={{marginTop:250+getDeviceTop()}}
                    alertBtnBlueStyle={{width:getWidth(330)}}
                    okText={'账号密码登录'}
                    cancelText={null}
                    title={'提示'}
                    message={'   忘记手势，可使用账号密码登录，\n         登录后需要重新绘制手势'}
                    close={null}
                    onSure={this.onSure}
                    // onClose={this.onCancel}
                    // onCancel={this.onCancel}
                />
                }
            </View>

        )
    }

    @action
    goBack = () => {
        this.$router.goBack()
        this.$store.commit('SET_GESTURE',this.$store.state.gesture?false:true)
    }

    forgotPassword = () =>{
        let showConfirm = true;
        this.setState({
            showConfirm
        })
    }

    onCancel = () => {
        let showConfirm = false;
        this.setState({
            showConfirm
        })
    }

    onSure = () => {
        let showConfirm = false;
        this.setState({
            showConfirm
        })

        //清空本地数据
        var userId = this.$store.state.authMessage.userId + '';
        userId != '' && AsyncStorage.setItem(userId,'')

        this.logout();
        this.$router.push('Login');

    }

    // 登出
    @action
    logout = () => {
        this.$http.send('LOGOFF', {
            bind: this,
            callBack: this.re_logout,
            errorHandler: this.error_logout
        })

    }

    // 登出回调
    @action
    re_logout = (data) => {
        typeof data == 'string' || (data = JSON.parse(data))

        console.warn('data', data)

        this.$store.commit('SET_AUTH_MESSAGE', {})

        //初始化参数
        this.$store.commit('SET_GESTURE',false);
        this.$store.commit('SET_SHOW_GESTURE',false);

        // this.notify({key: 'CHANGE_TAB'}, 0);
        // this.notify({key: 'SET_TAB_INDEX'},0);

    }

    // 登出出错
    @action
    error_logout = (err) => {

    }

    resetData = () => {
        this._cachedPassword = ''
        let isWarning = false
        let password = ''
        let message = '请绘制手势密码'
        let messageColor = StyleConfigs.txt9FA7B8
        this.setState({
            isWarning,
            password,
            message,
            messageColor,
        })
    }

    _renderThumbnails() {
        let thumbnails = []
        for (let i = 0; i < 9; i++) {
            let active = ~this.state.password.indexOf(i)
            thumbnails.push((
                <View
                    key={'thumb-' + i}
                    style={[
                        { width: 8, height: 8, margin: 2, borderRadius: 8, backgroundColor: '#2D2D2D'},
                        active ? { backgroundColor: '#C43E4E' } : { borderWidth: 0, borderColor: '#A9A9A9' }
                    ]}
                />
            ))
        }
        return (
            <View style={{ width: 38, flexDirection: 'row', flexWrap: 'wrap' }}>
                {thumbnails}
            </View>
        )
    }

    _renderDescription = () => {
        return (
            <View style={{ height: 188, paddingBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={logo} style={{width:200,height:52,marginBottom:30}} resizeMode={'contain'}/>
                <Text style={{color:this.state.messageColor}}>{this.state.message}</Text>
            </View>
        )
    }

    _renderActions = () => {
        return (
            <View
                style={{ position: 'absolute', bottom: 30, flex: 1, justifyContent: 'center', flexDirection: 'row', width: Dimensions.get('window').width, }}>
                {/* Forget password */}
                <BaseButton
                    style={{ margin: 10, height: 40, justifyContent: 'center', }}
                    textStyle={{ fontSize: 14, color: '#C43E4E' }}
                    onPress={this.forgotPassword}
                    text={'忘记密码？'}
                />
            </View>
        )
    }

    _onReset = () => {
        let isWarning = false
        //let password = ''
        // let message = '请绘制手势密码'
        let messageColor = StyleConfigs.txt9FA7B8
        this.setState({
            isWarning,
            //password,
            // message,
            messageColor,
        })
    }

    _onFinish = (password) => {

        if (password == this._cachedPassword) {
            //成功登陆后清空本地的错误次数
            let userGestureInfo = {'password':this._cachedPassword,'errorCount':0};
            let userId = this.$store.state.authMessage.userId + '';
            userId != '' && AsyncStorage.setItem(userId,JSON.stringify(userGestureInfo));

            //隐藏手势密码页面
            this.$store.commit('SET_SHOW_GESTURE',false);
            this.$store.commit('SET_SHOW_GESTURE_TIME',false);
            // this.$router.push('Home');
            return;
        }

        let isWarning = true
        let message
        let messageColor = StyleConfigs.txtRed
        // if (password.length < POINTNUM) {
        //     message = '至少需要连接'+POINTNUM+'个点，请重新绘制'
        //     // Alert.alert(message)
        // }

        // if(this._cachedPassword == '' && password.length >= POINTNUM){
        //     this._cachedPassword = password;
        //     isWarning = false;
        //     messageColor = '#999999'
        //     message = '请再次绘制手势密码'
        // }

        if(this._cachedPassword != '' && password != this._cachedPassword) {

            POINTNUM > this.errorCount && this.errorCount++;

            //需要保存错误次数到本地
            let userGestureInfo = {'password':this._cachedPassword,'errorCount':this.errorCount};
            let userId = this.$store.state.authMessage.userId + '';
            userId != '' && AsyncStorage.setItem(userId,JSON.stringify(userGestureInfo));

            message = '手势密码错误，还有'+(POINTNUM-this.errorCount)+'次机会'
            POINTNUM == this.errorCount && this.setState({showCountDialog:true});
            // Alert.alert(message)
        }
        this.setState({
            isWarning,
            password,
            message,
            messageColor,
        })
    }

}
