import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'
import device from "../configs/device/device";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
	container2:{
    	backgroundColor:StyleConfigs.navBgColor0602,
		paddingTop:getDeviceTop()

	},

    inputContainer: {
        paddingTop: getHeight(34),
    },

    inputBoxIconBox: {
        width: getWidth(66),
    },

    inputBoxIcon: {
        width: '10%',
    },

    inputBoxInput: {
        width: '90%',
        height: getHeight(44),
        fontSize: 15,
        color: '#fff'
    },

    shortInputBox: {
        width: '100%',
        height: getHeight(80),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: getHeight(36),
        justifyContent: 'space-between'
    },
    shortInputBoxIcon: {
        width: '40%',
    },
    shortInput: {
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        height: getHeight(44),
        fontSize: 15,
        color: '#fff'
    },
    shortInputBtnBox: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        height: getHeight(44),
        fontSize: 15,
        color: '#fff',
        justifyContent: 'space-between'
    },
    inputBoxInputShort: {
        // backgroundColor: '#fff',
        width: '80%',
        height: getHeight(44),
        fontSize: 15,
        color: '#fff',
    },
    inputBoxInputLine: {
        width: getWidth(2),
        height: getHeight(24),
        backgroundColor: 'rgba(151,151,151,0.4)',
    },

    inputBoxInputBtn: {
        // backgroundColor: '#fff',
        // width: '80%',
        height: getHeight(44),
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',

        flexDirection: 'row',
        alignItems: 'center',
    },
    inputBoxInputBtnText: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
    },
    emailIcon: {
        width: getWidth(44),
        height: getWidth(33),
    },
    emailVerifyIcon: {
        width: getWidth(39),
        height: getWidth(44),
    },
    pswIcon: {
        width: getWidth(37),
        height: getWidth(44),
    },
    pswConfirmIcon: {
        width: getWidth(37),
        height: getWidth(44),
    },
    userIcon: {
        width: getWidth(42),
        height: getWidth(42),
    },
    wrongAns: {
        width: '90%',
        alignSelf: 'flex-end',
        paddingTop: getHeight(15),
        // paddingBottom: getHeight(10),
        fontSize: 12,
    },

    agreementBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: getHeight(28),
    },
    agreeAgreement: {
        paddingLeft: getWidth(14),
        fontSize: 12,
    },
    userAgent: {
        fontSize: 12,
    },
    btn: {
        marginTop: getHeight(98),
        height: getHeight(88),
        borderRadius:2
    },
    btnText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    haveAccountBox: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: getHeight(18),
        paddingTop: getHeight(36),
        // backgroundColor:'red'
    },
    haveAccountText: {
        color: StyleConfigs.txt8994A5,
        fontSize: 16,

    },

    haveAccountToLoginText: {
        fontSize: 16,
        paddingLeft: getWidth(2),
    },
    tabBox:{
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        height: getHeight(80),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        backgroundColor:StyleConfigs.navBgColor0602
    },
    loginTab:{
        height:getHeight(80),
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
    },
    inputIcon: {
        width: getWidth(44),
        height: getWidth(44),
    },
    mobileIcon:{
        // color:'#fff'
        // width: getWidth(42),
        // height: getWidth(44),
    },



	areaWrap:{
    	flexDirection:'row',
    	justifyContent:'space-between',
		alignItems:'center',
		width:getWidth(140),
		paddingRight: getWidth(20)
	},
	areaText:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontSize: 16,
		color: '#172a4d',
	},

	triangleViewStyle:{


		width:0,
		height:0,
		borderStyle:'solid',
		borderWidth:getWidth(8),
		marginTop:getWidth(8),
		borderTopColor:StyleConfigs.placeholderTextColor,//下箭头颜色
		borderLeftColor:'transparent',//右箭头颜色
		borderBottomColor:'transparent',//上箭头颜色
		borderRightColor:'transparent'//左箭头颜色

	}


})

export default styles