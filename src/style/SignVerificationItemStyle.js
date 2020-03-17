import {StyleSheet} from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    inputBox: {
        paddingTop: getHeight(40),
    },
    inputLeftBox: {
        flexDirection: 'row',
    },
    inputItemBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        borderStyle: 'solid',
        borderBottomWidth: StyleSheet.hairlineWidth,
        // paddingBottom: getHeight(38),
    },
    iconBox: {
        width: getWidth(66),

    },
    icon: {
        width: getWidth(48),
        height: getWidth(48),
    },

    inputDetail: {
        width: getWidth(564),
        fontSize: 15,
    },

    doubleInputDetail: {
        width: getWidth(400),
    },

    inputButton: {
        marginTop: getHeight(100),
    },

    getVerificationCodeBox: {
        paddingLeft: getWidth(16),

        justifyContent: 'center',
        alignItems: 'center',

        borderStyle: 'solid',
        borderLeftWidth: 1,

    },
    getVerificationCode: {
        color: '#rgba(255,255,255,0.8)'
    }


})

export default styles