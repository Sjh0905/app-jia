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
    Platform
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import NavHeader from '../components/baseComponent/NavigationHeader'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";

import BaseStyle from '../style/BaseStyle'
import styles from "../style/PaymenSetStyle";
import device from "../configs/device/device";
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'
import bankcard from '../assets/C2cAssets/bankcard.png'
import add from '../assets/C2cAssets/add.png'
import Loading from '../components/baseComponent/Loading'
import CheckBox from '../components/baseComponent/BaseCheckBox'
import {getAuthStateForC2C} from "./C2CPublicAPI";
import Toast from "react-native-root-toast";
import MyConfirm from "../components/baseComponent/MyConfirm";
import GlobalFunc from "../configs/globalFunctionConfigs/GlobalFunction";
import DragDelete from "./DragDelete";

//用来判断分页距离
const reachedThreshold = Platform.select({
    ios: -0.1,
    android: 0.1
});

@observer
export default class PaymentSet extends RNComponent {

    @computed get authStateForC2C(){
        return this.$store.state.authStateForC2C;
    }
    @computed get unBindGASMS(){
        return (this.authStateForC2C.ga || this.authStateForC2C.sms);
    }


	componentWillMount() {
        this.listen({key: 'REFRESH_BANK_LIST', func: this.initData});
		// this.getOrder()
	}

	@observable bankList = [];
	@observable defaultList = [];
	@observable confirmDeleteBank=false// 确认删除银行卡
    @observable deleteBankIng=false // 正在删除银行卡
    @observable deleteBankName='' // 删除的银行
    @observable deleteBankCard='' // 删除的银行卡号
    @observable deleteBankId='' // 删除的银行卡id
    @observable deleteBankAccount='' // 删除的银行卡账号名



    componentDidMount(){
        super.componentDidMount();

        //获取用户认证状态
        this.doGetAuthStateForC2C();
        this.initData();
    }
    //async必须和()连在一起哦
    doGetAuthStateForC2C = async()=>{
        await getAuthStateForC2C(this.$http,this.$store);
    }


