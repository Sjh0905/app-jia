/**
 * hjx 2018.4.16
 */

import React from 'react';
import {StyleSheet, View, Modal,Text,TouchableOpacity,Image} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../../style/BaseStyle'
import StyleConfigs from '../../style/styleConfigs/StyleConfigs'
import BaseButton from './BaseButton'
import signBaseStyles from "../../style/SignBaseStyle";
import CheckBox from './BaseCheckBox'
import close from '../../assets/AdditionalRewards/close.jpg';

@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    @observable
    agreement = false;

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

    // 后退
    @action
    onPress = ()=>{
        this.props.onPress && this.props.onPress({
            agreement:this.agreement
        });
    }

    @action
    onClose = ()=>{
        this.props.onClose && this.props.onClose({
            agreement:this.agreement
        });
    }

    @action
    clickAgreement = (value)=>{
        this.agreement = !this.agreement;
    }

    /*----------------------- 挂载 -------------------------*/

    render() {
        return <Modal
                transparent={true}
                // animationType={'fade'}
                isVisible={true}
            >
                <View style={styles.background}/>
                <View style={styles.container}>
                    <View style={styles.closeBox}>
                        <TouchableOpacity activeOpacity={0.9} onPress={this.onClose} style={styles.close}>
                            <Image
                                style={styles.closeImage}
                                resizeMode={'stretch'}
                                source={close}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.alertBox}>
                        {
                            (typeof(this.props.title) == 'string' || !this.props.title)
                            && <Text allowFontScaling={false} style={[styles.title,this.props.titleStyle]}>{this.props.title || '提示'}</Text>
                            || this.props.title
                        }
                        <View style={styles.line}/>
                        {
                            (typeof(this.props.content) == 'string' || !this.props.content)
                            && <Text allowFontScaling={false} style={[styles.content,this.props.contentStyle]}>{this.props.content || 'alert'}</Text>
                            || this.props.content
                        }
                        {
                            (typeof(this.props.checkboxText) === 'string')
                            &&
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.checkboxBox}
                                onPress={this.clickAgreement}
                            >
                                <CheckBox
                                    unCheckedBorderWidth={1}
                                    unCheckedBorderColor={'#000'}
                                    checked={this.agreement}
                                    keys={1}
                                    onPress={this.clickAgreement}
                                />
                                <View style={styles.checkBoxSplit} />
                                <Text allowFontScaling={false} style={baseStyles.textColor}>{this.props.checkboxText}</Text>
                            </TouchableOpacity>
                            ||
                            this.props.checkbox
                        }
                        {
                            (typeof(this.props.buttonText) == 'string' || !this.props.buttonText)
                            &&
                            <BaseButton
                                onPress={this.onPress}
                                style={[styles.button,this.props.buttonStyle,!this.agreement && this.props.buttonDisabledStyle]}
                                textStyle={[styles.buttonText]}
                                activeOpacity={!this.agreement && this.props.buttonDisabledStyle && 1 || StyleConfigs.activeOpacity}
                                text={this.props.buttonText || 'button'}
                            >
                            </BaseButton>
                            || this.prop.button
                        }
                    </View>
                </View>
            </Modal>
    }
}
const styles = StyleSheet.create({
    background:{
        position: 'absolute',
        height: global.DeviceHeight,
        width: global.DeviceWidth,
        top: 0,
        left: 0,
        backgroundColor: '#000',
        opacity: 0.5
    },
    container:{
        flex:1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent:'center'
    },
    closeBox:{
        width: getWidth(640),
        flexDirection: 'row-reverse'
    },
    close:{
        width: getWidth(40),
        height: getWidth(40),
        marginBottom: 10,
    },
    closeImage:{
        width: getWidth(40),
        height: getWidth(40),
    },
    alertBox:{
        width: getWidth(640),
        borderRadius: 2,
        backgroundColor: 'white'
    },

    title:{
        color: StyleConfigs.txtRed,
        fontSize: getWidth(36),
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 15,
    },
    line:{
        alignSelf: 'center',
        width: getWidth(560),
        height: 1,
        borderTopColor: StyleConfigs.borderBottomColor,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    content:{
        width: getWidth(560),
        alignSelf: 'center',
        paddingTop: getHeight(34),
        paddingBottom: getHeight(12)
    },

    button: {
        alignSelf: 'center',
        width: getWidth(280),
        // marginLeft: getWidth(180),
        // marginRight: getWidth(180),
        marginTop: getHeight(20),
        marginBottom: getHeight(20),
        height: getHeight(76),
        backgroundColor: StyleConfigs.btnBlue,
        borderRadius: StyleConfigs.borderRadius2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 17,
        color: StyleConfigs.txtWhite,
    },

    checkboxBox:{
        marginTop: 5,
        marginBottom: 5,
        width: getWidth(560),
        alignSelf: 'center',
        flexDirection: 'row'
    },
    checkboxText:{
        color:'#666'
    },
    checkBoxSplit:{
        width:getWidth(14)
    }
})