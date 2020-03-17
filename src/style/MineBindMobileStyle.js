import {StyleSheet} from "react-native"
// import StyleConfigs from './styleConfigs/StyleConfigs'
import device from '../configs/device/device'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
	container2: {
    	// backgroundColor:'#202126',
		paddingTop: getDeviceTop()
	}
})

export default styles