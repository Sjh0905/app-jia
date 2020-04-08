/**
 * rjq 2018.4.17
 */

import React from 'react';
import {Image, Keyboard, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'

import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import styles from '../style/RegisterStyle'
import baseStyles from '../style/BaseStyle'

import NavHeader from './baseComponent/NavigationHeader'

import mobileIcon from '../assets/SignLogin/mobile-icon.png'
import emailIcon from '../assets/Register/register_mail.png'
import emailVerifyIcon from '../assets/Register/register_mail_varify.png'
import pswIcon from '../assets/Register/register_psw.png'
import pswConfirmIcon from '../assets/Register/register_psw_comfirm.png'
import userIcon from '../assets/Register/register_user.png'

import Loading from './baseComponent/Loading'

import signBaseStyles from '../style/SignBaseStyle'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";

import JiYan from './baseComponent/JiYan'

import CheckBox from './baseComponent/BaseCheckBox'
import CountDown from './baseComponent/BaseCountDown'
import CountDownMobile from './baseComponent/BaseCountDown'

import BaseButton from './baseComponent/BaseButton'
import GetGeetestAndroid from "../../native/GetGeetest";
import ENV from "../configs/environmentConfigs/env";
import Toast from "react-native-root-toast";
// const loginLogin = require('../assets/SignLogin/login-logo.png')


@observer
export default class App extends RNComponent {


	/*----------------------- data -------------------------*/

	@observable
	loading = false


	// 用户名
	@observable
	userName = ''
	// 用户名出错
	@observable
	userNameWA = ''


	// 验证码
	@observable
	verificationCode = ''

	// 验证码出错
	@observable
	verificationCodeWA = ''


	// 密码
	@observable
	psw = ''
	// 密码出错
	@observable
	pswWA = ''

	// 确认密码
	@observable
	pswConfirm = ''
	// 确认密码出错
	@observable
	pswConfirmWA = ''


	// 推荐人
	@observable
	referee = ''
	// 推荐人出错
	@observable
	refereeWA = ''


	// 是否同意用户协议
	@observable
	agreement = false
	// 用户协议出错
	@observable
	agreementWA = ''

	// 发送中
	@observable
	sending = false

	@observable
	selectedTab = 'mobile'

	@observable
	placeholderText = {
		'mobile': '请输入手机验证码',
		'email': '请输入邮箱验证码',
	}

	/*----------------------- 生命周期 -------------------------*/

	// 创建，请求可以写在这里
	constructor() {
		super()
	}

	// 挂载
	componentWillMount() {
		super.componentWillMount()
		JiYan.setOptions('register', this.onJiYanResult)
	}

	// 卸载
	componentWillUnmount() {
		super.componentWillUnmount()
		JiYan.deleteOptions('register')
	}

	/*----------------------- 函数 -------------------------*/

	goBack = () => {
		this.$router.goBack()
	}

	// 去登录
	goToLogin = (() => {
		let last = 0;
		return (data) => {
			if (Date.now() - last < 1000) return;
			last = Date.now();
			this.$router.goto('Login');
		}
	})()


	@action
	getVerificationCode = () => {
		Keyboard.dismiss()

		let verifyUserName = this.selectedTab == "mobile" ? this.testMobile() : this.testUserName();

		if (!verifyUserName) {
			return
		}
		if (this.userName === '') {
			this.userNameWA = '请输入账号'
			return
		}


		this.onJiYanResult();
		/*if(Platform.OS === 'ios'){

			JiYan.startJiYan('register')
			return;
		}

		let API1=this.$globalFunc.getGeetestApi("/user/pullGeetest?client_type='APP'");
		let API2=this.$globalFunc.getGeetestApi('/user/checkGeetest');

		GetGeetestAndroid.tryPromise(ENV.networkConfigs.domain, API2).then((map)=> {
			// alert(map['user_id']);
			// console.log('android_cookie======',map.cookie);
			// ENV.networkConfigs.headers.cookie = map.cookie;

			this.onJiYanResult({result:map['gtStr']});
		})*/

	}


	// 极验返回命令
	@action
	onJiYanResult = result => {
		// console.warn('这是注册页面的极验回调', result)
		// let jiYanResult = JSON.parse(result.result)

		// 发送，目的是register注册
		let params = {
			// geetest_challenge: jiYanResult.geetest_challenge,
			// geetest_seccode: jiYanResult.geetest_seccode,
			// geetest_validate: jiYanResult.geetest_validate,
			client_type: 'APP',
			"type": this.selectedTab,
			"mun": this.userName,
			"purpose": "register",
			'areaCode': this.$store.state.areaCode
		}

		console.warn("this is params", params)

		this.$http.send('POST_VERIFICATION_CODE', {
			bind: this,
			params: params,
			timeout: 3000,
			callBack: this.re_getVerificationCode,
			errorHandler: this.error_getVerificationCode,
			timeoutHandler: this.timeoutHandler
		})

		// Platform.OS === "android" && this.$globalFunc.deleteHeaderCookie();

	}

	// 获取验证码的回复
	@action
	re_getVerificationCode = (data) => {
		typeof (data) === 'string' && (data = JSON.parse(data))
		if (data.errorCode) {
			switch (data.errorCode) {
				case 1:
					this.selectedTab == 'mobile' && (this.verificationCodeWA = '手机已注册或已绑定其他账号')
					this.selectedTab == 'email' && (this.verificationCodeWA = '邮箱已注册或已绑定其他账号')
					break;
				case 2:
					this.selectedTab == 'mobile' && (this.verificationCodeWA = '无效的手机格式')
					this.selectedTab == 'email' && (this.verificationCodeWA = '无效的邮箱格式')
					break;
				case 3:
					this.verificationCodeWA = '发送频繁'
					break;
				case 4:
					this.verificationCodeWA = '暂不可用，请稍后再试'
					break;
				default:
					this.verificationCodeWA = '暂不可用，请稍后再试'

			}
			return
		}
		if (this.selectedTab === 'mobile') {
			this.refs.CountDownMobile.beginCountDown()
		}
		if (this.selectedTab === 'email') {
			this.refs.CountDownEmail.beginCountDown()
		}
		// this.refs.CountDown.beginCountDown()
	}

	// 获取验证码出错
	error_getVerificationCode = (err) => {
		err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
			duration: 1200,
			position: Toast.positions.CENTER
		})
		console.warn('获取验证码出错了！！', err)
	}


	// 点击用户协议
	@action
	clickAgreement = () => {
		this.agreement = !this.agreement
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
				// url: 'https://www.2020.exchange/index/help/userAgreement',
				url: 'index/mobileNotice?columnId=4&isApp=true',
				loading: false,
				navHide: false,
				title: '用户协议',
                rightCloseBtn:true
			})
		}
	})()

	goWebView = (() => {
		let last = 0;
		return (params = {
			url: '',
			loading: false,
			navHide: false,
			title: ''
		}) => {
			if (Date.now() - last < 1000) return;
			last = Date.now();
			if (!params.url) {
				return;
			}
			params.url.length && (params.url.indexOf('http') === -1) && (params.url = ENV.networkConfigs.downloadUrl + params.url.replace(/^\//, ''));
			return this.$router.push('WebPage', params)
		}
	})()


	// 判断输入用户
	@action
	testUserName = () => {
		if (this.userName === '') {
			this.userNameWA = ''
			return false
		}
		if (!this.$globalFunc.testEmail(this.userName)) {
			this.userNameWA = '请输入正确的邮箱'
			return false
		}
		this.userNameWA = ''
		return true
	}

	// 检测手机
	@action
	testMobile = () => {
		if (this.userName === '') {
			this.userNameWA = ''
			return false
		}
		if (!this.$globalFunc.testMobile(this.userName)) {
			this.userNameWA = '请输入正确的手机'
			return false
		}
		this.userNameWA = ''
		return true
	}


	// 判断推荐人
	@action
	testReferee = () => {
		if (this.referee === '') {
			this.refereeWA = ''
			return true
		}
		// if (!this.$globalFunc.testReferee(this.referee)) {
		//     this.refereeWA = '推荐人格式错误'
		//     return false
		// }
		this.refereeWA = ''
		return true
	}


	// 验证码输入
	@action
	testVerificationCode = () => {
		if (this.verificationCode === '') {
			this.verificationCodeWA = ''
			return false
		}
		this.verificationCodeWA = ''
		return true
	}

	// 密码输入
	@action
	testPsw = () => {
		if (this.pswConfirm !== '' || this.pswConfirm === this.psw) {
			this.testPswConfirm()
		}
		if (this.psw === '') {
			this.pswWA = ''
			return false
		}
		if (!this.$globalFunc.testPsw(this.psw)) {
			this.pswWA = '8到16位，必须包含数字和字母'
			return false
		}
		this.pswWA = ''
		return true
	}

	// 确认密码
	@action
	testPswConfirm = () => {
		if (this.psw !== this.pswConfirm) {
			this.pswConfirmWA = '两次输入不一致'
			return false
		}
		this.pswConfirmWA = ''
		return true
	}


	// 提交注册
	@action
	commit = () => {
		if (this.sending) return
		let canSend = true
		// 判断用户名
		canSend = (this.selectedTab == "mobile" ? this.testMobile() : this.testUserName()) && canSend
		canSend = this.testVerificationCode() && canSend
		canSend = this.testPswConfirm() && canSend
		canSend = this.testPsw() && canSend
		canSend = this.testReferee() && canSend

		if (this.userName === '') {
			this.userNameWA = '请输入账号'
			canSend = false
		}

		if (this.psw === '') {
			this.pswWA = '请输入密码'
			canSend = false
		}
		if (this.pswConfirm === '') {
			this.pswConfirmWA = '请确认密码'
			canSend = false
		}
		if (this.verificationCode === '') {
			this.verificationCodeWA = '请输入验证码'
			canSend = false
		} else {
			this.verificationCodeWA = ''
		}

		if (!this.agreement) {
			this.agreementWA = '请阅读并同意《用户协议》'
			canSend = false
		} else {
			this.agreementWA = ''
		}


		if (!canSend) {
			return
		}

		let params = this.selectedTab == "mobile" ? {
			"mobile": this.userName,
			"password": this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
			"code": this.verificationCode,
			'source': 'APP',
			'regsource': this.$store.state.sourceType,
			'inviteduserId': this.referee,
			'channel': '',
			'areaCode': this.$store.state.areaCode
		} : {
			"email": this.userName,
			"password1": this.$globalFunc.CryptoJS.SHA1(this.userName.toLowerCase() + ':' + this.psw).toString(),
			"password2": this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
			"code": this.verificationCode,
			'source': 'APP',
			'regsource': this.$store.state.sourceType,
			'inviteduserId': this.referee,
			'channel': '',
		}

		console.log('注册参数', params);

		let address = this.selectedTab == 'mobile' ? 'REGISTER_BY_MOBILE' : 'REGISTER';

		this.$http.send(address, {
			bind: this,
			params: params,
			callBack: this.re_commit,
			errorHandler: this.error_commit,
			timeoutHandler: this.timeoutHandler
		})
		this.sending = true

	}
	// 超时
	timeoutHandler = () => {
		Toast.show('亲！您的网络可能有点不稳定，先休息下吧，过会再来', {
			duration: 1200,
			position: Toast.positions.CENTER
		})
		// this.$globalFunc.timeoutHandler
		this.sending = false
	}

	// 注册处理
	re_commit = (data) => {
		typeof (data) === 'string' && (data = JSON.parse(data))
		// console.log('注册参数',{
		//     "email": this.userName,
		//     "password1": this.$globalFunc.CryptoJS.SHA1(this.userName.toLowerCase() + ':' + this.psw).toString(),
		//     "password2": this.$globalFunc.CryptoJS.SHA1('btcdo' + ':' + this.psw).toString(),
		//     "code": this.verificationCode,
		//     'source': 'APP',
		//     'inviteduserId': this.referee,
		//     'channel': '',
		// })
		console.log('注册结果', data);
		this.sending = false

		if (data.result === 'FAIL' || data.errorCode) {
			//手机注册，data.result != 'FAIL' && errorCode为3的时候好像是需要跳转二次验证页面
			if (this.selectedTab == 'mobile' && data.errorCode != 3) {
				switch (data.errorCode) {
					case 1:
						this.userNameWA = '用户已注册'
						break;
					case 2:
						this.userNameWA = '无效的手机格式'
						break;
					// case 3:
					//     this.verificationCodeWA = '验证码出错'
					//     break;
					case 4:
						this.refereeWA = '无效的推荐人ID'
						break;
					default:
						this.userNameWA = '暂不可用，请稍后再试'
				}
				return
			}

			if (this.selectedTab == 'mobile' && data.result == 'FAIL' && data.errorCode == 3) {
				this.verificationCodeWA = '验证码出错'
				return
			}

			//邮箱注册
			if (this.selectedTab == 'email') {
				switch (data.errorCode) {
					case 1:
						this.userNameWA = '用户已注册'
						break;
					case 2:
						this.userNameWA = '无效的邮箱格式'
						break;
					case 3:
						this.verificationCodeWA = '验证码出错'
						break;
					case 4:
						this.refereeWA = '无效的推荐人ID'
						break;
					default:
						this.userNameWA = '暂不可用，请稍后再试'
				}
				return
			}

		}
		this.$store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile)
		this.$router.popToTop()
		this.$event.notify({key: 'NEW_LOGIN'})

	}

	// 注册出错
	error_commit = (err) => {
		this.sending = false
		err.message == "Network request failed" && Toast.show('亲！您的网络可能中断了，请检查网络后重试', {
			duration: 1200,
			position: Toast.positions.CENTER
		})
		// this.$globalFunc.toast('暂不可用')
	}

	@action
	onSelectMobile = () => {
		if (this.selectedTab !== 'mobile') {
			this.selectedTab = 'mobile';
			this.initData()
		}
	}
	@action
	onSelectEmail = () => {
		if (this.selectedTab !== 'email') {
			this.selectedTab = 'email';
			this.initData()
		}
	}

	@action
	initData = () => {
		// 用户名
		this.userName = ''
		// 用户名出错
		this.userNameWA = ''
		// 验证码
		this.verificationCode = ''
		// 验证码出错
		this.verificationCodeWA = ''
		// 密码
		this.psw = ''
		// 密码出错
		this.pswWA = ''
		// 确认密码
		this.pswConfirm = ''
		// 确认密码出错
		this.pswConfirmWA = ''
		// 推荐人
		this.referee = ''
		// 推荐人出错
		this.refereeWA = ''
		// 是否同意用户协议
		this.agreement = false
		// 用户协议出错
		this.agreementWA = ''
	}

	/*----------------------- 挂载 -------------------------*/


	goArea = () => this.$router.push('RegisterArea')

	render() {
		return (
			<View style={[styles.container, styles.container2]}>

				<NavHeader
					goBack={this.goBack}
					// headerTitle={this.$i18n.t('REGISTER.title')}
				/>

				{/*无loading时*/}

				<View style={styles.tabBox}>
					<TouchableOpacity activeOpacity={1} onPress={this.onSelectMobile}
					                  style={[styles.loginTab, this.selectedTab === 'mobile' && styles.selectedTab || {}]}>
						<Text allowFontScaling={false}
						      style={[baseStyles.textColor, styles.tabText, this.selectedTab === 'mobile' && styles.selectedTabText || {}]}>手机注册</Text>
						<View
							style={[styles.tabUnderlineStyle, this.selectedTab === 'mobile' && styles.selectedTBLine || {}]}/>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={1} onPress={this.onSelectEmail}
					                  style={[styles.loginTab, this.selectedTab === 'email' && styles.selectedTab || {}]}>
						<Text allowFontScaling={false}
						      style={[baseStyles.textColor, styles.tabText, this.selectedTab === 'email' && styles.selectedTabText || {}]}>邮箱注册</Text>
						<View
							style={[styles.tabUnderlineStyle, this.selectedTab === 'email' && styles.selectedTBLine || {}]}/>
					</TouchableOpacity>
				</View>
				<View
					style={[signBaseStyles.inputContainer, styles.inputContainer, signBaseStyles.inputContainerPaddingTop, {
						flex: 1,
						backgroundColor: StyleConfigs.bgColor
					}]}>


					{/*userName begin*/}
					{this.selectedTab == 'mobile' &&
					<View style={[signBaseStyles.inputItemBox, {alignItems: 'center'}]}>
						{/*input框 email-input框*/}
						{/*<View style={signBaseStyles.iconBox}>*/}
						{/*<Image source={mobileIcon} style={[styles.inputIcon, styles.mobileIcon]} resizeMode={'contain'} />*/}
						{/*/!*<Image source={mobileIcon} style={[signBaseStyles.icon, styles.emailIcon]}></Image>*!/*/}
						{/*</View>*/}
						<TouchableOpacity style={styles.areaWrap} onPress={this.goArea}><Text
							style={styles.areaText}>{this.$store.state.areaCode.replace(/00/, '+')}</Text><View
							style={styles.triangleViewStyle}/></TouchableOpacity>
						<TextInput
							allowFontScaling={false}
							autoCapitalize={'none'}
							style={[signBaseStyles.input]}
							value={this.userName}
							placeholder={'请输入您的手机'}
							placeholderTextColor={StyleConfigs.placeholderTextColor}
							underlineColorAndroid={'transparent'}
							onBlur={this.testMobile}
							onChangeText={(text) => {
								this.userName = text
							}}
							returnKeyType={'done'}
							keyboardType={'numeric'}

						/>
					</View>
					||
					<View style={signBaseStyles.inputItemBox}>
						{/*input框 email-input框*/}
						{/*<View style={signBaseStyles.iconBox}>*/}
						{/*<Image source={emailIcon} style={[signBaseStyles.icon, styles.emailIcon]}></Image>*/}
						{/*</View>*/}
						<TextInput
							allowFontScaling={false}
							autoCapitalize={'none'}
							style={[signBaseStyles.input]}
							value={this.userName}
							placeholder={'请输入您的邮箱'}
							placeholderTextColor={StyleConfigs.placeholderTextColor}
							underlineColorAndroid={'transparent'}
							onBlur={this.testUserName}
							onChangeText={(text) => {
								this.userName = text
							}}
							returnKeyType={'done'}
							keyboardType={'email-address'}

						/>
					</View>
					}


					{/*错误提示*/}
					{!!this.userNameWA &&
					<View style={signBaseStyles.wrongAnsBox}>
						<View style={signBaseStyles.wrongAnsPadding}></View>
						<Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.userNameWA}</Text>
					</View>
					}

					{/*邮箱 end*/}


					{/*获取验证码 begin*/}
					{
						this.selectedTab === "mobile" &&
						<View style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>

							<View style={[signBaseStyles.inputLeftBox]}>
								{/*<View style={[signBaseStyles.inputLeftIconBox]}>*/}
								{/*<Image source={emailVerifyIcon}*/}
								{/*style={[styles.inputBoxIcon, styles.emailVerifyIcon]}></Image>*/}
								{/*</View>*/}
								<TextInput
									allowFontScaling={false}
									style={[signBaseStyles.inputLeftInput]}
									value={this.verificationCode}
									placeholder={this.placeholderText[this.selectedTab]}
									placeholderTextColor={StyleConfigs.placeholderTextColor}
									underlineColorAndroid={'transparent'}
									onBlur={this.testVerificationCode}
									onChangeText={(text) => {
										this.verificationCode = text
									}}
									returnKeyType={'done'}
									keyboardType={'numeric'}

								/>
							</View>

							<CountDownMobile
								onPress={this.getVerificationCode}
								time={60}
								text={'发送验证码'}
								boxStyle={[signBaseStyles.inputRightBox]}
								textStyle={[signBaseStyles.inputRightText, {color: StyleConfigs.txtBlue}]}
								delay={true}
								ref={'CountDownMobile'}
							/>


						</View>
					}
					{this.selectedTab === 'email' &&
					<View style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>

						<View style={[signBaseStyles.inputLeftBox]}>
							{/*<View style={[signBaseStyles.inputLeftIconBox]}>*/}
							{/*<Image source={emailVerifyIcon}*/}
							{/*style={[styles.inputBoxIcon, styles.emailVerifyIcon]}></Image>*/}
							{/*</View>*/}
							<TextInput
								allowFontScaling={false}
								style={[signBaseStyles.inputLeftInput]}
								value={this.verificationCode}
								placeholder={this.placeholderText[this.selectedTab]}
								placeholderTextColor={StyleConfigs.placeholderTextColor}
								underlineColorAndroid={'transparent'}
								onBlur={this.testVerificationCode}
								onChangeText={(text) => {
									this.verificationCode = text
								}}
								returnKeyType={'done'}
								keyboardType={'numeric'}

							/>
						</View>

						<CountDown
							onPress={this.getVerificationCode}
							time={60}
							text={'发送验证码'}
							boxStyle={[signBaseStyles.inputRightBox]}
							textStyle={[signBaseStyles.inputRightText, {color: StyleConfigs.txtBlue}]}
							delay={true}
							ref={'CountDownEmail'}
						/>

					</View>
					}


					{/*获取验证码 end*/}


					{/*获取验的错误提示*/}
					{!!this.verificationCodeWA &&
					<View style={signBaseStyles.wrongAnsBox}>
						<View style={signBaseStyles.wrongAnsPadding}></View>
						<Text allowFontScaling={false}
						      style={[signBaseStyles.wrongAns]}>{this.verificationCodeWA}</Text>
					</View>
					}


					{/*设置密码 begin*/}
					<View style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>
						{/*<View style={signBaseStyles.iconBox}>*/}
						{/*<Image source={pswIcon} style={[signBaseStyles.icon, styles.pswIcon]}></Image>*/}
						{/*</View>*/}
						<TextInput
							allowFontScaling={false}
							style={signBaseStyles.input}
							value={this.psw}
							placeholder={'请设置您的密码'}
							placeholderTextColor={StyleConfigs.placeholderTextColor}
							secureTextEntry={true}
							underlineColorAndroid={'transparent'}
							onBlur={this.testPsw}
							onChangeText={(text) => {
								this.psw = text
							}}
							returnKeyType={'done'}

						/>
					</View>

					{/*密码的错误提示*/}
					{!!this.pswWA &&
					<View style={signBaseStyles.wrongAnsBox}>
						<View style={signBaseStyles.wrongAnsPadding}></View>
						<Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.pswWA}</Text>
					</View>
					}
					{/*设置密码 end*/}


					{/*确认密码 begin*/}
					<View style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>
						{/*<View style={signBaseStyles.iconBox}>*/}
						{/*<Image source={pswConfirmIcon}*/}
						{/*style={[signBaseStyles.icon, styles.emailVerifyIcon]}></Image>*/}
						{/*</View>*/}
						<TextInput
							allowFontScaling={false}
							style={signBaseStyles.input}
							value={this.pswConfirm}
							placeholder={'请再次确认密码'}
							placeholderTextColor={StyleConfigs.placeholderTextColor}
							secureTextEntry={true}
							underlineColorAndroid={'transparent'}
							onBlur={this.testPswConfirm}
							onChangeText={(text) => {
								this.pswConfirm = text
							}}
							returnKeyType={'done'}

						/>
					</View>

					{/*确认密码错误提示*/}
					{!!this.pswConfirmWA &&
					<View style={signBaseStyles.wrongAnsBox}>
						<View style={signBaseStyles.wrongAnsPadding}></View>
						<Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.pswConfirmWA}</Text>
					</View>
					}

					{/*确认密码 end*/}


					{/*推荐人ID begin*/}
					<View style={[signBaseStyles.inputItemBox, signBaseStyles.inputItemBoxPaddingTop]}>
						{/*<View style={signBaseStyles.iconBox}>*/}
						{/*<Image source={userIcon} style={[signBaseStyles.icon, styles.userIcon]}></Image>*/}
						{/*</View>*/}
						<TextInput
							allowFontScaling={false}
							style={signBaseStyles.input}
							value={this.referee}
							placeholder={'邀请码 (邀请人UID不可修改，选填)'}
							placeholderTextColor={StyleConfigs.placeholderTextColor}
							underlineColorAndroid={'transparent'}
							onBlur={this.testReferee}
							onChangeText={(text) => {
								this.referee = text
							}}
							returnKeyType={'done'}

						/>
					</View>
					{/*推荐人ID end*/}

					{/*推荐人错误提示*/}
					{!!this.refereeWA &&
					<View style={signBaseStyles.wrongAnsBox}>
						<View style={signBaseStyles.wrongAnsPadding}></View>
						<Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.refereeWA}</Text>
					</View>
					}


					{/*已阅读并同意二零二零用户协议*/}
					<View style={[styles.agreementBox, signBaseStyles.inputItemBoxPaddingTop]}>
						<CheckBox
							style={{width: 14, height: 14}}
							checked={this.agreement}
							keys={1}
							onPress={this.clickAgreement}
						/>
						<TouchableOpacity
							activeOpacity={StyleConfigs.activeOpacity}
							onPress={this.clickAgreement}
						>
							<Text allowFontScaling={false}
							      style={[baseStyles.text6B7DA2, styles.agreeAgreement]}>我已阅读并同意</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={StyleConfigs.activeOpacity}
							onPress={this.goToUserAgreement}
						>
							<Text allowFontScaling={false} style={[baseStyles.textBlue, styles.userAgent]}>《用户协议》</Text>
						</TouchableOpacity>
					</View>

					{/*同意提示错误提示*/}
					{!!this.agreementWA &&
					<View style={signBaseStyles.wrongAnsBox}>
						<View style={signBaseStyles.wrongAnsPadding}></View>
						<Text allowFontScaling={false} style={[signBaseStyles.wrongAns]}>{this.agreementWA}</Text>
					</View>
					}


					{/*注册 begin*/}
					<BaseButton
						onPress={this.commit}
						text={'注  册'}
						style={[styles.btn, baseStyles.btnBlue]}
						textStyle={[baseStyles.textWhite, styles.btnText]}
					/>
					{/*注册 end*/}

					{/*已有账号 begin*/}
					<TouchableOpacity style={[styles.haveAccountBox]}
					                  activeOpacity={StyleConfigs.activeOpacity}
					                  onPress={this.goToLogin}>
						<Text allowFontScaling={false} style={[styles.haveAccountText]}>已注册，快去</Text>
						<TouchableOpacity
							activeOpacity={StyleConfigs.activeOpacity}
							onPress={this.goToLogin}
						>
							<Text allowFontScaling={false}
							      style={[baseStyles.textBlue, styles.haveAccountToLoginText]}>登录</Text>
						</TouchableOpacity>
					</TouchableOpacity>
					{/*已有账号 end*/}


				</View>
				{/*如果有loading*/}
				{
					!!(this.loading || this.sending) && <Loading leaveNav={true}/>
				}


			</View>
		)
	}
}
