import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    boxPadding: {
        paddingLeft: getWidth(30),
        paddingRight: getWidth(30),
    },
    itemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingTop: getHeight(30),
        // paddingBottom: getHeight(30),
        height: getHeight(100),
        borderStyle: 'solid',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: StyleConfigs.listSplitlineColor

    },
    itemBox2: {
        alignItems: 'flex-start',
        height: getHeight(138),
        paddingTop:getHeight(30),
    },
    iconBox: {
        width: getWidth(50),
        justifyContent: 'center',
        alignItems: 'center'
    },

    icon: {
        // position: 'absolute',
    },
    iconText: {
        // paddingLeft: getWidth(20),
        fontSize: 15,
        fontWeight: 'bold'
    },
    intoText: {
        fontSize: 14,
        color: StyleConfigs.txtA2B5D9,
        // paddingRight: getWidth(15)

    },
    statusText: {
        marginRight:getWidth(8),
        fontSize: 12,
        color: StyleConfigs.txtA2B5D9,
    },
    itemLeft: {

        // height:'100%',
        // flexDirection: 'row',
        justifyContent: 'center',

    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    itemRightColumn: {
        flexDirection: 'column',
        alignItems: 'flex-end',

    },
    myRecommendIcon: {
        width: getWidth(42),
        height: getWidth(42)
    },
    opacity1:{
        opacity:1
    },
    descBox:{
        height: getHeight(38),
        // alignItems: 'center',
        justifyContent: 'center',
    },
    descText:{
        marginTop:getHeight(15),
        color:StyleConfigs.txtA2B5D9,
        fontSize: 14,
    },
    intoIcon: {
        width: getWidth(14),
        height: getWidth(22),
        marginLeft:getWidth(15)
    },
    settingLogout:{
        position:'absolute',
        left:getWidth(30),
        bottom:getWidth(30),
        width:getWidth(DefaultWidth-60),
        height: getHeight(88),
        backgroundColor: StyleConfigs.btnBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: StyleConfigs.borderRadius1o5,
    }

})

export default styles