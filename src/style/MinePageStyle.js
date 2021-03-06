import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    settingIcon: {
        width: getWidth(40),
        height: getWidth(40),
    },
    boxPadding: {
        paddingLeft: getWidth(30),
        paddingRight: getWidth(22),
    },
    headerIconBox: {
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // paddingTop: getHeight(106),
        // paddingBottom: getHeight(106),
        height: getHeight(160),
        backgroundColor:StyleConfigs.bgColor,
    },
    headerIcon: {
        height: getWidth(72),
        width: getWidth(60),
        marginTop:-getWidth(20)
    },
    headerIconText: {
        marginLeft: getWidth(16),
        fontWeight: 'bold',
        fontSize: StyleConfigs.fontSize16,
    },
    userNameBottom:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft: getWidth(16),
        marginTop:getWidth(10),
    },
    userNameBottomItem:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        height:getWidth(36),
        paddingHorizontal:getWidth(12),
        borderRadius:getWidth(18),
        borderColor:StyleConfigs.borderE0E1F4,
        borderWidth:StyleSheet.hairlineWidth,
        // backgroundColor:'#000'
    },
    userNameBottomTouch:{
        marginLeft: getWidth(12),
    },
    flameIcon:{
        width:getWidth(18),
        marginRight:getWidth(10),
        marginBottom:getWidth(2)
    },
    heatText:{
        fontSize: 10,
        marginRight:getWidth(10),
    },
    heatVal:{
        fontSize: 10,
        marginRight:getWidth(10),
    },

    heatTriangleIcon:{
        width:getWidth(14),
    },
    headerUIDText: {
        // marginLeft: getWidth(16),
        // marginTop:getWidth(16),
        // fontWeight: 'bold',
        fontSize: 10,
        // backgroundColor:'green'
    },
    memberBox:{
        height:getHeight(80),
        justifyContent: 'space-between',
    },
    memberTitle:{
        fontSize:StyleConfigs.fontSize15,
        fontWeight:'500',
        color:StyleConfigs.txtB9894A
    },
    memberExpiresTime:{
        fontSize:StyleConfigs.fontSize12,
        fontWeight:'400',
        color:StyleConfigs.txtA2B5D9
    },
    headerLine:{
        borderBottomWidth:10,
        borderBottomColor:StyleConfigs.borderF7F7FB
    },
    BDBFeeBox: {
        // paddingTop: getHeight(15),
        // paddingBottom: getHeight(15),
        height: getHeight(100),
        // alignItems:'center'
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    BDBFeeText: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    itemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingTop: getHeight(30),
        // paddingBottom: getHeight(30),
        height: getHeight(108),
        borderStyle: 'solid',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: StyleConfigs.listSplitlineColor

    },
    iconBox: {
        width: getWidth(50),
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'#ccc'
    },

    icon: {
        // position: 'absolute',
    },
    textColor:{
        color:StyleConfigs.txt1F3F59
    },
    iconText: {
        paddingLeft: getWidth(20),
        fontSize: 15,
        // fontWeight: 'bold'
    },
    intoText: {
        fontSize: 14,
        color: StyleConfigs.txtWhiteOpacity,
        paddingRight: getWidth(20)

    },
    smallText:{
        fontSize: 13,
        color: StyleConfigs.txtWhiteOpacity,
        paddingRight: getWidth(20)
    },
    smallerText:{
        fontSize: 10,
        color: StyleConfigs.txtWhiteOpacity,
        paddingRight: getWidth(20)
    },
    verifyText: {
        fontSize: 12,
        // color: StyleConfigs.txtC5CFD5
    },
    verifyStateText: {
        fontSize: 12,
        color: StyleConfigs.txtA2B5D9
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    itemRightColumn: {
        flexDirection: 'column',
        alignItems: 'flex-end',

    },
    myRecommendIcon: {
        // width: getWidth(44),
        // height: getWidth(44),
        width: 20,
        height: 20
    },
    chanziIcon: {
        width: getWidth(42),
        height: getWidth(42)
    },
    intoIcon: {
        width: getWidth(14),
        height: getWidth(22),
        marginLeft:getWidth(20)
    },
    cardIcon: {
        // width: getWidth(44),
        // height: getWidth(44),
        width: 16,
        height: 18
    },
    phoneIcon: {
        // width: getWidth(32),
        // height: getWidth(46),
        width: 22,
        height: 22
    },
    emailIcon:{
        // width: getWidth(44),
        // height: getWidth(44)
        width: 21,
        height: 21
    },
    googleIcon: {
        // width: getWidth(44),
        // height: getWidth(44),
        width: 22,
        height: 22
    },
    bindcardIcon: {
        width: 18,
        height: 18
        // height: getWidth(28),
    },
    logout: {
        height: getHeight(88),
        // marginTop: getHeight(88),
    },
    logoutText: {
        fontSize: 18,
    },

    verifyModalBox: {
        width: getWidth(470),
        backgroundColor: StyleConfigs.modalBgWhite,
        borderRadius: StyleConfigs.borderRadius1o5,
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
    userNameBox: {
        // flex:1,
        // backgroundColor:'#ccc'
    },
    splitSmall:{
        height: getHeight(10)
    },
    opacity1:{
        opacity:1
    }

})

export default styles