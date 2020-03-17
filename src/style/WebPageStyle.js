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
    }
})

export default styles