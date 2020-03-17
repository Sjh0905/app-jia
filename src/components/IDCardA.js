/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image, Alert, ScrollView,BackHandler} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import StyleConfigs from '../style/styleConfigs/StyleConfigs';
import BaseButton from '../components/baseComponent/BaseButton';
import IDCard1 from '../assets/IDCardA/IDCard1.png';
import IDCard2 from '../assets/IDCardA/IDCard2.png';
import dashedLine from '../assets/BaseAssets/dashed-line.png';
import Toast from "react-native-root-toast";
import ImagePicker from 'react-native-image-crop-picker';
import device from "../configs/device/device";
import MyConfirm from './baseComponent/MyConfirm'
import touying from '../assets/IDCardA/touying.png';
import AndroidModule from "../../native/AndroidUtil";


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 滚动状态 0 不显示 1 显示
    @observable
    scrollState = 0;

    // 上传专用loading
    @observable
    uploading = false;

    @observable
    loadingText = '';

    // 是否显示退出框 0 不显示 1 显示
    @observable
    showExit = 0

    // 加载中
    @observable
    loading = false

    @observable
    imageBoxHeight = 0;

    @observable
    cardType = 0; // 0 人像面 1 国徽面

    @observable
    idCard = '';

    from = '';//从哪里来的 认证完后要跳回到哪里去

    @observable
    showDelete = false;


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        this.cardType = this.$beforeParams && this.$beforeParams.cardType || 0; // 传进来的身份证类型
        this.from = this.$beforeParams && this.$beforeParams.from || ''; // 传进来的身份证类型
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.addListenBack();
        if(this.$store.state.getIdentityInfo.identityAuthState.toString() === '1'){
            // 如果是被驳回 提示用户是否要重新认证
            this.showDelete = true;
        }
        if(this.$store.state.getIdentityInfo.identityAuthState.toString() === '3'){
            // 我帮用户删除一下
            this.exitCertification();
        }
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
        this.removeListenBack();
    }

    /*----------------------- 函数 -------------------------*/

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
        if(routers[routers.length - 1].routeName !== 'IDCardA'){
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

    // 点击上传按钮
    @action
    pressButton = ()=>{
        this.scrollState = 1;
        setTimeout(()=>{
            this.refs.scrollView.scrollToEnd();
        })
    }

    // 点击上传按钮后的空白区域隐藏按钮
    @action
    scrollBack = ()=>{
        if(this.scrollState === 0){
            return;
        }
        this.refs.scrollView.scrollTo({
            y: 0
        });
        setTimeout(()=>{
            this.scrollState = 0;
            },50)
    }

    @action
    uploadIDCard = (type)=>{
        let option = {}
        if(type === 'openPicker'){
            option = {
                compressImageMaxWidth: 500,
                compressImageMaxHeight: 500,
                compressImageQuality: 0.7,
                mediaType: 'photo',
                cropperChooseText:'确认',
                cropperCancelText: '取消'
            }
        }
        if(type === 'openCamera'){
            option = {
                compressImageMaxWidth: 500,
                compressImageMaxHeight: 500,
                compressImageQuality: 0.7,
                cropperChooseText:'确认',
                cropperCancelText: '取消'
            }
        }
        ImagePicker[type](option).then(images => {
                console.log(images)
                this.idCard = images.path
                this.get_SendIdentityCard();
        }).catch((err)=>{
            console.log('err',err,err.code);
            if(err && (err.code === 'E_PERMISSION_MISSING')){
                PlatformOS === 'ios' && Alert.alert('无法上传','请在iPhone的“设置-隐私-照片”选项中，允许欧联读取和写入你的照片。');
                PlatformOS === 'android' && Alert.alert(
                    '无法上传',
                    '当前状态无法上传图片或保存图片，请在设置中打开存储权限。',
                    [
                        {text: '不允许', style: 'cancel'},
                        {text: '去设置', onPress: this.androidSetting}
                    ],
                    { cancelable: false });
                return;
            }
            if(err && (err.code === 'E_PICKER_NO_CAMERA_PERMISSION')){
                PlatformOS === 'ios' && Alert.alert('无法拍摄','请在iPhone的“设置-隐私-相机”选项中，开启欧联相机权限。');
                PlatformOS === 'android' && Alert.alert(
                    '无法拍摄',
                    '当前状态无法拍摄，开启欧联相机权限。',
                    [
                        {text: '不允许', style: 'cancel'},
                        {text: '去设置', onPress: this.androidSetting}
                    ],
                    { cancelable: false });
                return;
            }
            if(err && err.code === 'E_PICKER_CANCELLED'){
                return;
            }
            Toast.show('请重试', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
        });
    }


    // 上传身份证
    get_SendIdentityCard = () => {
        let formData = new FormData();
        let file = {uri: this.idCard, type: 'application/octet-stream', name: encodeURI((this.cardType && 'certificate_negative_url.' || 'certificate_positive_url.') + this.idCard.split('.').pop())};
        formData.append('identityStr',JSON.stringify({
            type: this.cardType && 'reverse' || 'front',
            idcardTpye: 'ChineseMainland'
        }));
        formData.append('file',file);
        this.loadingText = '正在上传识别';
        this.uploading = true;
        this.$http.send('SEND_IDENTITY_CARD', {
            formData:formData,
            bind: this,
            timeout: 90000,
            timeoutHandler: this.timeout_SendIdentityCard,
            callBack: this.re_SendIdentityCard,
            errorHandler: this.error_SendIdentityCard
        })
        // this.loading = true;
        return
    }


    // 上传身份证_回调
    re_SendIdentityCard = (data) => {
        this.uploading = false;
        console.log('card1',JSON.stringify(data))
        // this.loading = false;
        typeof data === 'string' && (data = JSON.parse(data));
        console.log('card',data);
        // if(data.code == 200){
        //     (typeof data.message === 'string') && (data.message = JSON.parse(data.message));
        //     data.message && (this.orderListType = data.message);
        // }
        if(data.result == 'SUCCESS'){
            data.dataMap.image = this.idCard;
            this.$router.push('IDCardB',{
                cardType: this.cardType,
                from: this.from,
                data: data.dataMap
            })

        }else{
            let errMessage = '请重试';
            switch (data.errorCode.toString()){
                case '1': errMessage = '用户未登录';this.$router.push('Login');return;
                case '2': errMessage = '';break;
                case '3': errMessage = '照片格式不是jpg/jpeg/png';break;
                case '4': errMessage = '照片格式不是jpg/jpeg/png';break;
                case '5': errMessage = '照片不清楚或者大于2M';break;
                case '6': errMessage = '该身份认证信息错误';break;
                case '7': errMessage = '身份证不在有效期内';break;
                case '8': errMessage = '请先完成人像面认证';break;
                case '9': errMessage = '未满18周岁或超过65周岁';break;
                case '10': errMessage = '服务器发生错误，错误码：008';break;
                case '11': errMessage = '服务器发生错误，错误码：009';break;
                case '12': errMessage = '服务器发生错误，错误码：010';break;
                case '13': errMessage = '服务器发生错误，错误码：011';break;
                case '14': errMessage = '服务器发生错误，错误码：012';break;
                case '15': errMessage = '服务器发生错误，错误码：013';break;
                case '16': errMessage = '服务器发生错误，错误码：014';break;
                case '17': errMessage = '请上传包含身份证的照片';break;
                case '18': errMessage = '照片不清楚或者大于2M';break;
                case '19': errMessage = '服务器发生错误，错误码：015';break;
                case '20': errMessage = '该身份认证信息错误';break;
                case '21': errMessage = '请上传完整的身份证照片';break;
                case '22': errMessage = '请上传完整的身份证照片';break;
                case '23': errMessage = '服务器发生错误，错误码：016';break;
                case '24': errMessage = '服务器发生错误，错误码：017';break;
                case '25': errMessage = '服务器发生错误，错误码：018';break;
                case '26': errMessage = '照片不清楚或者大于2M';break;
                case '27': errMessage = '该身份认证信息错误';break;
                case '28': errMessage = '';break;
                case '29': errMessage = '服务器发生错误，错误码：019';break;
                case '36': errMessage = '服务器发生错误，错误码：020';break;
                case '60': errMessage = '上传的身份证不是国徽面';break;
                case '61': errMessage = '上传的图片不是身份证正面';break;
                case '62': errMessage = 'pc已经提交了申请 但是处于未审核状态';break;
                case '63': errMessage = '已经提交了申请 并且审核已经通过';break;
            }
            // this.$globalFunc.toast(errMessage);
            this.$router.push('CertificationResult',{from: this.from,result: 1,errorMessage: errMessage})
        }
    }
    // 上传身份证_报错
    error_SendIdentityCard = (err) => {
        this.uploading = false;
        // this.loading = false;
        console.warn("上传身份证_报错！", err)
    }

    timeout_SendIdentityCard = ()=>{
        this.uploading = false;
        console.log('上传身份证超时');
    }
    //
    // // 获取当前用户认证状态
    // getIdentityInfo = ()=>{
    //     this.$http.send('SEND_IDENTITY_CARD', {
    //         bind: this,
    //         timeoutHandler: this.timeout_getIdentityInfo,
    //         callBack: this.re_getIdentityInfo,
    //         errorHandler: this.error_getIdentityInfo
    //     })
    // }
    //
    // timeout_getIdentityInfo = ()=>{
    //     console.log('获取当前状态超时');
    // }
    //
    // re_getIdentityInfo = (data)=>{
    //     console.log(data);
    // }
    //
    // error_getIdentityInfo = (ex)=>{
    //     console.log('获取当前认证状态超时',ex);
    // }


    // // 当滚动结束
    // @action
    // onScrollEnd = (e)=>{
    //     console.log('onMomentumScrollEnd',e.nativeEvent)
    //     if(e.nativeEvent && e.nativeEvent.contentOffset && e.nativeEvent.contentOffset.y === 0){
    //         this.scrollState = 0;
    //     }
    // }

    // 点击了拍摄小贴士
    @action
    onPressTips = ()=>{
        this.$router.push('ShootingInstructions');
    }

    @action
    onShootPhoto = ()=>{
        this.scrollBack();
        this.uploadIDCard('openCamera')
    }

    @action
    onChoosePhoto = ()=>{
        this.scrollBack();
        this.uploadIDCard('openPicker')
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
        // 启动动画loading
        this.loadingText = '正在退出';
        this.uploading = true;
        this.exitCertification();
    }

    @action
    exitCertification = ()=>{
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
        console.log('退出认证',data);
        if(data.result === 'SUCCESS'){
            if(this.uploading === true){
                this.goBack();
            }
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
        this.uploading = false;
    }

    error_exitCertification = (ex)=>{
        this.uploading = false;
        console.log('退出认证异常',ex);
    }

    @action
    onDelete = ()=>{
        this.exitCertification();
        this.showDelete = false;
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
            <View style={[styles.container, baseStyles.container]}>
                <NavHeader headerTitle={'身份证认证'} goBack={this.goBack}/>
                <View style={styles.box}>
                    <View style={[styles.titleBox,styles.rowItem]}>
                        <View style={styles.rowText}><Text allowFontScaling={false} style={styles.title}>中国大陆公民本人有效</Text><Text allowFontScaling={false} style={[styles.title,styles.textRed]}>二代身份证</Text></View>
                        {/*<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onPressTips}><Text allowFontScaling={false} style={styles.tipText}>拍摄小贴士</Text></TouchableOpacity>*/}
                    </View>
                    <View
                        style={[styles.cardImageBox,styles.rowItem,{height: this.imageBoxHeight}]}
                        onLayout={this.onLayoutImageBox}>
                        <Image source={this.cardType === 0 && IDCard1 || IDCard2} style={styles.cardImage} resizeMode={'stretch'}/>
                    </View>
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

                        {/*<BaseButton*/}
                            {/*onPress={this.onPressExit}*/}
                            {/*style={[baseStyles.btnWhite,styles.button,styles.splitTop]}*/}
                            {/*textStyle={[baseStyles.btnTextColorWhite,styles.smallButton]}*/}
                            {/*text={'退出认证'}/>*/}
                    {/*</View>*/}
                </View>
                <BaseButton
                    onPress={this.pressButton}
                    style={[styles.btnbot]}
                    textStyle={[baseStyles.textWhite,styles.bigButton]}
                    text={this.cardType === 0 && '上传身份证人像面' || '上传身份证国徽面'}/>
                {!!this.showExit && <MyConfirm title={'确认退出'} message={'请确认是否退出认证流程~'} okText={'继续认证'} cancelText={'退出认证'} close={false} onSure={this.onContinue} onCancel={this.onExit}/>}
                {!!this.showDelete && <MyConfirm title={'提示'} message={['是否开启自动认证?']} okText={'开启'} cancelText={'取消'} close={false} onSure={this.onDelete} onCancel={this.goBack}/>}


                {/*选择照片模态框 begin*/}
                {!!this.scrollState &&

                <ScrollView
                    ref={'scrollView'}
                    scrollEnabled={false}
                    style={styles.modalScrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        onPress={this.scrollBack}
                        activeOpecity={1}
                        style={{height: RealWindowHeight}}
                    />
                    <View style={{backgroundColor:StyleConfigs.bgColor}}>
                        <BaseButton
                            activeOpecity={StyleConfigs.activeOpacity}
                            style={styles.modalBtn}
                            textStyle={styles.modalBtnTxt}
                            text={'拍照'}
                            onPress={this.onShootPhoto}
                        />
                        <BaseButton
                            activeOpecity={StyleConfigs.activeOpacity}
                            style={styles.modalPhotoBtn}
                            textStyle={styles.modalBtnTxt}
                            text={'从手机相册选择'}
                            onPress={this.onChoosePhoto}
                        />
                        <BaseButton
                            activeOpecity={StyleConfigs.activeOpacity}
                            onPress={this.scrollBack}
                            style={styles.modalBtn}
                            textStyle={styles.modalBtnCancleTxt}
                            text={'取消'}
                        />
                    </View>

                </ScrollView>

                    // </Modal>
                }
                {/*选择照片模态框 end*/}




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

                {/*提交中*/}
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
        paddingTop: getDeviceTop(),
        paddingBottom: getDeviceBottom()
    },
    box:{
        backgroundColor: '#fff',
        // marginTop: getHeight(42),
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
        justifyContent: 'space-between',
    },
    title:{
        fontSize: 15,
        fontWeight: 'bold'
    },
    tipText:{
        fontSize: 12,
        color: StyleConfigs.txtBlue,
        marginTop:5,
        marginBottom: 5,
        fontWeight: 'bold'
        // marginRight: getWidth(-14),
        // overflow: 'visible'
    },
    cardImageBox:{
        marginTop: getHeight(38),
        marginBottom: getHeight(114),
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
    smallButton:{
        fontSize: 14
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
        // borderColor: 'red',
        // borderWidth: 1,
        // paddingBottom: 20,
        // paddingTop: 20,
        // borderTopLeftRadius:15,
        // borderTopRightRadius:15,
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
        color: StyleConfigs.txtRed
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
    touying:{
        width: DeviceWidth,
        height: getHeight(220),
        position: 'absolute',
        // top:getHeight(-20),
        left: 0,
        bottom: 0,
        // borderColor: 'blue',
        // borderWidth: 1,
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
    modalScrollView:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor:'#00000080',
    },
    modalBtn:{
        width:'100%',
        height:50,
        backgroundColor:StyleConfigs.btnWhite,
        alignItems:'center',
        justifyContent:'center'
    },
    modalPhotoBtn:{
        width:'100%',
        height:50,
        backgroundColor:StyleConfigs.btnWhite,
        borderTopColor:StyleConfigs.borderC5CFD5,
        borderTopWidth:StyleSheet.hairlineWidth,
        borderBottomColor:StyleConfigs.borderBottomColor,
        borderBottomWidth:5,
        alignItems:'center',
        justifyContent:'center'
    },
    modalBtnTxt:{
        fontSize:StyleConfigs.fontSize16,
        color:StyleConfigs.txt172A4D
    },
    modalBtnCancleTxt:{
        fontSize:StyleConfigs.fontSize16,
        color:StyleConfigs.txt9FA7B8
    },
})