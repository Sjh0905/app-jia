/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Image, Text, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/MineAboutUsStyle'
// import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import device from "../configs/device/device";
import StyleConfigs from '../style/styleConfigs/StyleConfigs'

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
            <View style={[styles.container, {backgroundColor:StyleConfigs.navBgColor0602,paddingTop: getDeviceTop()}]}>
                <NavHeader headerTitle={'关于我们'} goBack={this.goBack}/>

                <View style={[styles.container, styles.articleBox, baseStyles.paddingBox,{backgroundColor:StyleConfigs.bgColor}]}>
                    <View style={styles.titleBox}>
                        {/*<Image source={null} style={styles.logoIcon}/>*/}
                        {/*<Text  allowFontScaling={false} style={[baseStyles.textColor, styles.sloganText]}>全民所有·币有所为</Text>*/}
                        <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.versionText]}>{this.$store.state.version}</Text>
                    </View>
                    <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.articleText]}>
                        EUNEX是香港的创新型区块链资产交易平台
                        EUNEX 隶属于HongKong Digital Currency And Token Clearing Trading Co . , Limited
                         网址为 www.2020.exchange。
                    </Text>
                    <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.articleText]}>
                        EUNEX致力于为全球区块链资产爱好者提供安全、稳定、流畅的区块链资产兑换服务。
                    </Text>
                    <Text  allowFontScaling={false} style={[baseStyles.textColor, styles.articleText]}>
                        EUNEX自始至终将全球区块链资产爱好者的体验作为平台发展的基石和力量的源泉，汇集全球智慧，共同推动区块链技术在全球的创新和应用。
                    </Text>

                </View>


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
