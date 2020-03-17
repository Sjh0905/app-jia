import {StyleSheet} from "react-native"
import StyleConfigs from "./styleConfigs/StyleConfigs";
import device from '../configs/device/device'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:StyleConfigs.navBgColor0602
    },
	container2:{
		paddingTop: getDeviceTop()
	},
    tabBoxStyle: {
        height: getHeight(80),
        justifyContent: 'center'
    },
    indicatorStyle: {
        backgroundColor: StyleConfigs.btnBlue,
        position: 'absolute',
        left: getWidth(750 / 3 - 750 / 6),
        bottom: 0,
        right: 0,
        height: getHeight(4),
        width: getWidth(750 / 6),
        alignSelf: 'center',
    },
    tabLabel: {
        fontWeight: 'bold',
    }
})

export default styles