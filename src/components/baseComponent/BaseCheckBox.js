/**
 * hjx 2018.4.16
 */

import React from 'react';
import {Animated, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import styles from '../../style/baseComponentStyle/BaseCheckBoxStyle'
import propTypes from 'prop-types'
import StyleConfigs from '../../style/styleConfigs/StyleConfigs'
import CheckedIcon from '../../assets/BaseCheckBox/base-check-box-checked-big.png'

@observer
export default class App extends RNComponent {


    /*----------------------- props -------------------------*/
    static propTypes = {
        style: propTypes.any,
        checked: propTypes.bool.isRequired,
        keys: propTypes.any.isRequired,
        onPress: propTypes.func.isRequired,
        width: propTypes.number,
        checkedBg: propTypes.string,
        borderRadius: propTypes.number,
        unCheckedBorderColor: propTypes.string,
        unCheckedBorderWidth: propTypes.number,
        activeOpacity: propTypes.number,
        timeDuring: propTypes.number

    }

    static defaultProps = {
        width: 28,
        unCheckedBorderColor: StyleConfigs.borderA2B5D9,
        unCheckedBorderWidth: 1,
        borderRadius: 2,
        checkedBg: StyleConfigs.btnBlue,
        activeOpacity: 1,
        timeDuring: 100,
    }


    /*----------------------- data -------------------------*/

    @observable
    loading = false


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        this.state = {
            checkedAnimated: new Animated.Value(0),
            unCheckedAnimated: new Animated.Value(1),
        }
    }


    /*----------------------- 函数 -------------------------*/

    @action
    goBack = () => {
        this.$router.goBack()
    }

    // 点击
    @action
    pressItem = () => {
        this.props.onPress && this.props.onPress(this.props.keys)

    }

    componentWillReceiveProps(props) {
        let toValue = 0
        if (props.checked) {
            toValue = 1
        }

        // console.warn('to value',toValue)

        Animated.timing(this.state.checkedAnimated, {
            toValue: toValue,
            duration: this.props.timeDuring
        }).start()
        Animated.timing(this.state.unCheckedAnimated, {
            toValue: 1 - toValue,
            duration: this.props.timeDuring
        }).start()

    }


    /*----------------------- 挂载 -------------------------*/

    render() {

        if (this.props.checked) {
            Animated.timing(this.state.checkedAnimated, {
                toValue: 1,
                duration: this.props.timeDuring
            }).start()
            Animated.timing(this.state.unCheckedAnimated, {
                toValue: 0,
                duration: this.props.timeDuring
            }).start()
        }


        let propStyles = StyleSheet.create({
            container: {
                width: getWidth(this.props.width),
                height: getHeight(this.props.width),
                borderRadius: this.props.borderRadius,
            },
            unChecked: {
                borderColor: this.props.unCheckedBorderColor,
                borderWidth: this.props.unCheckedBorderWidth,
                borderRadius: this.props.borderRadius,
            },
            checked: {
                backgroundColor: this.props.checkedBg,
                borderRadius: this.props.borderRadius,
            },

        })


        return (
            <TouchableOpacity
                style={[styles.container, propStyles.container]}
                onPress={this.pressItem}
                activeOpacity={this.props.activeOpacity}
            >
                <Animated.View
                    style={[styles.checkBox, styles.unChecked, propStyles.unChecked, {
                        opacity: this.state.unCheckedAnimated
                    }]}>
                </Animated.View>

                <Animated.View
                    style={[styles.checkBox, styles.checked, propStyles.checked, {
                        opacity: this.state.checkedAnimated
                    }]}
                >
                    <Image source={CheckedIcon} style={[styles.checkIcon]}/>
                </Animated.View>


            </TouchableOpacity>
        )
    }
}
