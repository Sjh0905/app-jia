/**
 * hjx 2018.4.16
 */

import React from 'react';
import {StyleSheet, View, Text, SectionList, Image, TouchableOpacity, Platform} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
// import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import close from '../assets/AdditionalRewards/close.jpg';
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import {Switch} from 'react-native-switch'
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'

//用来判断分页距离
const reachedThreshold = Platform.select({
    ios: -0.1,
    android: 0.1
});

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = true;

    @observable
    loadingMore = '上拉加载更多';

    @observable
    isCover = false;

    @observable reward = null;
    @observable record = [];
    showFooter = false;
    offset = 0;
    pageLimit = 10;

    @observable
    BDBInfo = true;
    @observable
    BDBInfoAnimating = false;

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount();
        this.notify({key: 'GET_REGULATION_CONFIG'});
        // 获取BDB抵扣
        this.getBDBInfo();
        this.getAdditionalRewards();
        this.listen({key:'RE_FEE_BDB_STATE',func:this.getBDBInfo});
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    componentDidMount(){
        super.componentDidMount();
    }
    /*----------------------- 函数 -------------------------*/

    @action
    showInstructions = ()=>{
        this.isCover = true;
    }

    @action
    closeAlert = ()=>{
        this.isCover = false;
    }

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }

    @action
    getAdditionalRewards = ()=>{
        if(this.loadingMore == '加载中' || this.loadingMore == '已经全部加载完毕'){
            return;
        }
        if (!this.$store.state.authMessage.userId) return;
        this.loadingMore = '加载中';
        this.$http.send('BURING_BDB_REWARD', {
            bind: this,
            params: {
                offset: this.offset,
                maxResults: this.pageLimit
            },
            callBack: this.re_getAdditionalRewards,
            errorHandler: this.error_getAdditionalRewards
        })
    }

    @action
    re_getAdditionalRewards = (data)=>{
        typeof (data) === 'string' && (data = JSON.parse(data))
        console.log('BURING_BDB_REWARD===========1111=',JSON.stringify(data));
        if (data && data.dataMap) {
            this.reward = this.$globalFunc.accFixed(data.dataMap.reward);
        }
        if(data && data.dataMap && data.dataMap.record && data.dataMap.record.length){
            data.dataMap.record.length >= this.pageLimit && (this.showFooter = true);
            data.dataMap.record = this.record.slice().concat(data.dataMap.record);
            this.record = data.dataMap.record;
            this.offset = this.record.length;
            data.dataMap.record.length < this.pageLimit && (this.loadingMore = '已经全部加载完毕') || (this.loadingMore = '上拉加载更多');
            return;
        }
        this.loadingMore = '已经全部加载完毕'
    }

    error_getAdditionalRewards = (err)=>{
        this.loadingMore = '上拉加载更多';
        console.warn("获取总计失败", err)
    }


    @action
    listRenderRow = ({section,item})=>{
        if(section.key === 'img'){
            return (
                <View style={styles.imgBox}>
                    <Image
                     source={null}
                     style={styles.img}
                    />

                    <Text allowFontScaling={false} style={[styles.imgTextSmall,styles.tfff]}>总计获得</Text>
                    <Text allowFontScaling={false} style={[styles.imgTextBig,styles.tfff]}>{this.reward}</Text>
                </View>
            )
        }
        if(section.key === 'list'){
            return (
                <View style={styles.listItem}>
                    <View style={styles.listItemRow}>
                        <Text allowFontScaling={false} style={[styles.listTextLeft,styles.tfff]}>日期</Text>
                        <Text allowFontScaling={false} style={[styles.listTextRight,styles.tfff]}>{item.date}</Text>
                    </View>
                    <View style={styles.listItemRow}>
                        <Text allowFontScaling={false} style={[styles.listTextLeft,styles.tfff]}>使用KK燃烧数量</Text>
                        <Text allowFontScaling={false} style={[styles.listTextRight,styles.tfff]}>{item.feeRefunded}</Text>
                    </View>
                    <View style={styles.listItemRow}>
                        <Text allowFontScaling={false} style={[styles.listTextLeft,styles.tfff]}>奖励()</Text>
                        <Text allowFontScaling={false} style={[styles.listTextRight,styles.tfff]}>{item.bonus}</Text>
                    </View>
                </View>
            )
        }
        return null;
    }

    @action
    renderHeader = ({section})=>{
        if(section.key === 'list'){
            return (<View><View style={[styles.listHeader,baseStyles.bgColor]}>
                <Text allowFontScaling={false} style={[styles.headerText,styles.tfff]}>奖励列表：</Text>
                <View style={{flex: 1}}></View>
                <TouchableOpacity activeOpacity={0.9} style={styles.touchBox} onPress={this.showInstructions}>
                    <View activeOpacity={0.9} style={styles.wenhao}>
                        <Image
                            source={null}
                            style={styles.img}
                        />
                    </View>
                    <Text allowFontScaling={false} style={[styles.headerText,styles.tfff]}>奖励规则说明</Text>
                </TouchableOpacity>
            </View>
                {
                    !this.record.length &&
                    <View style={[styles.emptyBox]}>
                        <Image source={EmptyIcon} style={styles.emptyIcon}/>
                        <Text allowFontScaling={false} style={[styles.emptyText]}>暂时没有记录</Text>
                    </View>
                }
            </View>)
        }
        return null;
    }

    @action
    rendItemFooter = ()=>{
        console.log('showFooter------',this.showFooter)
        return <View style={styles.loadingMore}>
            {this.showFooter && <Text  allowFontScaling={false} style={[styles.loadingMoreText]}>{this.loadingMore}</Text>}
        </View>
    }

    loadingMoreData=()=>{
        this.getAdditionalRewards();
    }


    // BDB是否抵扣
    @action
    getBDBInfo = () => {
        this.$http.send('FIND_FEE_BDB_INFO', {
            bind: this,
            callBack: this.re_getBDBInfo,
            errorHandler: this.error_getBDBInfo
        })
    }

    // BDB是否抵扣回调
    @action
    re_getBDBInfo = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        if (!data) return
        console.warn('this is bdb', data)
        if (data.errorCode) {

            return
        }
        if (data.dataMap.BDBFEE === 'yes') {
            this.BDBInfo = true
            this.$store.commit('SET_FEE_BDB_STATE',1);
            console.log('feeBdbState初始化为',this.$store.state.feeBdbState);

        }
        if (data.dataMap.BDBFEE === 'no') {
            this.BDBInfo = false
            this.$store.commit('SET_FEE_BDB_STATE',0);
            console.log('feeBdbState初始化为',this.$store.state.feeBdbState);

        }
        // BDB状态
        this.BDBReady = true
        this.loading = !(this.BDBReady)
    }

    // BDB是否抵扣出错
    @action
    error_getBDBInfo = (err) => {
        console.warn('BDB抵扣出错', err)
        this.BDBReady = true
        this.loading = !(this.BDBReady)
    }

    // BDB抵扣开关
    @action
    BDBFeeChange = (value) => {
        if (this.BDBInfoAnimating) return
        this.BDBInfoAnimating = true
        this.BDBInfo = value
        this.$http.send('CHANGE_FEE_BDB', {
            bind: this,
            params: {
                'feebdb': this.BDBInfo ? 'yes' : 'no'
            },
            callBack: this.re_clickToggle,
            errorHandler: this.error_clickToggle
        })
    }

    // 点击切换手续费折扣
    @action
    re_clickToggle = (data) => {
        typeof (data) === 'string' && (data = JSON.parse(data))
        this.BDBInfoAnimating = false

        this.$store.commit('SET_FEE_BDB_STATE',this.$store.state.feeBdbState === 1?0:1);
        console.log('feeBdbState改变后为',this.$store.state.feeBdbState);
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.container]}>
                <NavHeader headerTitle={'使用KK燃烧额外奖励'} goBack={this.goBack}/>
                <SectionList
                    style={[styles.container,baseStyles.bgColor,styles.Section]}
                    stickySectionHeadersEnabled={true}
                    renderItem={this.listRenderRow}
                    renderSectionHeader={this.renderHeader}
                    keyExtractor = {(item, index) => index.toString()}
                    sections={[
                        {data:[{value: this.reward}],key:'img'},
                        {data:(this.record || []).slice(),key:'list'}
                        ]}
                    // onRefresh={this.refreshData}
                    // refreshing={this.state.refreshing}
                    initialNumToRender={6}
                    ListFooterComponent={this.rendItemFooter}
                    onEndReached={this.loadingMoreData}
                    onEndReachedThreshold={reachedThreshold}
                    loadingMore ={this.loadingMore}
                />
                <View style={styles.footer}>
                    <Text allowFontScaling={false} style={[styles.tfff]}>使用KK支付交易手续费（）</Text>
                    <Switch
                    value={this.BDBInfo}
                    onValueChange={this.BDBFeeChange}
                    circleBorderWidth={0}
                    backgroundActive={StyleConfigs.btnBlue}
                    circleSize={20}
                    />
                </View>
                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
                {
                    this.isCover &&
                    <View style={styles.cover}>
                        <View style={styles.wall}></View>
                        <View style={styles.alert}>
                            <View>
                                <Text allowFontScaling={false} style={styles.alertTitle}>
                                    奖励规则说明
                                </Text>
                                <Text allowFontScaling={false} style={styles.alertContent}>
                                    1.使用KK支付交易手续费()，即可参与该活动。
                                </Text>
                                <Text allowFontScaling={false} style={styles.alertContent}>
                                    2.使用KK燃烧支付的手续费部分，可获得额外奖励。
                                </Text>
                                <Text allowFontScaling={false} style={styles.alertContent}>
                                    3.当天获得的奖励
                                </Text>
                                <Text allowFontScaling={false} style={styles.alertContent}>
                                    发放。
                                </Text>
                                <Text allowFontScaling={false} style={styles.alertContent}>
                                    4.活动如有调整以平台公告为准，本活动最终解释
                                </Text>
                                <Text allowFontScaling={false} style={styles.alertContent}>
                                    权归本平台所有。
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={this.closeAlert} activeOpacity={0.9} style={styles.close}>
                            <Image
                                source={close}
                                style={styles.img}
                            />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    footer:{
        paddingLeft:getWidth(24),
        paddingRight:getWidth(26),
        height: getHeight(100),
        backgroundColor: '#FFFFFF',
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection: 'row'
    },
    imgBox:{
        marginLeft: getWidth(20),
        marginRight: getWidth(20),
        marginTop: getHeight(20),
        height: getHeight(148),
        borderRadius: getWidth(20),
        overflow:'hidden',
        alignItems:'center',
        justifyContent: 'center'
    },
    img:{
        width: '100%',
        height: '100%',
        position:'absolute',
        top:0,
        left:0
    },
    imgTextSmall:{
        fontSize: getWidth(28),
        opacity: 0.7,
        lineHeight: getHeight(44)
    },
    imgTextBig:{
        fontSize: getWidth(34),
        lineHeight: getHeight(50)
    },

    Section:{
        marginBottom: (Platform.OS === "ios") && -getHeight(120) || 0,//由于安卓和iOS的分页要求不同
    },
    listItem:{
        borderRadius:getWidth(20),
        backgroundColor:'#141B24',
        height: getHeight(220),
        marginLeft: getWidth(20),
        marginRight:getWidth(20),
        marginBottom: getHeight(20),
        justifyContent: 'space-around'
    },
    listItemRow:{
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listTextLeft:{
        fontSize: getWidth(24),
        opacity: 0.8
    },
    listTextRight:{
        fontSize: getWidth(24),
    },

    listHeader:{
        height: getHeight(80),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: getWidth(20),
        marginRight: getWidth(20),
    },
    listHeaderText:{
        fontSize: getWidth(28),
        opacity: 0.6
    },
    wenhao:{
        height: getWidth(32),
        width: getWidth(32),
        marginRight: getWidth(12)
    },
    touchBox:{
        flexDirection: 'row'
    },
    cover: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    wall:{
        width: '100%',
        height: '100%',
        backgroundColor:'#000',
        opacity: 0.6
    },
    alert:{
        width:getWidth(640),
        height:getHeight(452),
        position:'absolute',
        top: getHeight(390),
        left:getWidth(56),
        backgroundColor: '#fff',
        borderRadius: getWidth(30)
    },
    alertTitle:{
        color:'#3576F5',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: getHeight(44),
        marginBottom: getHeight(46),
        fontSize: getWidth(32)
    },
    alertContent:{
        color: '#333',
        fontSize: getWidth(24),
        lineHeight:getHeight(44),
        marginLeft:getWidth(40),
        marginRight: getWidth(30)
    },
    close:{
        position: 'absolute',
        width: getWidth(40),
        height:getWidth(40),
        top: getHeight(330),
        left: getWidth(656)
    },

    loadingMore: {
        height: getHeight(120),
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingMoreText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: StyleConfigs.txtC5CFD5
    },

    emptyIcon: {
        width:getWidth(300),
        height:getWidth(300)
    },
    emptyBox: {
        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop:getHeight(350)
    },
    emptyText: {
        color:StyleConfigs.txtC5CFD5
    },

    tfff:{
        color:'#fff'
    }
})
