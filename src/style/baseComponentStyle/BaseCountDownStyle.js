import {StyleSheet} from "react-native"
import StyleConfigs from "../styleConfigs/StyleConfigs";

const styles = StyleSheet.create({

    // 验证码的文字
    countDownBox: {
        paddingLeft: getWidth(16),
        paddingRight: getWidth(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    countDownText: {
        color: StyleConfigs.txt172A4D,
        fontSize: 12,
    },
    countingDownText: {
        color: StyleConfigs.txtBlue,
        fontSize: 12,
    },
})

export default styles