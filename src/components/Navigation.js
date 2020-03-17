/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {observer} from 'mobx-react'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import {StackNavigator} from 'react-navigation'

import StackRouterConfigs from '../configs/navigationConfigs/StackRouterConfigs'
import StackRouterOptions from '../configs/navigationConfigs/StackRouterOptions'

import JiYan from './baseComponent/JiYan'
import baseStyles from "../style/BaseStyle";


const Nav = StackNavigator(StackRouterConfigs, StackRouterOptions)

@observer
export default class App extends RNComponent {


    // 渲染极验
    renderJiYan = () => {
        if (Platform.OS == 'ios')
            return (
                <View style={[baseStyles.hidden]}>
                    <JiYan
                        API1={"/user/pullGeetest?client_type='APP'"}
                        API2={'/user/checkGeetest'}
                        onJiYanResult={this.onJiYanResult}
                    />
                </View>
            )
        return (
            <View>

            </View>
        )
    }


    render() {
        return (
            <View style={styles.container}>
                <Nav
                    ref={navigatorRef => {
                        if (!navigatorRef || !navigatorRef._navigation) return
                        this.$router.setStackRouter(navigatorRef._navigation, navigatorRef)
                    }}
                />

                {/*极验全局 */}
                {
                    this.renderJiYan()
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
