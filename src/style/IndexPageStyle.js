import {StyleSheet} from "react-native";
import StyleConfigs from "./styleConfigs/StyleConfigs";

const styles = StyleSheet.create({
    root: {
        flex: 1,
	    backgroundColor:'#0b4ed0'
    },
    barStyle: {
        backgroundColor:'#202126',
    },
    loadingImg:{
        zIndex:1000,
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
    },
    modalView:{
        width:getWidth(420),
        height:getHeight(200),
        backgroundColor:'#fff',
        marginLeft:'auto',
        marginRight:'auto',
        borderRadius:getHeight(6)
    },
    updateText:{
        width:'100%',
        height:getHeight(120),
        fontSize:StyleConfigs.fontSize17,
        color:StyleConfigs.txt172A4D,
        textAlign:'center',
        lineHeight:getHeight(120)
    },
    modalLine:{
        width:'100%',
        height:getHeight(1),
        borderBottomColor:StyleConfigs.borderBottomColor,
        borderBottomWidth:StyleSheet.hairlineWidth
    },
    updateTouch:{
        width:'100%',
        height:getHeight(80),
        alignItems:'center',
        justifyContent:'center'
        // borderTopWidth: 1,
        // borderTopColor:'#ddd'
    },
    updateTouchText:{
        color:StyleConfigs.txtRed,
        fontSize:15
    },
    updateBox:{
        marginLeft:'auto',
        marginRight:'auto',
        width:566/2,
        height:585/2,
        alignItems:'center'
        // backgroundColor:StyleConfigs.bgColor,
        // marginTop:-17,//减去小火箭头多出来的部分，让整个框看起来居中
        // paddingTop:33,
        // paddingHorizontal:20,
        // paddingBottom:20,

        // width:getWidth(550),
        // height:getHeight(712),
        // marginTop:-getHeight(34),//减去小火箭头多出来的部分，让整个框看起来居中
        // paddingTop:getHeight((16+17)*2),
        // paddingHorizontal:getWidth(40),
        // paddingBottom:getHeight(40),
    },
    updateTitleText:{
        fontSize:StyleConfigs.fontSize11,
        color:StyleConfigs.txtWhite,
        height:19,
        lineHeight:19,
        // height:getHeight(58),
        // lineHeight:getHeight(58)
    },
    updateVersionBox:{
        // marginTop:getHeight(14),
        // width:getWidth(120),
        // height:getHeight(40),
        // borderRadius:getHeight(20),
        marginTop:197,
        width:101/2,
        height:38/2,
        borderRadius:StyleConfigs.borderRadius1o5,
        // backgroundColor:'#rgba(255,255,255,0.22)',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:StyleConfigs.borderBottomColor
    },
    updateVersionText:{
        // lineHeight:20,
        // textAlign:'center',
        fontSize: StyleConfigs.fontSize11,
        color: StyleConfigs.txt6B7DA2
    },
    updateInstructionsTitle:{
        // marginTop:getHeight(120),
        // marginBottom:getHeight(20),
        marginTop:60,
        marginBottom:10,
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize16
    },
    updateInstructionsContent:{
        fontSize:StyleConfigs.fontSize14,
        color:StyleConfigs.txt9FA7B8,
        height:20,
        lineHeight:20,
        // height:getHeight(40),
        // lineHeight:getHeight(40),
        flexWrap:'wrap'
    },
    updateBtn:{
        // marginTop:getHeight(60),
        // width:getWidth(235 * 2),
        // height:getHeight(88),
        marginTop:15,
        width:370/2,
        height:80/2,
        borderRadius:4,
        backgroundColor:StyleConfigs.btnBlue,
        justifyContent:'center',
        alignItems:'center'
    },
    updateBtnText:{
        fontSize:StyleConfigs.fontSize14,
        color:StyleConfigs.txtWhite
    },
    updateBtnBox:{
        marginTop:15,
        width:'100%',
        height:80/2,
        paddingHorizontal:44/2
    },
    updateBtnLeft:{
        width:230/2,
        height:80/2,
        borderRadius:4,
        backgroundColor:StyleConfigs.btnBlue,
        borderColor:StyleConfigs.border3576F5,
        borderWidth:StyleSheet.hairlineWidth,
        justifyContent:'center',
        alignItems:'center'
    },
    updateBtnRight:{
        backgroundColor:StyleConfigs.btnWhite
    }
});

export default styles