    initData = ()=>{
	    // alert('收到监听');
        this.$http.send('PAYMENT_SET_INIT', {
            bind: this,
            callBack: this.re_initData,
            errorHandler: this.error_initData,
        })
    }
    re_initData = (data)=>{
        typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('this is PaymenSet initData',data);

        if (!data) return
        if (data.errorCode) {
            return
        }
        this.defaultList = data.userPayInfoList || []

        this.bankList = this.defaultList.filter(v => {
            return v.type === 'BANKCARD'
        })

	    console.log('defaultList=====',this.defaultList)
	    console.log('bankList=====',this.bankList)


    }
    error_initData = (err)=>{
        console.warn('获取支付信息请求出错',err);
        Toast.show('获取支付信息请求出错', {
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
	toCopyVal = ()=>{

	}
    // 点击设置默认银行卡
    @action
    confirmChoseDefaultBank = (v) => {

	    if(this.bankList.length <= 1){
	        console.log('目前只有一张银行卡');
	        return;
        }

        this.$http.send('SET_DEFAULT_PAYMENT', {
            query: {
                id: v.id
            },
            bind: this,
            callBack: this.re_confirmChoseDefaultBank,
            errorHandler: this.error_confirmChoseDefaultBank,
        })
    }

    re_confirmChoseDefaultBank = (data)=>{
        typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('this is confirmChoseDefaultBank',data);

        if (!data) {
            Toast.show('您有未完成的订单或挂单，不能重置默认收款银行卡', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
			return
        }
        this.initData()

    }
    error_confirmChoseDefaultBank = (err)=>{
        console.warn('设置默认银行卡请求出错',err);
        Toast.show('设置默认银行卡请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }

    // 点击解绑银行卡
    clickReleaseBank = (item)=> {
        // this.deleteBankIng = false
        this.deleteBankId = item.id
        this.deleteBankCard = item.cardNumber
        this.deleteBankAccount = item.username
        this.deleteBankName = item.bankNameCN
        this.confirmDeleteBank = true
    }

	// 确认解绑银行卡
    confirmReleaseBank = (id)=>{
        // let id = this.deleteBankId
        this.$http.send('DELETE_PAYMENT_INFO', {
            query: {
                id
            },
            bind: this,
            callBack: this.re_confirmReleaseBank,
            errorHandler: this.error_confirmReleaseBank,
        })
	}

    re_confirmReleaseBank = (data)=>{
        typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('this is confirmReleaseBank',data);

        if (!data) {
            Toast.show('删除失败，可能有未完成的订单或挂单', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
            return
        }
        this.initData()
		this.onCancel()

    }
    error_confirmReleaseBank = (err)=>{
        console.warn('设置默认银行卡请求出错',err);
        Toast.show('设置默认银行卡请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
    }

    onCancel = () => {
		this.confirmDeleteBank = false
    }
    goToBindBank = () => {
		this.$router.push('BindBank',{bankList:this.bankList,bankInfo:{},bankType:'add'})
    }
    goToBindBankEdit = (v) => {
		this.$router.push('BindBank',{bankList:this.bankList,bankInfo:v,bankType:'edit'})
    }


    @observable selected = 0

	clickRadio = item =>{
		this.confirmChoseDefaultBank(item)
	}

	goAddBankCard = ()=>{

	    let modalMsg = '';

        let identityAuthState = this.$store.state.getIdentityInfo.identityAuthState;
        // 后台:0未审核 1被驳回 2已通过 3人工失效 4系统失效

        if(modalMsg == '' && identityAuthState != 2){
            modalMsg = '请先进行实名认证或等待实名认证通过'
        }

        // 如果没有绑定谷歌或手机，不允许打开提现
        if (modalMsg == '' && !this.unBindGASMS) {
            // this.$globalFunc.toast('请进行手机认证或谷歌认证')
            modalMsg = '请先进行手机认证或谷歌认证'
        }

        modalMsg != '' && Toast.show(modalMsg, {
            duration: 1000,
            position: Toast.positions.CENTER
        })

        if(modalMsg == '')this.$router.push('AddBankCard',{bankList:this.bankList})
	}

	listItem = ({item, index}) => {
		return (
			<DragDelete style={styles.itemWrap} item={item} deleteFunc={this.confirmReleaseBank}>

				<View style={styles.itemLine1}>
					<View style={styles.bankbank}>
						<Image style={styles.bank}
						       source={require('../assets/C2cAssets/bank.png')}/>
						<Text style={styles.bankTxt}>{item.bankNameCN}</Text>
					</View>

					<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} style={styles.radioWrap} onPress={()=>this.clickRadio(item)}>

						<View style={styles.radioBorder}>
							{item.isDefault  &&<View style={styles.radioSelect}></View>|| null}
						</View>
						{item.isDefault?<Text style={styles.text14Red}> 默 认 卡</Text>:<Text style={styles.text14Gray}>设置默认</Text> }
					</TouchableOpacity>
				</View>
				<View style={styles.itemLine2}>
					<Text style={styles.lineName}>{item.username}</Text>
				</View>
				<View style={styles.itemLine3}>
					<Text style={styles.lineCard}>{item.cardNumber}</Text>
				</View>

			</DragDelete>


		)

	}


	render() {


		return (

			<View style={styles.container}>
                <NavHeader headerTitle={''} goBack={this.goBack}/>
				<View style={styles.containerMake}>
					<Text style={styles.title}>收款方式</Text>
				</View>





				{
					this.bankList.length?
						<FlatList contentContainerStyle={styles.listContainer} data={this.bankList} renderItem={this.listItem} extraData={item => item.status}/> :
						<View style={styles.containerAdd}>
							<View style={styles.ImageMake}>
								<Image style={styles.addA}    source={require('../assets/C2cAssets/makeVoid.png')}/>

								<Text style={styles.realText}>请务必使用您本人的实名账户</Text>

								<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} style={styles.addBor} onPress={this.goAddBankCard}>
									<Image style={styles.addBtn}    source={require('../assets/C2cAssets/addBtn.png')}/>
									<Text style={styles.addText}>添加</Text>
								</TouchableOpacity>
							</View>


						</View>
				}




				<View style={styles.btnbotbg}>
					<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} style={styles.buttonsave} onPress={this.goAddBankCard}>
						<Text style={styles.button}>添加</Text>
					</TouchableOpacity>
				</View>




				{/*<ScrollView style={styles.container2}>

					<View style={styles.bankListTitle}>
						<Image source={bankcard} style={styles.bankImg} resizeMode={'contain'}/>
						<Text style={styles.bankTitleText}>银行转账</Text>
					</View>

					{this.bankList.map((v,i)=>
						<View key={i} style={styles.bankListItem}>
							<View style={styles.bankInfoBox}>
								<Text style={styles.bankInfoText}>{v.bankNameCN}</Text>
								<Text style={[styles.bankInfoText,{marginBottom:getHeight(20)}]}>{v.bankNameEN}</Text>
								<Text style={styles.bankInfoText}>{v.cardNumber}</Text>
							</View>
							<View style={styles.bankInfoOper}>
								<TouchableOpacity
									activeOpacity={StyleConfigs.activeOpacity}
									onPress={()=>{this.confirmChoseDefaultBank(v)}}
									style={[styles.inputTitleBoxRow,{marginLeft: getWidth(24)}]}>
									<CheckBox
										checked={v.isDefault == 1}
										keys={1}
										onPress={()=>{this.confirmChoseDefaultBank(v)}}
									/>
									<Text allowFontScaling={false} style={[styles.inputTitle,{marginLeft:getWidth(8)}]}>默认银行卡</Text>
								</TouchableOpacity>
								<View style={styles.operBox}>
									<TouchableOpacity
										onPress={()=>{
										    this.goToBindBankEdit(v)
										}}
										activeOpacity={StyleConfigs.activeOpacity}
										style={[styles.copyBtn]}>
										<Text  allowFontScaling={false} style={[BaseStyle.textBlue,styles.size12]}>修改</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={()=>{
											this.clickReleaseBank(v)
										}}
										activeOpacity={StyleConfigs.activeOpacity}
										style={[styles.copyBtn]}>
										<Text  allowFontScaling={false} style={[BaseStyle.textBlue,styles.size12]}>解绑</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
                    )}

				</ScrollView>
                {this.bankList.length == 0 &&
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                        您还没有添加任何银行卡
                    </Text>
                </View>
                }

                <View style={{
                    width: getWidth(DefaultWidth),
                    position: 'absolute',
                    paddingBottom: getHeight(getDeviceTop(true) + 10),
                    paddingTop:getHeight(10),
                    bottom: 10,
					right:0,
                    flexDirection: 'row',
                    justifyContent: 'center',
					alignItems:'center',
                    backgroundColor:'transparent',
                    paddingHorizontal:getWidth(20),
                }}>
                    <TouchableOpacity style={[styles.bbtn, styles.cancleBtn]} onPress={()=>{}}>
                        <Text allowFontScaling={false} style={{color: StyleConfigs.txtBlue, fontSize: StyleConfigs.fontSize15}}>取消订单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
						activeOpacity={StyleConfigs.activeOpacity}
						style={[styles.bbtn, styles.confirmBtn]}
						onPress={this.goToBindBank}
					>
                        <Image source={add} style={styles.addImg} resizeMode={'contain'}/>
						<Text allowFontScaling={false} style={{color: StyleConfigs.txtWhite, fontSize: StyleConfigs.fontSize15}}>添加银行卡</Text>
                    </TouchableOpacity>
                </View>

                {
                    this.confirmDeleteBank && <MyConfirm
                        alertMessageStyle={{alignItems:'flex-start',paddingLeft:getWidth(100)}}
                        style={{height:getHeight(330)}}
                        okText={'确定解绑'}
                        cancelText={'取消'}
                        title={'是否解绑'}
                        message={['银行：'+this.deleteBankName,'卡号：'+this.deleteBankCard,'账户：'+this.deleteBankAccount]}
                        close={null}
                        onSure={this.confirmReleaseBank}
						onClose={this.onCancel}
                        onCancel={this.onCancel}
                    />
                }*/}
			</View>
		);
	}
}



