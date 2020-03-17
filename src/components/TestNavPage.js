/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import CodePush from 'react-native-code-push'
import JiYan from './baseComponent/JiYan'


// type Props = {};
// export default class App extends Component<Props> {


@observer
export default class App extends RNComponent {

    @observable
    testEventNum = 0


    componentWillMount() {
        this.listen({
            key: 'TEST_EVENT',
            func: this.testEvent
        })
        this.testSocket()
    }

    componentWillUnmount() {
        super.componentWillUnmount()

        console.warn("组件卸载！nav")
    }

    @action
    testEvent(num) {
        this.testEventNum++
        console.warn("测试页面的event!", this.testEventNum)

    }

    @action
    testHttp(data) {
        console.warn("发送请求回来了！", data)
        this.someData = JSON.stringify(data)
    }

    @observable
    someData = '这是请求要改变的值'


    @action
    testSocket() {
        this.$socket.on({
            key: 'topic_prices',
            bind: this,
            callBack: this.re_getPrice
        })
    }

    @observable
    socketTime = 0

    @action
    re_getPrice(data) {
        // console.warn("这是socket接收到的数据！", data)
        this.socketTime++
    }

    @observable
    progress = 0


    @observable
    changeTab = () => {
        this.notify({key: 'CHANGE_TAB'}, 0)
    }


    testHotUpdate() {
        console.warn("测试热更新！")
        let that = this
        CodePush.checkForUpdate('W3B4QJ8fPQpPqDWzDPdDqRgnSeJ54ksvOXqog').then((update) => {
            console.warn("这是发送请求的数据！", update)

            if (!update) {
                Alert.alert("提示", "已是最新版本--", [
                    {
                        text: "Ok", onPress: () => {
                            console.log("点了OK");
                        }
                    }
                ]);
            }
            else {

                CodePush.sync({
                    deploymentKey: 'W3B4QJ8fPQpPqDWzDPdDqRgnSeJ54ksvOXqog',
                    updateDialog: {
                        // 非强制更新时取消按钮
                        optionalIgnoreButtonLabel: '稍后',
                        // 非强制更新时按钮
                        optionalInstallButtonLabel: '我想要更新呀',
                        // 非强制更新时文字
                        optionalUpdateMessage: '有新版本了，是否更新？',
                        // 强制更新时文字
                        mandatoryUpdateMessage: '这个版本你必须下载',
                        // 强制更新时按钮提示
                        mandatoryContinueButtonLabel: '你不下也得下',

                        title: '有更新了'
                    },
                    installMode: CodePush.InstallMode.IMMEDIATE
                }, function (progress) {

                    this.progress = progress

                })
            }
        });

    }

    // jiYanResult = null;
	// doSomething = ()=>console.warn('I will request service with jiyan:',this.jiYanResult)
	// onJiYanResult = result=>(this.jiYanResult = result.nativeEvent ) && this.doSomething ();
	// // startCaptcha = ()=>this.jiYanResult ? this.doSomething() : this.refs.jiYan.startCaptcha();
	// startCaptcha = ()=>this.refs.jiYan.startCaptcha();



	render() {
        return (
            <View style={styles.container}>
	            {/*<JiYan*/}
		            {/*API1="user/pullGeetest?client_type='APP'"*/}
		            {/*API2="user/checkGeetest"*/}
		            {/*onJiYanResult={this.onJiYanResult}*/}
		            {/*ref="jiYan"*/}
		            {/*visible={false}*/}
	            {/*/>*/}
	            <Button title="模拟登录" onPress={this.startCaptcha}/>
                <Text allowFontScaling={false} style={styles.welcome}>
                    this is testPage!!!and this is !!

                    这个版本是 v0.0.1!!!

                    进度：{this.progress}

                    {this.$store.state.testNum}
                </Text>
                <Text allowFontScaling={false}>测试下event，{this.testEventNum}</Text>
                <Text allowFontScaling={false}>测试下network{this.someData}</Text>
                <Text allowFontScaling={false}>测试下socket{this.socketTime}</Text>
                <Text allowFontScaling={false}>测试下i18n{this.$i18n.t('TEST.lang')}</Text>
                <Button title="test add" onPress={() => {
                    this.$globalFunc.testFunc()
                    this.$store.state.testNum++
                }}/>

                <Button title="测试i18n" onPress={() => {
                    console.warn("this is 现在的i18n", this.$i18n.currentLocale())
                    this.$i18n.locale = this.$i18n.currentLocale() == 'EN' ? 'CH' : 'EN'
                }}/>
                <Button title="test commit" onPress={() => {
                    // this.$globalFunc.testFunc()
                    // this.$store.state.testNum++
                    this.$store.commit('TEST_FUNC', 5)
                }}/>
                <Button title="DrawerOpen" onPress={() => {
                    console.warn("this is Drawer", this.$router)
                    this.$router.drawerPush('DrawerOpen')
                }}/>
                <Button title="测试下event" onPress={() => {
                    this.notify({key: 'TEST_EVENT'}, 3)
                }}/>

                <Button title="测试发送请求" onPress={() => {
                    // this.notify({key: 'TEST_EVENT'}, 3)
                    this.$http.send('GET_CURRENCY', {bind: this, callBack: this.testHttp})
                }}/>

                <Button title="去home" onPress={() => {
                    // this.notify({key: 'TEST_EVENT'}, 3)
                    // console.warn("this is push", this.$router.state)
                    this.$router.push('Home')
                }}/>
                <Button title="测试后退" onPress={() => {
                    this.$router.goBack()
                }}/>
                <Button title="测试热更新" onPress={this.testHotUpdate}/>
                <Button title="测试跳转tag" onPress={this.changeTab}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
})
