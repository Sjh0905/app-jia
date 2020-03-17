import {StyleSheet} from "react-native"
import device from '../configs/device/device'
import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    box:{
        paddingTop: getDeviceTop(),
        backgroundColor: StyleConfigs.navBgColor0602,
        flex: 1,
        paddingBottom: getDeviceBottom()
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: StyleConfigs.navBgColor0602,
        // height:getHeight(102)
        // height: getHeight(87 + getDeviceTop()),
        // paddingBottom: getDeviceBottom()
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    // instructions: {
    //     textAlign: 'center',
    //     color: '#333333',
    //     marginBottom: 5,
    // },
    // 文字选中样式
    selectedStyle: {
        color: StyleConfigs.txtC43E4E
    },
    // 文字样式
    textStyle: {
        color: StyleConfigs.txt9FA7B8,
        // paddingTop: getHeight(1),
        fontSize: 12
    },
    // 图标样式
    iconStyle: {
        marginTop:getWidth(10),
        width: getWidth(42),
        height: getWidth(43),
        marginBottom:-getWidth(6)
    }
})

export default styles