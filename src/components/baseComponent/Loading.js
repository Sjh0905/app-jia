/**
 * hjx 2018.4.16
 */

import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {observer} from 'mobx-react'
import propTypes from 'prop-types'
// import {observable} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import styles from '../../style/baseComponentStyle/LoadingStyle'


@observer
export default class App extends RNComponent {


    static propTypes = {
        // 是否预留下nav的高度
        leaveNav: propTypes.bool,
    }

    static defaultProps = {
        // 默认为否
        leaveNav: false,
    }


    constructor() {
        super()
    }


    componentWillMount() {

    }

    onRequestClose() {

    }


    render() {


        return (

            <View
                style={[styles.loadingBox, this.props.leaveNav && styles.leaveNavStyle]}
            >
                <ActivityIndicator
                    style={[styles.loading, this.props.leaveNav && styles.leaveNavLoading]}
                ></ActivityIndicator>
            </View>
        )
    }
}
