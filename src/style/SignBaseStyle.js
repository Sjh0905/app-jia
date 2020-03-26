import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    // 整个输入部分的container
    inputContainer: {
        paddingLeft: getWidth(60),
        paddingRight: getWidth(60),
    },
    inputContainerPaddingTop: {
        paddingTop: getHeight(34),
    },
    // input detail
    inputItemBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop:getHeight(20),
        // alignItems: 'center',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        height: getHeight(120),
        borderColor: StyleConfigs.borderBottomColor,
        width: '100%',

    },

    inputItemBoxPaddingTop: {},


    // 图标container
    iconBox: {
        // flex: 9.53,
        width: getWidth(44),
        // alignItems: 'center',
        // justifyContent: 'center'
    },

    // 图标
    icon: {
        width: getWidth(44),
        height: getHeight(44),
    },

    // 输入框
    input: {
        flex: 90.47,
        fontSize: 16,
        // marginLeft: getWidth(30),
        color: StyleConfigs.txt172A4D,
    },

    // 如果有验证码的输入框
    inputLeftBox: {
        flex: 74.61,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputLeftIconBox: {
        width: getWidth(30),
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    inputLeftInput: {
        // flex: 86,
        width: getWidth(540),
        fontSize: 15,
        // marginLeft: getWidth(30),
        color: StyleConfigs.txt172A4D,
    },


    // 验证码的文字
    inputRightBox: {

        marginTop:getHeight(30),
        justifyContent: 'center',
        alignItems: 'center',
        // flex: 25.39,
        width: getWidth(160),
        height: getHeight(30),
        borderColor: StyleConfigs.borderC5CFD5,
        borderStyle: 'solid',
        borderLeftWidth: 1,
    },

    inputRightText: {
        color: StyleConfigs.txt172A4D,
        fontSize: StyleConfigs.fontSize13,
    },


    // 按钮
    button: {
        width: '100%',
        height: getHeight(88),
        backgroundColor: StyleConfigs.btnBlue,
        borderRadius: StyleConfigs.borderRadius2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        fontSize: 18,
        color: StyleConfigs.txtWhite,
    },


    // 错误提示
    wrongAnsBox: {
        width: '100%',
        flexDirection: 'row',
    },
    wrongAnsPadding: {
        // flex: 1.04,
    },
    wrongAns: {
        // flex: 8.96,
        // marginLeft: getWidth(60),
        paddingTop: getHeight(15),
        fontSize: 12,
        color: StyleConfigs.txtError,

    },

})

export default styles