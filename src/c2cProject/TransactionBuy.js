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
    WebView,
    FlatList,
    Keyboard,
    SectionList,
    Platform
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import BaseStyles from '../style/BaseStyle'
import NavHeader from '../components/baseComponent/NavigationHeader'
import BaseTabView from '../components/baseComponent/BaseTabView'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import Toast from 'react-native-root-toast'
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'
import device from "../configs/device/device";
import Loading from '../components/baseComponent/Loading'
import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import BaseDefaultBar from '../components/baseComponent/BaseDefaultBar'
import {getAuthStateForC2C,getCookieForC2C} from './C2CPublicAPI'
import SignBaseStyle from "../style/SignBaseStyle";
import styles from "../style/TransactionBuyStyle";
import BaseButton from '../components/baseComponent/BaseButton'
import MyConfirm from "../components/baseComponent/MyConfirm";
import OrderConfirmPopups from "./OrderConfirmPopups";
import Env from '../configs/environmentConfigs/env.js'


@observer
export default class TransactionBuy extends RNComponent {

    componentWillMount(){
    }

    @computed get authStateForC2C(){
        return this.$store.state.authStateForC2C;
    }


    // loading
    @observable loading=false

    // 当前页币种
    @observable currency='USDT'
    // 分页
    @observable maxPage=1
    @observable selectIndex=1

    // 获取本页页面数据
    @observable offset=0
    @observable maxResults=50

    // 页面数据显示
    @observable pendingList=[]

    // 当前购买数据
    @observable buyItem={}

    //购买数量
    @observable inputPrice = 0.00
    //购买金额
    @observable inputLimtMoney = ''
    //购买数量
    @observable inputNum = ''
    //购买金额
    @observable inputCNY = ''

    // ----------- 弹框信息 start ----------
    // 是否弹框
    @observable popWindowOpen: false
    // 弹框标题
    @observable popWindowTitle: '提示'
    // 弹框内容
    @observable popWindowContent: ['文字1' ,'文字2']
    // 弹框按钮文字
    @observable popWindowBtnText: 'btn'
    // 弹框内容是否居中
    @observable popWindowContentCenter: false
    // 弹框内容整体居中
    @observable popWindowContentAllCenter: false
    // ----------- 弹框信息 end ----------

    // 如果用户被禁止交易的错误提示
    @observable userCanNotTradeInfo = ''

    //确认购买弹窗数据
    @observable buyCommitToastData = {}
    //确认购买弹窗
    @observable buyCommitToastOpen = false

    @observable popText= '系统繁忙，请稍后再试'

