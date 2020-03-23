import React from 'react';
import {StyleSheet, View, Modal,Text,TouchableOpacity,Image,ScrollView} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import BaseStyle from '../style/BaseStyle'
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import BaseButton from '../components/baseComponent/BaseButton'
import SignBaseStyle from "../style/SignBaseStyle";
import CheckBox from '../components/baseComponent/BaseCheckBox'
import close from '../assets/AdditionalRewards/close.jpg';
import closeIcon from '../assets/Modal/close-icon.png';
import propTypes from 'prop-types'
import Toast from 'react-native-root-toast'
import ENV from "../configs/environmentConfigs/env";

@observer
export default class OrderConfirmRiskPopups extends RNComponent {

    static propTypes = {
        data:propTypes.any,
        type: propTypes.string,
        title: propTypes.string,
        tips: propTypes.string,
        onSure: propTypes.func,
        onCancel: propTypes.func,
        onClose: propTypes.func,
        close: propTypes.bool,
        cancelText: propTypes.string,
        okText: propTypes.string,
        style:propTypes.any,
        alertBoxStyle:propTypes.any,
        alertBtnBlueStyle:propTypes.any
    }

    static defaultProps = {
        data:{},
        type:'SELL_ORDER',//'SELL_ORDER'  'BUY_ORDER' 用来判断区分颜色类型
        title: '二零二零C2C交易区风险提示',
        tips:'',
        close: true,
        cancelText: '暂不交易，离开',
        okText: '已了解市场规则与风险，进入交易',
        style:null,
        alertBtnBlueStyle:null
    }


    /*----------------------- data -------------------------*/

    @observable
    agreement = false;

    @observable
    loading = false;

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        // if(typeof(this.props.message) === 'string'){
        //     this.message = [this.props.message];
        // }
        // if(this.props.message instanceof Array){
        //     this.message = this.props.message;
        // }
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    @action
    onCancel = ()=>{}

    @action
    onSure = ()=>{
        this.popWindowCloseForFirst();
    }

    // 首次风险提示弹窗确认按钮
    popWindowCloseForFirst = () => {
        if(this.agreement === false) {
            Toast.show('请同意《C2C交易用户服务协议》', {
                duration: 500,
                position: Toast.positions.CENTER
            })
            return
        }

        this.$http.send('CONFIRM_MARKET_RULES_RECORD', {
            bind: this,
            callBack: this.re_popWindowCloseForFirst,
            errorHandler: this.error_popWindowCloseForFirst
        })
        this.loading = true;
        return
    }


    // 第一次进入是否弹窗回调
    re_popWindowCloseForFirst = (data) => {
        let that = this;
        this.loading = false;
        typeof data === 'string' && (data = JSON.parse(data));
        console.log('this is popWindowCloseForFirst',data);

        if (data.errorCode) {
            switch (data.errorCode) {
                case 1:
                    Toast.show('用户未登录', {
                        duration: 500,
                        position: Toast.positions.CENTER
                    })
                    break;
            }
            return
        }

        Toast.show('您已同意《C2C交易用户服务协议》', {
            duration: 500,
            position: Toast.positions.CENTER
        })

        that.props.onSure && that.props.onSure(false)
    }
    // 第一次进入是否弹窗出错
    error_popWindowCloseForFirst = (err) => {
        this.loading = false;
        Toast.show('获取是否弹窗请求出错', {
            duration: 500,
            position: Toast.positions.CENTER
        })
    }

    @action
    onClose = ()=>{}

    @action
    clickAgreement = ()=>{
        this.agreement = !this.agreement;
        // console.log('this.agreement 的状态为',this.agreement);
    }

