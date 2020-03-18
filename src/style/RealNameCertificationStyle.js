import {StyleSheet} from "react-native"
import device from "../configs/device/device";
import StyleConfigs from "./styleConfigs/StyleConfigs";

const styles = new StyleSheet.create({
    container:{
        flex: 1
    },
    deviceBox:{
        marginTop: getDeviceTop(),
        marginBottom: getDeviceBottom()
    },
    background:{
        backgroundColor:StyleConfigs.bgColor
    },
    box: {
        // overflow:'hidden'
    },
    padding:{
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
    },
    margin:{
        marginLeft: getWidth(24),
        marginRight: getWidth(24),
    },
    inputBox: {
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
    },
    inputItemBox: {
        marginLeft: getWidth(30),
        marginRight: getWidth(30),
    },
    inputTitleBox: {
        height: getWidth(76),
        justifyContent: 'center',
    },
    inputTitleBoxRow: {
        // marginLeft: getWidth(24),
        height: getWidth(32),
        lineHeight: getWidth(36),
        color:StyleConfigs.txtBlue,
        fontSize:StyleConfigs.fontSize10,
    },
    inputTitleBoxTitle: {
        height: getWidth(38),
        lineHeight: getWidth(42),
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize12,
    },
    inputStar:{
        color: '#ed4949',
        fontSize:26,
        marginBottom: -9,
        marginRight: 4
    },
    inputTitle: {
        color: StyleConfigs.txtWhiteOpacity,
        fontSize: 13,
    },
    inputTitleGray:{
        color: StyleConfigs.txtWhiteMoreOpacity,
        fontSize: 13
    },
    input: {
        borderColor: StyleConfigs.borderBottomColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(88),
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        // paddingLeft: getWidth(20),
        color: StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize16
    },
    selectedText:{
        fontSize:StyleConfigs.fontSize16,
        color: StyleConfigs.txt172A4D,
    },
    placeholderSelf:{
        fontSize:StyleConfigs.fontSize16,
        color: StyleConfigs.txtA2B5D9,
    },
    inputView:{
        borderColor: StyleConfigs.borderBottomColor,
        // borderRadius: StyleConfigs.borderRadius,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(88),
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        // paddingLeft: getWidth(20),
        // backgroundColor: '#181C22',
        justifyContent:'center'
    },
    wrongAns: {
        fontSize: 12,
        paddingTop: getHeight(20),
        paddingLeft: getWidth(20),
    },
    btn: {
        height: getHeight(88),
        marginTop: getHeight(60),
        marginBottom: getHeight(60),
        backgroundColor: StyleConfigs.btnBlue,
        borderRadius: StyleConfigs.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: getWidth(24),
        marginRight: getWidth(24),
    },
    btnbot: {
        position:'absolute',
        left:getWidth(30),
        bottom:getWidth(30),
        width:getWidth(DefaultWidth-60),
        height: getHeight(88),
        backgroundColor: StyleConfigs.btnBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: StyleConfigs.borderRadius1o5,
    },
    btnText: {
        // fontWeight: 'bold',
        color: '#fff',
        fontSize: 18,
    },
    arrowDown:{
        width: 0,
        height: 0,
        right: 10,
        top: getHeight(88)/2 - 2.5,
        borderLeftWidth: 4.5,
        borderRightWidth: 4.5,
        borderBottomWidth: 6.4,
        borderLeftColor: '#fff',
        borderRightColor: '#fff',
        borderBottomColor: StyleConfigs.borderA2B5D9,
        position: 'absolute'
    },
    arrowUp:{
        width: 0,
        height: 0,
        right: 10,
        top: getHeight(88)/2 - 2.5,
        borderLeftWidth: 4.5,
        borderRightWidth: 4.5,
        borderTopWidth: 6.4,
        borderLeftColor: '#fff',
        borderRightColor: '#fff',
        borderTopColor: StyleConfigs.borderA2B5D9,
        position: 'absolute'
    },
    imageBox:{
        flexDirection: 'row-reverse',
        justifyContent: 'space-around',
    },
    imageItems:{
        width: getWidth(220),
        height: getWidth(160)
    },
    deleteItems:{
        position: 'absolute',
        top: -7,
        right: -7,
        height: getWidth(30),
        width :getWidth(30)
    },
    image: {
        width: '100%',
        height: '100%'
    },
    modal:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top:0,
        left: 0,
        backgroundColor: 'transparent'
    },
    orderListOne:{
        marginHorizontal:getWidth(24),
        flexDirection: 'row',
        alignItems: 'center',
        height: getHeight(88),
    },
    orderListSplitTop:{
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: StyleConfigs.borderBottomColor
    },
    orderListText: {
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
        color: StyleConfigs.txt172A4D,
        fontSize: 13
    },
    pickerViewBox:{
        marginRight:getWidth(24),
        marginLeft:getWidth(24),
        backgroundColor:StyleConfigs.bgColor,
        borderColor: StyleConfigs.borderShadowColor,
        borderWidth: StyleSheet.hairlineWidth,
        shadowColor:  StyleConfigs.borderShadowColor,
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 0.5//安卓专用
    },
    imageTitle:{
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
        fontSize:StyleConfigs.fontSize16,
        color:StyleConfigs.txt172A4D,
        width:'100%',
        marginTop:10,
        marginBottom:12,
        // justifyContent:'center',
        textAlign:'center'
    },
    idCardTips:{
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
        fontSize:StyleConfigs.fontSize12,
        color:StyleConfigs.txt6B7DA2,
        width:'100%',
        marginBottom:12,
        // textAlign:'center',
        lineHeight:20
    },
    idCardBox:{
        flexDirection:'row',
        justifyContent:'space-around',
        paddingHorizontal:getWidth(24)
    },
    idCardItems:{
        width:getWidth(320),
        height:getWidth(214),
        alignItems:'center'
    },
    idCardItemTips:{
        color:StyleConfigs.txt6B7DA2,
        fontSize:StyleConfigs.fontSize12,
        textAlign:'center',
        marginTop:getWidth(12),
        marginBottom:getWidth(24)
    },
    idCardHold:{
        width:getWidth(240*2),
        height:getWidth(159*2),
        alignItems:'center'
    },
    idCardHoldBox:{
        alignItems:'center',
        paddingHorizontal:getWidth(24)
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
    identityAuthWAReasonBox:{
        paddingHorizontal:getWidth(24),
        marginBottom:10
    },
    identityAuthWAReasonText:{
        // marginTop:getWidth(14),
        paddingHorizontal:getWidth(14),
        flexWrap: "wrap",
        color:StyleConfigs.txt666666,
        fontSize:StyleConfigs.fontSize12,
        lineHeight:25,
        // borderWidth:StyleSheet.hairlineWidth,
        // borderColor:StyleConfigs.borderFFC0BB,
        backgroundColor:StyleConfigs.bgFFF1F0
    }
})

export default styles