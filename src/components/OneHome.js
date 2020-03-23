import React from 'react';
import {
    Button,
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    ListView,
    TouchableOpacity,
    FlatList,
    SectionList,
    WebView
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable,computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import NavHeader from './baseComponent/NavigationHeader'
import TabBar from './baseComponent/BaseTabView'
import Slider from './baseComponent/SliderNew'
import ScrollUpText from './baseComponent/ScrollUpText';
import BaseStyles from '../style/BaseStyle'
import env from '../configs/environmentConfigs/env';
// import Carousel from './react-native-looped-carousel/index';
import Carousel from 'react-native-snap-carousel';
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import Advertisement from './Advertisement';
import MyRecommend from "./MineMyRecommend";
import device from "../configs/device/device";
import MarketItem from "./MarketItem"
import LiteFace from "./LiteFace";
import legalCurrencyTransaction from '../assets/OneHome/legal_currency_transaction.png'
import HomeAdMarketItem from "./HomeAdMarketItem";
import CustomerService from '../assets/OneHome/customer_service.png'
import styles from '../style/OneHomeStyle'
import moreIcon from '../assets/OneHome/more.png'
import Modal from 'react-native-modal'
import Toast from "react-native-root-toast";

@observer
export default class OneHome extends RNComponent {

	constructor(){
		super();
        this.state = {
            refreshing:false
        }

        this.listen({key: 'RE_INIT_ONEHOME', func: ()=>{
        	console.log('onehome 收到刷新通知');
        	this.initWillMount();
        }})
	}


	@computed get marketList() {
		return this.$store.state.marketList
	}
	@computed get exchange_rate() {
		return this.$store.state.exchange_rate.ethExchangeRate
	}


	@observable	otherTestNum = 0
	@observable	imgData = [
        // {img:require('../assets/OneHome/banner.png'),url:'',title:''},
	]
    @observable	textData = [
        // {title:'正式开放注册启事( 10-12 )',url:'https://customerservice8872.zendesk.com/hc/zh-cn/articles/360034740012-正式开放注册启事'},
        // {title:'欧联交易所验证邮件延迟( 10-12 )',url:'https://customerservice8872.zendesk.com/hc/zh-cn/articles/360035114331-欧联交易所验证邮件延迟公告'},
        // {title:'关于欧联交易所( 10-12 )',url:'https://customerservice8872.zendesk.com/hc/zh-cn/articles/360035121071-关于欧联交易所'},
        // {title:'欧联交易所实名认证延迟( 10-12 )',url:'https://customerservice8872.zendesk.com/hc/zh-cn/articles/360034740072-欧联交易所实名认证延迟公告'},
    ]
	// @observable	moreNoticeUrl = 'index/mobileNotice/?isApp=true'
	@observable	moreNoticeUrl = 'https://customerservice8872.zendesk.com/hc/zh-cn/categories/360002253311-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83'
	// @observable	moreNoticeUrl = 'https://www.2020.exchange/index/notice/noticeDetail?id=100620'
		// 'https://customerTouchservice8872.zendesk.com/hc/zh-cn/categories/360002253311-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83'
	@observable	customerServiceUrl = 'https://customerservice8872.zendesk.com/hc/zh-cn/categories/360002244832-%E5%B8%AE%E5%8A%A9%E4%B8%AD%E5%BF%83'
	@observable	market_list = []
    //法币交易弹窗
	@observable	legalModalShow = false
	@observable _currencylist = []
	@observable activiteisData = [
        // PlatformOS === 'android' && {
        //     text: '币得宝',
        //
        //     action: '/coinbaby/H5BDBIndexList'
        // } || null,
        // {
        //     text: '法币交易',
        //     img: require('../assets/OneHome/legal_currency_transaction.png'),
        //     action: () => {
        //         this.legalModalShow = true;
        //         // let last = 0;
        //         // return () => {
        //         //     if (Date.now() - last < 1000) return;
        //         //     last = Date.now();
        //         //     this.$store.state.authMessage.userId && this.$router.push('C2CHomePage');
        //         //     this.$store.state.authMessage.userId || this.$router.push('Login');
        //         // }
        //     },
        //     badgeImg:null
        // },
        {
            text: '邀请好友',
            img: require('../assets/OneHome/invite-rebate-icon.png'),
            action: 'https://customerservice8872.zendesk.com/hc/zh-cn/articles/360035041312-%E9%82%80%E8%AF%B7%E5%A5%BD%E5%8F%8B%E6%B3%A8%E5%86%8C'
            // action: (() => {
            //     let last = 0;
            //     return () => {
            //         if (Date.now() - last < 1000) return;
            //         last = Date.now();
            //         this.$router.push('WorkOrder')
            //         // this.$store.state.authMessage.userId && !this.$router.push('MyRecommend') ;
            //         // this.$store.state.authMessage.userId || this.$router.push('Login');
            //     }
            // })()
        },
        // {
        //     text: 'GRC',
        //     img: require('../assets/OneHome/invite-rebate-icon.png'),
        //     action: (() => {
        //         let last = 0;
        //         return () => {
        //             if (Date.now() - last < 1000) return;
        //             last = Date.now();
        //             // this.$store.state.authMessage.userId || this.$router.push('Login');
			// 		this.goGRC();
        //         }
        //     })()
        // },
		{
            text: '帮助中心',
            img: require('../assets/OneHome/help-center.png'),
            action: this.customerServiceUrl
            // action: (() => {
            //     let last = 0;
            //     return () => {
            //         if (Date.now() - last < 1000) return;
            //         last = Date.now();
            //         this.$router.push('WorkOrder')
            //         // this.$store.state.authMessage.userId && !this.$router.push('MyRecommend') ;
            //         // this.$store.state.authMessage.userId || this.$router.push('Login');
            //     }
            // })()
        },
		// {
		// 	text: '充值',
		// 	img: require('../assets/OneHome/recharge.png'),
		// 	action: ()=>{
		// 		// this.notify({key: 'CHANGE_TAB'}, 3);
         //        if(!this.$store.state.authMessage.userId) {
         //        	this.$router.push('Login');
         //        	return
         //        }
         //        this.$router.push('AssetPageSearch')
		// 	}
		// },
		// {
		// 	text: '提现',
		// 	img: require('../assets/OneHome/withdrawals.png'),
         //    action: ()=>{
         //        // this.notify({key: 'CHANGE_TAB'}, 3);
         //        if(!this.$store.state.authMessage.userId) {
         //            this.$router.push('Login');
         //            return
         //        }
         //        this.$router.push('AssetPageSearch')
         //    }
		// 	// action: 'https://jinshuju.net/f/jhg65X'
		// },

	]

    refreshFlag = true;
    @observable  selectedTitleBar = 'mainBoard'
    @observable data

	componentWillMount() {
		this.initWillMount();

	}

	initWillMount = () =>{
        this.getBanner()
        this.getNotice()
	}


	getBanner() {this.$http.send('GET_HOME_BANNERM', {bind: this,callBack: this.re_getBanner})}
	re_getBanner(res){
		console.log('imgresponse=======',res)
		this.imgData = res;//TODO:调试接口要放开哦
		// this.imgData = res.map(val=>'https://www.2020.exchange' + val.imageUrl.replace(/\\/g, '/'));
		// this.imgData = ['https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png','https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png','https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png']
		this.imgDataReady = true
	}

	getBannerDetail = (res,title)=>{
		// return
		console.log(res)

        if(res.url.indexOf('events/grc-token-mining') > -1){
            this.goGRC(res);
            return;
        }

		this.goWebView({
			url: res.url && res.url || '',
			// url: res.id && ('index/mobileNoticeDetail?isApp=true&id=' + res.id) || '',
			loading: false,
			navHide: false,
			title: '公告详情'
		})
	}

	// 渲染通告列表
	getNotice() {this.$http.send('MOBILE_POST_NOTICE_LIST', {bind: this, params: {offset: 0,maxResults: 10,languageId: 1},	callBack: this.re_getNotice})}


	re_getNotice(res)
	{
		console.log('noticelist===============',res)
        res.length > 0 && (this.textData = res)
	}

	//获取公告详情
    // getNoticeDetail = (id) => this.$http.send('MOBILE_POST_NOTICE_DETAIL', {bind: this, params: {noticeId: id},	callBack: this.re_getNoticeDetail})

	//跳到GRC页面
    goGRC = (res) =>{
    	let userId = this.$store.state.authMessage.userId;

        if(!userId){
            this.$router.push('Login');
            return;
        }

        let _bitsession_ = this.$store.state.cookie._bitsession_;
        let isApp = true;
        let lang = 'CH';
        let GRC_URL = res.url+'?'+'isApp='+isApp+'&_bitsession_='+_bitsession_+'&userId='+userId+'&lang='+lang;
        // let GRC_URL = "https://build.eunex.group/events/grc-token-mining?isApp=false&_bitsession_=AAAADBW3010000016eeac11962WEB7c7c5ae06dc794bd823d890734a0f69714f3ea63c81bfbd63565398800422a56&userId=100001&lang=CH"

        this.goWebView({
            url: GRC_URL,
            loading: false,
            navHide: false,
            title: '易物点通证量化'
        })
    }

	//不再获取公告详情 直接获取地址
    getNoticeDetail = (res,title)=>{
    	// return
        this.goWebView({
            url: res.url && res.url || '',
            // url: res.id && ('index/mobileNoticeDetail?isApp=true&id=' + res.id) || '',
            loading: false,
            navHide: false,
            title: '公告详情'
        })
	}
    goToMoreNotice = () =>{
        this.goWebView({
            url: this.moreNoticeUrl || '',
            loading: false,
            navHide: false,
            title: '公告中心'
        })
	}

    re_getNoticeDetail = (res)=>{
		console.log('获取页面详情接口',res)
        this.goWebView({
			url: 'index/mobileNoticeDetail?isApp=true&id=' + res.id,
            loading: false,
            navHide: false,
            title: res.title
		})
		//'/index/mobileNoticeDetail?id=' +items.id
	}

	goWebView = (()=>{
		let last = 0;
		return (params={
			url: '',
			loading: false,
			navHide: false,
			title: ''
		},type) => {
			if (Date.now() - last < 1000) return;
			last = Date.now();
			if(!params.url){
				return;
			}
			params.url.length && (params.url.indexOf('http') === -1) && (params.url = env.networkConfigs.downloadUrl + params.url.replace(/^\//,''));
			console.log('this is webpage type',type);
			// if(!type)
				return this.$router.push('WebPage',params)

            // return this.$router.push('CustomerServiceWebPage',params)
        }
	})()


	goOtcPage = ()=>{
		if(this.$store.state.authMessage.userId){
			this.$router.push('OtcIndex');
			return
		}
		if(!this.$store.state.authMessage.userId){
			this.$router.push('Login');
			return
		}
	}


    @action
	gotoTrade = (()=>{
		let last = 0;
		return (symbol) => {
			if (Date.now() - last < 1000) return;
			last = Date.now();
			this.$store.commit('SET_SYMBOL',symbol+'_ETH')
			// console.log('this.$store.state.symbol',this.$store.state.marketPriceMerge)
			this.notify({key: 'CHANGE_SYMBOL'} )
			this.$router.push('TraddingHall')
		}

	})()

    @action
    goToCustomerService = ()=>{
        this.goWebView({
            url: this.customerServiceUrl || '',
            loading: false,
            navHide: false,
            title: '客服中心'
        },'customerService')
    }


    @action
    onSelectMainBoard = () => {
        if(this.selectedTitleBar === 'mainBoard')
            return;

        this.selectedTitleBar = 'mainBoard'

    }

    @action
    onSelectWeiMi = () => {
        if(this.selectedTitleBar === 'weiMi')
            return;

        this.selectedTitleBar = 'weiMi'
    }

	@action
	listRenderRow = ({item}) => {
		if(item.name == 'imgNotice')
			return this.renderBannerNotice();

		return (

			item.selectedTitleBar === 'mainBoard' &&

			<MarketItem page={'OneHome'} goRouter={'TraddingHall'} index={5} />

			|| <MarketItem page={'OneHome'} goRouter={'TraddingHall'} index={4} />
		)
	}

	@action
	rendItemHeader = (item)=> {
		return (

		<View>

			{/*<Advertisement style={styles.advertisement}/>*/}
            {/*<View style={styles.titleBarBox}>*/}
                {/*<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectMainBoard} style={[styles.titleBar,styles.titleMainBoardBar,item.selectedTitleBar === 'mainBoard' && styles.selectedTitleBar || {}]}>*/}
					{/*<Text allowFontScaling={false} style={[styles.titleBarText,item.selectedTitleBar === 'mainBoard' && styles.selectedTBText || {}]}>主板区</Text>*/}
					{/*<View style={[styles.titleBarUnderLine,styles.titleBarMBLine,item.selectedTitleBar === 'mainBoard' && styles.selectedTBLine || {}]}/>*/}
                {/*</TouchableOpacity>*/}
				{/*<View style={styles.titleBarVLine}/>*/}
                {/*<TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onSelectWeiMi} style={[styles.titleBar,styles.titleWeiMiBar,item.selectedTitleBar === 'weiMi' && styles.selectedTitleBar || {}]}>*/}
					{/*<Text allowFontScaling={false} style={[styles.titleBarText,item.selectedTitleBar === 'weiMi' && styles.selectedTBText || {}]}>超级为蜜区</Text>*/}
					{/*<View style={[styles.titleBarUnderLine,styles.titleBarWMLine,item.selectedTitleBar === 'weiMi' && styles.selectedTBLine || {}]}/>*/}
				{/*</TouchableOpacity>*/}
            {/*</View>*/}
            {/*<View style={{width:'100%',height:10,backgroundColor:StyleConfigs.sectTitleColor*/}
            {/*}}/>*/}
			<View style={[styles.listTitleWrap,{borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor:StyleConfigs.listSplitTitlelineColor}]}>
				<Text allowFontScaling={false} style={[styles.listTitleBase,styles.listTitle1]}>名称</Text>
				<Text allowFontScaling={false} style={[styles.listTitleBase,styles.listTitle2]}>最新价</Text>
				<Text allowFontScaling={false} style={[styles.listTitleBase,styles.listTitle3]}>24h涨跌</Text>
			</View>
		</View>
		)
	}

    @action
    renderCarouselItem = ({item, index})=> {
        // if(!item)return;
        // console.log('this is item ',item,index);
        return (
            <TouchableOpacity
                activeOpacity={0.97}
                style={[styles.itemCarouselBox,PlatformOS == 'ios' && {marginLeft:-6} || {marginHorizontal:0}]}
                onPress={()=>{
                	this.getBannerDetail(item,'banner详情')
                    // this.notify({key:'CHANGE_TAB'},1,true)
                    // this.divePointCurrName = this.diveP ointsArray[index].name;

                }}
            >
                <Image source={{uri:item.imageUrl}} style={styles.itemCarouselImg} resizeMode={PlatformOS == 'ios' ? 'cover' : 'stretch'}/>
            </TouchableOpacity>
        );
    }

    @action
    refreshData = () =>{

		this.notify({'key':'RE_INIT_PAGE'});


		if(this.refreshFlag){
			this.initWillMount();

            this.refreshFlag = false;

            setTimeout(()=>{this.refreshFlag = true},5000)
		}

	}
    @action
	renderBannerNotice(){

    	let itemWidth = PlatformOS == 'ios' ? getWidth(DefaultWidth) *(345/375)-12 : getWidth(DefaultWidth)*(345/360)-30
        return (
				<View>
					<View style={styles.banner}>
						{/*banner滚动*/}
						{/*<View style={styles.carousel}>*/}
							{/*{!!this.imgData.length &&*/}
							{/*<Carousel*/}
								{/*delay={4500}*/}
								{/*style={styles.itemCarousel}*/}
								{/*autoplay*/}
								{/*bullets*/}
							{/*>*/}
								{/*{*/}
									{/*this.imgData.map((v,i)=>{*/}
										{/*return <TouchableOpacity*/}
											{/*activeOpacity={0.9}*/}
											{/*key={i}*/}
											{/*style={styles.itemCarouselTouch}*/}
											{/*onPress={() => {*/}
												{/*this.goWebView({*/}
													{/*url: v.url,*/}
													{/*loading: false,*/}
													{/*navHide: false,*/}
													{/*title:'公告详情' //v.title*/}
												{/*})*/}
											{/*}}*/}
										{/*>*/}
											{/*<Image source={*/}
											    {/*{uri: v.imageUrl}*/}
											{/*}*/}
											{/*style = {{width:'100%', height: '100%'}}*/}
											{/*resizeMode={'stretch'}*/}
											{/*/>*/}
										{/*</TouchableOpacity>*/}
									{/*})}*/}
							{/*</Carousel>*/}
							{/*}*/}
						{/*</View>*/}

						<View style={styles.carouselBox}>
							<Carousel
								layout={'default'}
								// slideStyle={}
								// style={{backgroundColor:'red'}}
								ref={(c) => { this._carousel = c; }}
								firstItem={this.imgData.length}//解决在loopClonesPerSide > 0的情况下安卓第一次滑动的BUG
								data={this.imgData.slice()}
								renderItem={this.renderCarouselItem}
								sliderWidth={getWidth(DefaultWidth)}
								// sliderHeight={250}
								itemWidth={itemWidth}
								activeSlideAlignment={'center'}
								onSnapToItem={(inx)=>{
									console.log('this is ',inx%this.imgData.length);
								}}
								loopClonesPerSide={5}
								loop={true}
							/>
						</View>
						{/*公告列表*/}
						<View style={styles.notice}>
							<View style={styles.noticeImgBox}>
								<Image
									style={styles.noticeImg}
									source={require('../assets/OneHome/notice.png')}
								/>
							</View>

							<ScrollUpText
								style={styles.noticeTextBox}
								textStyle={styles.noticeTxt}
								lineHeight={getHeight(60+20)}
								onPress={this.getNoticeDetail}
								DataList={this.textData}
								duration={4000}
							>
							</ScrollUpText>
							<TouchableOpacity
                                activeOpacity={StyleConfigs.activeOpacity}
								onPress={this.goToMoreNotice}
								style={styles.moreBox}>
								<Text style={styles.moreText}>更多</Text>
								<Image
									style={styles.moreImg}
									source={moreIcon}
								/>
							</TouchableOpacity>
						</View>

					</View>

                    {/*首页四个导航*/}
                    {/*<View>*/}
                        {/*<View style={styles.activiteisBox2}>{*/}
                            {/*this.activiteisData.map((v,i)=>*/}
                                {/*{return v && <View key={i}>*/}
                                    {/*<TouchableOpacity*/}
                                        {/*activeOpacity={0.85}*/}
                                        {/*// key={i}*/}
										{/*style={styles.activitiesButton}*/}
                                        {/*onPress={typeof v.action === 'function'&&*/}
                                        {/*v.action*/}
                                        {/*||*/}
                                        {/*this.goWebView.bind(this,{*/}
                                            {/*url: v.action,*/}
                                            {/*loading: false,*/}
                                            {/*navHide: false,*/}
                                            {/*title: v.text*/}
                                        {/*})*/}
                                        {/*}*/}
                                    {/*>*/}

                                        {/*<Image*/}
                                            {/*source={v.img}*/}
                                            {/*style={styles.activityImage2}*/}
                                        {/*/>*/}
                                        {/*<Text*/}
                                            {/*style={styles.activityText2}*/}
                                            {/*allowFontScaling={false}*/}
                                        {/*>{v.text}</Text>*/}

                                    {/*</TouchableOpacity>*/}

                                    {/*{v.badgeImg &&*/}
                                        {/*<Image*/}
                                            {/*source={v.badgeImg}*/}
                                            {/*style={styles.badgeImg}*/}
                                        {/*/>}*/}
                                    {/*</View>*/}
                                    {/*||*/}
                                    {/*null*/}
                                {/*}*/}
                            {/*)*/}
                        {/*}</View>*/}
                    {/*</View>*/}
					{/*广告位行情*/}
					<HomeAdMarketItem page={'OneHome'} goRouter={'TraddingHall'}/>
					{/*首页导航*/}
					<View style={styles.activiteisBox}>
						<TouchableOpacity activeOpacity={1} onPress={this.goOtcPage} style={styles.activiteisBoxLeft}>
							<View>
								<Text style={styles.activiteisBoxLeftTitle}>法币交易</Text>
								<Text style={styles.activiteisBoxLeftDesc}>支持申请成为币商</Text>
							</View>
							<Image source={legalCurrencyTransaction} style={styles.activiteisBoxLeftImg}></Image>
						</TouchableOpacity>

						<View style={styles.activiteisBoxRight}>{
							this.activiteisData.map((v,i)=>
								{return v && <TouchableOpacity
										style={[styles.activiteisRightItem,i == 1 && {marginTop:getWidth(16)}]}
										activeOpacity={0.9}
										key={i}
										// style={styles.activitiesButton}
										onPress={typeof v.action === 'function'&&
										v.action
										||
										this.goWebView.bind(this,{
											url: v.action,
											loading: false,
											navHide: false,
											title: v.text
										})
										}
									>
										<Image
											source={v.img}
											style={styles.activityImage}
										/>
										<Text
											style={styles.activityText}
											allowFontScaling={false}
										>{v.text}</Text>
									</TouchableOpacity>
									||
									null
								}
							)
						}</View>
					</View>

			</View>
        );

	}

    // 渲染客服
    @action
    renderCustomerServiceIcon = () => {
        return (
            <TouchableOpacity
                onPress={this.goToCustomerService}
                activeOpacity={StyleConfigs.activeOpacity}
            >
                <Image
                    style={styles.customerServiceIcon}
                    source={CustomerService}
                />
            </TouchableOpacity>
        )
    }

    //关闭法币交易弹窗
    closeLegalModal = ()=>{
        this.legalModalShow = false;
    }


	render() {
		return (
			<View style={[styles.container, BaseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602}]}>
				{/*顶部*/}
				<NavHeader
                    headerLeft={
							<View style={{flexDirection: 'row'}}>
							   <Image source={require('../assets/OneHome/logo.png')}
									  style={{width: 90,height:24,marginLeft:68}}
                                      resizeMode={'contain'}
							   />
						   </View>
				   		}
                       // headerRight={this.renderCustomerServiceIcon()}
				/>
				{/*<View style={styles.split}></View>*/}
				{/*bannner公告*/}
				<SectionList
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={true}
                    renderItem={this.listRenderRow}
                    renderSectionHeader={({section}) => {
                        // console.log('section==imgNotice',section.key === 'imgNotice');
                        if(section.key === 'imgNotice')return;

                        let obj = {selectedTitleBar:this.selectedTitleBar}

                        return this.rendItemHeader(obj);
                    }}
                    keyExtractor = {(item, index) => {
                    	// console.log('keyExtractor',this.selectedTitleBar+index.toString());
                    	return index.toString()
                    }}
                    sections={[
                        {data:[{'name':'imgNotice',imgData:this.imgData,textData: this.textData}],key:'imgNotice'},
                        {data:[{'name':'market',selectedTitleBar:this.selectedTitleBar}],key:'symbol'}
                    ]}
                    onRefresh={this.refreshData}
                    refreshing={this.state.refreshing}
                    initialNumToRender={6}
				/>

				{/*</View>*/}


                {/*法币交易模态框 begin*/}
                <Modal
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    isVisible={this.legalModalShow}
                    backdropColor={'black'}
                    backdropOpacity={0.5}
                >
                    <View style={styles.verifyModalBox}>
                        <View style={styles.modalArticleBox}>
                            {/*<Image source={VerifyModalIcon} style={styles.verifyModalIcon}/>*/}
                            <Text  allowFontScaling={false} style={[styles.modalArticleText,PlatformOS == 'ios' && {fontFamily:'PingFangSC-Regular'} || {}]}>OTC近期上线，敬请期待！</Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={StyleConfigs.activeOpacity}
                            onPress={this.closeLegalModal}
                        >
                            <View style={styles.modalFooterBox}>
                                <Text  allowFontScaling={false} style={styles.modalFooterText}>我知道了</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </Modal>
                {/*法币交易模态框 end*/}

                <View style={[{
                    position:'absolute',
                    width:250,
                    height:200,
                    left:-350,
                    bottom:-300,
                    opacity:0
                }]}>
                    {this.$store.state.webviewUrl.map((v,i)=>
                        <WebView
                            key={i}
                            source={{uri: v}}
                            style={[{
                                height:1
                                // opacity:0
                            }]}
                            mixedContentMode={'always'}
                        />
                    )}
                </View>

			</View>
		);
	}
}


