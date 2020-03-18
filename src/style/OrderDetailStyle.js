import {StyleSheet} from "react-native"
import device from "../configs/device/device";
import StyleConfigs from "./styleConfigs/StyleConfigs";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: StyleConfigs.bgColor,
        backgroundColor:StyleConfigs.navBgColor0602,
        // padding:getWidth(30),
        paddingTop: getDeviceTop(),//+getHeight(40),
        // paddingBottom: getDeviceBottom()//+getHeight(110),
    },
    container2: {
        // flex: 1,
        backgroundColor: StyleConfigs.bgColor,
        padding:getWidth(35),
        // paddingTop: getDeviceTop()
    },
    importantTip:{
        width:'100%',
        lineHeight:getHeight(36),
        color:StyleConfigs.txtRed,
        paddingVertical:getHeight(40)
    },
    orderTypeBox:{
        flexDirection: 'row',
        borderBottomColor:StyleConfigs.lineColor,
        borderBottomWidth:1,
        justifyContent:'space-between',
        height:getHeight(60),
    },
    infoListBox:{
        marginTop:getHeight(40),
        borderBottomColor:StyleConfigs.lineColor,
        borderBottomWidth:1,
        paddingBottom:getHeight(20)
    },
    infoListItem:{
        height:getHeight(60),
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    infoListLeftText:{
        lineHeight:getHeight(60),
        color:StyleConfigs.txtWhiteMoreOpacity,
        fontSize:StyleConfigs.fontSize13
    },
    infoListRightText:{
        lineHeight:getHeight(60),
        color:StyleConfigs.txtWhiteLittleOpacity,
        fontSize:StyleConfigs.fontSize15
    },
    orderStatus:{
        lineHeight:getHeight(60),
        fontSize:StyleConfigs.fontSize15,
        color:StyleConfigs.txtRed
    },
    sellerInfoTitle:{
        color:StyleConfigs.txtWhite,
        fontSize:StyleConfigs.fontSize13,
        lineHeight:getHeight(80)
    },
    sellerInfoBox:{
        paddingHorizontal:getWidth(30),
        width:getWidth(690),
        borderRadius:6,
        borderTopWidth:StyleSheet.hairlineWidth,
        borderTopColor:StyleConfigs.lineBlue,
        backgroundColor:StyleConfigs.blockNewBg,
        paddingBottom:getHeight(15)
    },
    sellerInfoItem:{
        flexDirection: 'row',
        justifyContent:'flex-start',
        width:'100%',
        alignItems:'center'
        // backgroundColor:'#ccc'
    },
    copyBtn:{
        position:'absolute',
        width:getWidth(88),
        height:getHeight(40),
        right:getWidth(20),
        borderColor:StyleConfigs.lineBlue,
        borderWidth:StyleSheet.hairlineWidth,
        borderRadius:StyleConfigs.borderRadius,
        alignItems:'center',
        justifyContent:'center',
    },
    operBtnBox:{
        width: getWidth(DefaultWidth),
        position: 'absolute',
        paddingBottom: getHeight(getDeviceTop(true) + 10),
        paddingTop:getHeight(10),
        bottom: 0,
        right:0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:'#16171B',
        paddingHorizontal:getWidth(20),
    },
    bbtn: {
        width:PlatformOS === 'ios' && getWidth(344) || getWidth(330),
        height: getHeight(80),
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancleBtn:{
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:StyleConfigs.lineBlue
    },
    confirmBtn:{
        backgroundColor:StyleConfigs.btnBlue
    },
    ballGreen: {
        width: getWidth(32),
        height: getDealHeight(32),
        backgroundColor: '#34A753',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getDealHeight(16),
        marginRight: 10
    },
    ballRed: {
        width: getWidth(32),
        height: getDealHeight(32),
        backgroundColor: '#EF5656',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: getDealHeight(16),
        marginRight: 10
    },
    size11: {fontSize: 11},
    size12: {fontSize: 12},
    color100: {color: '#fff'},
    color80: {color: 'rgba(255,255,255,0.8)'},
    color60: {color: 'rgba(255,255,255,0.6)'},
    color40: {color: 'rgba(255,255,255,0.4)'},
    colorGreen: {color: '#34A753'},
    colorRed: {color: '#EF5656'},
    bgGreen: {backgroundColor: '#34A753'},
    bgRed: {backgroundColor: '#EF5656'},

});

export default styles