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
import Env from '../configs/environmentConfigs/env.js'
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'
import device from "../configs/device/device";
import Loading from '../components/baseComponent/Loading'
import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import BaseDefaultBar from '../components/baseComponent/BaseDefaultBar'
import TransactionBuy from "./TransactionBuy";
import TransactionSell from "./TransactionSell";
import OrderList from "./OrderList";
import OrderConfirmRiskPopups from "./OrderConfirmRiskPopups";
import {getCookieForC2C,getAuthStateForC2C} from "../c2cProject/C2CPublicAPI";

@observer
export default class C2CHomePage extends RNComponent {

    componentWillMount(){
        this.listen({key:'SET_C2CHOMEPAGE_INDEX',func:this.listenOnIndexChange});
        if(!this.$store.state.cookieForC2C){
            this.doGetCookieForC2C()
        }
    }

    componentDidMount(){
        super.componentDidMount();
        this.isFirstVisit();
    }
    @observable
    loading = false;

    @observable
    componentUpdate = false;

    // 首次风险提示弹窗
    @observable
    popWindowOpenForFirst = false

    // @observable
    state = {
        index: 0,
        routes: [
            {key: 'buy', title: '买入'},
            {key: 'sell', title: '卖出'},
            {key: 'processing', title: '进行中'},
            {key: 'complete', title: '已完成'},
            {key: 'cancel', title: '已取消'}
        ]
    }

    doGetCookieForC2C =async()=>{
        await getCookieForC2C(this.$http,this.$store,Env);
    }

    // 第一次进入是否弹窗
    isFirstVisit = async() => {
        this.loading = true;
        if(!this.$store.state.cookieForC2C){
            await getCookieForC2C(this.$http,this.$store,Env);
            await getAuthStateForC2C(this.$http,this.$store);
        }

        this.$http.send('IS_FIRST_VISIT', {
            bind: this,
            callBack: this.re_isFirstVisit,
            errorHandler: this.error_isFirstVisit
        })
        return
    }


    // 第一次进入是否弹窗回调
    re_isFirstVisit = (data) => {
        this.loading = false;
        typeof data === 'string' && (data = JSON.parse(data));
        console.log('this is isFirstVisit',data);
        if (data.errorCode) {
            switch (data.errorCode) {
                case 2:
                    this.popWindowOpenForFirst = true
                    break;
            }
            return
        }

    }
    // 第一次进入是否弹窗出错
    error_isFirstVisit = (err) => {
        this.loading = false;
        Toast.show('获取是否弹窗请求出错', {
            duration: 500,
            position: Toast.positions.CENTER
        })
    }

    onSure = (val)=>{
        this.popWindowOpenForFirst = val
    }
    onCancel = ()=>{
        this.popWindowOpenForFirst = false
        this.goBack()
    }


    @action goBack = () => {
        this.$router.goBack()
    }


    @action    listenOnIndexChange = (index) => {
        try{
            // this.componentUpdate = true;
            if(this.scrollTabView)
                this.scrollTabView.goToPage(index);

            // setTimeout(()=>{
            //     this.componentUpdate = false;
            // },200)
        }catch(ex){
            alert('切换tab错误' + '  ' + ex.toString());
            console.log('切换tab错误',ex);
        }
    }

    @action
    onIndexChange = (() => {
        let last = 0;
        let lastIndex = 0;
        let lastShowLogin = false;
        return ({i,from}) => {
            if (Date.now() - last < 1000 && i == lastIndex){
                return;
            }
            last = Date.now();
            lastIndex = i;
            console.log('this is C2CHomePage tab ===',i);

            setTimeout(()=>{
                i == 0 && this.notify({key: 'RE_TRANSACTION'},'BUY')
                i == 1 && this.notify({key: 'RE_TRANSACTION'},'SELL')
                i == 2 && this.notify({key: 'RE_ORDER_LIST'},'PROCESSING')
                i == 3 && this.notify({key: 'RE_ORDER_LIST'},'COMPLETE')
                i == 4 && this.notify({key: 'RE_ORDER_LIST'},'CANCEL')
                i == 5 && this.notify({key: 'RE_ORDER_LIST'},'OTHER')
            },100)

        }
    })()

