import {StyleSheet} from "react-native"
import StyleConfigs from "./styleConfigs/StyleConfigs"

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    modalBox: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: getWidth(640),
    },
    modalCloseBox: {
        alignItems: 'flex-end',
    },

    modalCloseIcon: {
        width: getWidth(33),
        height: getWidth(33),
    },

    modalArticleBox: {
        marginTop: getHeight(10),
        backgroundColor: StyleConfigs.btnWhite,
        width: '100%',
        borderRadius: 8,
        paddingLeft: getWidth(38),
        paddingRight: getWidth(38),
        justifyContent: 'space-between',
    },
    modalTitleBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: getHeight(20),
        paddingBottom: getHeight(20),
        borderColor: '#f2f2f2',
        borderStyle: 'solid',
        borderBottomWidth: 1
    },

    modalTitle: {
        fontSize: 16,
        // fontWeight: 'bold',
        color: StyleConfigs.txtBlue,
    },
    modalArticleDetailBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: getHeight(15),
    },

    modalDetailText: {
        paddingTop: getHeight(13),
        fontSize: 10,
        color: '#666666'
    },
    articleText: {
        paddingTop: getHeight(52),
        paddingBottom: getHeight(62),
    },
    btnBox: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'row',
        marginBottom: getHeight(40),
    },
    btn: {
        width: getWidth(240),
        height: getWidth(72),
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: StyleConfigs.btnRadius

    },
    btnText: {
        fontSize: 15,

    },

    cancelBtn: {
        borderColor: StyleConfigs.btnBlue,
    },
    confirmBtn: {
        borderColor: StyleConfigs.btnBlue,
        backgroundColor: StyleConfigs.btnBlue
    },
    cancelBtnText: {
        color: StyleConfigs.txtBlue,
    },
    confirmBtnText: {
        color: StyleConfigs.txtWhite,
    },

})

export default styles