/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Clipboard, Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/MineMyRecommendStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import Modal from 'react-native-modal'
import QrCode from 'react-native-qrcode'

import env from "../configs/environmentConfigs/env";
import ModalCloseIcon from '../assets/MineMyRecommend/my-recommend-close.png'
import ShareUrlIcon from '../assets/MineMyRecommend/my-recommend-share-url.png'


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = true

    @observable
    modalShow = false

    @observable
    totalPrice = 0

    //邀请人数
    @observable
    personNum = 0

    //已实名人数
    @observable
    personRealNameNum = 0

    @observable
    shareShow = false


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        this.getRecommend()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.notify({key: 'GET_REGULATION_CONFIG'});
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }

    // 获取推荐奖励
    @action
    getRecommend = () => {
        this.$http.send('POST_MY_RECOMMEND', {
            bind: this,
            params: {
                fromIndex: 1,
                toIndex: 9,
            },
            callBack: this.re_getRecommend,
            errorHandler: this.error_getRecommend,
        })
    }

    @action
    re_getRecommend = (data) => {
        typeof data === 'string' && (data = JSON.parse(data))
        console.warn("this is getRecommend data", data)
        // data = {
        //     "result": "SUCCESS",
        //     "errorCode": 0,
        //     "dataMap": {
        //         "myInvites": [
        //             {
        //                 "identityAuthStatus": 3,
        //             },{
        //                 "identityAuthStatus": 2,
        //             },{
        //                 "identityAuthStatus": 1,
        //             },{
        //                 "identityAuthStatus": 0,
        //             },
        //         ],
        //         "size": 4,
        //         "totalRegister": 100
        //     }
        // }
        let dataMap = data.dataMap || {}
        this.totalPrice = dataMap.totalRegister || 0
        this.personNum = dataMap.size || 0

        let myInvites = dataMap.myInvites || [{"identityAuthStatus": 0}]
        let arr = myInvites.filter(v=>v.identityAuthStatus==2) || []//2代表已实名
        this.personRealNameNum = arr.length || 0;
        this.loading = false
    }
    @action
    error_getRecommend = (err) => {
        console.warn('获取我的推荐奖励出错', err)
        this.loading = false

    }


    // 复制我的推荐
    @action
    copyRecommendId = (id) => {
        Clipboard.setString(id)

        this.$globalFunc.toast('复制成功')

    }

    // 复制分享链接
    @action
    copyShareUrl = (url) => {
        this.closeShareUrl()
        Clipboard.setString(url)

        this.$globalFunc.toast('复制成功')


    }

    // 显示我的推荐二维码
    @action
    showMyQrCode = () => {
        this.modalShow = true
    }
    // 关闭我的推荐二维码
    @action
    closeModal = () => {
        this.modalShow = false
    }
    // 打开我的分享
    @action
    shareUrl = () => {
        this.shareShow = true

    }
    // 关闭我的分享
    @action
    closeShareUrl = () => {
        this.shareShow = false

    }

    // 去我的海报
    goToPoster = ()=>{
        this.$router.push('Poster')
    }


    /*----------------------- 挂载 -------------------------*/

    render() {

        let uid = this.$store.state.authMessage.uuid || this.$store.state.authMessage.userId.toString() || ''

        return (
            <View style={[styles.container, styles.container2]}>
                <NavHeader headerTitle={'我的邀请'} goBack={this.goBack}/>
                <ScrollView style={[styles.container, styles.containerBox,{backgroundColor:StyleConfigs.bgColor}]}>

                    {/*banner begin*/}
                    <View style={styles.bannerIconBox}>
                        <Image resizeMode={'contain'} source={null} style={styles.bannerIcon}/>
                        {/*<Text style={styles.rewardFloatText}>{this.$store.state.activity*100}%</Text>*/}
                    </View>
                    {/*banner end*/}

                    {/*已推荐朋友和获取奖励 begin*/}
                    <View style={styles.rewardBox}>
                        <View style={[styles.rewardDetailBox]}>
                            <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.rewardDetailTitle]}>
                                已推荐好友(人)
                            </Text>
                            <Text  allowFontScaling={false} style={[baseStyles.textBlue, styles.rewardDetail]}>
                                {this.personNum}
                            </Text>
                        </View>
                        <View style={[styles.rewardDetailBox]}>
                            <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.rewardDetailTitle]}>
                                已实名好友(人)
                            </Text>
                            <Text  allowFontScaling={false} style={[baseStyles.textBlue, styles.rewardDetail]}>
                                {this.personRealNameNum}
                            </Text>
                        </View>
                        {/*<View style={styles.rewardDetailline}/>*/}
                        <View style={[styles.rewardDetailBox,styles.rewardDetailBoxEnd]}>
                            <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.rewardDetailTitle]}>
                                已获得金币(枚)
                            </Text>
                            <Text  allowFontScaling={false} style={[baseStyles.textBlue, styles.rewardDetail]}>
                                {this.totalPrice}
                            </Text>
                        </View>
                    </View>
                    {/*已推荐朋友和获取奖励 end*/}
                    {/*line begin*/}
                    <View style={styles.lineView}/>
                    {/*line end*/}

                    {/*我的二维码 begin*/}
                    <View style={[styles.myRecommendIdBox]}>
                        <View style={[styles.myRecommendIdTitleBox]}>
                            <Text  allowFontScaling={false} style={[styles.myRecommendIdText,{color:StyleConfigs.txt9FA7B8}]}>我的推荐ID</Text>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.showMyQrCode}
                            >
                                <View style={[styles.qrCodeAlertBox]}>
                                    <Image source={null} style={[styles.qrCodeAlertIcon]}/>
                                    <Text  allowFontScaling={false} style={[baseStyles.textBlue, styles.qrCodeAlertText]}>
                                        推荐二维码
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.idCopyBox}>
                            <TextInput
                                allowFontScaling={false}
                                value={uid}
                                underlineColorAndroid={'transparent'}
                                style={[baseStyles.textColor, styles.recommendId]}
                                editable={false}
                            />
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={() => {
                                    this.copyRecommendId(uid)
                                }}
                            >
                                <View style={styles.recommendIdCopyBtnBox}>
                                    <Text  allowFontScaling={false} style={[baseStyles.textBlue, styles.recommendIdCopyBtnText]}>复制</Text>
                                </View>
                            </TouchableOpacity>


                            <View style={styles.split}>

                            </View>
                            <TouchableOpacity
                                style={[styles.center,styles.myPosterEnterBox]}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToPoster}
                            >
                                {/*<Image source={myPosterEnter} style={styles.myPosterEnterImage} />*/}
                                <Text allowFontScaling={false} style={[styles.myRecommendIdText]}>我的专属邀请海报</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*我的二维码 end*/}
                    {/*line begin*/}
                    <View style={styles.lineView}/>
                    {/*line end*/}
                    {/*我的推荐链接 begin*/}
                    {/*<View style={styles.myRecommendUrlBox}>*/}
                        {/*<View style={styles.myRecommendUrlTitleBox}>*/}
                            {/*<Text  allowFontScaling={false} style={styles.myRecommendUrlTitle}>我的推荐链接</Text>*/}
                        {/*</View>*/}
                        {/*<View style={styles.myRecommendUrlDetailBox}>*/}
                            {/*<TextInput*/}
                                {/*allowFontScaling={false}*/}
                                {/*value={env.networkConfigs.downloadUrl+'index/register?uid=' + uid}*/}
                                {/*underlineColorAndroid={'transparent'}*/}
                                {/*style={[baseStyles.textColor, styles.recommendUrl]}*/}
                                {/*editable={false}*/}
                            {/*/>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*onPress={this.shareUrl}*/}
                            {/*>*/}
                                {/*<Image resizeMode={'contain'} source={ShareIcon} style={styles.shareIcon}/>*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                    {/*我的推荐链接 end*/}

                    {/*活动细则 begin*/}
                    <View style={styles.ruleBox}>
                        <View style={styles.ruleTitleBox}>
                            {/*<View style={styles.ruleTitleLine}></View>*/}
                            <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.ruleTitle]}>活动细则</Text>
                            {/*<View style={styles.ruleTitleLine}></View>*/}
                        </View>
                        <View style={styles.ruleDetailBox}>
                            <Text  allowFontScaling={false} style={[baseStyles.text9FA7B8, styles.ruleDetail]}>1、活动期间内，每邀请一名好友注册交易平台并完成实名认证，即可获得100枚9Bull金币；</Text>
                            <Text  allowFontScaling={false} style={[baseStyles.text9FA7B8, styles.ruleDetail]}>2、当被邀请人认证并完成首次交易，邀请人可再额外获得500枚9Bull金币；</Text>
                            <Text  allowFontScaling={false} style={[baseStyles.text9FA7B8, styles.ruleDetail]}>3、邀请好友数量不设上限，累计邀请金币不设上限；</Text>
                            <Text  allowFontScaling={false} style={[baseStyles.text9FA7B8, styles.ruleDetail]}>4、Bull金币可用于后续的新币兑换、线下私密活动报名等使用。</Text>
                        </View>

                    </View>
                    {/*活动细则 end*/}


                </ScrollView>


                {/*扫描二维码 begin*/}
                {
                    <Modal
                        animationIn={'fadeIn'}
                        animationOut={'fadeOut'}
                        isVisible={this.modalShow}
                        backdropColor={'black'}
                        backdropOpacity={0.5}
                    >
                        <View style={styles.modalBox}>
                            <View style={styles.modalCloseBox}>
                                <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    onPress={this.closeModal}
                                >
                                    <Image source={ModalCloseIcon} style={styles.modalCloseIcon}/>
                                </TouchableOpacity>

                            </View>
                            <View style={styles.modalQrCodeBox}>
                                <View style={styles.modalTitleBox}>
                                    <Text  allowFontScaling={false} style={[styles.modalTitle]}>专属推荐二维码</Text>
                                </View>
                                <View style={styles.modalQrCodeDetailBox}>
                                    <QrCode
                                        value={env.networkConfigs.downloadUrl+'index/register?uid=' + uid}
                                        size={getWidth(200)}
                                    />
                                    <Text  allowFontScaling={false} style={styles.modalDetailText}>邀请好友得金币</Text>

                                </View>
                            </View>
                        </View>
                    </Modal>
                }
                {/*扫描二维码 end*/}

                {/*分享链接 begin*/}
                {
                    <Modal
                        isVisible={this.shareShow}
                        backdropColor={'black'}
                        backdropOpacity={0.5}
                    >
                        <View style={styles.shareBox}>
                            <Text  allowFontScaling={false} style={styles.shareTitle}>分享到</Text>
                            {/*分享到 begin*/}
                            <View style={styles.shareDetailBox}>

                                <TouchableOpacity
                                    activeOpacity={StyleConfigs.activeOpacity}
                                    onPress={() => {
                                        this.copyShareUrl(env.networkConfigs.downloadUrl+'index/register?uid=' + uid)
                                    }}
                                >
                                    <View style={styles.shareItemBox}>
                                        <View style={[styles.shareItem, styles.shareUrl]}>
                                            <Image source={ShareUrlIcon} style={styles.shareUrlIcon}/>
                                        </View>
                                        <Text  allowFontScaling={false} style={styles.shareUrlDetailTitle}>复制链接</Text>
                                    </View>
                                </TouchableOpacity>


                            </View>

                            {/*分享到 end*/}

                            {/*取消 begin*/}
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.closeShareUrl}
                            >
                                <View style={styles.cancelShareBox}>
                                    <Text  allowFontScaling={false} style={styles.cancelShareText}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            {/*取消 end*/}


                        </View>
                    </Modal>
                }
                {/*分享链接 end*/}


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={true}/>
                }
            </View>
        )
    }
}
