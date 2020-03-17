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
import styles from '../style/SignResetPswVerifyStyle'
import BaseTabView from './baseComponent/BaseTabView'
import VerifyItem from './SignResetPswVerifyItem'


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    @observable
    loading = false


    _renderScreen = {
        ga: () => <VerifyItem type={'ga'}/>,
        mobile: () => <VerifyItem type={'mobile'}/>
    }

    state = {
        index: 0,
        routes: [
            {key: 'ga', title: '谷歌验证'},
            {key: 'mobile', title: '手机验证'}
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
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

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
            <View style={[styles.container, baseStyles.container]}>
                <NavHeader headerTitle={'重置密码'} goBack={this.goBack}/>

                <BaseTabView
                    renderScreen={this._renderScreen}
                    state={this.state}
                    onIndexChange={this.onIndexChange}
                    indicatorStyle={[styles.indicatorStyle]}
                    tabStyle={[styles.tabBar]}
                    tabBoxStyle={[styles.tabBoxStyle, baseStyles.navTwoBgColor]}
                />

            </View>
        )
    }
}
