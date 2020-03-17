import {StyleSheet} from "react-native"
import StyleConfigs from "./styleConfigs/StyleConfigs"

const styles = StyleSheet.create({
    container: {
        flex: 1,

        // borderWidth: 2,
        // borderColor: 'red',
        // borderStyle: 'solid',

    },

    inputBox: {
        marginTop: getHeight(60),
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: StyleConfigs.inputBorderColor,
        backgroundColor: StyleConfigs.inputBackgroundColor,
        borderRadius: StyleConfigs.inputBorderRadius,
        width: '100%',
        height: getHeight(88),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: '100%',
        paddingLeft: getWidth(20),
        fontSize: 13,
        color: StyleConfigs.txtWhite,
    },
    doubleInput: {
        width: '70%',
        height: '100%',
        paddingLeft: getWidth(20),
        fontSize: 13,
        color: StyleConfigs.txtWhite,
    },
    countDownBox: {
        width: '20%',
        height: getHeight(36),
        borderColor: StyleConfigs.inputBorderColor,
        borderStyle: 'solid',
        borderLeftWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    countDownText: {
        fontSize: 13,
    },
    btn: {
        width: '100%',
        height: getHeight(88),
        marginTop: getHeight(60)
    },
    btnText: {
        fontSize: 15,
        fontWeight: 'bold',
    },

})

export default styles