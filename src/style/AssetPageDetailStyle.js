import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'
import device from '../configs/device/device'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
	container2: {
    	backgroundColor:StyleConfigs.navBgColor0602,
		paddingTop: getDeviceTop()
	},

    boxPadding: {
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
    },
    titleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // height: getHeight(120),
        marginTop: getHeight(50),
        // borderColor: 'red',
        // borderWidth: 1,
        // borderStyle: 'solid',
    },
    fullNameBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: getHeight(30),
        marginTop:getHeight(6),
    },
    fullNameText: {
        color: StyleConfigs.txt9FA7B8,
    },

    currencyIcon: {
        width: getWidth(44),
        height: getWidth(44),
    },

    currencyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: getWidth(10),
    },

    detailBox: {},
    itemBox: {
        paddingTop: getHeight(10),
        paddingBottom: getHeight(10),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 13,
        color: StyleConfigs.txt9FA7B8
    },
    itemArticle: {
        fontSize: 15,
        color: StyleConfigs.txt172A4D,
        fontWeight: 'bold',
    },
    line: {
        marginTop: getHeight(24),
        marginBottom: getHeight(24),
        height: getHeight(2),
        width: '100%',
        // backgroundColor: StyleConfigs.borderColorLight
        backgroundColor: StyleConfigs.borderBottomColor
    },
    toTradeBox: {
        marginTop: getHeight(14),
        // flex: 1,
        height: getHeight(644),

        // borderColor: 'red',
        // borderWidth: 1,
        // borderStyle: 'solid'
    },
    toTradeTitle: {
        fontSize: 13,
        paddingTop: getHeight(28),
        paddingBottom: getHeight(8),
    },
    toTradeDetailBox: {
        flex: 1,
    },
    toTradeDetail: {
        // flex: 1,
        // height: '100%',
    },
    marketItemBox: {
        flex: 0.5,
        marginTop: getHeight(20),
    },
    marketItemBg: {
        backgroundColor: StyleConfigs.blockBg,
    },
    marketItem: {
        width: getWidth(344),
        height: getHeight(120),
        justifyContent: 'space-between',
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        paddingTop: getHeight(20),
        paddingBottom: getHeight(20),
    },
    // 偶数
    marketItemBoxOdd: {
        // marginLeft: getWidth(20),
        alignItems: 'flex-end'
    },
    // 奇数
    marketItemBoxEven: {
        // marginRight: getWidth(10),
    },
    marketItemTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    marketItemBottom: {
        flexDirection: 'row'
    },
    marketName: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    marketUpAndDown: {
        fontSize: 13,
        fontWeight: 'bold',

    },
    marketCurrentPrice: {
        fontSize: 13,
        color: StyleConfigs.txtWhiteMoreOpacity,
        fontWeight: 'bold',

    },
    priceUp: {
        color: StyleConfigs.txtGreen
    },
    priceDown: {
        color: StyleConfigs.txtRed
    },

    marketAppraisement: {
        fontSize: 12,
        paddingLeft: getWidth(16),
        color: StyleConfigs.txtWhiteMoreOpacity,
        fontWeight: 'bold',
    },

    btnBox: {
        paddingTop:getHeight(10),
        bottom: 0,
        width:'100%',
        // height: getHeight(110),
        backgroundColor:StyleConfigs.bgF2FFFFFF,
        // backgroundColor:'#ccc',
        position: 'absolute',
        left: 0,
        // right: 0,
        paddingBottom: getHeight(getDeviceTop(true)+20),
        flexDirection: 'row',
        paddingLeft: getWidth(30),
        paddingRight: getWidth(30),
        /*shadowColor: StyleConfigs.borderShadowColor,
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 1,
        shadowRadius: 7,
        elevation: 1,//安卓专用*/
    },
    btnLeftBox: {
        justifyContent: 'center',
        flex: 1,

    },
    btnRightBox: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'flex-end'
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    btn: {
        width: PlatformOS === 'ios' &&  getWidth(344) ||  getWidth(330),
        height: getHeight(80),
    },
    rechargeBtn: {},
    withdrawalsBtn: {},
    goTradeText:{
        width:'100%',
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize13,
        marginTop:23,
        marginBottom:14,
        fontWeight:'bold'
    },
    verifyModalBox: {
        width: getWidth(470),
        backgroundColor: StyleConfigs.modalBgWhite,
        borderRadius: 3,
        marginLeft: 'auto',
        marginRight: 'auto',
        overflow:'hidden',
    },
    modalArticleBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: getHeight(50),
        paddingBottom: getHeight(50),
    },
    verifyModalIcon: {
        width: getWidth(120),
        height: getWidth(106),
        marginBottom: getHeight(40),
    },
    modalArticleText: {
        fontSize: 14,
        // fontWeight: 'bold',
        lineHeight: 20,
        color:StyleConfigs.txt172A4D
    },
    modalFooterView:{
        flexDirection:'row',
        justifyContent:'space-between',
        borderColor: StyleConfigs.lineColorLight,
        borderTopWidth: 1,
        borderStyle: 'solid',
    },
    modalFooterBox: {
        // borderColor: StyleConfigs.lineColorLight,
        // borderTopWidth: 1,
        // borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: getHeight(80),
    },
    modalFooterMobile:{
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        height: getHeight(80),
    },
    modalFooterMobileLine:{
        borderColor: StyleConfigs.lineColorLight,
        borderLeftWidth: 1,
        borderStyle: 'solid',
    },
    modalFooterText: {
        fontSize: 14,
        // fontWeight: 'bold',
        color: StyleConfigs.txtBlue,
    },
    closeImgTouch:{
        marginTop:30,
        marginHorizontal:'auto',
        width:100,
        height:20,
        alignItems:'center',
        justifyContent:'center'
    },
    closeImg:{
        width:18,
        height:18
    },
    currencyName:{
        color:StyleConfigs.txtRed,
        fontSize:StyleConfigs.fontSize24,
        lineHeight: 36,
        marginTop:getHeight(27),
        marginLeft:getWidth(30),
        marginBottom:getWidth(24),
        fontWeight:'bold'
    },
    itemLineBot:{
        // height: PlatformOS == 'ios' ? getHeight(90) : getHeight(100),
        paddingHorizontal:getWidth(30),
        paddingBottom:getWidth(29),
        borderColor: StyleConfigs.borderF7F8FA,
        borderStyle: 'solid',
        borderBottomWidth: 10,
    },
    itemSectionTitle:{
        color:StyleConfigs.txtA2B5D9,
        fontSize:StyleConfigs.fontSize12,
        lineHeight:getHeight(32),
    },
    itemSectionNum:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize14,
        marginTop:getHeight(9)
    },
    baseColumn1:{
        width:'36%'
    },
    baseColumn2:{
        width:'30%'
    },
    baseColumn3:{
        width:'34%'
    },
    recordTitleBox:{
        height:getHeight(98),
        paddingHorizontal:getWidth(30),
        paddingTop:12
    },
    recordTitle:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize20,
        fontWeight:'bold'
    },
    filterTouch:{
        height:'100%',
        justifyContent:'center'
    },
    filterImg:{
        width:getWidth(38),
        height:getWidth(34)
    },
    itemIcon:{
        width:getWidth(114),
        height:getWidth(114)
    },
    itemIconTxt:{
        width:'100%',
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize12,
        textAlign:'center'
    },
    itembtnView:{
        justifyContent:'center'
    }

})

export default styles