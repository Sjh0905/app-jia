import React from 'react';
import {StyleSheet, View, Modal,Text,TouchableOpacity,Image} from 'react-native';
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

@observer
export default class OrderConfirmPopups extends RNComponent {

    static propTypes = {
        data:propTypes.any,
        type: propTypes.string,
        title: propTypes.string,
        tips: propTypes.string,
        onSure: propTypes.func,
        onCancel: propTypes.func,
        onClose: propTypes.func,
        showNoPayAgree:propTypes.bool,
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
        title: '确定买入',
        tips:'',
        // tips: '未付款时点击确定付款属于恶意点击，一经查处，系统将暂时封锁账户，请谨慎操作。',
        // tips: '重要提示：撤销订单后本交易将被取消，请勿再付款。',
        // tips: '重要提示：请确定已经收到相应款项，确定收款后资产将直接打给对方账户，有不可追回风险，请慎重操作。',
        showNoPayAgree:false,
        close: true,
        cancelText: '取消',
        okText: '确定下单',
        style:null,
        alertBtnBlueStyle:null
    }


    /*----------------------- data -------------------------*/

    @observable
    noPayAgree = false;

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
        let that = this;
        that.props.onSure && that.props.onSure(this.noPayAgree)
    }

    @action
    onClose = ()=>{}

    @action
    noPayAgreeFunc = ()=>{
        this.noPayAgree = !this.noPayAgree;
        // console.log('this.noPayAgree 的状态为',this.noPayAgree);
    }

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
                    <Text allowFontScaling={false} style={[styles.alertTitleText,sell && BaseStyle.textRed || null]}>{this.props.title}</Text>
                </View>


                <View style={styles.buyInputBox}>
                    <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                        <Text style={styles.inputField}>商家：</Text>
                        <Text style={styles.inputLimt}>{userinfo.name}</Text>
                    </View>
                    <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                        <Text style={styles.inputField}>单号：</Text>
                        <Text style={styles.inputLimt}>{order.orderId}</Text>
                    </View>
                    <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                        <Text style={styles.inputField}>类型：</Text>
                        <Text style={[styles.inputPrice,sell && BaseStyle.textRed || null]}>{sell && '卖出' || '买入'}</Text>
                    </View>
                    <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                        <Text style={styles.inputField}>价格：</Text>
                        <Text style={[styles.inputPrice,sell && BaseStyle.textRed || null]}>{this.$globalFunc.accFixed(order.price,2)}CNY</Text>
                    </View>
                    <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                        <Text style={styles.inputField}>数量：</Text>
                        <Text style={styles.inputLimt}>{this.$globalFunc.accFixed(order.amount,2)}USDT</Text>
                    </View>

                    <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                        <Text style={styles.inputField}>金额估值：</Text>
                        <Text style={[styles.inputPrice,sell && BaseStyle.textRed || null]}>{this.$globalFunc.accFixed(order.amount * order.price,2)}CNY</Text>
                        <Text style={[styles.inputTips,{color:StyleConfigs.txt666666}]}>(以实际订单为准)</Text>
                    </View>
                    <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                        <Text style={styles.inputField}>支付方式：</Text>
                        <Text style={styles.inputBank}>银行转账</Text>
                        <Text style={styles.inputTips}>(须本人账户支付)</Text>
                    </View>
                    {this.props.showNoPayAgree &&
                        <View style={[styles.agreementBox]}>
                            <CheckBox
                                unCheckedBorderColor = '#dddddd'
                                checked={this.noPayAgree}
                                keys={1}
                                onPress={this.noPayAgreeFunc}
                            />
                            <TouchableOpacity
                                style={styles.noPayAgreeTouch}
                                activeOpacity={StyleConfigs.activeOpacity}
                                onPress={this.noPayAgreeFunc}
                            >
                                <Text allowFontScaling={false} style={[styles.inputField]}>我确定没有付款</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        this.props.tips && <Text style={styles.tipsText}>{this.props.tips}</Text> || null
                    }

                </View>



                <View style={styles.alertBtnBox}>
                    {
                        this.props.cancelText
                        &&
                        <BaseButton style={[styles.alertBtnWhite,sell && {borderColor:StyleConfigs.btnRed} || null]}
                                    textStyle={[styles.alertBtnTextBlue,sell && {color:StyleConfigs.txtRed} || null]}
                                    text={this.props.cancelText}
                                    onPress={this.props.onCancel || this.onCancel}/>
                        ||
                        null
                    }
                    <BaseButton
                        style={[styles.alertBtnBlue,sell && {borderColor:StyleConfigs.btnRed,backgroundColor:StyleConfigs.btnRed} || null]}
                        textStyle={styles.alertBtnTextWhite}
                        text={this.props.okText}
                        onPress={this.onSure}/>
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
        width: getWidth(650),
        // height: getHeight(314),
        borderRadius: 8,
        // marginTop: getHeight(300)
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
        color: StyleConfigs.txtGreen,
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
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    alertBtnWhite:{
        width:getWidth(250),
        height: getHeight(72),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: StyleConfigs.btnGreen,
        backgroundColor: StyleConfigs.btnWhite,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBtnBlue:{
        width:getWidth(250),
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
        width:getWidth(650-40-40),
        // backgroundColor:'#ccc',
        paddingVertical:getHeight(30),
    },
    itemInput:{
        justifyContent:'flex-start',
        // paddingHorizontal:getWidth(16),
        height:getHeight(50),
        borderBottomWidth:0
    },
    inputField:{
        // width:getWidth(128),
        color:StyleConfigs.txt333333,
        fontSize:StyleConfigs.fontSize14
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
        marginTop:getHeight(10)
    },
    noPayAgreeTouch:{
        marginLeft:getWidth(10)
    }
})