    render() {
        return (
            <View
                onLayout={(e)=>{
                    // console.log('e.nativeEvent.layout.height',e.nativeEvent.layout.height);
                    // this.$store.commit('SET_DEVICE_HEIGHT_STATE', e.nativeEvent.layout.height);
                }}
                style={[styles.container,BaseStyles.bgColor,{backgroundColor:StyleConfigs.navBgColor0602}]}>
                <NavHeader
                    headerTitle={'USDT/CNY'}
                    goBack={this.goBack}
                    headerRight={
                        <View style={styles.headerRightStyle}>
                            <Text allowFontScaling={false} style={{color: '#fff', fontSize: 12}}>普通</Text>
                        </View>
                    }

                />

                <ScrollableTabView
                    locked={false}
                    style={{flex: 1}}
                    ref = {(scrollTabView)=>{this.scrollTabView = scrollTabView}}
                    renderTabBar={() =>
                        <BaseDefaultBar
                            tabLabels={['买入','卖出','进行中','已完成','已取消','其他']}
                            tabUnderlineWidth={[getWidth(58),getWidth(58),getWidth(82),getWidth(82),getWidth(82),getWidth(58)]}
                            tabBarBackgroundColor={StyleConfigs.navBgColor0602}
                        />
                    }
                    initialPage={0}
                    // page={1}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#3576F5'
                    tabBarInactiveTextColor='#fff'
                    tabBarTextStyle={{fontSize: 14,marginBottom:getHeight(-22)}}
                    tabBarUnderlineStyle={{
                        backgroundColor: '#3576F5',
                        height:getDealHeight(4),
                        // width:getDealHeight(DeviceWidth*2/5),
                        // marginLeft:getDealHeight(DeviceWidth*2/13)
                        marginLeft: DeviceWidth / 13 - (7 * 14 / 2),
                        width: (4 * 14),
                        borderRadius:getHeight(4)
                    }}
                    onChangeTab={this.onIndexChange}
                    prerenderingSiblingsNumber={1}

                >
                    {/*买入*/}
                    <TransactionBuy/>
                    {/*卖出*/}
                    <TransactionSell/>
                    {/*进行中*/}
                    <OrderList status={'PROCESSING'}/>
                    {/*已完成*/}
                    <OrderList status={'COMPLETE'}/>
                    {/*已取消*/}
                    <OrderList status={'CANCEL'}/>
                    {/*其他*/}
                    <OrderList status={'OTHER'}/>
                </ScrollableTabView>

                {/*{*/}
                    {/*this.loading && <Loading/>*/}
                {/*}*/}

                {this.popWindowOpenForFirst &&
                    <OrderConfirmRiskPopups
                        onSure={this.onSure}
                        onCancel={this.onCancel}
                    />
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: getDeviceTop()
        // backgroundColor: 'red'
    },
    headerRightStyle:{
        width:getWidth(76),
        height:getHeight(36),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:2,
        backgroundColor:StyleConfigs.btnBlue
    },
    tabBoxStyle: {
        height: getDealHeight(80),
        justifyContent: 'center'
    },


    container2: {
        // height:(604.33/global.RateDeviceHeight-55-80-88)*global.RateDeviceHeight,
        // flex: 1,
        flexDirection: 'row',
        flexWrap: "wrap",
        backgroundColor: StyleConfigs.bgColor,
        // backgroundColor: 'green',
        paddingBottom:(getDeviceTop() != 0) && getDealHeight(6) || getDealHeight(8),
        // paddingVertical: getDealHeight(20),
        paddingHorizontal: getDealHeight(20),
        paddingTop:PlatformOS === 'ios' && (PlatformiOSPlus || getDeviceTop() != 0) && getDealHeight(26) || getDealHeight(15)
    },
    halfBox1: {
        flex: 1,
        // backgroundColor: 'red'
    },
    halfBox2: {
        flex: 1,
        // backgroundColor: 'yellow'
    },


});