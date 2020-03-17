import {StyleSheet} from "react-native"
import StyleConfigs from "./styleConfigs/StyleConfigs";
// import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    nextBtn: {
        // height: getHeight(88),
        // width: '100%',
        // marginTop: getHeight(286),
        position:'absolute',
        left:getWidth(30),
        bottom:getWidth(30),
        width:getWidth(DefaultWidth-60),
        height: getHeight(88),
        backgroundColor: StyleConfigs.btnBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: StyleConfigs.borderRadius1o5,
    },
})

export default styles