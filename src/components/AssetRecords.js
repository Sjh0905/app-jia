/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/AssetRecordsStyle'

import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
// import BaseTabView from './baseComponent/BaseTabView'
import AssetRecordsItem from './AssetRecordsItem'
import RewardRecordsItem from './RewardRecordsItem'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
// import BaseDefaultBar from './baseComponent/BaseDefaultBar'
import BaseScrollableBar from './baseComponent/BaseScrollableBar'
import InternalTransferRecordsItem from "./InternalTransferRecordsItem";
import CapitalTransferRecordsItem from "./CapitalTransferRecordsItem";
import MiningRecordsItem from "./MiningRecordsItem";
import FundRecordsItem from "./FundRecordsItem";
import HeatRecordsItem from "./HeatRecordsItem";
import CashBackRecordsItem from "./CashBackRecordsItem";
import CapitalExchangeItem from "./CapitalExchangeItem";

@observer
export default class AssetRecords extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    // 加载中
    @observable
    initialPage = 0


    _renderScreen = ({route}) => {
        switch (route.key) {
            case 'recharge':
                return <AssetRecordsItem type={'recharge'}/>
            case 'withdrawals':
                return <AssetRecordsItem type={'withdrawals'}/>
            default:
                return null
        }
    }

    state = {
        index: 0,
        routes: [
            {key: 'recharge', title: '充值记录'},
            {key: 'withdrawals', title: '提现记录'}
        ]
    }


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()

        this.initialPage = this.$params && this.$params.initialPage || 0
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

    @action
    onIndexChange = (index) => {
        this.setState({index: index})
    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container,styles.container2]}>
                <NavHeader headerTitle={'财务记录'} goBack={this.goBack}/>

                {/*<BaseTabView*/}
                    {/*renderScreen={this._renderScreen}*/}
                    {/*state={this.state}*/}
                    {/*onIndexChange={this.onIndexChange}*/}
                    {/*indicatorStyle={[styles.indicatorStyle]}*/}
                    {/*tabStyle={[styles.tabBar]}*/}
                    {/*tabBoxStyle={[styles.tabBoxStyle, baseStyles.navTwoBgColor]}*/}
                    {/*labelStyle={[styles.tabLabel]}*/}
                    {/*useSceneMap={false}*/}
                {/*/>*/}

                <ScrollableTabView
                    renderTabBar={() =>
                        <BaseScrollableBar
                        tabLabels={['充币','提币','划转','转账','挖矿','奖励','基金','热度','返现','资金往来']}
                        tabUnderlineWidth={[getWidth(42),getWidth(42),getWidth(42),getWidth(42),getWidth(42),getWidth(42),getWidth(42),getWidth(42),getWidth(42),getWidth(96)]}
                        tabBarBackgroundColor={StyleConfigs.navBgColor0602}
                        // tabInActiveColor={'#9FA7B8'}
                        />
                    }
                    initialPage={this.initialPage}
                    /*tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#3576F5'
                    tabBarInactiveTextColor='#fff'
                    tabBarTextStyle={{fontSize: 14,marginBottom:getHeight(-26)}}
                    tabBarUnderlineStyle={{
                        backgroundColor: '#3576F5',
                        height:getHeight(4),
                        marginLeft: DeviceWidth / 4 - (5 * 14 / 2),
                        width: (5 * 14),
                        borderRadius:getHeight(4)
                    }}*/
                    onChangeTab={(asd)=>{
                        this.onIndexChange(asd.i);
                    }}
                >
                    <AssetRecordsItem tabLabel={' 充币 '} type={'recharge'}/>
                    <AssetRecordsItem tabLabel={' 提币 '} type={'withdrawals'}/>
                    <CapitalTransferRecordsItem tabLabel={' 划转 '} type={'capitalTransfer'}/>
                    <InternalTransferRecordsItem tabLabel={' 转账 '} type={'internalTransfer'}/>
                    <MiningRecordsItem tabLabel={' 挖矿 '} type={'mining'}/>
                    <RewardRecordsItem tabLabel={' 奖励 '} type={'withdrawals'}/>
                    <FundRecordsItem tabLabel={' 基金 '} type={'fund'}/>
                    <HeatRecordsItem tabLabel={' 热度 '} type={'heat'}/>
                    <CashBackRecordsItem tabLabel={' 返现 '} type={'cashback'}/>
                    <CapitalExchangeItem tabLabel={' 资金往来 '} type={'capitalexchange'}/>
                </ScrollableTabView>


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
