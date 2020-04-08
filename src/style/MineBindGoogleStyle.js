import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'
import device from '../configs/device/device'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
	container2: {
    	// backgroundColor:'#202126',
		paddingTop: getDeviceTop()
	},
    containerBox: {
        // paddingTop: getHeight(56),
    },
    stepHeaderBox: {
        // justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepIcon: {
        width: getWidth(40),
        height: getWidth(40),
    },
    stepHeaderText: {
        color: StyleConfigs.txt172A4D,
        fontSize: StyleConfigs.fontSize15,
        // fontWeight: "700",
        // paddingLeft: getWidth(16),
    },
    downloadBox: {
        justifyContent: 'space-between',
        // justifyContent:'center',
        flexDirection: 'row',
        marginTop: getHeight(30),
        marginBottom: getHeight(48),
        // backgroundColor:'red'
    },
    downloadItem: {
        flexDirection: 'row',
        width: getWidth(136 * 2),
        height: getHeight(36 * 2),
        backgroundColor: StyleConfigs.bgBlack,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: getWidth(36),
        // paddingBottom: getHeight(24),
    },
    downloadIcon: {
        width: getWidth(36),
        height: getWidth(40),
    },
    downloadText: {
        // marginTop:2,
        fontSize: 15,
    },
    codeContainer: {
        // paddingLeft: getWidth(56),
    },
    promptBox: {
        marginTop: getHeight(14),
    },
    promptText: {
        fontSize: 12,
        lineHeight: 20,
    },
    codeDetailContainer: {
        marginTop: getHeight(24),
    },
    codeTitle: {
        fontSize: 14,
    },
    codeDetailBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: getHeight(12),

    },
    codeInput: {
        padding:0,
        height: getHeight(60),
        width: getWidth(254 * 2),
        borderStyle: 'solid',
        borderColor: StyleConfigs.borderBottomColor,
        borderRadius: StyleConfigs.inputBorderRadius,
        borderWidth: 1,
        textAlign: 'center',
        fontSize:StyleConfigs.fontSize14,
        paddingLeft:9,
        paddingRight:5,
    },
    copyBtn: {
        width:PlatformOS == 'ios' && getWidth(160) || getWidth(145),
        height: getHeight(60),
        marginLeft:PlatformOS == 'ios' && 2 || 5,
        backgroundColor:'#rgba(53,118,245,0.04)',
        borderColor:'#rgba(53,118,245,0.15)',
        borderWidth:StyleSheet.hairlineWidth,
    },
    copyText: {
        fontSize: 13,
        // fontWeight: 'bold',
    },
    codePrompt: {
        marginTop: getHeight(24),
        fontSize: 12,
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
    nextBtnText: {
        fontSize: 18,
    },

})

export default styles