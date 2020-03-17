/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'

import propTypes from 'prop-types'
import StyleConfigs from "../../style/styleConfigs/StyleConfigs";
import styles from '../../style/baseComponentStyle/BaseCountDownStyle'


@observer
export default class App extends RNComponent {

    /*----------------------- props -------------------------*/

    static propTypes = {
        onPress: propTypes.func,
        boxStyle: propTypes.any,
        textStyle: propTypes.any,
        countingTextStyle: propTypes.any,
        time: propTypes.number,
        countDownCallBack: propTypes.func,
        speed: propTypes.number,
        text: propTypes.string,
        delay: propTypes.bool,
    }


    static defaultProps = {
        time: 60,
        speed: 1000,
        text: '获取验证码',
        boxStyle: styles.countDownBox,
        textStyle: styles.countDownText,
        countingTextStyle: styles.countingDownText,
        delay: false,
    }


    /*----------------------- data -------------------------*/

    @observable
    loading = false

    @observable
    time = 0

    @observable
    timeInterval = null

    @observable
    countDownBegin = false


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
        this.timeInterval && clearInterval(this.timeInterval)
    }

    /*----------------------- 函数 -------------------------*/


    // 开始倒计时
    @action
    clickToCountDown = () => {
        if (this.countDownBegin) {
            return
        }
        this.props.onPress && this.props.onPress()
        !this.props.delay && this.beginCountDown()
    }

    @action
    beginCountDown = () => {
        this.timeInterval && clearInterval(this.timeInterval)

        this.time = this.props.time - 1

        this.countDownBegin = true

        let thatTime = new Date()

        this.timeInterval = setInterval(() => {
            let now = new Date()

            this.time--

            this.time = Math.min(this.time, this.props.time - Math.floor((now - thatTime) / 1000))


            if (this.time <= 0) {
                this.timeInterval && clearInterval(this.timeInterval)
                this.countDownBegin = false
                this.props.countDownCallBack && this.props.countDownCallBack()
            }
        }, this.props.speed)
    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <TouchableOpacity
                activeOpacity={StyleConfigs.activeOpacity}
                onPress={this.clickToCountDown}
                style={[this.props.boxStyle]}
            >
                <View
                    // style={[this.props.boxStyle]}
                >
                    {/*获取验证码 begin*/}
                    {
                        this.countDownBegin ?
                            <Text allowFontScaling={false} style={[this.props.countingTextStyle]}>{this.time}s</Text>
                            :

                            <Text allowFontScaling={false} style={[this.props.textStyle]}>{this.props.text}</Text>

                    }
                    {/*获取验证码 end*/}
                </View>
            </TouchableOpacity>


        )
    }
}
