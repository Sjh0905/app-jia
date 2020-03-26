import {StyleSheet} from "react-native"

import StyleConfigs from './styleConfigs/StyleConfigs'
import SecurityCenter from "../components/SecurityCenter";

const styles = StyleSheet.create({
    box: {
        flex: 1,
    },
    textBlue: {
        color: StyleConfigs.txtBlue,
    },
    textRed: {
        color: StyleConfigs.txtRed,
    },
    textGreen: {
        color: StyleConfigs.txtGreen,
    },
    textWhite: {
        color: StyleConfigs.txtWhite,
    },
    text6B7DA2: {
        color: StyleConfigs.txt6B7DA2,
    },
    textError: {
        color: StyleConfigs.txtError,
    },
    btnBlue: {
        backgroundColor: StyleConfigs.btnBlue,
        borderRadius: StyleConfigs.borderRadius1o5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTextColor: {
        color: StyleConfigs.txtWhite,
    },
    btnTextColorWhite: {
        color: StyleConfigs.whiteBtnColor,
    },
    btnGreen: {
        backgroundColor: StyleConfigs.btnGreen,
        borderRadius: StyleConfigs.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnRed: {
        backgroundColor: StyleConfigs.btnRed,
        borderRadius: StyleConfigs.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnRed2: {
        backgroundColor: StyleConfigs.btnRed,
        borderRadius: StyleConfigs.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnDisabled: {
        backgroundColor: StyleConfigs.btnDisabled,
        borderRadius: StyleConfigs.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnWhite: {
        backgroundColor: StyleConfigs.btnWhite,
        borderRadius: StyleConfigs.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgColor: {
        backgroundColor: StyleConfigs.bgColor,
    },
    navBgColor: {
        backgroundColor: StyleConfigs.navBgColor,
    },
    navBgColor0602: {
        backgroundColor: StyleConfigs.navBgColor0602,
    },
    navTwoBgColor: {
        backgroundColor: StyleConfigs.twoNavBgColor,
    },
    sectTitleColor:{
        backgroundColor: StyleConfigs.sectTitleColor,
    },
    textColor: {
        color: StyleConfigs.txt172A4D,
    },
    text9FA7B8: {
        color: StyleConfigs.txt9FA7B8,
    },
    textC5CFD5: {
        color: StyleConfigs.txtC5CFD5,
    },
    lineColor: {
        borderColor: StyleConfigs.lineColor,
    },
    bottomLine: {
        borderBottomColor: StyleConfigs.borderColor,
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    bottomLineFocus: {
        borderBottomColor: 'rgba(255,255,255,0.6)',
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    hidden: {
        display: 'none',
        width: 0,
        height: 0,
        opacity: 0,
    },
    paddingBox: {
        paddingLeft: getWidth(30),
        paddingRight: getWidth(30),
    },
    flexRowBetween:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    flexRowAround:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
    },
    securityCenterTitle:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize28,
        marginTop:getHeight(30),
        marginLeft:getWidth(30),
        marginBottom:getWidth(50),
        fontWeight:'bold'
    },
    modalScrollView:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor:'#00000080',
    },
    modalBtn:{
        width:'100%',
        height:50,
        backgroundColor:StyleConfigs.btnWhite,
        alignItems:'center',
        justifyContent:'center'
    },
    modalBtnborderTop:{
        borderTopColor:StyleConfigs.borderC5CFD5,
        borderTopWidth:StyleSheet.hairlineWidth,
    },
    modalPhotoBtn:{
        width:'100%',
        height:50,
        backgroundColor:StyleConfigs.btnWhite,
        borderTopColor:StyleConfigs.borderC5CFD5,
        borderTopWidth:StyleSheet.hairlineWidth,
        borderBottomColor:StyleConfigs.borderBottomColor,
        borderBottomWidth:5,
        alignItems:'center',
        justifyContent:'center'
    },
    modalBtnTxt:{
        fontSize:StyleConfigs.fontSize16,
        color:StyleConfigs.txt172A4D
    },
    modalBtnCancleTxt:{
        fontSize:StyleConfigs.fontSize16,
        color:StyleConfigs.txt9FA7B8
    },
    size10: {fontSize: 10},
    size11: {fontSize: 11},
    size12: {fontSize: 12},
    size13: {fontSize: 13},
    size14: {fontSize: 14},
    size15: {fontSize: 15},
    size16: {fontSize: 16},
})

export default styles