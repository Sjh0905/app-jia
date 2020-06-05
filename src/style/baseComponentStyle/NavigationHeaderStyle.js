import {StyleSheet} from "react-native";
import StyleConfigs from "../styleConfigs/StyleConfigs";

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        height: getHeight(128),
        width: '100%',

        // borderColor: 'green',
        // borderStyle: 'solid',
        // borderWidth: 1,
    },
    androidContainer: {
        height: getHeight(88),
        // marginTop:getHeight(20),
    },
    // 返回
    goBackBox: {
        // width: getWidth(100),
        // height: getHeight(80),
        width: '100%',
        height: '100%',
        alignItems: "center",
        justifyContent: 'center',
        // backgroundColor:'#ccc'
    },
    goBack: {},


    // IOS状态栏
    IOSStatusBar: {
        height: getHeight(40),

        // borderColor: 'blue',
        // borderStyle: 'solid',
        // borderWidth: 1,
    },
    // Android状态栏
    androidStatusBar: {
        height: getHeight(0),
    },

    navBox: {
        height: getHeight(88),
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',

        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1,
    },


    // 右边的box
    rightBox: {
        position: 'absolute',
        right: getWidth(30),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightTitleBox: {},
    rightTitle: {
        color: StyleConfigs.txt9FA7B8,
        fontSize: 13,
    },

    // 左边的box
    leftBox: {
        position: 'absolute',
        //paddingLeft: getWidth(40),
        width: getWidth(100),
        // height: 'auto',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // alignItems: 'center',

        // borderColor: 'red',
        // borderStyle: 'solid',
        // borderWidth: 1,

    },
    leftTitleBox: {},
    leftTitle: {
        color: StyleConfigs.txt6B7DA2,
        fontSize: StyleConfigs.fontSize14,
    },
    goBackIcon: {
        width:isIPhoneX() ? getWidth(34) : getWidth(32),
        height: getHeight(32),
        marginLeft:-2,
    },


    // 中间的组件
    headerBox: {
        marginLeft: 'auto',
        marginRight: 'auto',
	    paddingHorizontal:getWidth(100),
	    paddingVertical:getHeight(20)
    },

    headerTitleStyle: {
        color:StyleConfigs.txt0D0E23,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: 17,
        fontWeight: 'bold',
    }
})

export default styles