    componentDidMount(){
        super.componentDidMount();

        this.init()
        this.getPageList()

        this.listen({key:'RE_TRANSACTION',func:(type)=>{
            if(type == 'BUY' && !this.loading){
                console.log("this is to refresh TransactionBuy",type);
                this.pendingList = [];
                this.init()
                this.getPageList()
            }
        }})
        //获取用户认证状态
        // this.doGetAuthStateForC2C();
        // this.getPageList();
    }
    //async必须和()连在一起哦
    init = async()=>{
        this.loading = true
        if(!this.$store.state.cookieForC2C){
            await getCookieForC2C(this.$http,this.$store,Env);
            await getAuthStateForC2C(this.$http,this.$store);
        }
        //获取用户的购买权限
        this.getUserCanTrade();

    }
    // 获取用户的购买权限
    getUserCanTrade = ()=>{
        this.$http.send('VALIDATE_USER_CAN_TRADE', {
            bind: this,
            callBack: this.re_getUserCanTrade,
            errorHandler: this.error_getUserCanTrade,
        })
    }
    re_getUserCanTrade = (data)=>{
        this.loading = false
        typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('this is getUserCanTrade',data);
        if (data.errorCode) {
            switch (data.errorCode) {
                case 0:
                    this.userCanNotTradeInfo = ''
                    break;
                case 1:
                    this.userCanNotTradeInfo = '未登录'
                    break;
                case 8:
                    this.userCanNotTradeInfo = '有一个订单未完成，暂停继续下单，完成后恢复'
                    break;
                case 9:
                    this.userCanNotTradeInfo = '24H内超过3笔取消订单'
                    break;
            }
            return
        }
    }
    error_getUserCanTrade = (err)=>{
        this.loading = false
        console.warn('获取购买权限请求出错',err);
        Toast.show('获取购买权限请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }

    getPageList = ()=>{
        let that = this;
        this.$http.send('GET_LIST_OF_LISTS', {
            query: {
                offset: that.offset,
                maxResults: that.maxResults,
                status: 'SELL_ORDER',
                currency: that.currency,
            },
            bind: this,
            callBack: this.re_getPageList,
            errorHandler: this.error_getPageList,
        })
    }

    re_getPageList = (data)=>{
        typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('this is c2c sell order',data);

        this.pendingList = data.dataMap.orders;

        if(this.pendingList.length > 0){
            let rowData = this.pendingList[0] || {}

            this.selectItem(rowData);//默认选中第一个订单
            this.inputPrice = rowData.price || this.inputPrice;
            this.inputLimtMoney = this.$globalFunc.accFixed(this.$globalFunc.accMul(rowData.minLimit || 0,rowData.price || 0),2) +'-'+ this.$globalFunc.accFixed(this.$globalFunc.accMul(rowData.amount || 0,rowData.price || 0),2)
        }
    }

    error_getPageList = (err)=>{
        console.warn('查询订单请求出错',err);
        Toast.show('查询订单请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }
    @action
    selectItem = (rowData)=>{
        this.buyItem = rowData;
        [this.inputPrice,this.inputLimtMoney] = [rowData.price,rowData.limtMoney]

        if(this.inputNum>0)this.bindInputNum(this.inputNum);
    }

    clickToBuy = ()=>{
        // 没有身份认证 并 没有绑定手机或没有绑定邮箱 并 没有绑定银行卡
        if((!this.authStateForC2C.identity) && (!(this.authStateForC2C.sms && this.authStateForC2C.mail)) && (!this.authStateForC2C.method)) {
            this.popWindowTitle = '提示';
            this.popWindowContent = ['参与C2C交易需要满足以下条件：','1、注册欧联，并完成实名认证', '2、绑定您本人手机号', '3、至少绑定一张本人银行卡'];
            this.popWindowBtnText = '去设置';
            this.popWindowOpen = true
            return
        }

        // 没有身份认证
        if(!this.authStateForC2C.identity) {
            this.popWindowTitle = '提示';
            this.popWindowContent = ['C2C交易需要完成实名认证并绑定本人手机号才能进行交易','您尚未完成实名认证，不能进行C2C交易操作，请先完成实名认证。'];
            this.popWindowBtnText = '去认证';
            this.popWindowOpen = true
            return
        }
        // 没有绑定手机
        if(!this.authStateForC2C.sms) {
            this.popWindowTitle = '提示';
            this.popWindowContent = ['C2C交易需要完成实名认证并绑定本人手机号才能进行交易','您尚未绑定您本人手机号，不能进行C2C交易操作，请先绑定本人手机号。'];
            this.popWindowBtnText = '去绑定';
            this.popWindowOpen = true
            return
        }
        // 没有绑定邮箱
        if(!this.authStateForC2C.mail) {
            this.popWindowTitle = '提示';
            this.popWindowContent = ['C2C交易需要完成实名认证并绑定本人邮箱才能进行交易','您尚未绑定您本人邮箱，不能进行C2C交易操作，请先绑定本人邮箱。'];
            this.popWindowBtnText = '去绑定';
            this.popWindowOpen = true
            return
        }
        // 没有绑定银行卡
        if(!this.authStateForC2C.method) {
            this.popWindowTitle = '提示';
            this.popWindowContent = ['C2C交易需要完成实名认证并绑定本人银行卡才能进行交易','您尚未绑定本人银行卡，不能进行C2C交易操作，请先至少绑定一张本人银行卡。'];
            this.popWindowBtnText = '去绑定';
            this.popWindowOpen = true
            return
        }
        //用户没有购买权限
        if(this.userCanNotTradeInfo){
            Toast.show(this.userCanNotTradeInfo, {
                duration: 1000,
                position: Toast.positions.CENTER
            })

            return
        }
        if(this.inputNum*1 <= 0) {
            Toast.show('请输入购买数量', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
            return
        }
        //由于"<"两边都乘以相同价格，故可以约分为乘以1计算交易额
        if(this.inputNum*1 < this.buyItem.minLimit*1) {
            Toast.show('不足最小交易额', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
            return
        }
        if(this.inputNum*1 > this.buyItem.maxLimit*1) {
            Toast.show('购买数量超出最大交易额', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
            return
        }
        if(this.inputNum*1 > this.buyItem.amount*1) {
            Toast.show('下单数量超过可购买数量', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
            return
        }

        this.buyCommitToastData = Object.assign({},this.buyItem);
        this.buyCommitToastData.amount = this.inputNum
        this.buyCommitToastData.orderId = this.buyCommitToastData.id
        this.buyCommitToastOpen = true

    }


    @action
    onSure = () => {
        this.popWindowOpen = false
        this.$router.push('Mine',{goBack:true})
    }

    @action
    onCancel = () => {
        this.popWindowOpen = false
    }

    @action
    clickConfirmBtn = ()=>{
        console.log('this is c2c to buy params',{
            orderId: this.buyItem.id,
            amount: this.inputNum,
        })

        this.$http.send('PLACE_AN_ORDER', {
            params: {
                orderId: this.buyItem.id,
                amount: this.inputNum,
            },
            bind: this,
            callBack: this.re_clickConfirmBtn,
            errorHandler: this.error_clickConfirmBtn,
        })
    }

    re_clickConfirmBtn = (data)=>{
        typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('this is c2c clickConfirmBtn',data);

        let self = this;
        if (data.result === 'FAIL' || data.errorCode) {
            // this.submitBtnAjaxFlag = false;
            switch (data.errorCode) {
                case 1:
                    // window.location.reload();
                    break;
                case 2:
                    self.popText = '24H内超过3笔取消订单将禁止1天C2C交易'
                    break;
                case 3:
                    self.popText = '无此订单'
                    break;
                case 4:
                    self.popText = '不在限额内'
                    break;
                case 5:
                    self.popText = '账户余额不足'
                    break;
                case 6:
                    self.popText = '购买数量超过上限'
                    break;
                case 8:
                    self.popText = '有一个订单未完成，暂停继续下单，完成后恢复'
                    break;
                case 9:
                    self.popText = '24H内超过3笔取消订单将禁止1天C2C交易'
                    break;
                case 10:
                    self.popText = '您不能购买自己的挂单'
                    break;
                case 11:
                    self.popText = '您没有绑定手机'
                    break;
                case 12:
                    self.popText = '您没有实名认证'
                    break;
                case 13:
                    self.popText = '您没有绑定银行卡'
                    break;
                case 110:
                    self.popText = '用户被禁用'
                    break;
                default:
                    self.popText = '其余错误'
            }
            Toast.show(self.popText, {
                duration: 1000,
                position: Toast.positions.CENTER
            })

            return
        }
        //关闭确认购买弹窗
        this.buyCommitToastOpen = false;

        Toast.show('下单成功', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
        setTimeout(()=>{
            this.notify({key: 'SET_C2CHOMEPAGE_INDEX'},2);
        },1000)

    }

    error_clickConfirmBtn = (err)=>{
        console.warn('下单请求出错',err);
        Toast.show('下单请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }


    bindInputNum =  (inputNum) =>{
        if (!inputNum) {
            this.inputCNY = ''
            return
        }
        this.inputCNY = this.$globalFunc.accFixed(this.$globalFunc.accMul(inputNum,this.buyItem.price),2)
    }

    bindInputCNY = (inputCNY)=> {
        if (!inputCNY) {
            this.inputNum = ''
            return
        }
        if(this.buyItem.price == 0) {
            return
        }
        this.inputNum = this.$globalFunc.accFixed(this.$globalFunc.accDiv(inputCNY,this.buyItem.price),0)
    }

    @action
    onConfirmCancel = () => {
        this.buyCommitToastOpen = false
    }


    @action
    goBack = () => {
        this.$router.goBack()
    }

    renderInput = (item)=>{
        //价格、限额、数量、金额
        return <View style={styles.buyInputBox}>
            <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                <Text style={styles.inputField}>价格：</Text>
                <Text style={[styles.inputPrice]}>{this.inputPrice}CNY</Text>
            </View>
            <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                <Text style={styles.inputField}>限额：</Text>
                <Text style={styles.inputLimt}>{this.inputLimtMoney}CNY</Text>
            </View>
            <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                <Text style={styles.inputField}>数量：</Text>
                <TextInput
                    allowFontScaling={false}
                    style={[SignBaseStyle.input]}
                    placeholder={'请输入买入数量'}
                    placeholderTextColor={StyleConfigs.placeholderTextColor}
                    underlineColorAndroid={'transparent'}
                    // onBlur={this.testVerificationCode.bind(this.GACode)}
                    onChangeText={(text) => {
                        this.inputNum = this.$globalFunc.inputTransToNumbers(text)
                        this.bindInputNum(this.inputNum)
                    }}
                    value={this.inputNum}
                    keyboardType={'numeric'}
                />
                <Text style={styles.inputDesc}>USDT</Text>
            </View>
            <View style={[SignBaseStyle.inputItemBox,styles.itemInput]}>
                <Text style={styles.inputField}>金额：</Text>
                <TextInput
                    allowFontScaling={false}
                    style={[SignBaseStyle.input]}
                    placeholder={'请输入金额'}
                    placeholderTextColor={StyleConfigs.placeholderTextColor}
                    underlineColorAndroid={'transparent'}
                    // onBlur={this.testVerificationCode.bind(this.GACode)}
                    onChangeText={(text) => {
                        this.inputCNY = this.$globalFunc.inputTransToNumbers(text)
                        this.bindInputCNY(this.inputCNY);
                    }}
                    value={this.inputCNY}
                    keyboardType={'numeric'}
                />
                <Text style={styles.inputDesc}>CNY</Text>
            </View>
            <View style={[SignBaseStyle.inputItemBox,styles.itemInput,{
                borderBottomWidth:0,height:getHeight(100),alignItems:'center'}]}>
                <Text style={styles.inputField}>支付方式：</Text>
                <Text style={styles.inputBank}>银行转账</Text>
                <Text style={styles.inputTips}>（须本人账户支付）</Text>
            </View>
            <View style={styles.subBtnBox}>
                <BaseButton
                    onPress={this.clickToBuy}
                    style={[SignBaseStyle.button,{backgroundColor:StyleConfigs.btnGreen,width:'94%'}]}
                    textStyle={[SignBaseStyle.buttonText]}
                    activeOpacity={StyleConfigs.activeOpacity}
                    text={'买入USDT'}
                />
            </View>
        </View>
    }

    renderOrderList = (rowData, index)=>{

        if(!rowData)return null

        let limtMoney = this.$globalFunc.accFixed(this.$globalFunc.accMul(rowData.minLimit || 0,rowData.price || 0),2) +'-'+ this.$globalFunc.accFixed(this.$globalFunc.accMul(rowData.amount || 0,rowData.price || 0),2)
        rowData.limtMoney = limtMoney;
        return (
            <TouchableOpacity
                key={index}
                onPress={()=>this.selectItem(rowData)}
                style={styles.itemOrder}
                activeOpacity={StyleConfigs.activeOpacity}
            >
                <View style={styles.rowV1}>
                    <Text  allowFontScaling={false} style={[styles.size14,BaseStyles.textRed]}>卖出</Text>
                </View>

                <View style={styles.rowV2}>
                    <Text  allowFontScaling={false} style={[styles.size14,BaseStyles.textWhite]}>{this.$globalFunc.accFixed(rowData.amount || 0,2)}</Text>
                </View>

                <View style={styles.rowV3}>
                    <Text  allowFontScaling={false} style={[styles.size14,BaseStyles.textWhite]}>
                        {limtMoney}
                    </Text>
                </View>

                <View style={styles.rowV4}>
                    <Text  allowFontScaling={false} style={[styles.size14,BaseStyles.textRed]}>{this.$globalFunc.accFixed(rowData.price || 0,2)}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    @action
    listRenderRow = (rowData) => {

        let item = rowData.item;

        if(rowData.section.key == 'input')
            return this.renderInput(item)
        if(rowData.section.key == 'order')
            return this.renderOrderList(item);
    }

    @action
    rendItemHeader = (item)=> {
        return <View style={styles.orderHeaderBox}>
                    <Text style={styles.orderHeaderTop}>市场挂单（点击列表订单进行购买）</Text>
                    <View style={styles.orderHeader}>
                        <Text  allowFontScaling={false} style={[styles.rowV1, styles.color40,styles.size12]}>类型</Text>
                        <Text  allowFontScaling={false} style={[styles.rowV2, styles.color40,styles.size12]}>数量(USDT)</Text>
                        <Text  allowFontScaling={false} style={[styles.rowV3, styles.color40,styles.size12]}>限额(CNY)</Text>
                        <Text  allowFontScaling={false} style={[styles.rowV4, styles.color40,styles.size12,{textAlign:'right'}]}>价格(CNY)</Text>
                    </View>
                </View>
    }

    render() {

        let  pendingList = this.pendingList
        let sectionsData = this.pendingList.length > 0 ? [
            {data:[{inputPrice:this.inputPrice,inputLimtMoney:this.inputLimtMoney,inputCNY:this.inputCNY,inputNum:this.inputNum}],key:'input'},
            {data:pendingList.slice(),key:'order'}
        ]:[
            {data:[{inputPrice:0,inputLimtMoney:'0-0'}],key:'input'},
            {data:[],key:'order'}
        ]

        return (
            <View style={styles.container}>
                <SectionList
                    style={styles.container}
                    stickySectionHeadersEnabled={true}
                    renderItem={this.listRenderRow}
                    renderSectionHeader={({section}) => {
                        // console.log('section==input',section.key === 'input');
                        if(section.key === 'input')return null;

                        return this.rendItemHeader();
                    }}
                    keyExtractor = {(item, index,item1) => {
                        // console.log('keyExtractor',this.selectedTitleBar+index.toString());
                        return (item.name || '') + index.toString()
                    }}
                    sections={sectionsData}
                />
                {
                    this.loading && <Loading/>
                }
                {
                    this.popWindowOpen && <MyConfirm
                        alertBoxStyle={{justifyContent:'flex-start'}}
                        style={{height:getHeight(360),marginTop:getHeight(280)}}
                        okText={this.popWindowBtnText}
                        cancelText={'取消'}
                        title={'提示'}
                        message={this.popWindowContent}
                        close={null}
                        onSure={this.onSure}
                        // onClose={this.onCancel}
                        onCancel={this.onCancel}
                    />
                }
                {
                    this.buyCommitToastOpen &&
                    <OrderConfirmPopups
                        alertBoxStyle={{justifyContent:'flex-start'}}
                        style={{marginTop:getHeight(150)}}
                        data={{order:this.buyCommitToastData,userinfo:this.buyCommitToastData}}
                        type={'BUY_ORDER'}
                        close={false}
                        title={'买入USDT'}
                        onSure={this.clickConfirmBtn}
                        onCancel={this.onConfirmCancel}
                        // onClose={this.onConfirmCancel}
                        okText={'确认下单'}
                    />
                }
            </View>
        )
    }
}