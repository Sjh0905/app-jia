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
import closeIcon from '../../assets/Modal/close-icon.png';
import propTypes from 'prop-types'

@observer
export default class App extends RNComponent {

    static propTypes = {
        title: propTypes.string,
        // message: propTypes.any,
        onSure: propTypes.func,
        onCancel: propTypes.func,
        onClose: propTypes.func,
        close: propTypes.bool,
        cancelText: propTypes.string,
        okText: propTypes.string,
        style:propTypes.any,
        alertBoxStyle:propTypes.any,
        alertBtnBlueStyle:propTypes.any,
        alertMessageStyle:propTypes.any
    }


    /*----------------------- data -------------------------*/

    @observable
    message = '';

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        if(typeof(this.props.message) === 'string'){
            this.message = [this.props.message];
        }
        if(this.props.message instanceof Array){
            this.message = this.props.message;
        }
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    @action
    onCancel = ()=>{}

    @action
    onSure = ()=>{}

    @action
    onClose = ()=>{}

    /*----------------------- 挂载 -------------------------*/

    render() {
        return <View style={[styles.alertBox,this.props.alertBoxStyle || {}]}>
            <View style={styles.alertBoxBackground}></View>
            <View style={[styles.alert,this.props.style || {}]}>
                {this.props.close && <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} style={styles.alertClose} onPress={this.props.onClose || this.onClose}>
                    <Image style={styles.alertIcon} source={closeIcon} resizeMode={'stretch'}/>
                </TouchableOpacity>}
                {!!this.props.title && <View style={styles.alertTitle}>
                    <Text allowFontScaling={false} style={styles.alertTitleText}>{this.props.title}</Text>
                </View>}
                <View style={[styles.alertMessage,this.props.alertMessageStyle || {}]}>
                    {
                        this.message.map((v,i)=>{
                            return <Text allowFontScaling={false} style={styles.alertMessageText} key={i}>{v}</Text>
                        })
                    }
                </View>
                <View style={styles.alertBtnBox}>
                    {
                        this.props.cancelText
                        &&
                        <BaseButton style={styles.alertBtnWhite} textStyle={styles.alertBtnTextBlue} text={this.props.cancelText || '取消'} onPress={this.props.onCancel || this.onCancel}/>
                        ||
                        null
                    }
                    <BaseButton style={[styles.alertBtnBlue,this.props.alertBtnBlueStyle || {}]} textStyle={styles.alertBtnTextWhite} text={this.props.okText || '确定'} onPress={this.props.onSure || this.onSure}/>
                </View>
            </View>
        </View>
    }
}
const styles = StyleSheet.create({
    alertBox:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBoxBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#000',
        opacity: 0.6
    },
    alert:{
        backgroundColor: '#fff',
        width: getWidth(640),
        height: getHeight(314),
        borderRadius: 8,
        // marginTop: getHeight(300)
    },
    alertClose:{
        width: getWidth(40),
        height: getWidth(40),
        position: 'absolute',
        right: 0,
        top: getWidth(-60)
    },
    alertIcon:{
        width: '100%',
        height: '100%'
    },
    alertTitle:{
        marginLeft: getWidth(40),
        marginRight: getWidth(40),
        height: getHeight(76),
        borderColor: '#f2f2f2',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertTitleText:{
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold'
    },
    alertMessage:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal:getWidth(40)
    },
    alertMessageText:{
        fontSize: 14,
        color: '#313131'
    },
    alertBtnBox:{
        height: getHeight(72),
        marginBottom: getHeight(40),
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    alertBtnWhite:{
        width:getWidth(240),
        height: getHeight(72),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: StyleConfigs.btnBlue,
        backgroundColor: StyleConfigs.btnWhite,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBtnBlue:{
        width:getWidth(240),
        height: getHeight(72),
        borderRadius: 4,
        borderWidth: 1,
        borderColor: StyleConfigs.btnWhite,
        backgroundColor: StyleConfigs.btnBlue,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertBtnTextBlue:{
        fontSize: 15,
        color: StyleConfigs.txtBlue
    },
    alertBtnTextWhite:{
        fontSize: 15,
        color: StyleConfigs.txtWhite
    }
})