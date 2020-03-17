import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemPadding: {
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
    },
    itemBox: {
        height: getHeight(100),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        borderColor: StyleConfigs.listSplitlineColor,
        borderBottomWidth: 1,
    },
    itemLeft: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    itemText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    itemRight: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    intoText: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingRight: getWidth(14)
    },
    intoIcon: {
        width: getWidth(12),
        height: getHeight(20)
    },
    boxPadding: {
        paddingLeft: getWidth(30),
        paddingRight: getWidth(30),
    },
    logout: {
        height: getHeight(88),
        marginTop: getHeight(88),
    },
    logoutText: {
        fontSize: 18,
    },
    verifyModalBox: {
        width: getWidth(470),
        backgroundColor: StyleConfigs.modalBgWhite,
        borderRadius: StyleConfigs.borderRadius2,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    modalArticleBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: getHeight(50),
        paddingBottom: getHeight(50),
    },
    verifyModalIcon: {
        width: getWidth(120),
        height: getWidth(106),
        marginBottom: getHeight(40),
    },
    modalArticleText: {
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    modalFooterBox: {
        borderColor: StyleConfigs.lineColorLight,
        borderTopWidth: 1,
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: getHeight(80),
    },
    modalFooterText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: StyleConfigs.txtBlue,

    },

})

export default styles