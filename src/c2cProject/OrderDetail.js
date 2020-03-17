import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ListView,
    FlatList,
    SectionList,
    Platform,
    Clipboard
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import NavHeader from '../components/baseComponent/NavigationHeader'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import styles from "../style/OrderDetailStyle";

import BaseStyle from '../style/BaseStyle'
import device from "../configs/device/device";
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'
import Loading from '../components/baseComponent/Loading'
import OrderConfirmPopups from './OrderConfirmPopups'
import VerifyPopups from './VerifyPopups'
import {getAuthStateForC2C} from './C2CPublicAPI'
import Toast from 'react-native-root-toast'

//用来判断分页距离
const reachedThreshold = Platform.select({
    ios: -0.1,
    android: 0.1
});

@observer
export default class OrderList extends RNComponent {


	componentWillMount() {
		// this.getOrder()

	}

	componentDidMount() {
	    //获取用户认证状态
	    this.doGetAuthStateForC2C();
	    //获取订单详情
		this.getOrderDetail();
	}



    @computed get order(){
        return this.$params.order;
    }
    //tab类型，从C2CHomePage传过来的，用于标注当前为哪个tab页面，不能和orderStatus混为一谈
    // @computed get status(){
    //     return this.$params.status;
    // }
    @computed get c2cOrderStatusMap(){
        return this.$store.state.c2cOrderStatusMap;
    }
    @computed get authStateForC2C(){
        return this.$store.state.authStateForC2C;
    }
    @computed get showPicker(){
        return this.authStateForC2C.ga && this.authStateForC2C.sms;
    }

    @observable status= this.$params.status
    // 展示付款码
	@observable show_receipt_code= false

    // 展示弹框
    @observable show_dialog= false
    // 弹框类型
    @observable dialog_type= ''
    //弹窗标题
    @observable dialog_title = '';
	//提示语
    @observable tips = '';
    //弹窗确定按钮
    @observable dialog_ok_text = '';

    // loading
    @observable loading= true

    // 是否展示收/付款按钮
    @observable show_buy_sell_btn= true

    // 进行中订单是否显示申诉
    @observable appealTime= 0
    @observable appeal= ''

    // 订单状态时间
    @observable order_detail_time= ''

    // 订单超时时间
    @observable expireTime= 0

    // dialog
    @observable popType= 0
    @observable popOpen= false
    @observable popText= '系统繁忙，请稍后再试'

    // 是否显示付款按钮
    @observable paying= false
    //是否显示"我确认没有付款"选项
    @observable showNoPayAgree = false

    // 展示订单状态 未付款，已收款，已撤单等
    @observable
    order_status= 0
    // 是否撤单
    @observable canneling= false

    // 用户信息
    @observable user_info= {}
    // 订单列表
    @observable ctc_order= {}
    // 支付列表
    @observable pay_info= [] //分为 商户支付列表 和 个人支付列表
    // 详情用户状态
    @observable userType= 0  // 0 商家， 1 普通用户
    // 支付宝二维码url
    @observable alipay_url= ''

    // 确认未付款
    @observable no_pay_agree= false

    // 邮箱验证
    @observable sendingEmail= false
    @observable bindEmail= false
    @observable show_mail= false
    @observable mailCode= ''
    @observable mailCodeWA= ''
    @observable getMailCode= false
    @observable getMailCodeCountdown= 60

    // 谷歌验证码信息
    // 展示验证信息框
    @observable show_ga_sms_dialog= false

    // 验证信息
    @observable verificationCode= ''
    @observable verificationCodeWA= ''

    @observable getVerificationCode= false
    @observable getVerificationCodeInterval= null
    @observable getVerificationCodeCountdown= 60
    @observable clickVerificationCodeButton= false

    // 是否显示验证
    // @observable showPicker= false
    // @observable bindGA= false
    // @observable bindMobile= false
    // @observable picked= ''
    // 短信码/谷歌码
    @observable GACode= ''
    @observable GACodeWA= ''
    @observable sending= false

    //async必须和()连在一起哦
    doGetAuthStateForC2C = async()=>{
        await getAuthStateForC2C(this.$http,this.$store);
    }

    notifyOderList = ()=>{
        this.notify({key: 'RE_ORDER_LIST'},'PROCESSING')
    }

