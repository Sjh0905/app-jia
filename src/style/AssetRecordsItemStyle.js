import {Platform, StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'
import device from "../configs/device/device";

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    flatBox: {
        flex: 1,
        marginBottom: (Platform.OS === "ios") && -getHeight(120) || 0,//由于安卓和iOS的分页要求不同
	    backgroundColor:StyleConfigs.bgColor,
        paddingBottom: getDeviceBottom()
    },
    rechargeRecordsItemBox: {
        height: getHeight(120),
        borderColor: StyleConfigs.borderBottomColor,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        paddingTop: getHeight(22),
        paddingBottom: getHeight(22),
        justifyContent: 'space-between',
    },
    rechargeRecordsItemBox2: {
        height: getHeight(200),
        borderColor: StyleConfigs.borderF7F8FA,
        borderStyle: 'solid',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingLeft: getWidth(30),
        paddingRight: getWidth(30),
        paddingTop: getHeight(30),
        paddingBottom: getHeight(20),
        justifyContent: 'space-between',
    },
    withdrawalsRecordsItemBox: {
        height: getHeight(120),
        borderColor: StyleConfigs.listSplitlineColor,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
        paddingTop: getHeight(22),
        paddingBottom: getHeight(22),
        justifyContent: 'space-between',
    },
    itemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    currency: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    total: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 13,
        fontWeight: 'bold',
        color: StyleConfigs.txtC5CFD5

    },
    status: {
        fontSize: 13,
        fontWeight: 'bold',
        color: StyleConfigs.txtC5CFD5
    },
    loadingMore: {
        height: getHeight(120),
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingMoreText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: StyleConfigs.txtC5CFD5
    },
    emptyIcon: {
        width:getWidth(300),
        height:getWidth(300),
    },
    emptyBox: {
        justifyContent: 'center',
        alignItems: 'center',

        paddingTop:getHeight(250),

        // flex:1,
        // height:'100%',
        // width:'100%',



        // borderStyle:'solid',
        // borderWidth:1,
        // borderColor:'red',

    },
    emptyText: {
        color:StyleConfigs.txtC5CFD5
    },
    itemLineBot:{
        // height: PlatformOS == 'ios' ? getHeight(90) : getHeight(100),
        // paddingHorizontal:getWidth(30),
        marginTop:getWidth(28),
    },
    itemSectionTitle:{
        color:StyleConfigs.txt8994A5,
        fontSize:StyleConfigs.fontSize12,
        lineHeight:getHeight(32),
    },
    itemSectionNum:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize14,
        marginTop:getHeight(9)
    },
    baseColumn1:{
        width:'36%'
    },
    baseColumn2:{
        width:'30%'
    },
    baseColumn3:{
        width:'34%'
    },


})

export default styles