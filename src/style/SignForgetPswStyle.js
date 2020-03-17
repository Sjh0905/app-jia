import {StyleSheet} from "react-native"
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import device from "../configs/device/device";

const styles = StyleSheet.create({
    container: {
        flex: 1,
	    paddingTop: getDeviceTop()
    },
    forgetPswBox: {
        flex: 1,
        paddingTop: getHeight(34),
    },
    emailIcon: {
        // width: getWidth(44),
        // height: getWidth(33),
    },
    mobileIcon:{
        width: getWidth(44),
        height: getWidth(44),
    },
    codeIcon: {
        // width: getWidth(38.5),
        // height: getWidth(44),
    },
    commitBtn: {
        marginTop: getHeight(100),
    },


    tabBox:{
        height:getHeight(80),
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'stretch'
    },
    tabItem:{
        width: getWidth(160),
        justifyContent:'center',
        alignItems: 'center'
    },
    tabItemSelected:{
        borderBottomWidth: 2,
        borderBottomColor: StyleConfigs.txtBlue
    },
    tabText:{
        color: StyleConfigs.txt9FA7B8
    },
    tabTextSelected:{
        color: StyleConfigs.txtBlue
    }
})

export default styles