    getOrderDetail = ()=>{
        this.$http.send('CTC_ORDER_DETAIL', {
            params: {
                userId: this.$store.state.authMessage.userId,
                c2cOrderType: this.order.type,
                ctcOrderId: this.order.id,
            },
            bind: this,
            callBack: this.re_getOrderDetail,
            errorHandler: this.error_getOrderDetail,
        })
	}
    re_getOrderDetail = (data)=>{
        typeof (data) === 'string' && (data = JSON.parse(data))
		console.log('this is c2c orderdetail',data);

        let self = this;
        let code = data.errorCode;
        let datas = data.dataMap || {};

        if (code == 0) {
            this.loading = false;

            // 进行中订单是否显示申诉
            this.appealTime = datas.appealTime;
            this.appeal = datas.ctcOrder && datas.ctcOrder.appeal;

            // 0 商家， 1 普通用户
            this.userType = datas.userType;
            this.ctc_order = datas.ctcOrder || {};
            this.user_info = datas.userType == 0 ? (!!datas.user && datas.user[0] || {}) : (!!datas.business && datas.business[0] || {});
            this.pay_info = datas.userType == 1 ? (!!datas.userPayInfoList && datas.userPayInfoList[0] || {}) : (!!datas.businessPayInfoList && datas.businessPayInfoList || {});
            // this.pay_info = datas.userType == 1 ? (datas.userPayInfoList || []) : (datas.businessPayInfoList || []);
            // 判断用户支付方式有无变化 买入时候需要判断
            // datas.userType == 1 && this.USER_PAY_INFO(this.ctc_order);

            // OrderComplete:2

            // 订单付款/完成/取消时间
            this.order_detail_time = this.status == 'COMPLETE' ? this.ctc_order.confirmTime : (this.status == 'CANCEL' ? this.ctc_order.cancelTime : this.ctc_order.payTime);


            // UNCONFIRMED, // 未确认
            // BUYER_CONFIRM, // 买方确认
            // SELLER_CONFIRM, // 卖方确认
            // SELLER_ONCE_CONFIRM // 在买方未确认情况下的卖方确认
            // 是否收/付款
            if (this.ctc_order.type == 'BUY_ORDER' && this.ctc_order.confirmStatus != 'UNCONFIRMED') { // 如果是买单
                this.paying = true; // 不能点
                return;
            }
            //如果是卖单并且卖方确认
            if (this.ctc_order.type == 'SELL_ORDER' && this.ctc_order.confirmStatus != 'UNCONFIRMED' && this.ctc_order.confirmStatus != 'BUYER_CONFIRM') {  // 如果是卖单
                this.paying = true; // 不能点
                return;
            }
            //如果是卖单并且买方确认
            if (this.ctc_order.type == 'SELL_ORDER') {
                if (this.ctc_order.confirmStatus != 'UNCONFIRMED') {
                    this.order_status = 1; // 显示买家已付款
                }
            }
            // 如果是取消订单列表
            if (!!this.ctc_order.cancelTime) {
                this.paying = true;
                return;
            }

            // 初始化倒计时
            this.expireTime = !!this.ctc_order.expireTime2 ? this.ctc_order.expireTime2 : this.ctc_order.expireTime1;
            // this.status == 'PROCESSING' && this.initTimes(this.serverTime, end);


            return
        }

        switch (code) {
            case 5:
                self.popText = '用户/商户不存在';
                break;
            case 6:
                self.popText = '待审核或审核未通过';
                break;
            case 7:
                self.popText = '保证金未缴纳,异常,释放中,已释放';
                break;
            case 8:
                self.popText = '对方的支付信息为空';
                break;
            case 2:
                self.popText = '商家已被禁用';
                break;
            default:
                break;
        }
        Toast.show(self.popText, {
            duration: 1000,
            position: Toast.positions.CENTER
        })

	}
    error_getOrderDetail = (err)=>{
        console.warn('查询订单详情请求出错',err);
        Toast.show('查询订单详情请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
	}

    @action
	goBack = ()=>{
		this.$router.goBack()
	}

    goWorkOrder = ()=>{
		// this.$router.push('WorkOrder')
	}
	toCopyVal = (val)=>{
        Clipboard.setString(val)
        this.$globalFunc.toast('复制成功')
	}

    showDialog = (dialog) =>{

        //确定撤单 BUY_ORDER
        if(dialog == 'cancle'){
            this.dialog_title = '确定撤单';
            this.tips = '重要提示：撤销订单后本交易将被取消，请勿再付款。';
            this.dialog_ok_text = '确定撤单';
            this.showNoPayAgree = true;
        }
        //确定已付款 BUY_ORDER
        if(dialog == 'confirmPay'){
            this.dialog_title = '确定付款';
            this.tips = '未付款时点击确定付款属于恶意点击，一经查处，系统将暂时封锁账户，请谨慎操作。';
            this.dialog_ok_text = '确定付款';
            this.showNoPayAgree = false;
        }
        //确定已收款 SELL_ORDER
        if(dialog == 'confirmReceipt'){
            this.dialog_title = '确定收款';
            this.tips = '重要提示：请确定已经收到相应款项，确定收款后资产将直接打给对方账户，有不可追回风险，请慎重操作。';
            this.dialog_ok_text = '确定收款';
        }
        this.dialog_type = dialog
        this.show_dialog = true

    }

    onSure=(noPayAgree)=>{
        console.log('noPayAgree 的状态为',noPayAgree);

        //确定撤单 BUY_ORDER
        if(this.dialog_type == 'cancle'){
            this.cancelCtcOrder(noPayAgree)
        }
        //确定已付款 BUY_ORDER
        if(this.dialog_type == 'confirmPay'){
            this.confirmPayOrder();
        }
        //确定已收款 SELL_ORDER
        if(this.dialog_type == 'confirmReceipt'){
            //弹出谷歌验证码

            if(!this.authStateForC2C.ga && !this.authStateForC2C.sms){
                Toast.show('请先绑定谷歌或手机', {
                    duration: 1000,
                    position: Toast.positions.CENTER
                })
                return
            }

            this.show_dialog = false;
            this.show_ga_sms_dialog = true;
        }
    }
    onCancel = () =>{
        this.show_dialog = false;
    }
    onClose = () =>{
        this.show_dialog = false;
    }
    verifyOnCancel = () =>{
        this.show_ga_sms_dialog = false;
    }
    verifyOnClose = () =>{
        this.show_ga_sms_dialog = false;
    }
    verifyOnSure = ()=>{
        this.show_ga_sms_dialog = false;
        //重新获取并刷新数据
        this.getOrderDetail();
        this.notifyOderList();
    }
    cancelCtcOrder = (noPayAgree) => {
        if(!noPayAgree){
            Toast.show('请确定没有付款', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
            return;
        }
        this.$http.send('CANCEL_CTC_ORDER', {
            params: {
                confirmNOPay: noPayAgree ? 0 : 1,
                ctcOrderId: this.order.id,
            },
            bind: this,
            callBack: this.re_cancelCtcOrder,
            errorHandler: this.error_cancelCtcOrder,
        })

    }
    re_cancelCtcOrder=(data)=>{
        typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('this is cancelCtcOrder',data);

        let errorCode = data.errorCode;
        let self = this;
        if (errorCode == 0) {
            //关闭弹窗
            self.onClose()
            // 跳到撤单详情界面
            self.status = 'CANCEL'
            self.getOrderDetail();
            self.popText = '撤销成功';
            self.notifyOderList();
            return;
        }
        if (errorCode == 1) {
            self.popText = '没有勾选确认付款';
            return;
        }
        if (errorCode == 2 || errorCode == 9) {
            self.popText = '24小时内超过3笔取消订单将禁止2天C2C交易';
            return;
        }
    }
    error_cancelCtcOrder = (err)=>{
        console.warn('撤单请求出错',err);
        Toast.show('撤单请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }

    confirmPayOrder =()=>{
        this.$http.send('COMFIRM_PAYMENT', {
            params: {
                ctcOrderId: this.order.id,
            },
            bind: this,
            callBack: this.re_confirmPayOrder,
            errorHandler: this.error_confirmPayOrder,
        })
    }
    re_confirmPayOrder = (data)=>{
        typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('this is confirmPayOrder',data);

        let code = data.errorCode;
        if (code == 0) {
            // 关闭弹框
            this.onClose();
            // 刷新界面
            this.getOrderDetail();
            this.notifyOderList();
            return
        }

        Toast.show(this.popText, {
            duration: 1000,
            position: Toast.positions.CENTER
        })

    }
    error_confirmPayOrder = (err)=>{
        console.warn('确定已付款请求出错',err);
        Toast.show('确定已付款请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }

	render() {

		let order = this.order
        let headerRightTitle = this.appealTime == 1 && (!this.appeal ? '我要申诉' : (order.winnerId == order.userId && '用户胜诉' || '商家胜诉')) || '我要申诉'

		return (

			<View style={[styles.container,this.status == 'PROCESSING' && {paddingBottom:getDeviceBottom()+getHeight(110)} || null]}>
                <NavHeader headerTitle={'订单详情'} goBack={this.goBack}
                           headerRightTitle={headerRightTitle}
                           headerRightOnPress={()=>{
                               if(headerRightTitle != '我要申诉')return;
                               this.goWorkOrder();
                           }}
				/>
				<ScrollView style={styles.container2}>
					{
                        this.status == 'PROCESSING' && order.type == 'BUY_ORDER' &&
                        <Text style={styles.importantTip}>
                        重要提示：请及时付款并点击“确认付款”，未付款点击“确认付款”，经核实，将会暂时封锁账号
                        </Text>
					}
					{
                        this.status == 'PROCESSING' && order.type == 'SELL_ORDER' &&
                        <Text style={styles.importantTip}>
                            重要提示：请确认已经收到相应款项，确认收款后资产将直接打给对方账户，有不可追回风险，请慎重操作。
                        </Text>
					}

					{/*订单信息1*/}
					<View style={[styles.orderTypeBox,this.status != 'PROCESSING' && {marginTop:getHeight(30)}]}>
						<View style={{flexDirection: 'row'}}>
                            {
                                order.type == 'SELL_ORDER' &&

                                <View style={[styles.ballRed]}>
                                    <Text  allowFontScaling={false} style={[styles.color100, styles.size12]}>{'卖'}</Text>
                                </View>
                                ||
                                <View style={[styles.ballGreen]}>
                                    <Text  allowFontScaling={false} style={[styles.color100, styles.size12]}>{'买'}</Text>
                                </View>
                            }
							<Text  allowFontScaling={false} style={[styles.color40, styles.size15]}>金额：</Text>
							<Text  allowFontScaling={false} style={[styles.color100, styles.size15]}>￥{this.$globalFunc.accFixed(order.amount * order.price,2)}</Text>
						</View>
						<View style={{flexDirection: 'row'}}>
							{/*<Text  allowFontScaling={false} style={[styles.color40, styles.size15]}>付款码：</Text>*/}
							<Text  allowFontScaling={false} style={[styles.color40, styles.size15]}>{order.type == 'SELL_ORDER' && '收款码 ' || '付款码 '}</Text>
							<Text  allowFontScaling={false} style={[styles.color100, styles.size15]}>{order.randomStr || '无'}</Text>
						</View>
					</View>
                    {/*订单信息1*/}
                    {/*订单信息2*/}
					<View style={styles.infoListBox}>
                        {/*单号*/}
						<View style={styles.infoListItem}>
							<Text style={styles.infoListLeftText}>单号</Text>
							<Text style={styles.infoListRightText}>{order.orderId}</Text>
						</View>
                        {/*价格/数量*/}
						<View style={styles.infoListItem}>
							<Text style={styles.infoListLeftText}>价格/数量</Text>
							<Text style={[styles.infoListRightText,{color:StyleConfigs.txtWhite}]}>¥{this.$globalFunc.accFixed(order.price,2)}/{this.$globalFunc.accFixed(order.amount,2)}</Text>
						</View>
                        {/*状态*/}
						<View style={styles.infoListItem}>
							<Text style={styles.infoListLeftText}>状态</Text>
							{
                                this.status == 'PROCESSING' &&
                                <View style={{flexDirection:'row'}}>
                                    {
                                        !this.paying &&
                                        //卖单，但是买家没有付款或已付款
                                        (<Text style={[styles.orderStatus,order.type == 'BUY_ORDER' && {color:StyleConfigs.txtGreen} || null]}>{this.order_status != 1 && '待付款' || '已付款'}</Text>)
                                        ||
                                        //买单，并且已经花钱了或者已撤单
                                        <Text style={[styles.orderStatus,order.type == 'BUY_ORDER' && {color:StyleConfigs.txtGreen} || null]}>{!this.canneling && '已付款' || '已撤单'}</Text>
                                    }
                                    {
                                        !this.paying && this.order_status != 2 &&
                                        <Text style={styles.infoListRightText}>
                                            {this.$globalFunc.timeCountdown(this.$store.state.serverTime,this.expireTime)}
                                        </Text>
                                    }
                                </View>
								||
								    this.status == 'OTHER' &&
                                    //其他订单类型
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[styles.orderStatus,order.type == 'BUY_ORDER' && {color:StyleConfigs.txtGreen} || null]}>{this.c2cOrderStatusMap[this.status][order.orderStatus]} </Text>
                                    </View>
                                ||
                                    // 已完成或者已取消
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={[styles.orderStatus,order.type == 'BUY_ORDER' && {color:StyleConfigs.txtGreen} || null]}>{this.c2cOrderStatusMap[this.status]} </Text>
                                    </View>
							}
						</View>
                        {/*创建时间*/}
						<View style={styles.infoListItem}>
							<Text style={styles.infoListLeftText}>创建时间</Text>
							<Text style={styles.infoListRightText}>{this.$globalFunc.formatDateUitl(order.createdAt)}</Text>
						</View>
					</View>
                    {/*订单信息2*/}

                    {/*'卖家信息' || '买家信息'*/}
					<Text style={styles.sellerInfoTitle}>
                        {order.type == 'BUY_ORDER' && '卖家信息' || '买家信息'}
					</Text>
					<View style={[styles.sellerInfoBox,{paddingTop:getHeight(15)}]}>
						<View style={styles.sellerInfoItem}>
							<Text style={styles.infoListLeftText}>{'姓名：'}</Text>
                            {
                                (this.status == 'COMPLETE' || this.status == 'CANCEL') &&
                                <Text style={[styles.infoListRightText,BaseStyle.textWhite]}>{this.$globalFunc.changeName(this.user_info.name)}</Text>
                                ||
                                <Text style={[styles.infoListRightText,BaseStyle.textWhite]}>{this.user_info.name || ''}</Text>
                            }
						</View>
						<View style={styles.sellerInfoItem}>
							<Text style={styles.infoListLeftText}>电话：</Text>
                            {
                                (this.status == 'COMPLETE' || this.status == 'CANCEL') &&
                                <Text style={[styles.infoListRightText,BaseStyle.textBlue]}>{this.$globalFunc.changePhone(this.user_info.mobile)}</Text>
                                    ||
                                <Text style={[styles.infoListRightText,BaseStyle.textBlue]}>{this.user_info.mobile}</Text>
                            }
						</View>
					</View>
                    {/*'卖家信息' || '买家信息'*/}

                    {/*'卖家收款信息' || '我的收款信息'*/}
					<Text style={styles.sellerInfoTitle}>
                        {order.type == 'BUY_ORDER' && '卖家收款信息' || '我的收款信息'}
                    </Text>
					<View style={styles.sellerInfoBox}>
						<Text style={styles.sellerInfoTitle}>
							银行转账
						</Text>
						<View style={styles.sellerInfoItem}>
							<Text style={styles.infoListLeftText}>{order.type == 'BUY_ORDER' && '卖家姓名：' || '姓名：'}</Text>
                            {
                                (this.status == 'COMPLETE' || this.status == 'CANCEL') &&
                                <Text style={[styles.infoListRightText,BaseStyle.textWhite]}>{this.$globalFunc.changeName(this.pay_info.username)}</Text>
                                ||
                                <Text style={[styles.infoListRightText,BaseStyle.textWhite]}>{this.pay_info.username}</Text>
                            }
							<TouchableOpacity
								onPress={()=>{
								    let username = (this.status == 'COMPLETE' || this.status == 'CANCEL') ? this.$globalFunc.changeName(this.pay_info.username) : this.pay_info.username;
									this.toCopyVal(username)
								}}
								activeOpacity={StyleConfigs.activeOpacity}
								style={[styles.copyBtn]}>
								<Text  allowFontScaling={false} style={[BaseStyle.textBlue,styles.size12]}>复制</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.sellerInfoItem}>
							<Text style={styles.infoListLeftText}>银行：</Text>
							<Text style={[styles.infoListRightText,BaseStyle.textWhite]}>{this.pay_info.bankName}</Text>
							<TouchableOpacity
								onPress={()=>{
									this.toCopyVal(this.pay_info.bankName)
								}}
								activeOpacity={StyleConfigs.activeOpacity}
								style={[styles.copyBtn]}>
								<Text  allowFontScaling={false} style={[BaseStyle.textBlue,styles.size12]}>复制</Text>
							</TouchableOpacity>
						</View>
						<View style={[styles.sellerInfoItem]}>
							<Text style={[styles.infoListLeftText]}>支行：</Text>
							<Text style={[styles.infoListRightText,BaseStyle.textWhite]}>{this.pay_info.bankAddr}</Text>
							<TouchableOpacity
								onPress={()=>{
									this.toCopyVal(this.pay_info.bankAddr)
								}}
								activeOpacity={StyleConfigs.activeOpacity}
								style={[styles.copyBtn]}>
								<Text  allowFontScaling={false} style={[BaseStyle.textBlue,styles.size12]}>复制</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.sellerInfoItem}>
							<Text style={styles.infoListLeftText}>银行卡号：</Text>
                            {
                                (this.status == 'COMPLETE' || this.status == 'CANCEL') &&
                                <Text style={[styles.infoListRightText,BaseStyle.textWhite]}>{this.$globalFunc.changeBankCard(this.pay_info.cardNumber)}</Text>
                                ||
                                <Text style={[styles.infoListRightText,BaseStyle.textWhite]}>{this.pay_info.cardNumber}</Text>
                            }
							<TouchableOpacity
								onPress={()=>{
								    let cardNumber = (this.status == 'COMPLETE' || this.status == 'CANCEL') ? this.$globalFunc.changeBankCard(this.pay_info.cardNumber) : this.pay_info.cardNumber;
									this.toCopyVal(cardNumber)
								}}
								activeOpacity={StyleConfigs.activeOpacity}
								style={[styles.copyBtn]}>
								<Text  allowFontScaling={false} style={[BaseStyle.textBlue,styles.size12]}>复制</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>

                {/*买单操作按钮*/}
                {
                    this.status == 'PROCESSING' && order.type == 'BUY_ORDER' && !this.paying &&
                    <View style={styles.operBtnBox}>
                        <TouchableOpacity style={[styles.bbtn, styles.cancleBtn]} onPress={()=>{
                            this.showDialog('cancle')
                        }}>
                            <Text allowFontScaling={false} style={{color: StyleConfigs.txtBlue, fontSize: StyleConfigs.fontSize16}}>取消订单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.bbtn, styles.confirmBtn]} onPress={()=>{
                            this.showDialog('confirmPay')
                        }}>
                            <Text allowFontScaling={false} style={{color: StyleConfigs.txtWhite, fontSize: StyleConfigs.fontSize16}}>确认已付款</Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    this.status == 'PROCESSING' && order.type == 'SELL_ORDER' && !this.paying &&
                    <View style={styles.operBtnBox}>
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            style={[styles.bbtn, styles.confirmBtn,{width:'100%'}]}
                            onPress={()=>{
                                this.showDialog('confirmReceipt')
                            }}
                        >
                            <Text allowFontScaling={false} style={{color: StyleConfigs.txtWhite, fontSize: StyleConfigs.fontSize15}}>确认已收款</Text>
                        </TouchableOpacity>
                    </View>
                }
                {/*卖单操作按钮*/}

                {this.show_dialog &&
                    <OrderConfirmPopups
                    data={{order:this.order,userinfo:this.user_info}}
                    showNoPayAgree={this.status == 'PROCESSING' && order.type == 'BUY_ORDER' && !this.paying && this.showNoPayAgree}
                    type={order.type}
                    title={this.dialog_title}
                    tips={this.tips}
                    onSure={this.onSure}
                    onCancel={this.onCancel}
                    onClose={this.onClose}
                    okText={this.dialog_ok_text}
                />}

                {this.show_ga_sms_dialog &&
                    <VerifyPopups
                        order={this.order}
                        showPicker={this.showPicker}
                        picked={this.authStateForC2C.ga ? 'bindGA' : 'bindMobile'}
                        onSure={this.verifyOnSure}
                        onCancel={this.verifyOnCancel}
                        onClose={this.verifyOnClose}
                    />

                }

			</View>
		);
	}
}