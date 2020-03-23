/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image, BackHandler, Alert} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import { RNCamera} from 'react-native-camera';
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import BaseButton from '../components/baseComponent/BaseButton';
import dashedLine from '../assets/BaseAssets/dashed-line.png';
import device from "../configs/device/device";
import AndroidModule from "../../native/AndroidUtil";
import MovToMp4 from 'react-native-mov-to-mp4';


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false;

    // 上传专用loading
    @observable
    uploading = false;

    // 是否正在录像
    @observable
    recording = false;

    @observable
    bizNumber = new Date().getTime();

    @observable
    number = null;

    @observable
    tokenRandomNumber = null;

    // 禁用按钮的状态 1 为禁用 0 为启用
    @observable
    disabledBtnState = 0;

    timer = null;
    timer2 = null;

    @observable
    appState = '';


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount();
        this.tokenRandomNumber = this.$beforeParams && this.$beforeParams.tokenRandomNumber || null;
        this.from = this.$beforeParams && this.$beforeParams.from || '';
        this.addListenBack();
        this.addListenBackground();
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
        this.removeListenBack();
        clearTimeout(this.timer);
    }

    /*----------------------- 函数 -------------------------*/

    // 监听返回到后台
    addListenBackground = ()=>{
        this.listen({key:'APP_STATE_CHANGE',func:this.onAppStateChange});
    }

    onAppStateChange = (state)=>{
        // 如果在上传中 不用处理
        if(this.uploading){
            return;
        }
        this.appState = state;
        console.log('aaastatechange',state);
        // 清除两个计时器 3s 6s
        clearTimeout(this.timer);
        clearTimeout(this.timer2);
        // 设置按钮可以点击
        this.disabledBtnState = 0;
        // 修改录像状态
        if(this.recording){
            this.onFinish();
        }
        this.recording = false;

    }

    // 监听返回键
    addListenBack = ()=>{
        BackHandler.addEventListener("hardwareBackPress", this.onPressBack);
    }
    removeListenBack = ()=>{
        BackHandler.addEventListener("hardwareBackPress", this.onPressBack);
    }

    onPressBack = ()=>{
        let routers = this.$router.state.routes;
        if(routers[routers.length - 1].routeName !== 'VideoCertification'){
            // 不是自己不处理
            return false;
        }
        this.goBack();
        return true;
    }

    // 后退
    @action
    goBack = () => {
        this.notify({key: 'GET_IDENTITY_INFO'});
        this.$router.goBackToRoute(this.from);
    }

    @action
    pressButton = ()=>{
        if(this.disabledBtnState){
            return;
        }
        if(!this.recording){
            this.recording = true;
            this.disabledBtn();
            this.onStart();
            return;
        }
        if(this.recording){
            this.recording = false;
            this.onFinish();
            return;
        }
    }

    @action
    disabledBtn = ()=>{
        this.disabledBtnState = 1;
        this.timer = setTimeout(()=>{
            if(this.disabledBtnState){
                this.disabledBtnState = 0;
            }
        },3000)
        this.timer2 = setTimeout(()=>{
            if(this.recording){
                this.pressButton();
            }
        },6000)
    }

    @action
    getBtnClass = ()=>{
        if(!this.recording){
            return baseStyles.btnBlue;
        }
        if(this.disabledBtnState){
            return baseStyles.btnDisabled;
        }
        return baseStyles.btnRed2;
    }

    @action
    onStart = ()=>{
        try{
            this.refs.camera.recordAsync({
                quality:RNCamera.Constants.VideoQuality["4:3"],
                maxFileSize: 3097152
                // path: `${RNFS.ExternalStorageDirectoryPath}/download`,
                // uri: `${RNFS.ExternalStorageDirectoryPath}/com.xxx.exchange/download/test.mp4`
            }).then((data)=>{
                // this.disabledBtnState = 0;
                // this.recording = false;
                if(this.appState !== 'active' && this.appState !== ''){
                    return;
                }
                console.log('视频录制结果',data);
                // alert(JSON.stringify(data))
                if(PlatformOS === 'ios'){
                    let fileName = new Date().getTime();
                    MovToMp4.convertMovToMp4(data.uri, fileName + ".mp4", (result)=>{
                        console.log('视频转换结果',result);
                        this.commit(result);
                    });
                }
                if(PlatformOS === 'android'){
                    this.commit(data.uri);
                }

            }).catch((ex1)=>{{
                // alert(ex.toString());
                console.log('视频录制异常1',ex1);
                if(ex1.code === 'E_CAMERA_UNAVAILABLE'){
                    // 奇葩手机 只有在录像的时候 才知道权限不可用
                    this.onAuthError();
                }
            }})
        }catch(ex2){
            console.log('视频录制异常2',ex2);
        }
    }
    @action
    onFinish = ()=>{
        try{
            this.refs.camera.stopRecording()
        }catch(ex){
            console.log('视频结束异常',ex);
        }
    }

    @action
    commit = (uri)=>{
        if(uri){
            this.uploading = true;
            let params = ''
            let formData = new FormData();
            let file = {uri: uri, type: 'application/octet-stream', name: encodeURI('living_body_url.' + uri.split('.').pop())};
            formData.append('identityStr',JSON.stringify({
                biz_no: this.bizNumber,
                token_random_number: this.tokenRandomNumber
            }));
            formData.append('file',file);
            console.log(formData);
            this.$http.send('SEND_IDENTITY_BODY', {
                formData:formData,
                bind: this,
                timeout: 90000,
                callBack: this.re_commit,
                timeoutHandler: this.timeout_commit,
                errorHandler: this.err_commit
            })
        }
    }

    @action
    re_commit = (data)=>{
        this.uploading = false;
        console.log('视频上传结果',data);
        if(data.result === 'SUCCESS'){
            this.$router.push('CertificationResult',{
                from: this.from,
                result: 0,
                name:data.dataMap.name,
                area: data.dataMap.area === 'ChineseMainland' && 'China(中国)' || '其他',
                idCardNo: data.dataMap.idCardNo.replace(/^(.{2})(.*)(.{2})$/,'$1' + '**************' +'$3'),
                fromDate: this.formitDate(data.dataMap.fromDate),
                toDate: this.formitDate(data.dataMap.toDate)
            })
        }else{
            let errMessage = '请重试';
            switch (data.errorCode.toString()){
                case '1': errMessage = '用户未登录';this.$router.push('Login');return;
                case '2': errMessage = '仅可上传一个视频';break;
                case '3': errMessage = '视频过大，超过3M';break;
                case '4': errMessage = '不支持该视频格式';break;
                case '5': errMessage = '不支持该视频格式';break;
                case '6': errMessage = '请先完成国徽面验证';break;
                case '7': errMessage = '服务器发生错误，错误码：001';break;
                case '8': errMessage = '服务器发生错误，错误码：002';break;
                case '9': errMessage = '';break;
                case '10': errMessage = '服务器发生错误，错误码：003';break;
                case '30': errMessage = '视频中未出现所需验证的人脸';break;
                case '36': errMessage = '视频中未按要求朗读指定数字';break;
                case '37': errMessage = '视频中未按要求朗读指定数字';break;
                case '38': errMessage = '视频中有多张人脸，无法验证通过';break;
                case '39': errMessage = '';break;
                case '40': errMessage = '';break;
                case '41': errMessage = '视频中未出现所需验证的人脸';break;
                case '42': errMessage = '视频中未出现所需验证的人脸';break;
                case '43': errMessage = '视频中未出现所需验证的人脸';break;
                case '44': errMessage = '服务器发生错误，错误码：004';break;
                case '45': errMessage = '与身份证正面头像不符';break;
                case '46': errMessage = '服务器发生错误，错误码：005';break;
                case '47': errMessage = '';break;
                case '48': errMessage = '';break;
                case '49': errMessage = '';break;
                case '50': errMessage = '';break;
                case '51': errMessage = '服务器发生错误，错误码：006';break;
                case '52': errMessage = '该身份认证信息出现错误，请您退出验证后重新验证';break;
                case '53': errMessage = '';break;
                case '54': errMessage = '该身份认证信息出现错误，请您退出验证后重新验证';break;
                case '55': errMessage = '服务器发生错误，错误码：007';break;
                case '99': errMessage = '检测到异常情况，需要您从新开始认证';break;
            }
            this.$router.push('CertificationResult',{from: this.from,result: 1,errorMessage: errMessage,errorCode: data.errorCode.toString(),backTo: 'CertificationNumber'})
        }
    }

    timeout_commit = (data)=>{
        this.uploading = false;
        console.log('视频上传超时');
    }

    @action
    err_commit = (err)=>{
        this.uploading = false;
        console.log('视频上传异常',err);
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

    getErrorView = ()=>{
        return (<View>
            <View onLayout={this.onAuthError}></View>
        </View>);
    }

    // 当用户没有权限的时候 会调用这个东西
    @action
    onAuthError = ()=>{
        this.$router.goBack()
        setTimeout(()=>{
            PlatformOS === 'ios' && Alert.alert('相setT机和麦克风权限','当前状态无法拍摄和录制声音，请在设置-隐私-相机/麦克风中，开启二零二零相机和麦克风权限');
            PlatformOS === 'android' && Alert.alert(
                '相机和麦克风权限',
                '当前状态无法拍摄和录制声音，请在设置中打开相机和麦克风权限。'  ,
                [
                    {text: '不允许', style: 'cancel'},
                    {text: '去设置', onPress: this.androidSetting}
                ],
                { cancelable: false });
        })
    }

    @action
    androidSetting = ()=>{
        try{
            AndroidModule.openAndroidPermission();
        }catch(ex){
            console.log('跳到设置失败',ex);
        }
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.container,styles.baseContainer]}>
                <NavHeader headerTitle={'身份认证'} goBack={this.goBack}/>
                <View style={styles.box}>
                    <View style={[styles.videoBox,styles.rowItem]}>
                        <RNCamera
                        ref={'camera'}
                        style={styles.container}
                        captureAudio={true}
                        // permissionDialogTitle={'Permission to use camera'}
                        // permissionDialogMessage={'We need your permission to use your camera phone'}
                        type={RNCamera.Constants.Type.front}
                        notAuthorizedView={this.getErrorView()}
                        >
                        </RNCamera>
                    </View>
                    {/*<View style={[styles.line,styles.rowItem]}>*/}
                        {/*<Image source={dashedLine} style={styles.cardImage} resizeMode={'stretch'}/>*/}
                    {/*</View>*/}
                    {/*<View style={[styles.line]}>*/}
                        {/*<View style={styles.cycleLeft}>*/}

                        {/*</View>*/}
                        {/*<View style={styles.cycleRight}>*/}

                        {/*</View>*/}
                    {/*</View>*/}
                    {/*<View style={[styles.bottomBox,styles.rowItem]}>*/}
                        {/**/}
                    {/*</View>*/}
                </View>
                <BaseButton
                    onPress={this.pressButton}
                    disabledBtnState={this.disabledBtnState}
                    style={[styles.btnbot,
                        this.getBtnClass()]}
                    textStyle={[baseStyles.textWhite,styles.bigButton]}
                    text={this.recording === false && '开始录制视频' || '结束录制视频'}/>

                {/*<RNCamera*/}
                    {/*ref={'camera'}*/}
                    {/*style={styles.container}*/}
                    {/*captureAudio={true}*/}
                    {/*permissionDialogTitle={'Permission to use camera'}*/}
                    {/*permissionDialogMessage={'We need your permission to use your camera phone'}*/}
                    {/*type={RNCamera.Constants.Type.front}*/}
                {/*>*/}
                {/*</RNCamera>*/}
                {/*加载中*/}
                {
                     /*!!this.uploading && <View style={styles.loadingBox}>
                        <View style={[styles.loadingBox,styles.loadingBackground]}></View>
                        <View style={styles.loading}>
                            <Text allowFontScaling={false} style={styles.loadingTextBig}>正在上传识别</Text>
                            <View style={styles.loadingImageBox}>
                                <Image style={styles.loadingImage} source={loadingTriangle} resizeMode={'contain'}/>
                            </View>
                            <Text allowFontScaling={false} style={styles.loadingTextSmall}>正在上传识别</Text>
                            <View style={styles.leftTopBox}></View>
                            <View style={styles.leftBottomBox}></View>
                            <View style={styles.rightTopBox}></View>
                            <View style={styles.rightBottomBox}></View>
                        </View>
                    </View>*/
                }


                {
                    !!this.uploading && <Loading leaveNav={false}/>
                }
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    baseContainer:{
        paddingTop: getDeviceTop(),
        paddingBottom: getDeviceBottom()
    },
    container: {
        flex: 1,
        backgroundColor: StyleConfigs.bgColor
    },
    box:{
        backgroundColor: '#fff',
        flex: 1,
        marginTop: getHeight(42),
        marginLeft: getHeight(20),
        marginRight: getHeight(20),
        borderRadius: 6,
        paddingTop: getHeight(58),
        paddingBottom: getHeight(20),
        // marginBottom: getHeight(72),
        marginBottom: getHeight(20)
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
        marginTop: getHeight(74),
        marginBottom: getHeight(114),
    },
    cardImage:{
        width: '100%',
        height: '100%'
    },
    bottomBox:{
        flex: 1,
        justifyContent:'center'
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
    videoBox:{
        overflow: 'hidden',
        alignSelf: 'center',
        width: getWidth(600),
        height: getWidth(820),
        marginBottom: getHeight(40),
        borderRadius:4
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