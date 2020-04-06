import {StyleSheet} from "react-native"
import StyleConfigs from "./styleConfigs/StyleConfigs";
import device from "../configs/device/device";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:StyleConfigs.navBgColor0602,
        paddingTop: getDeviceTop()
    },
    boxPadding: {
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
    },

    titleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: getHeight(160),

        // borderWidth: 1,
        // borderStyle: 'solid',
        // borderColor: 'red'
    },

    currencyIcon: {
        width: getWidth(44),
        height: getHeight(44),
    },

    currencyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: getWidth(10),
    },


    rechargeAddressBox: {
        // marginTop: getHeight(40),
    },
    rechargeAddressTitle: {
        color: StyleConfigs.txtWhiteMoreOpacity,
        fontSize: 13,
        fontWeight: 'bold',
    },
    itemBox: {
        flex: 1,
        // borderWidth: 1,
        // borderStyle: 'solid',
        // borderColor: 'red'
    },

    itemDetailBox: {
        marginTop: getHeight(10),
        marginBottom: getHeight(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTitle: {
        color: StyleConfigs.txt6B7DA2,
        fontSize: 13,
        fontWeight: 'bold',

    },
    itemDetail: {
        fontSize: 13,
        fontWeight: 'bold',
    },

    line: {
        marginTop: getHeight(20),
        marginBottom: getHeight(20),
        height: getHeight(2),
        width: '100%',
        backgroundColor: StyleConfigs.borderBottomColor
    },
    txid: {
        width: getWidth(540),
        textAlign: 'right'
    },
    errorMessage: {
        width: getWidth(540),
        textAlign: 'right'
    },
    toAddress: {
        width: getWidth(540),
        textAlign: 'right'
    },
    btnBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // borderWidth: 1,
        // borderStyle: 'solid',
        // borderColor: 'red'
    },
    txidBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: getHeight(40),
    },
    btnLeftBox: {
        flex: 0.5,
    },
    btnRightBox: {
        flex: 0.5,
        alignItems: 'flex-end'
    },
    btnText: {
        color: StyleConfigs.txtBlue,
        fontSize: 16,
        fontWeight: 'bold',
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: StyleConfigs.btnBlue,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: StyleConfigs.borderRadius,
        width: getWidth(344),
        height: getHeight(80),
    },
    cancelWithdrawalsText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    cancelWithdrawalsBtn: {
        width: '100%',
        height: getHeight(88),
        borderRadius: StyleConfigs.btnRadius,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: getHeight(40),
    },


})

export default styles