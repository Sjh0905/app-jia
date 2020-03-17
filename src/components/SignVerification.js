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
import styles from '../style/SignVerificationStyle'
import Loading from './baseComponent/Loading'

import VerifyItem from './SignVerificationItem'

import TabView from './baseComponent/BaseTabView'


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    @observable
    templateData = 0

    @observable
    loading = true

    @observable
    navHeader = '登录验证'

    @observable
    bindGa = true

    @observable
    bindMobile = true

    @observable
    bindEmail = true;

    @observable
    selectIndex = 0

    @observable
    userName = ''


    _renderScreen = {
        ga: () => {
            return <VerifyItem type={'ga'}/>
        },
        mobile: () => {
            return <VerifyItem type={'mobile'}/>
        },
    }


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        this.state = {
            index: 0,
            routes: [
                {key: 'ga', title: '谷歌验证'},
                {key: 'mobile', title: '手机验证'},
            ]
        }

        this.userName = this.$route.routes[this.$route.routes.length - 1].params && this.$route.routes[this.$route.routes.length - 1].params.userName
        this.type = this.$route.routes[this.$route.routes.length - 1].params && this.$route.routes[this.$route.routes.length - 1].params.type
        // 获取认证状态
        this.getLoginAuthState()

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

    // 获取认证状态
    @action
    getLoginAuthState = () => {
        this.$http.send('VERIFYING_LOGIN_STATE', {
            bind: this,
            params: {
                email: this.type === 'email' && this.userName || '',
                mobile: this.type === 'mobile' && this.userName || '',
            },
            callBack: this.re_getLoginAuthState,
            errorHandler: this.error_getLoginAuthState,
        })
    }
    @action
    re_getLoginAuthState = (data) => {
        console.log('VERIFYING_LOGIN_STATE',data)
        typeof data === 'string' && (data = JSON.parse(data))
        this.bindGa = data.dataMap.ga
        this.bindMobile = data.dataMap.sms
        this.bindEmail = data.dataMap.email
        this.loading = false
    }

    @action
    error_getLoginAuthState = (err) => {

    }

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
            <View style={[styles.container, baseStyles.bgColor]}>
                <NavHeader
                    goBack={this.goBack}
                    headerTitle={this.navHeader}
                />
                {
                    !this.loading &&
                    (
                        <View style={styles.verifyBox}>

                            {/*只绑定了谷歌*/}
                            {
                                this.bindGa && !this.bindMobile && (
                                    <VerifyItem
                                        type={'ga'}
                                    />
                                )
                            }

                            {/*只绑定了手机*/}
                            {
                                !this.bindGa && this.bindMobile && (
                                    <VerifyItem
                                        type={'mobile'}
                                    />
                                )
                            }

                            {/*两者都绑定了*/}
                            {
                                this.bindGa && this.bindMobile && (
                                    <TabView
                                        renderScreen={this._renderScreen}
                                        onIndexChange={this.onIndexChange}
                                        state={this.state}
                                        indicatorStyle={[styles.indicatorStyle]}
                                        tabStyle={[styles.tabBar]}
                                        tabBoxStyle={[styles.tabBoxStyle, baseStyles.navTwoBgColor]}
                                    ></TabView>
                                )
                            }
                        </View>
                    )
                }

                {
                    this.loading && <Loading leaveNav={true}/>
                }


            </View>
        )
    }
}
