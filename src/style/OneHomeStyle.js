import {StyleSheet} from "react-native"
import device from "../configs/device/device";
import StyleConfigs from "./styleConfigs/StyleConfigs";

var baseWidth = PlatformOS == 'ios' ? 375 :360;
var itemCarouselBoxWidth = getWidth(DefaultWidth*(345/baseWidth));
var itemCarouselBoxHeight = itemCarouselBoxWidth*(150/345);

// var itemCarouselBoxWidth2 = itemCarouselBoxWidth+70;
var itemCarouselBoxWidth2 = getWidth(DefaultWidth*(345/baseWidth));
var itemCarouselBoxHeight2 = itemCarouselBoxWidth2*150/345

const styles = StyleSheet.create({
    carouselBox:{
        // backgroundColor:'red',
        // marginTop:10,
        // marginBottom:20,
        // marginLeft:-20,
        width:getWidth(DefaultWidth),
    },
    itemCarouselBox:{
        // backgroundColor:'green',
	    width:PlatformOS == 'ios' ? itemCarouselBoxWidth : itemCarouselBoxWidth2,
	    height:PlatformOS == 'ios' ? itemCarouselBoxHeight : itemCarouselBoxHeight2,
        // width:itemCarouselBoxWidth,
        // height:itemCarouselBoxHeight,
        // backgroundColor:"#f5f5f5",
        // marginTop:10,
        // borderRadius:2.5,
        overflow:'hidden'
    },
    itemCarouselImg:{
        width:PlatformOS == 'ios' ? itemCarouselBoxWidth : itemCarouselBoxWidth2,
        height:PlatformOS == 'ios' ? itemCarouselBoxHeight : itemCarouselBoxHeight2
    },
    container: {
        flex: 1,
        backgroundColor:StyleConfigs.bgColor
    },
    split:{
        height: getHeight(20),
        backgroundColor:'#0E1114'
    },
    banner: {
        // marginTop: -10,
        backgroundColor:StyleConfigs.bgColor,
        // paddingLeft:getWidth(30),
        // paddingRight:getWidth(30),
        // paddingTop:getHeight(8),
    },
    carousel: {
        width:PlatformOS == 'ios' && getWidth(690) || getWidth(660),
        height:PlatformOS == 'ios' && getWidth(270) || getWidth(258),
        borderRadius: 2,
        overflow:'hidden',
        flexDirection: 'row',
        // backgroundColor:'red'
    },
    itemCarousel:{
        // width: '100%',
        // height: getHeight(350)
        // height: getWidth(350),
        height: '100%',
        flex: 1,
    },
    itemCarouselTouch:{
        flex: 1,
        // height: getWidth(350),
    },
    notice: {
        height:getHeight(60+20),
        paddingHorizontal:getWidth(32),
        justifyContent:'center',
        flexDirection: 'row',
        alignItems:'center',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:StyleConfigs.borderBottomColor
    },
    noticeTxt: {
        color:StyleConfigs.txt172A4D,
        fontSize:14,
        //height: getHeight(60),
        lineHeight: getHeight(60+20)
    },
    noticeTextBox:{
        flex: 1,
        justifyContent: 'center',
    },
    noticeImgBox:{
        width: getWidth(50),
        justifyContent: 'center'
    },
    noticeImg: {
        width: getHeight(32),
        height: getHeight(32),
        justifyContent: 'center'
    },
    listView:{
        //height:getHeight(610),
        flex: 1,
        marginTop:getHeight(20),
        backgroundColor:'#131316'
    },
    listTitleWrap:{
        width:'100%',
        height:getHeight(60),
        // borderBottomWidth:StyleSheet.hairlineWidth,
        // borderBottomColor:StyleConfigs.listSplitlineColor,
        backgroundColor: StyleConfigs.bgColor,
        flexDirection:'row',
        alignItems:'center',
        //paddingTop:getHeight(42),
        // paddingTop: getHeight(13),
        paddingLeft:getHeight(30),
        paddingRight:getHeight(30),
        // paddingBottom:getHeight(13),
        // marginLeft:getWidth(20),
        // marginRight:getWidth(20)
    },
    listTitleBase:{
        fontSize:StyleConfigs.fontSize12,
        color:StyleConfigs.txtA2B5D9
    },
    listTitle1:{
        width: '38%'
    },
    listTitle2:{
        width: '37%'

    },
    listTitle3:{
        width: '25%',
        textAlign:'right'
    },
    listRowWrap: {
        height: getHeight(120),
        borderBottomWidth: 1,
        backgroundColor:StyleConfigs.bgColor,
        borderBottomColor: StyleConfigs.listSplitlineColor,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20)
    },
    rowBase: {

    },
    row1:{
        width:'34%'
    },
    row2:{
        width:'41%'
    },
    row3:{
        width:'25%',
        justifyContent:'center',
        alignItems:'flex-end'
    },


    size12:{fontSize:12},
    size13:{fontSize:13},
    size14:{fontSize:14},
    size15:{fontSize:15},
    size16:{fontSize:16},
    color100:{color:'#fff'},
    color80:{color:'rgba(255,255,255,0.8)'},
    color40:{color:'rgba(255,255,255,0.4)'},
    colorGreen:{color:'#86CB12'},
    colorRed:{color:'#F60076'},
    bgGreen:{backgroundColor:'#86CB12'},
    bgRed:{backgroundColor:'#F60076'},
    row3Btn:{
        width: getWidth(156),
        height: getHeight(58),
        borderRadius:4,
        alignItems:'center',
        justifyContent:'center'
    },
    fontWeight:{
        fontWeight:'bold'
    },
    activityText:{
        color:StyleConfigs.txt172A4D,
        fontSize: StyleConfigs.fontSize14,
        lineHeight:20,
        fontWeight:'600'
    },
    activityImage:{
        height: getWidth(36),
        width: getWidth(36),
        marginRight:getWidth(20)
    },
    advertisement:{
        borderBottomWidth: getHeight(10),
        borderBottomColor: '#11151A',
        height: getHeight(184)
    },
    titleBarBox:{
        width:'100%',
        height:getHeight(80),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        backgroundColor:'#161C24'
    },
    titleBar:{
        width:'50%',
        height:getHeight(80),
        borderWidth:getWidth(0),
        borderColor:'#5B5F64',
        alignItems:'center',
        justifyContent:'center'
    },
    titleMainBoardBar:{
        borderRightWidth:0,
        borderTopLeftRadius:getHeight(6),
        borderBottomLeftRadius:getHeight(6)
    },
    titleWeiMiBar:{
        borderLeftWidth:0,
        borderTopRightRadius:getHeight(6),
        borderBottomRightRadius:getHeight(6)
    },
    titleBarView:{
        height:getHeight(80),
        // backgroundColor:'#333',
        alignItems:'center',
        justifyContent:'center'

    },
    titleBarText:{
        color:'#fff',
        fontSize: 15,
        opacity:0.8,
        // fontWeight:'bold',
        // backgroundColor:'red',
        // lineHeight:getHeight(60),
        marginBottom:-getHeight(4)
    },
    selectedTitleBar:{
        // backgroundColor:'red',
        // borderColor:'#3576F5'
    },
    selectedTBText:{
        opacity:1,
        color:'#3576F5'
    },
    titleBarUnderLine:{
        position:'absolute',
        bottom:0,
        height:getHeight(4),
        // width:getWidth(152),
        // backgroundColor:'yellow',
        borderRadius:getHeight(4)

    },
    titleBarMBLine:{
        width:getWidth(90),
    },
    titleBarWMLine:{
        width:getWidth(152),
    },
    selectedTBLine:{
        backgroundColor:'#3576F5'
    },
    titleBarVLine:{
        height:getHeight(40),
        width:getWidth(1),
        backgroundColor:'#222731'
    },
    activiteisBox:{
        width:'100%',
        height:getWidth(200),
        // paddingVertical:getWidth(20),
        backgroundColor:StyleConfigs.sectTitleColor,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // borderTopWidth:getHeight(5),
        // borderTopColor: '#11151A',
        // height: getHeight(140+10)
    },
    activiteisRightItem:{
        paddingLeft:getWidth(54),
        width:PlatformOS == 'ios' ?getWidth(290) : getWidth(277),
        height:getWidth(72),
        backgroundColor:StyleConfigs.blockFFFFFF,
        alignItems:'center',
        flexDirection:'row',
        borderRadius:StyleConfigs.borderRadius1o5,
        shadowColor:  StyleConfigs.borderShadowColor,
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 1,
        shadowRadius: 8,
        // elevation: 1//安卓专用
    },
    activiteisBoxLeft:{
        width:PlatformOS == 'ios' ? getWidth(400) : getWidth(387),
        height:getWidth(160),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor:StyleConfigs.blockFFFFFF,
        marginRight:getWidth(20),
        borderRadius:StyleConfigs.borderRadius1o5,
        shadowColor:  StyleConfigs.borderShadowColor,
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 1,
        shadowRadius: 8,
        // elevation: 1//安卓专用
    },
    activiteisBoxLeftTitle:{
        fontSize:StyleConfigs.fontSize16,
        color:StyleConfigs.txt172A4D,
        lineHeight:22,
        // fontWeight:'600'
    },
    activiteisBoxLeftDesc:{
        color:StyleConfigs.txt6B7DA2,
        fontSize:StyleConfigs.fontSize12,
        lineHeight:17
    },
    activiteisBoxLeftImg:{
        width:44,
        height:36
    },
    activiteisBoxRight:{
        // backgroundColor:'#ccc'
    },
    activiteisBox2:{
        // backgroundColor:'#161C24',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth:10,
        borderBottomWidth:10,
        borderColor: StyleConfigs.borderF7F7FB,
        paddingTop:getWidth(30),
        paddingBottom:getWidth(26),
        // height: getHeight(140+10)
    },
    activiteisBox2Item:{
        width:'18%'
    },
    activityText2:{
        color:StyleConfigs.txt6B7DA2,
        fontSize: StyleConfigs.fontSize13
    },
    activityImage2:{
        height: getWidth(72),
        width: getWidth(72),
        marginBottom:getWidth(16)
    },
    customerServiceIcon:{
        marginRight:getWidth(15),
        width:getWidth(40),
        height:getWidth(40)
    },
    headPortraitIcon:{
        marginRight:getWidth(2),
        width:getWidth(48),
        height:getWidth(48)
    },
    moreBox:{
        height:'100%',
        flexDirection:'row',
        alignItems:'center',
    },
    moreText:{
        fontSize:StyleConfigs.fontSize13,
        color:StyleConfigs.txtA2B5D9,
        marginRight:5
    },
    moreImg:{
        width: getWidth(14),
        height: getWidth(22),
        // marginLeft:getWidth(20)
    },
    badgeImg:{
        position:'absolute',
        top:0,
        right:-9,
        width:28,
        height:12,
        backgroundColor:StyleConfigs.bgColor,
        // backgroundColor:StyleConfigs.txtWhite
    },
    activitiesButton:{
        alignItems:'center',
        // backgroundColor:'red',
        // width:'25%'
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
    joinGroupTouch:{
        width:'100%',
        // borderBottomWidth:10,
        // borderColor: StyleConfigs.borderF7F7FB,
        backgroundColor: StyleConfigs.borderF7F7FB,
        paddingHorizontal:getWidth(30),
        // marginHorizontal:getWidth(30),
        paddingBottom:getWidth(20),
    },
    joinGroupBox:{
        // width:'100%',
        // height:'100%',
        // alignItems: 'center',

        paddingHorizontal:getWidth(20),
        paddingVertical:getWidth(28),
        // backgroundColor:'#3592F6',
        // paddingBottom:getWidth(26),
    },
    joinGroupTitle:{
        color:StyleConfigs.txtFFFB6A,
        fontSize:StyleConfigs.fontSize18,
        fontWeight:"500",
        lineHeight:25
    },
    joinGroupDesc:{
        fontSize:StyleConfigs.fontSize12,
        fontWeight:"400",
        color:StyleConfigs.txtWhite,
        lineHeight:17
    },
    treasureChestTouch:{
        // paddingHorizontal:getWidth(30),
        alignItems:'center'
    },
    treasureChestImg:{
        width:getWidth(684),
        height:getWidth(180)
    }

});

export default styles