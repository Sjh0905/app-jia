/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import TestNav from './TestNavPage'
import NavHeader from './baseComponent/NavigationHeader'
import BaseStyles from '../style/BaseStyle'

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


const icon = [require("../assets/HomePage/home-page-home.png"), require("../assets/HomePage/home-page-market.png"), require("../assets/HomePage/home-page-trade.png"), require("../assets/HomePage/home-page-assets.png"), require("../assets/HomePage/home-page-mine.png")]
const selectedIcon = [require("../assets/HomePage/home-page-home-selected.png"), require("../assets/HomePage/home-page-market-selected.png"), require("../assets/HomePage/home-page-trade-selected.png"), require("../assets/HomePage/home-page-assets-selected.png"), require("../assets/HomePage/home-page-mine-selected.png")]


// type Props = {};
// export default class App extends Component<Props> {
@observer
export default class App extends RNComponent {

    @observable
    otherTestNum = 0

    componentWillMount() {
        this.listen({
            key: 'TEST_EVENT',
            func: this.testEvent
        })
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        console.warn("组件卸载！home")
    }

    @action
    testEvent(num) {
        this.otherTestNum++
        console.warn("测试home的event!", this.otherTestNum)
    }

    stateChanged(index) {
        console.log(index)
    }

    render() {
        return (
            <View style={[styles.container, BaseStyles.bgColor]}>
                <NavHeader
                    headerTitle={'注册'}
                    headerTitleOnPress={()=>{
                        console.warn("aaa")
                    }}
                    goBack={()=>{
                        console.warn("hh")
                    }}
                    headerRightTitle={'测试'}

                />

                <Text allowFontScaling={false} style={styles.welcome}>
                    This is EUNEX
                    版本：1 v0.0.1
                </Text>
                <Text allowFontScaling={false} style={styles.welcome}>
                    测试一下event事件
                    {this.otherTestNum}
                </Text>
                <Text allowFontScaling={false} style={styles.instructions}>
                    and this is test Num {this.$store.state.testNum}
                </Text>
                <Text allowFontScaling={false} style={styles.instructions}>
                    {instructions}
                </Text>
                <Button title="DrawerOpen" onPress={() => {
                    this.$router.drawerPush('DrawerOpen')
                }}/>

                <Button title="Number++" onPress={() => {
                    this.$globalFunc.testFunc()
                    this.$store.state.testNum++
                }}/>
                <Button title="测试下event" onPress={() => {
                    this.notify({key: 'TEST_EVENT'}, 3)
                }}/>
                <Button title="去测试页" onPress={() => {
                    // this.notify({key: 'TEST_EVENT'}, 3)
                    this.$router.push('Login')
                    console.warn("this is router", this.$router.state)
                }}/>
                <Button title="测试后退" onPress={() => {
                    this.$router.goBack()
                }}/>

                <Text allowFontScaling={false} style={styles.testStyle}>测试宽度</Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },

    testStyle:{
        width:getWidth(40),
        height:getHeight(40),
        borderStyle:'solid',
        borderColor:'red',
        borderWidth:2
    }
});
