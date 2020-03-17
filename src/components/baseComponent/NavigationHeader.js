/**
 * Created by hjx on 2017/9/15.
 */
import React, {Component} from "react"
import {Dimensions, Image, Platform, Text, TouchableOpacity, View} from "react-native"
import PropTypes from "prop-types"
import styles from '../../style/baseComponentStyle/NavigationHeaderStyle'
import BaseStyles from '../../style/BaseStyle'
import StyleConfigs from "../../style/styleConfigs/StyleConfigs";

import {observer} from 'mobx-react'
import {action, observable,computed} from 'mobx'

let getWidth = (px) => Dimensions.get("window").width / DefaultWidth * px
let getHeight = (px) => Dimensions.get("window").height / DefaultHeight * px


const goBackIcon = require('../../assets/NavigationHeader/go-back-icon.png')

const isIOS = Platform.OS == 'ios' ? true : false

@observer
export default class NavHeader extends Component {
    static propTypes = {
        goBack: PropTypes.func,


	    touchCompLeft:PropTypes.any,
	    touchCompLeftClick:PropTypes.func,

	    touchComp: PropTypes.any,
	    touchCompClick: PropTypes.func,

        touchCompRight:PropTypes.any,
        touchCompRightClick:PropTypes.func,

        // header
        header: PropTypes.any,
        headerTitle: PropTypes.string,
        headerTitleOnPress: PropTypes.func,

        // 右侧是组件的话
        headerRight: PropTypes.any,
        // 左侧是组件的话
        headerLeft: PropTypes.any,
        headerleftBoxStyle: PropTypes.any,

        // 右侧如果只有文字的话
        headerRightTitle: PropTypes.string,
        headerRightOnPress: PropTypes.func,
        // 左侧如果有文字的话
        headerLeftTitle: PropTypes.string,
        headerLeftOnPress: PropTypes.func,
        //样式
        navStyle: PropTypes.any,
        leftTitleStyle: PropTypes.any,
        rightTitleStyle: PropTypes.any,

        //事件
        onLayout: PropTypes.func
    }

    static defaultProps = {
        navStyle:{}
    }

    constructor(...params) {
        super(...params)
        //this.navColor = this.props.navColor;
        //alert(this.navColor)
    }

    @observable
    navColor = null;

    @action
    setColor = (navColor)=>{
        this.navColor = navColor;
    }

    // 右侧组件
    renderRight() {

        if (this.props.touchCompRight) {
            return <TouchableOpacity
                activeOpacity={StyleConfigs.activeOpacity}
                style={[styles.rightBox]}
                onPress={this.props.touchCompRightClick}
            >
                {this.props.touchCompRight}
            </TouchableOpacity>
        }

        // 如果有整个组件，优先整个组件
        if (this.props.headerRight) {
            return <View
                style={[styles.rightBox]}
            >
                {this.props.headerRight}
            </View>
        }

        // 如果有Title，则放title
        if (this.props.headerRightTitle) {
            return <View
                style={[styles.rightBox]}
            >
                <TouchableOpacity
                    style={[styles.rightTitleBox]}
                    onPress={this.props.headerRightOnPress}
                    activeOpacity={StyleConfigs.activeOpacity}

                >
                    <Text allowFontScaling={false} style={[styles.rightTitle,this.props.rightTitleStyle]}>{this.props.headerRightTitle}</Text>
                </TouchableOpacity>
            </View>
        }

        return null
    }

    // 左侧组件
    renderLeft() {
	    if (this.props.touchCompLeft) {
		    return <TouchableOpacity
                activeOpacity={StyleConfigs.activeOpacity}
			    style={[styles.leftBox]}
			    onPress={this.props.touchCompLeftClick}
		    >
			    {this.props.touchCompLeft}
		    </TouchableOpacity>
	    }




        // 如果有left组件，优先用整个组件
        if (this.props.headerLeft) {
            return <View
                style={[styles.leftBox,this.props.headerleftBoxStyle]}
            >
                {this.props.headerLeft}
            </View>
        }


        // 如果有Title，则用Title
        if (this.props.headerLeftTitle) {

            return <View
                style={[styles.leftBox]}
            >
                <TouchableOpacity
                    style={[styles.leftTitleBox]}
                    onPress={this.props.headerLeftOnPress}
                    activeOpacity={StyleConfigs.activeOpacity}

                >
                    <Text allowFontScaling={false} style={[styles.leftTitle,this.props.leftTitleStyle]}>{this.props.headerLeftTitle}</Text>
                </TouchableOpacity>
            </View>
        }

        // 如果有goBack，则用goBack
        if (this.props.goBack) {
            return <View
                style={styles.leftBox}
            >
                <TouchableOpacity
                    style={[styles.goBackBox]}
                    onPress={this.props.goBack}
                    activeOpacity={StyleConfigs.activeOpacity}

                >
                    <View style={[styles.goBack]}>
                        <Image
                            source={goBackIcon}
                            style={styles.goBackIcon}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        }


        return null
    }

    renderMiddle() {

	    if (this.props.touchComp) {

		    return <TouchableOpacity
                activeOpacity={StyleConfigs.activeOpacity}
			    style={[styles.headerBox]}
			    onPress={this.props.touchCompClick}
		    >
			    {this.props.touchComp}
		    </TouchableOpacity>
	    }




        // 如果有整个组件，则优先用整个组件
        if (this.props.header) {

            return <View
                style={[styles.headerBox]}
            >
                {this.props.header}
            </View>
        }

        // 如果header有点击事件
        if (this.props.headerTitleOnPress) {

            return <TouchableOpacity
                style={[styles.headerBox]}
                onPress={this.props.headerTitleOnPress}
                activeOpacity={StyleConfigs.activeOpacity}

            >
                <Text
                    allowFontScaling={false}
                    style={[styles.headerTitleStyle,this.props.headerTitleStyle || {}]}
                >
                    {this.props.headerTitle}
                </Text>
            </TouchableOpacity>
        }


        return <Text
            allowFontScaling={false}
            style={[styles.headerTitleStyle,this.props.headerTitleStyle || {}]}
        >{this.props.headerTitle}</Text>

    }



    render() {
        let renderLeft = this.renderLeft()
        let renderRight = this.renderRight()
        let renderMiddle = this.renderMiddle()

        return (
            <View onLayout={this.props.onLayout || (()=>{})} style={[styles.container, BaseStyles.navBgColor0602,this.props.navStyle, !isIOS && styles.androidContainer, this.navColor && {backgroundColor: this.navColor}]}>
                <View style={[styles.IOSStatusBar, !isIOS && styles.androidStatusBar]}></View>
                <View
                    style={styles.navBox}
                >

                    {/*/!*左侧组件 begin*!/*/}
                    {renderLeft}


                    {/*中间标题 begin*/}
                    {renderMiddle}

                    {/*中间标题 end*/}


                    {/*右边 begin*/}
                    {renderRight}
                    {/*右边 end*/}

                </View>
            </View>
        )
    }
}
