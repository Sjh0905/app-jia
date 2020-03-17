import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'
import device from "../configs/device/device";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleConfigs.navBgColor0602,
        paddingTop: getDeviceTop()

    },
    containerBox: {
        flex:1,
        paddingTop: getHeight(30),
        backgroundColor:StyleConfigs.bgColor,
        // paddingTop: getHeight(30),
        // paddingBottom: (device.DeviceModel === 'iPhone X')&&getHeight(534)||getHeight(555),

        // borderColor: 'red',
        // borderWidth: 1,
        // borderStyle: 'solid',
    },

    // 一级标题
    titleBox: {
        borderStyle: 'solid',
        borderLeftWidth: getWidth(6),
        borderColor: StyleConfigs.txtWhite,
        paddingLeft: getWidth(18),
        marginBottom: getHeight(14),
        marginTop: getHeight(22),
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: StyleConfigs.txtWhite,
    },


    // 二级标题
    twoLevelTitleBox: {
        marginBottom: getHeight(14),
        marginTop: getHeight(6),
    },
    twoLevelTitleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: StyleConfigs.txtWhiteOpacity,
        lineHeight: 24,
    },

    // 三级标题
    threeLevelTitleBox: {
        marginBottom: getHeight(14),
        marginTop: getHeight(6),
    },
    threeLevelTitleText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: StyleConfigs.txtWhiteOpacity,
        lineHeight: 24,
    },


    // 一级文字
    oneLevelArticleBox: {
        marginBottom: getHeight(14),
    },
    oneLevelArticleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: StyleConfigs.txtWhiteLittleOpacity,
        lineHeight: 24,
    },

    // 三级文字
    articleBox: {
        marginBottom: getHeight(14),
    },
    articleText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: StyleConfigs.txtWhiteLittleOpacity,
        lineHeight: 24,
    },

    // 二级文字
    twoLevelArticleBox: {
        marginBottom: getHeight(14),
    },

    twoLevelArticleText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: StyleConfigs.txtWhiteOpacity,
        lineHeight: 24,
    },

    // 总结
    endArticleBox: {
        marginBottom: getHeight(45 + getDeviceBottom(true))
    },
    endArticle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: StyleConfigs.txtWhite,
        lineHeight: 24,
    }

})

export default styles