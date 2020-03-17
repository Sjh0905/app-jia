import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    verifyBox: {
        flex: 1
    },
    tabBoxStyle: {
        height: getHeight(80),
        justifyContent: 'center'
    },
    indicatorStyle: {
        backgroundColor: StyleConfigs.btnBlue,
        position: 'absolute',
        left: getWidth(750 / 4 - 750 / 8),
        bottom: 0,
        right: 0,
        height: getHeight(4),
        width: getWidth(750 / 4),
        alignSelf: 'center',
    },
})

export default styles