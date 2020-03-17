import {StyleSheet} from "react-native"
import StyleConfigs from "./styleConfigs/StyleConfigs";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerBox: {
        paddingTop: getHeight(38),
    },
    titleText: {
        fontSize: 13,
        color: StyleConfigs.txt172A4D,
    },
    inputDetailBox: {
        // borderWidth: StyleSheet.hairlineWidth,
        // borderStyle: 'solid',
        // // borderColor: StyleConfigs.listSplitlineColor,
        // borderColor: StyleConfigs.borderBottomColor,
        // width: '100%',
        // height: getHeight(88),
        // borderRadius: StyleConfigs.inputBorderRadius,
        // backgroundColor: StyleConfigs.inputBackgroundF7F7FB,
        // marginTop: getHeight(20),
        // // justifyContent: 'center',

        alignItems: 'center',
        flexDirection: 'row',
        marginTop: getHeight(20),
        borderBottomColor: StyleConfigs.borderBottomColor,
        // borderRadius: StyleConfigs.borderRadius,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(88),
        // backgroundColor: StyleConfigs.inputBackgroundF7F7FB,
        // paddingLeft: getWidth(20),
    },
    inputDetail: {
        width: '100%',
        height: '100%',
        // paddingLeft: getWidth(30),
        color: StyleConfigs.txt172A4D
    },
    inputMobileTitleBox: {
        width: getWidth(100),
        borderRightWidth: 1,
        borderColor: StyleConfigs.borderC5CFD5,
        borderStyle: 'solid',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    spaceBetweenBox: {
        justifyContent: 'space-between',
    },
    inputMobileTitle: {
        color: StyleConfigs.txt172A4D,
        fontSize: 13,
    },
    inputMobileDetail: {
        width: getWidth(600),
        height: '100%',
        paddingLeft: getWidth(30),
        color: StyleConfigs.txtWhite,
    },
    inputVerificationTitleBox: {
        width: getWidth(160),
        borderLeftWidth: 1,
        borderColor: StyleConfigs.borderBottomColor,
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputVerificationTitle: {
        color: StyleConfigs.txtBlue,
        fontSize: 13,
    },
    inputVerificationDetail: {
        width: getWidth(520),
        height: '100%',
        // paddingLeft: getWidth(30),
        color: StyleConfigs.txt172A4D,
    },

    inputBoxBottom: {
        marginBottom: getHeight(34),
    },
    btn: {
        width: '100%',
        height: getHeight(88),
        marginTop: getHeight(60),
        backgroundColor: StyleConfigs.btnBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: StyleConfigs.inputBorderRadius
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
        fontSize: 18,
        color: StyleConfigs.txtWhite,
    },


})

export default styles