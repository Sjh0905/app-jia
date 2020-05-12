import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal:getWidth(30)
    },
    containerMargin:{
        marginTop: -(getDeviceTop()+2),
        paddingTop: getDeviceTop()+2,
    },
    totalAssetBox: {
        height: getHeight(152),
        alignItems: 'center',
        paddingTop: getHeight(34),
        backgroundColor:StyleConfigs.bgColor
    },
    totalAssetBox2: {
        // marginLeft:PlatformOS == 'ios' && getWidth(DefaultWidth-690)/2 || getWidth(DefaultWidth-660)/2,
        // width: PlatformOS == 'ios' && getWidth(690) || getWidth(660),
        width: getWidth(DefaultWidth),
        height: getWidth(222),
        // alignItems: 'center',
        // borderRadius:8,
        paddingTop:getWidth(12),
        overflow:'hidden',
        backgroundColor:StyleConfigs.bgAssetPageTop
    },
    totalAssetTitleTouch: {
        marginLeft:getWidth(40),
        marginBottom:getWidth(10),
    },
    totalAssetTitleBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalAssetTitle: {
        fontSize: StyleConfigs.fontSize12,
        color:StyleConfigs.txtWhite,
        opacity:0.8
    },
    eyeIcon: {
        width: getWidth(26),
        height: getWidth(18),
        marginLeft: getWidth(10),
        marginTop:1.5
    },
    totalAssetDetailBox: {
        marginLeft: getWidth(40),
        flexDirection: 'row',
        alignItems: 'flex-start',
        // paddingTop: getHeight(12),
        // alignItems:'center'
    },
    totalAssetBTC: {
        fontSize: StyleConfigs.fontSize26,
        // fontWeight: 'bold',
    },
    totalAssetRMB: {
        fontSize: StyleConfigs.fontSize12,
        fontWeight: 'bold',
        paddingLeft: getWidth(10),
        marginTop:getHeight(26),
        // backgroundColor:'#ccc'
    },
    operTouch:{
        position:'absolute',
        bottom:0,
        left:0,
        width:'100%',
        height:getWidth(88),
        borderTopWidth:StyleSheet.hairlineWidth,
        borderTopColor:StyleConfigs.lineAsset,
        flexDirection:'row',
        alignItems:'center'
    },
    rechargeTouch:{
        height:'100%',
        width:'24.7%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    rechargeImage:{
        width:getWidth(44),
        height:getWidth(44),
        marginRight:getWidth(20)
    },
    rechargeText:{
        fontSize:StyleConfigs.fontSize14,
        color:StyleConfigs.txtWhite
    },
    rechargeLine:{
        width:StyleSheet.hairlineWidth,
        height:16,
        backgroundColor:StyleConfigs.lineAsset
    },
    assetCheckBox:{
        width: getWidth(DefaultWidth),
        height:getHeight(80),
        backgroundColor:StyleConfigs.bgColor,
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:StyleConfigs.listSplitTitlelineColor
    },
    assetCheckItem:{
        height:'100%',
        borderBottomColor:'transparent',
        justifyContent:'center',
        borderBottomWidth:getHeight(4),
    },
    assetCheckItemSelected:{
        borderBottomColor:StyleConfigs.txt0D0E23
    },
    assetCheckItemText:{
        fontSize:StyleConfigs.fontSize13,
        color:StyleConfigs.txt9EA8B7
    },
    assetCheckItemTextSelected:{
        color:StyleConfigs.txt0D0E23
    },
    listBox: {
        flex: 1,
        backgroundColor:StyleConfigs.bgColor
    },
    currencyItemFirstBox: {
        // borderColor: StyleConfigs.borderColorLight,
        borderColor: StyleConfigs.borderBottomColor,
        borderStyle: 'solid',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    currencyItemBoxTouch:{
        borderColor: StyleConfigs.borderBottomColor,
        borderStyle: 'solid',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    currencyItemBox: {
        height: getHeight(80),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: getWidth(30),
        paddingRight: getWidth(30),
        alignItems: 'center',
        // borderColor: StyleConfigs.borderColorLight,
        // borderColor: StyleConfigs.borderBottomColor,
        // borderStyle: 'solid',
        // borderBottomWidth: StyleSheet.hairlineWidth,
    },
    currencyItemLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    currencyItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyIcon: {
        width: getWidth(44),
        height: getWidth(44),
    },
    currencyText: {
        // paddingLeft: getWidth(20),
        fontSize: 15,
        fontWeight: 'bold'
    },
    currencyTotal: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    intoIcon: {
        marginLeft:getWidth(20),
        width: getWidth(14),
        height: getWidth(22),
    },
    assetsTitleBox:{
        width:'100%',
        paddingHorizontal:getWidth(30),
        height:getHeight(100),
        paddingTop:getHeight(50),
        paddingBottom:getHeight(10),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:StyleConfigs.bgColor
    },
    assetsTitle:{
        color:StyleConfigs.txt9FA7B8,
        fontSize:StyleConfigs.fontSize14,
    },
    assetsTitleTouch:{
        flexDirection:'row',
        alignItems:'center',
    },
    hideImg:{
        width:15,
        height:15,
        marginRight:6
    },
    hideText:{
        fontSize:StyleConfigs.fontSize14,
        color:StyleConfigs.txt6B7DA2
    },
    searchBox: {
        width:'100%',
        height:PlatformOS == 'ios' ? 64 : 44,
        // borderColor: 'black',
        flexDirection: 'row',   // 水平排布
        // borderRadius: 8,  // 设置圆角边
        // backgroundColor: '#ccc',
        // borderWidth: 0.8,
        // borderRadius: 10,
        // borderColor: 'gray',
        alignItems: 'center',
        marginLeft: getWidth(30),
        // paddingTop: 20,
        // marginTop: searchHeightMargin,
        // marginBottom: searchHeightMargin,
        // paddingBottom: 0,
        // marginRight: 8,

    },
    inputText: {
        width:'80%',
        height:36,
        // backgroundColor: '#fff',
        fontSize: 15,
        padding:0,
        // paddingBottom: 0,
        // paddingTop: 2,
        marginLeft: 8,
        // marginTop: searchHeightMargin,
        // marginBottom: searchHeightMargin,
        // paddingBottom: 2,
        // marginRight: 8,
        lineHeight:36,
        // borderRadius: 5,
        // textAlign:'center',
        // alignItems:'center',
        // justifyContent:'center'
        color:StyleConfigs.txt4D4D4D
    },
    itemLineBot:{
        height: PlatformOS == 'ios' ? getHeight(90) : getHeight(100),
        paddingHorizontal:getWidth(30),
        paddingBottom:getWidth(25),
        borderColor: StyleConfigs.borderBottomColor,
        borderStyle: 'solid',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    itemSectionTitle:{
        color:StyleConfigs.txtA2B5D9,
        fontSize:StyleConfigs.fontSize12,
        lineHeight:getHeight(32),
    },
    itemSectionNum:{
        color:StyleConfigs.txt0D0E23,
        fontSize:StyleConfigs.fontSize14,
        marginTop:getHeight(6)
    },
    itemSectionNumToRMB:{
        color:StyleConfigs.txt6B7DA2,
        // opacity:0.8,
        textAlign:'right'
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

})

export default styles