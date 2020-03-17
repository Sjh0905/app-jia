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
        color: StyleConfigs.txtC5CFD5,
        // paddingRight: getWidth(15)

    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',

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
        height: getHeight(70),
        // alignItems: 'center',
        justifyContent: 'center',
    },
    descText:{
        color:StyleConfigs.txtC5CFD5,
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