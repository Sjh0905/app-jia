/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Animated} from 'react-native'
import {observer} from 'mobx-react'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../../style/BaseStyle'


import {SceneMap, TabBar, TabViewAnimated} from 'react-native-tab-view'

import propTypes from 'prop-types'
import StyleConfigs from "../../style/styleConfigs/StyleConfigs"


@observer
export default class App extends RNComponent {

    /*----------------------- props -------------------------*/
    static propTypes = {
        renderScreen: propTypes.any.isRequired,
        state: propTypes.any.isRequired,
        selectTxtColor: propTypes.string,
        unSelectTxtColor: propTypes.string,
        pressOpacity: propTypes.number,
        onIndexChange: propTypes.func.isRequired,
        canJumpToTab: propTypes.func.isRequired,
        tabBoxStyle: propTypes.any,
        tabStyle: propTypes.any,
        indicatorStyle: propTypes.any,
        labelStyle: propTypes.any,
        useSceneMap: propTypes.bool,
    }

    static defaultProps = {
        selectTxtColor: StyleConfigs.txtBlue,
        unSelectTxtColor: StyleConfigs.txt9FA7B8,
        pressOpacity: StyleConfigs.activeOpacity,
        tabBoxStyle: baseStyles.navTwoBgColor,
        useSceneMap: true,
        canJumpToTab: () => true,
    }


    /*----------------------- data -------------------------*/


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    /*----------------------- 函数 -------------------------*/


    // 渲染header
    _renderHeader = (props) => {
        return (
            <TabBar
                style={this.props.tabBoxStyle}
                tabStyle={this.props.tabStyle}
                indicatorStyle={this.props.indicatorStyle}
                pressOpacity={this.props.pressOpacity}
                {...props}
                renderLabel={this._renderLabel(props)}
            />)
    }

    // 渲染Label
    _renderLabel = props => ({route, index}) => {
        const inputRange = props.navigationState.routes.map((x, i) => i)
        const outputRange = inputRange.map(
            inputIndex => (inputIndex === index ? this.props.selectTxtColor : this.props.unSelectTxtColor)
        )
        const color = props.position.interpolate({
            inputRange,
            outputRange,
        })
        return (
            <Animated.Text allowFontScaling={false} style={[{color}, this.props.labelStyle]}>
                {route.title}
            </Animated.Text>
        )
    }


    /*----------------------- 挂载 -------------------------*/

    render() {

        let _renderScreen = this.props.useSceneMap ? SceneMap(this.props.renderScreen) : this.props.renderScreen

        return (
            <TabViewAnimated
                {...this.props}
                navigationState={this.props.state}
                renderScene={_renderScreen}
                renderHeader={this._renderHeader}
                onIndexChange={this.props.onIndexChange}
                canJumpToTab={this.props.canJumpToTab}
            ></TabViewAnimated>
        )
    }
}
