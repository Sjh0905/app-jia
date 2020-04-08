import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputBox: {
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
    },
    inputItemBox: {
        marginTop: getHeight(14),
    },
    inputTitleBox: {
        height: getHeight(76),
        justifyContent: 'flex-end'
    },
    inputTitle: {
        color: StyleConfigs.txt172A4D,
        fontSize: 12,
    },
    input: {
        borderBottomColor: StyleConfigs.borderBottomColor,
        // borderRadius: StyleConfigs.borderRadius,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(88),
        // backgroundColor: StyleConfigs.inputBackgroundF7F7FB,
        // paddingLeft: getWidth(20),
        color: StyleConfigs.txt172A4D,
    },
    wrongAns: {
        fontSize: 12,
        paddingTop: getHeight(20),
        // paddingLeft: getWidth(20),
    },
    btn: {
        position:'absolute',
        left:getWidth(30),
        bottom:getWidth(30),
        width:getWidth(DefaultWidth-60),
        height: getHeight(88),
        // marginTop: getHeight(200)
    },
    btnText: {
        // fontWeight: 'bold',
        fontSize: 18,
    },

})

export default styles