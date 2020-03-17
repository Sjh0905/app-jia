/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react'
import propTypes from 'prop-types'
import {action, observable} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import StyleConfigs from '../../style/styleConfigs/StyleConfigs'

@observer
export default class App extends RNComponent {

    /*----------------------- props -------------------------*/

    static propTypes = {
        text: propTypes.string,
        onPress: propTypes.func.isRequired,
        activeOpacity: propTypes.number,
        style: propTypes.any,
        textStyle: propTypes.any,
    }

    static defaultProps = {
        activeOpacity: StyleConfigs.activeOpacity,
    }


    /*----------------------- data -------------------------*/

    @observable
    template = 0

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
    templateFunc = () => {

    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <TouchableOpacity
                activeOpacity={this.props.activeOpacity}
                onPress={this.props.onPress}
                style={this.props.style}
            >
                <Text
                    allowFontScaling={false}
                    style={this.props.textStyle}
                >{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}
