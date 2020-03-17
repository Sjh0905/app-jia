import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'
import device from '../configs/device/device'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
	container2:{
    	backgroundColor:StyleConfigs.navBgColor0602,
		paddingTop: getDeviceTop()
	},
    containerBox: {
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        flex: 1,
        paddingTop: getHeight(20),

    },
    bannerIconBox:{
        // paddingHorizontal:getWidth(10),
        // backgroundColor:'red',
        borderRadius: getHeight(8),
        alignItems: 'center',
        justifyContent: 'center',
        // height:getHeight(380),
        width:'100%'
    },
    bannerIcon: {
        width: getWidth(690),
        height: getWidth(260),
        // height: getWidth(720)/710*385,
    },
    myRecommendIdBox: {
        paddingVertical: getHeight(40),
    },
    myRecommendIdTitleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    myRecommendIdText: {
        fontSize: StyleConfigs.fontSize14,
        color: StyleConfigs.txtWhite,
    },
    qrCodeAlertBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    qrCodeAlertIcon: {
        width: getWidth(24),
        height: getWidth(24),
    },
    qrCodeAlertText: {
        fontSize: StyleConfigs.fontSize13,
        paddingLeft: getWidth(8),
    },

    idCopyBox: {
        paddingTop: getHeight(20),
        flexDirection: 'row',
    },

    recommendId: {
        padding:0,
        fontSize: StyleConfigs.fontSize13,
        height: getHeight(80),
        // fontWeight: 'bold',
        width: getWidth(216),
        paddingLeft: getWidth(20),
        borderWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        borderBottomLeftRadius: 2,
        borderTopLeftRadius: 2,
        // borderColor: StyleConfigs.listSplitlineColor,
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        backgroundColor: StyleConfigs.bgF7F7FB,
        borderColor: StyleConfigs.borderC5CFD5
    },
    recommendIdCopyBtnBox: {
        marginLeft:-StyleSheet.hairlineWidth,
        width: getWidth(100),
        height: getHeight(80),
        borderWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        borderBottomRightRadius: 2,
        borderTopRightRadius: 2,
        borderColor: StyleConfigs.borderC5CFD5,
        backgroundColor:StyleConfigs.bgF7F7FB,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recommendIdCopyBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    myRecommendUrlBox: {
        paddingTop: getHeight(40),
    },
    myRecommendUrlTitleBox: {},
    myRecommendUrlTitle: {
        fontSize: 13,
        color: StyleConfigs.txtWhiteOpacity,
    },
    myRecommendUrlDetailBox: {
        paddingTop: getHeight(20),
        paddingRight: getHeight(10),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    recommendUrl: {
        padding:0,
        width: PlatformOS === 'ios' && getWidth(650) || getWidth(590),
        height: getHeight(60),
        paddingLeft: getWidth(20),
        fontSize: 13,
        fontWeight: 'bold',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: StyleConfigs.listSplitlineColor,
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        borderRadius: 4,
        backgroundColor: '#181C22',
        // borderColor: '#20252E'
    },
    shareIcon: {
        width: getWidth(30),
        height: getWidth(30),
    },
    rewardBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center'
        // paddingTop: getHeight(30),
    },
    rewardDetailBox: {
        flex:1,
        // width: '33.3%',
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        height: getHeight(160),
        alignItems: 'flex-start',
        justifyContent: 'center',
        // paddingTop: getHeight(45),
        // paddingBottom: getHeight(45),
        backgroundColor: StyleConfigs.bgColor,
        // borderColor: '#20252E'
    },
    rewardDetailBoxEnd:{
        alignItems: 'flex-end',
    },
    rewardDetailline:{
        width:1,
        height:getHeight(100),
        backgroundColor:StyleConfigs.borderBottomColor
    },
    rewardDetail: {
        marginTop:8,
        fontSize: StyleConfigs.fontSize20,
        fontWeight: 'bold'
    },
    rewardDetailTitle: {
        fontSize: StyleConfigs.fontSize13,
        color:StyleConfigs.txt9FA7B8
        // fontWeight: 'bold'
    },

    ruleBox: {
        marginTop: getHeight(30),
        marginBottom: getHeight(48),
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        paddingBottom: getHeight(10),
        paddingTop: getHeight(20),
        borderRadius: 4,
        // backgroundColor: '#181C22',
        // borderColor: '#20252E'
    },
    ruleTitleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: getHeight(24),
    },
    ruleTitleLine: {
        backgroundColor: StyleConfigs.borderColor,
        width: getWidth(145),
        height: getHeight(1),
    },
    ruleTitle: {
        fontSize: StyleConfigs.fontSize15,
        // fontWeight: 'bold',
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
    },
    ruleDetailBox: {
        paddingLeft: getWidth(33),
        paddingRight: getWidth(33),
    },
    ruleDetail: {
        fontSize: StyleConfigs.fontSize13,
        paddingTop: getHeight(15),
        lineHeight:getHeight(40),
    },
    modalBox: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: getWidth(360),
    },
    modalCloseBox: {
        alignItems: 'flex-end',
    },
    modalCloseIcon: {
        width: getWidth(33),
        height: getWidth(33),
    },
    modalQrCodeBox: {
        marginTop: getHeight(10),
        backgroundColor: StyleConfigs.btnWhite,
        width: '100%',
        borderRadius: 8,
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        paddingBottom: getHeight(37),
        paddingTop: getHeight(19),

        justifyContent: 'space-between',
    },
    modalTitleBox: {
        alignItems: 'center',
        paddingBottom: getHeight(19),
        borderColor: '#f2f2f2',
        borderStyle: 'solid',
        borderBottomWidth: 1
    },
    modalTitle: {
        fontSize: 14,
        fontWeight: 'bold',

    },
    modalQrCodeDetailBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: getHeight(15),

    },
    modalDetailText: {
        paddingTop: getHeight(13),
        fontSize: 10,
        color: '#666666'
    },
    shareBox: {
        position: 'absolute',
        bottom: getHeight(50),
        left: getWidth(50),
        right: getWidth(50),
        backgroundColor: StyleConfigs.btnWhite,
        borderRadius: 8,
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
    },
    shareTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingTop: getHeight(36),
        paddingBottom: getHeight(10),
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    shareDetailBox: {
        paddingRight: getWidth(20),
        paddingLeft: getWidth(20),
        paddingBottom: getHeight(60),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    shareItemBox: {
        alignItems: 'center',
        marginTop: getHeight(28),
    },
    shareItem: {
        width: getWidth(120),
        height: getWidth(120),
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareUrlIcon: {
        width: getWidth(46),
        height: getWidth(46)
    },
    shareUrlDetailTitle: {
        fontSize: 11,
        color: '#a5a5a5',
        paddingTop: getHeight(20),
    },
    shareUrl: {
        backgroundColor: '#77d6c7',
    },
    cancelShareBox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: getHeight(90),
        borderStyle: 'solid',
        borderColor: '#f2f2f2',
        borderTopWidth: 1,
    },
    cancelShareText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#b6b6b6',
    },
    split: {
        flex:1
    },
    center:{
        justifyContent:'center',
        alignItems: 'center'
    },
    rewardFloatText:{
        position:'absolute',
        color: '#fef159',
        fontSize: getWidth(20),
        fontWeight: 'bold',
        // top: getWidth(316),ios
        top: PlatformOS === 'ios' && '82.8%' || '80.8%',
        // right: getWidth(131)ios
        right: PlatformOS === 'ios' && '18.7%' ||'19.2%'
    },
    myPosterEnterBox: {
        width: getWidth(310),
        height: getHeight(80),
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor:StyleConfigs.btnBlue
    },
    myPosterEnterText:{
        fontSize: 13,
        color: '#fff'
    },
    myPosterEnterImage:{
        position:'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    lineView:{
        width:getWidth(DefaultWidth),
        height:10,
        backgroundColor:StyleConfigs.borderF7F7FB,
        marginLeft:-getWidth(20)
    }
})

export default styles