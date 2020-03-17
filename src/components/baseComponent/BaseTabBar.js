/**
 * Created by hjx on 2017/9/14.
 */
import React, {Component} from "react"
import {Image, Text, TouchableOpacity, View} from "react-native"
import PropTypes from "prop-types"
import TabBarItem from "./BaseTabBarItem"
import styles from '../../style/baseComponentStyle/BaseTabBarStyle'


export default class TabBar extends Component {

    static Item = TabBarItem

    static propTypes = {
        icon: PropTypes.any,
        selectedIcon: PropTypes.any,
        text: PropTypes.string,
        selectedText: PropTypes.string,
        stateChanged: PropTypes.func,
        indexNum: PropTypes.number,
        setIndex: PropTypes.func,
    }
    static defaultProps = {
        text: "图标",
        selected: 1,
    }

    activity = [true]


    constructor(...props) {
        super(...props)
        this.state = {
            selected: 0,
        }
    }


    selectChange(index) {
        if (this.state.selected == index) return
        this.props.setSelected && this.props.setSelected(index)
        this.props.stateChanged && this.props.stateChanged(index)
    }


    componentWillReceiveProps(nextProps) {
        this.setState({selected: nextProps.indexNum})
        this.activity[nextProps.indexNum] = true
    }


    render() {

        return (
            <View style={[styles.container]}>
                <View style={[styles.childrenView]}>
                    {
                        this.props.children ? React.Children.map(this.props.children, (child, index) => {
                            return (this.activity[index] &&
                                <View
                                    key={"child" + index}
                                    style={[this.state.selected == index ? styles.show : styles.hidden]}
                                >
                                    {child}
                                </View>
                            )
                        }) : (<Text allowFontScaling={false} style={[styles.emptyView]}>no Children View！</Text>)
                    }

                </View>
                <View style={[styles.nav]}>
                    {
                        React.Children.map(this.props.children, (child, index) => {
                            let iconSource = child.props.icon
                            let selectedIconSource = child.props.selectedIcon || child.props.icon
                            let text = child.props.text
                            let selectedText = child.props.selectedText || child.props.text
                            let selectedStyle = child.props.selectedStyle || styles.selectedText
                            let textStyle = child.props.textStyle || styles.text
                            let iconStyle = child.props.iconStyle || styles.icon
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.selectChange(index)
                                    }}
                                    key={"nav" + index}
                                    style={styles.navTouchable}
                                >
                                    <Image
                                        source={this.state.selected == index ? selectedIconSource : iconSource}
                                        style={[iconStyle]}
                                    />
                                    <Text
                                        allowFontScaling={false}
                                        style={[textStyle, this.state.selected == index ? selectedStyle : null]}>{this.state.selected == index ? text : selectedText}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
            </View>
        )
    }
}

