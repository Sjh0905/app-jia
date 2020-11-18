import {StyleSheet} from "react-native"
import device from "../configs/device/device";

const styles = StyleSheet.create({
    container: {
        flex: 1,
	    paddingTop: getDeviceTop()
    },
    webView: {
        flex: 1,
        // backgroundColor: '#10151B'
    },
    headRefreshIcon:{
        marginRight:getWidth(2),
        width:getWidth(32),
        height:getWidth(32)
    }
})

export default styles