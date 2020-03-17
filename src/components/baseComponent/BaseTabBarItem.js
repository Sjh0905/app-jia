/**
 * Created by hjx on 2017/9/15.
 */

import React, {Component} from "react"
import {View} from "react-native"
import styles from '../../style/baseComponentStyle/BaseTabBarItemStyle'

export default class TabBarItem extends Component {
    constructor(...props) {
        super(...props)
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        )
    }
}
