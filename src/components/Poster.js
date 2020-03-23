/**
 * hjx 2018.4.16
 */

import React from 'react';
import {StyleSheet,View, Image,TouchableOpacity,Text,CameraRoll,Alert, Platform} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import BaseButton from './baseComponent/BaseButton'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import env from "../configs/environmentConfigs/env";
import GetAndroidUpdate from "../../native/GetAndroidUpdate";
import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";
import AndroidModule from "../../native/AndroidUtil";

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    @observable
    inviteUrl = null;

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount();
        this.notify({key: 'GET_REGULATION_CONFIG'});
        this.getInvitePoster();
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    // 获取推荐奖励
    @action
    getInvitePoster = () => {
        this.$http.send('GET_INVITE_POSTER', {
            bind: this,
            params: {
                type :"invite",
                param:"CH"
            },
            callBack: this.re_getInvitePoster,
            errorHandler: this.error_getInvitePoster,
        })
    }

    @action
    re_getInvitePoster = (data) => {
        console.log('-------获取图片地址',data)
        typeof data === 'string' && (data = JSON.parse(data))
        data && data.dataMap && data.dataMap.inviteUrl && (this.inviteUrl = env.networkConfigs.downloadUrl + data.dataMap.inviteUrl);
    }

    @action
    error_getInvitePoster = (err) => {
        console.log('获取图片地址出错', err);
    }

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }

    saveImageIOS = ()=>{
        let me = this;
        let img = this.inviteUrl;

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
                Alert.alert('无法保存','请在iPhone的“设置-隐私-照片”选项中，允许二零二零访问你的照片。')
                return;
            }
            me.$globalFunc.toast('请重试');
            return;
        });
    }

    saveImageAndroid = ()=>{
        globalFunc.downloadImage(this.inviteUrl,(img,res)=>{
            if(res && res.code === 'ENOENT'){
                Alert.alert(
                    '无法上传',
                    '当前状态无法上传图片或保存图片，请在设置中打开存储权限。'  ,
                    [
                        {text: '不允许', style: 'cancel'},
                        {text: '去设置', onPress: this.androidSetting}
                    ],
                    { cancelable: false });
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

    saveImage = async ()=>{
        Platform.OS === 'android' && this.saveImageAndroid();
        Platform.OS === 'ios' && this.saveImageIOS();
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
                <NavHeader headerTitle={'我的专属邀请海报'} goBack={this.goBack}/>
                <View style={[styles.container,baseStyles.bgColor]}>
                    <View style={styles.fontBox}>
                        <View style={styles.center}>
                            <Text allowFontScaling={false} style={[styles.tfff,styles.f14]}>即刻分享海报，邀请好友送金币</Text>
                        </View>
                        {/*<View style={[styles.center,styles.split]}>*/}
                            {/*<Text allowFontScaling={false} style={[styles.tblue,styles.f20]}>{this.$store.state.activity * 100}% </Text><Text allowFontScaling={false} style={[styles.tfff,styles.f14]}>返还BDB奖励</Text>*/}
                        {/*</View>*/}
                    </View>
                    <View style={styles.imageBox}>
                        {this.inviteUrl && <Image
                            style={styles.image}
                            source={{
                                uri: this.inviteUrl
                            }}
                            resizeMode={'contain'}
                        />}
                    </View>
                </View>
                <View style={[styles.footer,baseStyles.bgColor]}>
                    <BaseButton style={styles.button} textStyle={styles.buttonText} onPress={this.saveImage} text={'保存图片'}>
                    </BaseButton>
                </View>
                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    split:{
        marginTop:getHeight(10)
    },
    center: {
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    fontBox:{
        height: getHeight(80),
        marginTop: getHeight(26)
    },
    tfff:{
        color: StyleConfigs.txt131F30
    },
    tblue:{
        color:'#3576F5'
    },
    f14:{
        fontSize: getWidth(28)
    },
    f20:{
        fontSize: getWidth(40)
    },
    imageBox:{
        alignItems:'center',
        justifyContent:'center'
    },
    image:{
        height: getHeight(960),
        width: '100%'
    },
    footer:{
        paddingBottom: getHeight(20),
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-around'
    },
    button:{
        width: getWidth(600),
        height: getHeight(80),
        backgroundColor: StyleConfigs.btnBlue,
        borderRadius: StyleConfigs.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText:{
        fontSize:getWidth(30),
        color: StyleConfigs.txtWhite,
    }
})