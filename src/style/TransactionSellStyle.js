import {StyleSheet} from "react-native"
import device from "../configs/device/device";
import StyleConfigs from "./styleConfigs/StyleConfigs";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:StyleConfigs.bgColor
    },
    headerRightStyle:{
        width:getWidth(76),
        height:getHeight(36),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:2,
        backgroundColor:StyleConfigs.btnBlue
    },
    tabBoxStyle: {
        height: getDealHeight(80),
        justifyContent: 'center'
    },
    buyInputBox:{
        width:'100%'
    },
    itemInput:{
        justifyContent:'flex-start',
        paddingHorizontal:getWidth(16)
    },
    inputField:{
        // width:getWidth(128),
        color:StyleConfigs.txtWhite,
        fontSize:StyleConfigs.fontSize16
    },
    inputPrice:{
        flex:1,
        color:StyleConfigs.txtRed,
        fontSize:StyleConfigs.fontSize16
    },
    inputLimt:{
        flex:1,
        color:StyleConfigs.txtWhite,
        fontSize:StyleConfigs.fontSize16,
    },
    inputDesc:{
        color: StyleConfigs.placeholderTextColor,
        fontSize:StyleConfigs.fontSize16
    },
    inputBank:{
        color:StyleConfigs.txtWhite,
        fontSize:StyleConfigs.fontSize16,
        // backgroundColor:"#ccc"
    },
    inputTips:{
        fontSize:StyleConfigs.fontSize13,
        color:StyleConfigs.txtBlue,
        // backgroundColor:"#ccc"
    },
    orderHeaderBox:{
        width:'100%'
    },
    orderHeaderTop:{
        height:getHeight(80),
        lineHeight:getHeight(80),
        opacity: 0.8,
        fontSize: StyleConfigs.fontSize16,
        color: StyleConfigs.txtWhite,
        paddingLeft:getWidth(20)
    },
    orderHeader:{
        paddingHorizontal: getWidth(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: StyleConfigs.sectTitleColor,
        height: getHeight(60)
    },
    rowV1: {
        width: '12%',
        // fontSize:StyleConfigs.fontSize12
    },
    rowV2: {
        width: '30%',
        // fontSize:StyleConfigs.fontSize12
    },
    rowV3: {
        width: '39%',
        // fontSize:StyleConfigs.fontSize12
    },
    rowV4: {
        width: '19%',
        // fontSize:StyleConfigs.fontSize12,
        // textAlign: 'right',
        alignItems: 'flex-end',
        // backgroundColor:'green'
    },
    color40: {color: 'rgba(255,255,255,0.4)'},
    size12: {fontSize:StyleConfigs.fontSize12},
    size14: {fontSize:StyleConfigs.fontSize14},
    itemOrder:{
        height: getHeight(80),
        borderBottomColor: StyleConfigs.listSplitlineColor,
        borderBottomWidth: 1,
        paddingHorizontal: getWidth(20),
        flexDirection: 'row',
        alignItems: 'center'
    },
    subBtnBox:{
        alignItems:'center',
        // marginTop:getHeight(40),
        marginBottom:getHeight(10)
    }
});
export default styles