    // 查看用户协议
    @action
    goToUserAgreement = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            // this.$router.push('UserAgreement')
            this.goWebView({
                // url: 'http://192.168.2.142:8080/index/help/userAgreement',
                url: 'index/notice/noticeDetail?id=100325',
                loading: false,
                navHide: false,
                title: 'C2C交易用户服务协议'
            })
        }
    })()

    goWebView = (()=>{
        let last = 0;
        return (params={
            url: '',
            loading: false,
            navHide: false,
            title: ''
        }) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            if(!params.url){
                return;
            }
            params.url.length && (params.url.indexOf('http') === -1) && (params.url = ENV.networkConfigs.downloadUrl + params.url.replace(/^\//,''));
            return this.$router.push('WebPage',params)
        }
    })()

    /*----------------------- 挂载 -------------------------*/

    render() {
        let sell = this.props.type == 'SELL_ORDER';
        let order = this.props.data.order || {};
        let userinfo = this.props.data.userinfo || {};
        return <View style={[styles.alertBox,this.props.alertBoxStyle || {}]}>
            <View style={styles.alertBoxBackground}></View>
            <View style={[styles.alert,this.props.style || {}]}>
                {
                    this.close && <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} style={styles.alertClose} onPress={this.props.onClose || this.onClose}>
                        <Image style={styles.alertIcon} source={closeIcon} resizeMode={'stretch'}/>
                    </TouchableOpacity>
                }

                <View style={styles.alertTitle}>
                    <Text allowFontScaling={false} style={[styles.alertTitleText]}>{this.props.title}</Text>
                </View>


                <View style={styles.buyInputBox}>
                    {/*<ScrollView style={{width:'100%'}}>*/}
                        <View style={[styles.itemInput]}>
                            <Text style={styles.inputField} offlines>1、C2C交易是用户之间点对点交易，须买方在场外手动转账付款，卖方收款后确认发币；</Text>
                        </View>
                        <View style={[styles.itemInput]}>
                            <Text style={styles.inputField}>2、下单后务必在15分钟内付款，转账后立即点击“我已付款”；</Text>
                        </View>
                        <View style={[styles.itemInput]}>
                            <Text style={styles.inputField}>3、超过15分钟，如未点击“我已付款”，系统视为无效订单，会自动撤销订单；</Text>
                        </View>
                        <View style={[styles.itemInput]}>
                            <Text style={styles.inputField}>4、订单撤销后，切勿再付款；如已付款，切勿撤销订单。如果操作有误，请第一时间提交申诉，上传付款证明；</Text>
                        </View>
                        <View style={[styles.itemInput]}>
                            <Text style={styles.inputField}>5、C2C交易存在风险，请充分了解交易规则，交易时保持电话畅通，关注邮件和短信提醒，谨防受骗！</Text>
                        </View>
                        <View style={[styles.agreementBox]}>
                            <CheckBox
                                unCheckedBorderColor = '#999'
                                checked={this.agreement}
                                keys={1}
                                onPress={this.clickAgreement}
                            />
                            <TouchableOpacity
                                style={styles.agreementTouch}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.clickAgreement}
                            >
                                <Text allowFontScaling={false} style={[styles.inputField]}>我已阅读并同意</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.goToUserAgreement}
                            >
                                <Text allowFontScaling={false} style={[styles.userAgent]}>《C2C交易用户服务协议》</Text>
                            </TouchableOpacity>
                        </View>
                    {/*</ScrollView>*/}

                </View>

                <View style={styles.alertBtnBox}>
                    <BaseButton
                        style={[styles.alertBtnBlue,sell && {borderColor:StyleConfigs.btnRed,backgroundColor:StyleConfigs.btnRed} || null]}
                        textStyle={styles.alertBtnTextWhite}
                        text={this.props.okText}
                        onPress={this.onSure}/>
                    <BaseButton
                        style={[styles.alertBtnWhite,sell && {borderColor:StyleConfigs.btnRed} || null]}
                        textStyle={[styles.alertBtnTextBlue,sell && {color:StyleConfigs.txtRed} || null]}
                        text={this.props.cancelText}
                        onPress={this.props.onCancel || this.onCancel}/>
                </View>
            </View>
        </View>
    }
}
const styles = StyleSheet.create({
    alertBox:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBoxBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#000',
        opacity: 0.6
    },
    alert:{
        backgroundColor: '#fff',
        width: getWidth(655),
        // height: '100%',
        borderRadius: 8,
        // marginTop: getHeight(300)
        paddingBottom:50
    },
    alertClose:{
        width: getWidth(40),
        height: getWidth(40),
        position: 'absolute',
        right: 0,
        top: getWidth(-60)
    },
    alertIcon:{
        width: '100%',
        height: '100%'
    },
    alertTitle:{
        marginLeft: getWidth(40),
        marginRight: getWidth(40),
        height: getHeight(96),
        borderColor: '#f2f2f2',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertTitleText:{
        fontSize: 16,
        color: '#rgba(0,0,0,0.9)',
        fontWeight: 'bold'
    },
    tipsText:{
        marginTop:getHeight(10),
        fontSize:13,
        color:StyleConfigs.txtRed,
        flexWrap:'wrap',
        lineHeight:getHeight(34)
    },
    alertBtnBox:{
        height: getHeight(72),
        marginBottom: getHeight(40),
        alignItems: 'center',
        // flexDirection: 'row'
    },
    alertBtnWhite:{
        marginTop:getHeight(30),
        width:getWidth(600),
        height: getHeight(72),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: StyleConfigs.btnGreen,
        backgroundColor: StyleConfigs.btnWhite,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBtnBlue:{
        width:getWidth(600),
        height: getHeight(72),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: StyleConfigs.btnGreen,
        backgroundColor: StyleConfigs.btnGreen,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBtnTextBlue:{
        fontSize: 15,
        color: StyleConfigs.txtGreen
    },
    alertBtnTextWhite:{
        fontSize: 15,
        color: StyleConfigs.txtWhite
    },
    buyInputBox:{
        marginLeft: getWidth(40),
        marginRight: getWidth(40),
        width:getWidth(655-40-40),
        // height:250,
        // backgroundColor:'#ccc',
        paddingVertical:getHeight(30),
    },
    itemInput:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent:'flex-start',
        // paddingHorizontal:getWidth(16),
        // height:getHeight(50),
        borderBottomWidth:0
    },
    inputField:{
        // width:getWidth(128),
        color:StyleConfigs.txt333333,
        fontSize:StyleConfigs.fontSize14,
        flexWrap:'wrap',
        lineHeight:getHeight(50)
    },
    inputPrice:{
        // flex:1,
        color:StyleConfigs.txtGreen,
        fontSize:StyleConfigs.fontSize14
    },
    inputLimt:{
        // flex:1,
        color:StyleConfigs.txt333333,
        fontSize:StyleConfigs.fontSize14,
    },
    inputDesc:{
        color: StyleConfigs.placeholderTextColor,
        fontSize:StyleConfigs.fontSize14
    },
    inputBank:{
        color:StyleConfigs.txt333333,
        fontSize:StyleConfigs.fontSize14,
        // backgroundColor:"#ccc"
    },
    inputTips:{
        fontSize:StyleConfigs.fontSize12,
        color:StyleConfigs.txtBlue,
        // backgroundColor:"#ccc"
    },
    agreementBox: {
        flexDirection: 'row',
        marginTop:getHeight(10),
        alignItems:'center'
    },
    agreementTouch:{
        marginLeft:getWidth(10)
    },
    userAgent:{
        fontSize:StyleConfigs.fontSize14,
        color:StyleConfigs.txt999999
    }
})