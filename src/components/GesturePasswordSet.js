import React from 'react'
import {
    Alert,
    View,
    Text,
    Dimensions,
    AsyncStorage, BackHandler
} from 'react-native'
import {action} from "mobx";
import GesturePassword from './baseComponent/gesturePassword/GesturePassword'
import Button from 'react-native-smart-button'
import styles from '../style/GesturePasswordSetStyle'
import device from "../configs/device/device";
import NavHeader from './baseComponent/NavigationHeader'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import baseStyles from "../style/BaseStyle";
import RNComponent from "../configs/classConfigs/ReactNativeComponent";

const POINTNUM = 5;

export default class GestureUnlock extends RNComponent {

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
        };
        this._cachedPassword = ''
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.addListenBack();
        // this.getIdentityInfo();
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
        this.removeListenBack();
    }

    componentDidMount() {
        // this._cachedPassword = '0124' //get cached gesture password
    }

    // 监听返回键
    @action
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
        if(routers[routers.length - 1].routeName !== 'GesturePasswordSet'){
            // 不是自己不处理
            return false;
        }
        this.goBack();
        return true;
    }

    render() {
        let areaTop = PlatformOS == 'ios' && 88 || 48
        return (
            <View style={[styles.container, baseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602,paddingTop: getDeviceTop()}]}>
                <NavHeader
                    headerTitle={'设置手势密码'}
                    goBack={this.goBack}
                    headerRightTitle={'重设'}
                    headerRightOnPress={this.resetData}
                />
                <View style={[{backgroundColor:StyleConfigs.bgColor, flex:1}]}>
                    <GesturePassword
                        //style={{paddingTop: 20 + 44}}
                        pointBackgroundColor={StyleConfigs.bgColor}
                        gestureAreaTop={areaTop}
                        isWarning={this.state.isWarning}
                        color={'#2d2d2d'}
                        activeColor={'#3576F5'}
                        warningColor={StyleConfigs.txtRed}
                        warningDuration={500}
                        allowCross={true}
                        topComponent={this._renderDescription()}
                        // bottomComponent={this._renderActions()}
                        onFinish={this._onFinish}
                        // onReset={this._onReset}
                    />
                </View>
            </View>

        )
    }

    @action
    goBack = () => {
        this.$router.goBackToRoute(this.from);
        // this.$router.goBack()
        this.$store.commit('SET_GESTURE',this.$store.state.gesture?false:true)
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
                        { width: 8, height: 8, margin: 2, borderRadius: 8, backgroundColor: StyleConfigs.btnE7EBEE},
                        active ? { backgroundColor: '#3576F5' } :
                            { borderWidth: 0, borderColor: '#A9A9A9' }
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
            <View style={{ height: 198, paddingTop:10,justifyContent: 'center', alignItems: 'center'}}>

                {this._renderThumbnails()}
                <Text
                    style={{ fontFamily: '.HelveticaNeueInterface-MediumP4', fontSize: 16, marginVertical: 20, color: this.state.messageColor }}>{this.state.message}</Text>
            </View>
        )
    }

    _renderActions = () => {

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
            let isWarning = false
            let message = '恭喜，密码设置成功'
            let messageColor = '#3576F5'
            this.setState({
                isWarning,
                password,
                message,
                messageColor,
            })

            // this.$store.commit('SET_GESTURE',true);
            var userId = this.$store.state.authMessage.userId + '';
            var userPass = {'password':password};
            userId != '' && AsyncStorage.setItem(userId,JSON.stringify(userPass))

            this.$router.goBack()

            return;
        }

        let isWarning = true
        let message
        let messageColor = StyleConfigs.txtRed
        if (password.length < POINTNUM) {
            message = '至少需要连接'+POINTNUM+'个点，请重新绘制'
            // Alert.alert(message)
        }

        if(this._cachedPassword == '' && password.length >= POINTNUM){
            this._cachedPassword = password;
            isWarning = false;
            messageColor = StyleConfigs.txt9FA7B8
            message = '请再次绘制手势密码'
        }

        if(this._cachedPassword != '' && password != this._cachedPassword) {
            message = '两次绘制不一致，请重新绘制'
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
