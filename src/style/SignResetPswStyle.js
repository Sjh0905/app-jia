import {StyleSheet} from "react-native"
import StyleConfigs from '../style/styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    inputContainer: {
        paddingTop: getHeight(34),
    },
    pswIcon: {
        width: getWidth(31.83),
        height: getHeight(44),
    },
    pswConfirmIcon: {
        width: getWidth(39),
        height: getHeight(44),
    },
    checkBoxContainer: {
        flexDirection: 'row'
    },

    checkBoxItem: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        width: 'auto',
    },

    checkBox: {
        width: getWidth(50),
        height: getHeight(50),
        backgroundColor: '#fff',
    },

    checkBoxLabel: {
        marginLeft: getWidth(20),
    },

    commitBtn: {
        marginTop: getHeight(100),
    },
    googleIcon: {
        width: getWidth(44),
        height: getHeight(44),
    },
    codeIcon: {
        width: getWidth(38.5),
        height: getHeight(44),
    },
    tabBox:{
        height: getHeight(100),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    tab:{
        flexDirection: 'row',
        height: getHeight(36)
    },
    tabText:{
        color:StyleConfigs.txt9FA7B8
    },
    selectedTabText:{
        color: StyleConfigs.txtBlue
    }

})

export default styles