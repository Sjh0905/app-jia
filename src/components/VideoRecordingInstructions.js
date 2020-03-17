/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";

import dashedLine from '../assets/BaseAssets/dashed-line.png';
import BaseButton from './baseComponent/BaseButton'
import device from "../configs/device/device";


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false


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

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.container]}>
                <NavHeader headerTitle={'身份认证'} goBack={this.goBack}/>
                <View style={styles.box}>
                    <View>
                        <View><Text style={styles.textTip} allowFontScaling={false}>视频录制须知</Text></View>
                        <View style={[styles.line,styles.rowItem,{marginTop: getHeight(32)}]}>
                            <Image source={dashedLine} style={styles.cardImage} resizeMode={'stretch'} />
                        </View>
                    </View>
                    <View style={[styles.itembox]}>
                        <Image source={null} style={styles.icon} resizeMode={'stretch'}/>
                        <View style={[styles.itemLeft]}>
                            <View><Text style={styles.textOne} allowFontScaling={false}>正对屏幕</Text></View>
                            <View><Text style={styles.textTwo} allowFontScaling={false}>确认人脸完全处于镜头内</Text></View>
                        </View>
                    </View>
                    <View style={[styles.itembox]}>
                        <Image source={null} style={styles.icon} resizeMode={'stretch'}/>
                        <View style={[styles.itemLeft]}>
                            <View><Text style={styles.textOne} allowFontScaling={false}>轮廓清晰</Text></View>
                            <View><Text style={styles.textTwo} allowFontScaling={false}>保证精准对焦，使人像清</Text></View>
                            <View><Text style={styles.textTwo} allowFontScaling={false}>晰可见</Text></View>
                        </View>
                    </View>

                    <View style={[styles.itembox]}>
                        <Image source={null} style={ styles.icon} resizeMode={'stretch'}/>
                        <View style={[styles.itemLeft]}>
                            <View><Text style={styles.textOne} allowFontScaling={false}>亮度均匀</Text></View>
                            <View><Text style={styles.textTwo} allowFontScaling={false}>避免图片出现遮挡光线、</Text></View>
                            <View><Text style={styles.textTwo} allowFontScaling={false}>反光等情况</Text></View>
                        </View>
                    </View>
                    <View style={[styles.itembox]}>
                        <Image source={null} style={styles.icon} resizeMode={'stretch'}/>
                        <View style={[styles.itemLeft]}>
                            <View><Text style={styles.textOne} allowFontScaling={false}>声音清晰</Text></View>
                            <View><Text style={styles.textTwo} allowFontScaling={false}>保证声音的正确性及清晰</Text></View>
                            <View><Text style={styles.textTwo} allowFontScaling={false}>度</Text></View>
                        </View>
                    </View>
                    <View style={[styles.rowItem2,styles.line]}>
                        <Image source={dashedLine} style={styles.cardImage} resizeMode={'stretch'} />
                        <View style={styles.cycleLeft}>
                        </View>
                        <View style={styles.cycleRight}>
                        </View>
                    </View>
                    <View style={[styles.button,styles.rowItem]}>
                        <BaseButton
                            text={'确定'}
                            onPress={this.goBack}
                            style={[baseStyles.btnBlue, styles.button]}
                            textStyle={[baseStyles.textColor, styles.okText]}
                        >
                        </BaseButton>
                    </View>
                    {/*加载中*/}
                    {
                        this.loading && <Loading leaveNav={false}/>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleConfigs.bgColor,
        paddingTop: getDeviceTop(),
        paddingBottom: getDeviceBottom()
    },
    textTip: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        alignItems: 'center'
    },
    textOne: {
        color: '#000',
        fontSize: 18
    },
    textTwo: {
        color: '#000',
        paddingRight: getHeight(42),
        fontSize: 14
    },
    box: {
        backgroundColor: '#fff',
        flex: 1,
        marginTop: getHeight(42),
        marginBottom: getHeight(20),
        //marginLeft: getHeight(20),
        // marginRight: getHeight(20),
        borderRadius: 6,
        paddingTop: getHeight(34),
        paddingBottom: getHeight(20),
        justifyContent: 'space-around'
    },
    itembox: {
        flexDirection: 'row', //默认是column
    },
    itemLeft: {
        marginLeft:getHeight(52.4),
        justifyContent:'space-around',
        paddingTop: getHeight(20),
        paddingBottom: getHeight(20)
    },
    itemRight: {

    },
    icon: {
        marginLeft:getHeight(90),
        width: getWidth(171.6),
        height: getWidth(146),
        alignSelf: 'center'
    },
    line:{
        height: 3,
        marginLeft: 0,
        marginRight: 0,
    },
    bottomBox:{
        paddingTop: getHeight(44),
        paddingBottom: 20
    },
    rowItem:{
        marginLeft: getWidth(36),
        marginRight: getWidth(36),
    },
    rowItem2:{
        paddingLeft: getWidth(36),
        paddingRight: getWidth(36),
    },
    cardImage:{
        width: '100%',
        height: '100%'
    },
    cycleLeft:{
        height: 20,
        width: 10,
        backgroundColor: StyleConfigs.bgColor,
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        position: 'absolute',
        top: -11,
        left: 0
    },
    cycleRight:{
        height: 20,
        width: 10,
        backgroundColor: StyleConfigs.bgColor,
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        position: 'absolute',
        top: -11,
        right: 0
    },
    button:{
        width: getWidth(560),
        alignSelf: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    okText:{
    fontSize: 18
}
})