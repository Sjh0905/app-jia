import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'
import device from '../configs/device/device'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
	container2:{
    	backgroundColor:StyleConfigs.navBgColor0602,
		paddingTop: getDeviceTop(),
	},

    boxPadding: {
        paddingLeft: getWidth(30),
        paddingRight: getWidth(30),
    },
    titleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: getHeight(160),

        // borderWidth: 1,
        // borderStyle: 'solid',
        // borderColor: 'red'
    },

    currencyIcon: {
        width: getWidth(44),
        height: getHeight(44),
    },

    currencyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: getWidth(10),
    },
    rechargeAddressBox: {
        // marginTop: getHeight(40),
    },
    rechargeAddressTitle: {
        marginTop:getHeight(40),
        color: StyleConfigs.txt8994A5,
        fontSize: StyleConfigs.fontSize14,
        // fontWeight: 'bold',
    },
    rechargeAddress: {
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: getHeight(14),
        lineHeight: 20,
        height:60
    },
    rechargeAddress2: {
        marginTop:getHeight(20),
        fontSize: StyleConfigs.fontSize14,
        // fontWeight: 'bold',
    },
    copyBox: {
        alignItems: 'flex-end'
    },
    copyBtn: {
        width: getWidth(110),
        height: getHeight(50),
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: StyleConfigs.btnBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginTop: getHeight(20),
    },
    copyText: {
        fontSize: 13,
        fontWeight: 'bold'
    },

    line: {
        marginTop: getHeight(48),
        marginBottom: getHeight(32),
        height: getHeight(2),
        width: '100%',
        // backgroundColor: StyleConfigs.borderColorLight
        borderTopColor: StyleConfigs.borderBottomColor,
        borderTopWidth: StyleSheet.hairlineWidth ,
        width: getWidth(710),
        alignSelf: 'center'
    },
    qrCodeBox: {
        paddingBottom:getHeight(40)
    },
    qrCodeTitle: {
        color: StyleConfigs.txtC5CFD5,
        fontSize: 13,
        fontWeight: 'bold',
    },
    qrCodeDetailBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: getHeight(30),
    },
    qrCodeBg: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: StyleConfigs.btnWhite,
        width: getWidth(320),
        height: getWidth(320),
    },
    footer:{
        height: getHeight(140)
    },
    AssetRechargeTip:{
        height:45,
        lineHeight:45,
        fontSize:StyleConfigs.fontSize12,
        color:StyleConfigs.txt8994A5,
        // backgroundColor:StyleConfigs.txt131F30,
        // marginBottom:-20
    },
    tibiWrap:{
        marginBottom:getHeight(26),
        marginTop:getHeight(40)
    },
    xuanzebizhongWrap:{
        width:'100%',
        height:getHeight(88),
        paddingHorizontal:getWidth(30),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#f7f8fa',
        marginBottom:getHeight(30)

    },
    tibiTxt:{
        fontSize:24,
        color:'#172A4D',
        fontWeight:'bold',
        fontFamily:'System'
    },
    currencyName:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize16,
        fontWeight:'bold'
    },
    rechargeAddressBox2:{
        width:'100%',
        paddingTop:getHeight(50),
        paddingBottom:getHeight(32),
        alignItems:'center',
        backgroundColor:StyleConfigs.bgF7F8FA,
        borderRadius:StyleConfigs.borderRadius1o5,
        marginBottom:getHeight(30),
        paddingHorizontal:getWidth(30)
    },
    copyBtnTouch:{
        marginTop:getHeight(20),
        paddingHorizontal:getWidth(10),
        // width:getWidth(120),
        height:getHeight(44),
        borderRadius:StyleConfigs.borderRadius1o5,
        backgroundColor:StyleConfigs.btnE7EBEE,
        alignItems:'center',
        justifyContent:'center'
    },
    selectCurrency:{
        color:StyleConfigs.txt8994A5,
        fontSize:StyleConfigs.fontSize12
    },
    chainNameText:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize12
    },
    chainNameBtnBox:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:getHeight(30)
    },
    chainNameBtn:{
        width:getWidth(76 * 2),
        height:getHeight(32 * 2),
        borderWidth:1,
        backgroundColor:StyleConfigs.bgF7F8FA,
        borderColor:StyleConfigs.borderF7F8FA,
        borderRadius:StyleConfigs.borderRadius1o5,
        justifyContent:'center',
        alignItems:'center',
        marginRight:getWidth(20)
    },
    chainNameBtnSel:{
        borderColor:StyleConfigs.btnBlue,
    },
    usdtTypeText:{
        color:StyleConfigs.txt8994A5,
        fontSize:StyleConfigs.fontSize12
    },
    usdtTypeTextSel:{
        color:StyleConfigs.txtBlue,
    }

})

export default styles