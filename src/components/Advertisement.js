/**
 * hjx 2018.4.16
 * 首页中间广告页 单独拿出来 考虑到之后可能会换成别的其他的什么东西 可以单独维护 现在做为BT的入口
 */
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable,computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import env from "../configs/environmentConfigs/env";

@observer
export default class Advertisement extends RNComponent {


    /*----------------------- data -------------------------*/
    @computed
    get FEE_DIVIDEND() {
        return this.$globalFunc.accFixed(this.$store.state.feeDividend || 0);
    }

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/
    pressButton = ()=>{
        this.goWebView({
            url: 'static/mobileBTActivityHomePage'
        })
    }

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
            params.url.length && (params.url.indexOf('http') === -1) && (params.url = env.networkConfigs.downloadUrl + params.url.replace(/^\//,''));
            return this.$router.push('WebPage',params)
        }
    })()

    /*----------------------- 挂载 -------------------------*/

    render() {
        return (<TouchableOpacity
            onPress={this.pressButton}
            style={[this.props.style ,styles.box]}
            activeOpacity={1}
        >
            <View style={[styles.item,{width:getWidth(242),justifyContent:'center',alignItems:'center'}]}>
                <Image
                    source={null}
                    style={{
                        width: getWidth(232),
                        height: getWidth(146)
                    }}
                />
            </View>
            <View style={[styles.item,{flex: 1,paddingLeft: getWidth(20)}]}>
                <Text
                    allowFontScaling={false}
                    style={{
                    fontSize: getWidth(32),
                    // color: '#37c3ff',
                    color: '#fff',
                    lineHeight:getHeight(42),
                    marginTop: getHeight(12),
                    marginBottom:getHeight(12)
                }}>挖矿收益</Text>
                <Text
                    allowFontScaling={false}
                    style={{
                    fontSize: getWidth(24),
                    color: '#fff',
                    lineHeight:getHeight(34),
                    opacity: 0.6
                }}>今日平台交易手续费折合:</Text>
                <Text
                    allowFontScaling={false}
                    style={{
                    fontSize: getWidth(30),
                    // color: '#fff',
                    lineHeight:getHeight(34),
                    color: '#C43E4E',
                }}>{this.FEE_DIVIDEND} USDT</Text>
            </View>
            <View style={[styles.item,styles.arrowBox]}>
                <Image
                    resizeMode={'contain'}
                    style={styles.arrow}
                    source={null}
                />
            </View>
            {/*<View style={[styles.item,{width: getWidth(174),justifyContent:'center'}]}>*/}
                {/*<TouchableOpacity*/}
                    {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                    {/*style={{*/}
                        {/*// backgroundColor:'red',*/}
                        {/*borderRadius: 4,*/}
                        {/*overflow:'hidden',*/}
                        {/*height: getHeight(56),*/}
                        {/*width: getWidth(156),*/}
                        {/*alignItems: 'center',*/}
                        {/*justifyContent:'center'*/}
                    {/*}}*/}
                    {/*onPress={this.pressButton}*/}
                {/*>*/}
                    {/*<Image style={{*/}
                        {/*height: getHeight(56),*/}
                        {/*width: getWidth(156),*/}
                        {/*position: 'absolute',*/}
                        {/*top: 0,*/}
                        {/*left: 0*/}
                    {/*}} source={null} />*/}
                    {/*<Text allowFontScaling={false}*/}
                          {/*style={{*/}
                              {/*fontSize: getWidth(26),*/}
                              {/*color: '#fff'*/}
                    {/*}}>查看收益</Text>*/}

                {/*</TouchableOpacity>*/}
            {/*</View>*/}

            </TouchableOpacity>)
    }
}

const styles = StyleSheet.create({
    box: {
        height: getHeight(164),
        flexDirection: 'row',
        // backgroundColor:'red'
        backgroundColor:'#FFFFFF',
    },
    item:{
        overflow: 'hidden'
    },
    arrowBox:{
        width: getWidth(36),
        marginRight: getWidth(20)
    },
    arrow:{
        width: '100%',
        height: '100%'
    }
})