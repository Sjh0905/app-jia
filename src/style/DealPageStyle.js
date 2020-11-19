import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

/**
 * 如果通过修改padding或者margin修改了本页面的总高度，需要修改函数listenOnScroll中ev.nativeEvent.contentOffset.y的最大值
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'red'
    },

    listView: {
        // height:getDealHeight(600),
        marginTop: getDealHeight(20),
        backgroundColor: '#131316'
    },
    listTitleWrap: {
        height: getDealHeight(64),
        borderBottomWidth: 1,
        borderBottomColor: '#202126',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: getWidth(20),
        marginRight: getWidth(20)
    },
    listTitleBase: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)'
    },
    listTitle1: {
        width: '40%'
    },
    listTitle2: {
        width: '35%'

    },
    listTitle3: {
        width: '25%',
        textAlign: 'right'
    },
    listRowWrap: {
        height: getDealHeight(120),
        borderBottomWidth: 1,
        borderBottomColor: '#202126',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20)
    },
    rowBase: {},
    row1: {
        width: '40%'
    },
    row2: {
        width: '35%'
    },
    row3: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },


    size10: {fontSize: 10},
    size12: {fontSize: 12},
    size13: {fontSize: 13},
    size14: {fontSize: 14},
    size15: {fontSize: 15},
    size16: {fontSize: 16},
    color100: {color: '#fff'},
    color80: {color: StyleConfigs.txt9FA7B8},
    color9FA7B8: {color: StyleConfigs.txt9FA7B8},
    color40: {color: 'rgba(255,255,255,0.4)'},
    colorC5CFD5: {color: StyleConfigs.txtC5CFD5},
    colorA2B5D9: {color: StyleConfigs.txtA2B5D9},
    color6B7DA2: {color: StyleConfigs.txt6B7DA2},
    color172A4D: {color: StyleConfigs.txt172A4D},
    colorGreen: {color: '#86CB12'},
    colorRed: {color: '#F60076'},
    bgGreen: {backgroundColor: '#86CB12'},
    bgRed: {backgroundColor: '#F60076'},
    row3Btn: {
        width: getWidth(156),
        height: getDealHeight(58),
        borderRadius: StyleConfigs.borderRadius1o5,
        alignItems: 'center',
        justifyContent: 'center'
    },


    indicatorStyle: {
        backgroundColor: StyleConfigs.btnBlue,
        position: 'absolute',
        left: getWidth(750 / 10),/*getWidth(750 / 15),*/
        bottom: 0,
        right: 0,
        height: getDealHeight(4),
        width: getWidth(750 / 8),/*getWidth(750 / 5),*/
        alignSelf: 'center',
    },
    indicatorStyle2: {
        backgroundColor: StyleConfigs.btnBlue,
        position: 'absolute',
        left: getWidth(750 / 15),
        bottom: 0,
        right: 0,
        height: getDealHeight(4),
        width: getWidth(750 / 5),
        alignSelf: 'center',
    },
    tabBoxStyle: {
        height: getDealHeight(80),
        justifyContent: 'center'
    },


    container2: {
        // height:(604.33/global.RateDeviceHeight-55-80-88)*global.RateDeviceHeight,
        // flex: 1,
        flexDirection: 'row',
        flexWrap: "wrap",
        backgroundColor: StyleConfigs.bgColor,
        // backgroundColor: 'green',
        paddingBottom:(getDeviceTop() != 0) && getDealHeight(6) || getDealHeight(8),
        // paddingVertical: getDealHeight(20),
        paddingLeft: getWidth(30),
        paddingTop:PlatformOS === 'ios' && (PlatformiOSPlus || getDeviceTop() != 0) && getDealHeight(26) || getDealHeight(15)
    },
    halfBox1: {
        // flex: 1,
        width:getWidth(400)
        // backgroundColor: 'red'
    },
    halfBox2: {
        flex: 1,
        // backgroundColor: 'yellow'
    },
    modalDropdownBox:{
        marginVertical:9,
        height: getWidth(50),
        // backgroundColor:'red'
    },
    noDropdownText:{
        marginVertical:9,
        height: getWidth(50),
        padding: 5,
        paddingLeft:10,
        includeFontPadding: false,
        textAlignVertical: 'center',
        fontSize: StyleConfigs.fontSize13,
        color: StyleConfigs.txt172A4D,
        fontWeight:'500',
    },
    dropdownImg:{
        position:'absolute',
        top:11,
        right:10,
        width:10,
        height:7
    },
    iptBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: '#0E0E0E',
        // width: getWidth(344),
        height: getDealHeight(80),
        borderRadius: StyleConfigs.borderRadius1o5,
        borderWidth:StyleSheet.hairlineWidth,
        // borderColor:StyleConfigs.listSplitlineColor
        borderColor: StyleConfigs.borderC8CFD5,
        overflow:'hidden',
        marginBottom:getHeight(6)
    },
    iptDisabled:{
        paddingLeft:10,
        backgroundColor:StyleConfigs.bgF7F8FA,
        alignItems:'center',
    },
    iptDisabledTxt:{
        color:StyleConfigs.txt172A4D,
    },
    ipt: {
        padding:0,
        paddingLeft:10,
        // width:'50%',
        height: getDealHeight(80),
        color: StyleConfigs.txt172A4D,
        flex: 1,
        // paddingLeft:getWidth(10),
        // textAlign: 'center',
        // lineHeight: getDealHeight(72)
        // alignItems:'center',
        // justifyContent:'center'
    },
    iptUnit:{
        height: getDealHeight(80),
        lineHeight: getDealHeight(80),
        color: StyleConfigs.txt6B7DA2,
        paddingRight:getWidth(30),
    },
    img: {
        marginTop: getDealHeight(22),
        marginBottom: getDealHeight(20),
        marginLeft: getWidth(19),
        marginRight: getWidth(19),
        width: getWidth(23),
        height: getDealHeight(23)
    },
    imgBox:{
        width:getWidth(68),
        // backgroundColor:StyleConfigs.sectTitleColor,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imgBoxJianHao:{
        borderLeftWidth:StyleSheet.hairlineWidth,
        borderLeftColor:StyleConfigs.borderBottomColor,
    },
    imgBoxJiaHao:{

    },
    imgBoxLine:{
        width:StyleSheet.hairlineWidth,
        height:getWidth(26),
        backgroundColor:StyleConfigs.borderBottomColor
    },
    ratio: {
        width: getWidth(80),
        height: getDealHeight(40),
        // lineHeight:getDealHeight(30),
        borderStyle: 'solid',
        // borderColor: StyleConfigs.listSplitlineColor,
        borderColor: StyleConfigs.borderC5CFD5,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: StyleConfigs.borderRadius1o5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    totalMoney: {
        flexDirection:'row',
        // justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#0E0E0E',
        borderStyle: 'solid',
        // borderColor: StyleConfigs.listSplitlineColor,
        // borderColor: StyleConfigs.borderC8CFD5,
        // borderWidth: StyleSheet.hairlineWidth,
        // borderRadius: StyleConfigs.borderRadius,
        height: getDealHeight(64)
    },
    dealBtn: {
        width:'100%',
        height: getDealHeight(80),
        alignItems: 'center',
        justifyContent: 'center'
    },
    dealBtnGreen: {
        backgroundColor: '#86CB12',
        borderRadius: StyleConfigs.borderRadius1o5,
        height: getDealHeight(80),
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom:getHeight(6)
    },
    dealBtnRed: {
        backgroundColor: '#F60076',
        borderRadius: StyleConfigs.borderRadius1o5,
        height: getDealHeight(80),
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom:getHeight(6)
    },
    dealBtnDisabled:{
        backgroundColor:StyleConfigs.btnDisabled
    },
    line: {
        //flexDirection: 'row',
        //用于数据逆序排列
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: getDealHeight(50),
        paddingLeft: getWidth(30)
    },
    line2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: getDealHeight(50),
        paddingRight: getWidth(30)
    },
    rowV1: {
        width: '34%',
    },
    rowV2: {
        width: '29%',

    },
    rowV3: {
        width: '21%',
        alignItems: 'flex-end'

    },
    rowV4: {
        width: '16%',
        alignItems: 'flex-end'

    },

    ballRed: {
        width: getWidth(32),
        height: getDealHeight(32),
        backgroundColor: '#F60076',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getDealHeight(16),
        marginRight: 10
    },
    ballGreen: {
        width: getWidth(32),
        height: getDealHeight(32),
        backgroundColor: '#86CB12',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getDealHeight(16),
        marginRight: 10


    },
    chedan: {
        paddingLeft: getWidth(4),
        paddingRight: getWidth(4),
        height: getDealHeight(40),
        borderRadius: StyleConfigs.borderRadius1o5,
        borderWidth: 1,
        borderColor: '#3576F5',
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center'
    },
    flatBox: {
        flex: 1,
        // height:600,
        // marginBottom: -getDealHeight(120),
        //
        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1
    },
    emptyIcon: {
        width:getWidth(300),
        height:getDealHeight(250)
    },
    emptyBox: {
        height:getDealHeight(920),
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop:getDealHeight(200),
        // paddingBottom:getDealHeight(350)

    },
    emptyText: {
        color:StyleConfigs.txtC5CFD5
    },
    latestDeal:{
        position:'absolute',
        bottom:0,
        left:0,
        backgroundColor:'#131316',
        opacity:0.9,
        height:(getDeviceTop() != 0) && getHeight(60) || getHeight(55),
        // width:(getDeviceTop() != 0) && getHeight(650) || getHeight(750),
        width:DeviceWidth,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingHorizontal: getHeight(20)
        // paddingRight: getWidth(10)

    },
    latestDealDown:{
        backgroundColor:StyleConfigs.sectTitleColor,
        // backgroundColor:'#555',
        opacity:1,
        height:(getDeviceTop() != 0) && getHeight(61) || getHeight(55),
        // width:(getDeviceTop() != 0) && getHeight(650) || getHeight(750),
        width:DeviceWidth,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingHorizontal: getHeight(20)

    },
    latestDealTouch:{
        width:(getDeviceTop() != 0) && getHeight(520) || getHeight(590),
        height:getHeight(49),
        // backgroundColor:'red',
        justifyContent: 'center',
        alignItems:'flex-end'
    },
    latestDealImage:{
        // color:'#fff',
        width:getHeight(30),
        height:getHeight(30)
    },
    latestDealList:{
        height: (getDeviceTop() != 0) && getDealHeight(45.7) ||getDealHeight(46),
        backgroundColor:StyleConfigs.bgColor,
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        flexDirection: 'row',
        alignItems: 'center',
        width:'100%'
    },
    latestDealHeader:{
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: StyleConfigs.bgColor,
        // backgroundColor: 'red',
        height: getDealHeight(53)
    },
    toTradeBtn:{
        marginTop:50,
        width:120,
        height:36
    },
    titleBarBox:{
        width:'100%',
        height:getHeight(80),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    titleBar:{
        width:getWidth(160),
        height:getHeight(52),
        borderWidth:StyleSheet.hairlineWidth,
        borderRadius:StyleConfigs.borderRadius1o5,
        borderColor:StyleConfigs.borderC5CFD5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:StyleConfigs.bgColor,
    },
    titleMainBoardBarView:{
        width:getWidth(160),
        height:getHeight(52),
        overflow:'hidden',
        // borderWidth:getWidth(1),
        // borderRadius:getHeight(6),
        // borderColor:'#5B5F64',
        // alignItems:'center',
        // justifyContent:'center'
    },
    titleMainBoardBar:{
        // borderRightWidth:0,
        // borderTopLeftRadius:getHeight(6),
        // borderBottomLeftRadius:getHeight(6),
        paddingRight:getHeight(1.5)
    },
    titleWeiMiBarView:{
        width:getWidth(160),
        height:getHeight(52),
        overflow:'hidden',
    },
    titleWeiMiBar:{
        // borderLeftWidth:0,
        // borderTopRightRadius:getHeight(6),
        // borderBottomRightRadius:getHeight(6),
        // marginLeft:-getHeight(3),
        // paddingLeft:getHeight(1.5),


    },
    titleBarText:{
        color:StyleConfigs.txt6B7DA2,
        fontSize: StyleConfigs.fontSize13,
    },
    selectedTitleBar:{
        backgroundColor:StyleConfigs.bgColor,
        borderColor:StyleConfigs.border3576F5,
        borderWidth:StyleSheet.hairlineWidth,
    },
    selectedTBText:{
        opacity:1,
        color:StyleConfigs.txt3576F5
    },
    titleBarBoxAndroid:{
        width:'100%',
        height:getHeight(80),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    },
    titleBarAndroid:{
        width:getWidth(160),
        height:getHeight(52),
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:StyleConfigs.borderC5CFD5,
        alignItems:'center',
        justifyContent:'center'
    },
    titleMainBoardBarAndroid:{
        // borderRightWidth:0,
        borderTopLeftRadius:StyleConfigs.borderRadius1o5,
        borderBottomLeftRadius:StyleConfigs.borderRadius1o5
    },
    titleWeiMiBarAndroid:{
        borderLeftWidth:0,
        borderTopRightRadius:StyleConfigs.borderRadius1o5,
        borderBottomRightRadius:StyleConfigs.borderRadius1o5
    },
    itemHeader:{
        width:getWidth(DefaultWidth),
        height:getHeight(80),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:getWidth(30),
        backgroundColor:StyleConfigs.bgColor
    },
    itemHeaderLeft:{
        flexDirection:'row',
        alignItems:'center',
    },
    changeSymbol:{
        width:getWidth(56),
        height:getWidth(56),
    },
    itemHeaderSymbol:{
        fontSize:StyleConfigs.fontSize20,
        color:StyleConfigs.txt172A4D,
        paddingBottom:1
    },
    quoteChangeView:{
        marginLeft:getWidth(20),
        backgroundColor:StyleConfigs.btnGreen008,
        // opacity: 0.08,
        padding:getWidth(4)
    },
    quoteChangeRedView:{
        backgroundColor:StyleConfigs.btnRed008,
    },
    quoteChange:{
        opacity: 1,
        color:StyleConfigs.txtGreen,
        fontSize:StyleConfigs.fontSize12
    },
    quoteChangeRed:{
        color:StyleConfigs.txtRed,
    },
    itemHeaderRight:{
        flexDirection:'row',
        alignItems:'center',
        // backgroundColor:'green'
    },
    iconTouch:{
        height:'100%',
        alignItems:'center',
        // backgroundColor:'red'
    },
    kline:{
        marginLeft:getWidth(20),
        width:getWidth(56),
        height:getWidth(56),
    },
    moreImg:{
        marginLeft:getWidth(20),
        width:getWidth(56),
        height:getWidth(56),
    },
    changeDealTypeBox:{
        width:'100%',
        flexDirection:'row',
        height:getHeight(70),
        justifyContent:'space-between'
    },
    buyTypeBtn:{
        width:getWidth(199),
        height:getWidth(70),
        justifyContent:'center',
        alignItems:'center'
    },
    buyTypeBtnText:{
        fontSize:StyleConfigs.fontSize14,
        color:StyleConfigs.txt6B7DA2
    },
    btnTextSelected:{
        color:StyleConfigs.txtWhite
    },
    depthOperBox:{
        position:'absolute',
        bottom:0,
        right:getWidth(30),
        paddingLeft:getWidth(30),
        width:'100%',
        // paddingRight:getWidth(30),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    depthOperLeft:{
        width:getWidth(180),
        height:getHeight(50),
        // paddingLeft:getWidth(37),
        borderRadius:StyleConfigs.borderRadius1o5,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:StyleConfigs.borderBottomColor,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    depthType:{
        width:getWidth(60),
        height:getWidth(50),
    },
    secItemHeader:{
        borderTopWidth:10,
        borderTopColor:StyleConfigs.borderF7F7FB,
        width:'100%',
        height:getHeight(100),
        paddingHorizontal:getWidth(30),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    secItemHeaderText:{
        fontSize:StyleConfigs.fontSize20,
        color:StyleConfigs.txt172A4D
    },
    secItemHeaderRight:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    allOrderIcon:{
        width:getWidth(24),
        height:getWidth(24),
    },
    alltext:{
        marginLeft:getWidth(4),
        fontSize:StyleConfigs.fontSize12,
        color:StyleConfigs.txt6B7DA2
    },
    itemLineTop:{
        marginBottom:getHeight(37)
    },
    itemLineTopLeft:{

    },
    chedanTouch:{
        width:getWidth(58*2),
        height:getHeight(26*2),
        backgroundColor:StyleConfigs.bgF7F8FA,
        borderRadius:StyleConfigs.borderRadius1o5,
        justifyContent:'center',
        alignItems:'center',
    },
    itemLineBot:{

    },
    itemSectionTitle:{
        color:StyleConfigs.txt6B7DA2,
        fontSize:StyleConfigs.fontSize12,
        lineHeight:getHeight(32)
    },
    itemSectionNum:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize14,
        marginTop:getHeight(2.8)
    },
    modalScrollView:{
        // flex:1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // alignItems:'flex-end',
        // flexDirection:'row-reverse',
        flexDirection:PlatformOS === 'ios' ? 'row-reverse' :'row',
        backgroundColor:'#00000080',
        zIndex:9999
    },
    depthScrollView:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor:'#00000080',
    },
    modalBtn:{
        width:'100%',
        height:getHeight(100),
        backgroundColor:StyleConfigs.btnWhite,
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:StyleConfigs.borderBottomColor
    },
    modalBtnTxt:{
        fontSize:StyleConfigs.fontSize16,
        color:StyleConfigs.txt172A4D
    },
    modalBtnCancle:{

    },
    modalBtnCancleTxt:{
        fontSize:StyleConfigs.fontSize16,
        color:StyleConfigs.txt9FA7B8
    },
    pageBotKLineBox:{
        position:'absolute',
        // bottom:-168,
        width:getWidth(DefaultWidth),
        height:208,
        backgroundColor:StyleConfigs.bgColor,
    },
    kLineBoxTop:{
        height:40,
        paddingHorizontal:getWidth(30),
        borderTopWidth:StyleSheet.hairlineWidth,
        borderColor:StyleConfigs.borderBottomColor,
        // borderLeftWidth:0,
        // borderRightWidth:0,
    },
    kLineBoxTitle:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize14
    },
    kLineBoxOper:{
        width:58,
        height:25,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:StyleConfigs.borderA2B5D9,
        borderRadius:StyleConfigs.borderRadius1o5,
        paddingHorizontal:7
    },
    kLineBoxTouchText:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize13
    },
    verifyModalBox: {
        width: getWidth(470),
        backgroundColor: StyleConfigs.modalBgWhite,
        borderRadius: 3,
        marginLeft: 'auto',
        marginRight: 'auto',
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
    modalFooterBox: {
        borderColor: StyleConfigs.lineColorLight,
        borderTopWidth: 1,
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: getHeight(80),
    },
    modalFooterText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: StyleConfigs.txtBlue,

    },
    toAssetRechargeBox:{
        position:'absolute',
        right:getWidth(6),
        top:getHeight(20),
        width:159,
        height:65,
        backgroundColor:StyleConfigs.bgColor,
        paddingLeft:15,
        flexDirection:'row',
        alignItems:'center',
    },
    rechargeIcon:{
        width:30,
        height:30,
        marginRight:10
    },
    rechargeText:{
        fontFamily: 'PingFangSC-Medium',
        fontSize:StyleConfigs.fontSize16,
        color:StyleConfigs.txt1F3F59,
    }

});

export default styles