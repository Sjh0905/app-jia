import {StyleSheet} from "react-native"
import device from "../configs/device/device";
import StyleConfigs from '../style/styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    bg:{
        backgroundColor: StyleConfigs.signLoginBackColor
    },
    container: {
        flex: 1,
	    paddingTop: getDeviceTop()
    },
    loginLogo: {
        width: getWidth(356),
        height: getWidth(72),
        // width: getWidth(162 * 2),
        // height: getWidth(42 * 2),
        // marginTop: getHeight(230),
        // margin: 'auto',
        // marginTop: getHeight(200 - 128 + 50),
        // marginBottom: getHeight(112-30-20),
        marginTop: getHeight(25 *2+(42-60/2)),
        marginBottom: getHeight(11 * 2+(42-60/2)),
    },
    inputBox: {
        marginTop:getHeight(96),
        width: '100%'
    },
    inputDetail: {},
    textInputDetail: {
        width: '90%',
        fontSize: 15,
        color: '#fff',
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: 'transparent'
    },
    iconBox: {},
    emailBox: {},
    pswBox: {},
    inputIcon: {
        width: getWidth(44),
        height: getWidth(44),
    },
    emailIcon: {
        // width: getWidth(38),
        // height: getWidth(40),
    },
    mobileIcon:{
        // width: getWidth(42),
        // height: getWidth(44),
    },
    pswIcon: {
        // width: getWidth(32),
        // height: getWidth(44),
    },

    wrongAns: {
        width: '100%',
        alignSelf: 'flex-end',
        paddingTop: getHeight(15),
        fontSize: 12,
    },
    forgetPswBox: {
        // alignItems: 'flex-end',
        paddingTop: getHeight(28),
        paddingBottom: getHeight(28),
        // backgroundColor:'red'
    },
    forgetPsw: {
        color: StyleConfigs.txt3576F5,
        fontSize: StyleConfigs.fontSize14,
    },

    loginBtn: {
        // height: getHeight(88),
        // width: '100%',
        marginTop: getHeight(66),
    },
    loginBtnText: {
        fontSize: 15,
        color: '#fff',
    },

    // 快去注册
    goToRegisterBox: {
        marginTop:getHeight(260),
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: getHeight(34),
        paddingBottom: getHeight(34),
        // backgroundColor:'red'
    },
    haveNoAccount: {
        fontSize: StyleConfigs.fontSize16,
        // color: StyleConfigs.txtC5CFD5
    },
    goToRegister: {
        fontSize: StyleConfigs.fontSize16,
        paddingLeft: getWidth(2)
    },
    topBox:{
        paddingLeft: getWidth(60),
        // alignItems:'center'
    },
    tabBox:{
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        height: getHeight(70),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch'
    },
    loginTab:{
        height:getHeight(70),
        alignItems: 'center',
        width: getWidth(200),
        justifyContent: 'center',
        // borderBottomWidth: getHeight(4),
        // borderBottomColor: 'transparent'
    },
    tabText:{
        fontSize: 16,
        opacity:0.8
    },
    selectedTab:{
        // height:getHeight(66),
        // borderBottomWidth: getHeight(4),
        // borderBottomColor: '#3576F5',
    },
    selectedTabText:{
        color: '#3576F5',
        opacity:1
    },
    tabUnderlineStyle:{
        position:'absolute',
        bottom:0,
        height:getHeight(4),
        width:getWidth(128),
        // backgroundColor:'yellow',
        borderRadius:getHeight(4)
    },
    selectedTBLine:{
        backgroundColor:'#3576F5'
    }

})

export default styles