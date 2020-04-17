import {StyleSheet} from "react-native"
import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import device from '../configs/device/device'

const styles = StyleSheet.create({
    overflow: {
        // overflow: 'hidden'
    },
    container: {
        // flex: 1
        paddingBottom: getDeviceBottom()
    },
	container2: {
		backgroundColor:StyleConfigs.navBgColor0602,
		paddingTop: getDeviceTop(),
        paddingBottom: getDeviceBottom()
	},
    boxPadding: {
        paddingLeft: getWidth(20),
        paddingRight: getWidth(20),
    },
    availableBox: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: getHeight(54),
        paddingBottom: getHeight(34),

        borderColor: StyleConfigs.borderBottomColor,
        borderStyle: 'solid',
        borderBottomWidth: 1,

    },
    availableTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: StyleConfigs.txtC5CFD5,
    },
    availableArticle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: StyleConfigs.txt172A4D,
        marginTop: getHeight(10),
    },
    inputBox: {
        marginTop: getHeight(32),
    },
    inputBoxTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    withdrawalsAmountTitle: {
        fontSize: 13,
        color: StyleConfigs.txt9FA7B8,
        fontWeight: 'bold',
    },
    withdrawalsMinimumAmountBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    withdrawalsMinimumAmountTitle: {
        fontSize: 13,
        color: StyleConfigs.txt9FA7B8,

    },
    withdrawalsMinimumAmountDetail: {
        fontSize: 13,
        color: StyleConfigs.txt172A4D,
    },

    inputBoxMiddle: {
        // marginTop: getHeight(20),
        borderStyle: 'solid',
        borderColor: StyleConfigs.borderBottomColor,
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        borderWidth: StyleSheet.hairlineWidth,
        height: getHeight(88),
        borderRadius: StyleConfigs.inputBorderRadius,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    input: {
        width: '87%',
        paddingLeft: getWidth(22),
        color: StyleConfigs.txt172A4D,
        fontSize: 13,
    },
    withdrawalsAllBox: {
        // borderStyle: 'solid',
        // borderColor: 'red',
        // borderWidth: 2,
    },
    withdrawalsAllText: {
        paddingRight: getWidth(22),
        // fontSize:20,
        fontSize: 13,
        fontWeight: 'bold',
    },

    withdrawalsFeeBox: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        marginTop: getHeight(18),
    },
    withdrawalsFee: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    withdrawalsRealAmount: {
        marginTop: getHeight(18),
        flexDirection: 'row',
        alignItems: 'center'
    },
    withdrawalsFeeTitle: {
        fontSize: 12,
        color: StyleConfigs.txtC5CFD5,

    },
    withdrawalsFeeArticle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: StyleConfigs.txt172A4D
    },

    // 提现地址
    withdrawalsAddressBox: {
        // marginTop: getHeight(28),
        marginTop: getHeight(18),
        flex: 1,
    },
    withdrawalsAddressTitleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    withdrawalsAddressTitle: {
        fontSize: 13,
        paddingTop: 5,
        paddingBottom: 5
    },
    withdrawalsAddressTitleIconBox: {
        width: getWidth(100),
        height: getWidth(36),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    upAndDownIcon: {
        width: getWidth(20),
        height: getWidth(10),
    },

    withdrawalsAddressDetailBox: {
        marginTop: getHeight(22),
        flex: 1,
    },

    // 新增提现地址
    addNewAddressBox: {
        marginBottom: getHeight(18),
    },
    addressInputItem: {
        width: '100%',
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        borderWidth: 1,
        borderColor: StyleConfigs.borderBottomColor,
        borderStyle: 'solid',
        borderRadius: StyleConfigs.inputBorderRadius,
    },
    addNewAddressInputItem: {
        height: getHeight(88),

    },
    addressInput: {
        width: '100%',
        paddingLeft: getWidth(22),
        color: StyleConfigs.txt172A4D,
        fontSize: 13,
        height: '100%',
    },
    addressInputItemMarginTop: {
        // marginTop: -1,
        marginTop: 10
    },
    addressListBox: {
        flex: 1,
        // position:'absolute',
        // marginBottom: getHeight(140),

        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderColor: 'red',
    },
    addressListButton:{
        paddingTop: getHeight(4),
        paddingBottom: getHeight(4)
    },
    addressListItemBox: {
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        // height: getHeight(100),
        paddingRight: getWidth(20),
        paddingLeft: getWidth(20),

    },
    addressDeleteButton:{
        backgroundColor: '#FFFFFF',
        width: getWidth(60),
        justifyContent: 'center',
        alignItems: 'center'
    },
    addressListItem: {
        // height: '100%',
        justifyContent: 'space-between',
        paddingTop: getHeight(14),
        paddingBottom: getHeight(14),
        width: getWidth(590),


        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderColor: 'red',
    },
    deleteIconBox: {
        width: getWidth(60),
        alignItems: 'flex-end'
    },
    deleteIcon: {
        width: getWidth(30),
        height: getWidth(30),
    },
    addressSelectedBox: {},
    addressSelectedItem: {
        justifyContent: 'space-between',
        paddingTop: getHeight(14),
        paddingBottom: getHeight(14),
        flex:1
    },
    addressAddNewBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: getHeight(88),
    },
    addNewAddressDetailBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAddressIcon: {
        width: getWidth(30),
        height: getWidth(30),
    },
    addNewAddressText: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingLeft: getWidth(10),
    },
    btn: {
        // position: 'absolute',
        // bottom: getHeight(40),
        height: getHeight(88),
        borderRadius: StyleConfigs.borderRadius,
        width: '100%',
    },
    btnText: {
        fontSize: 15,
        fontWeight: 'bold',
    },

    inputBoxButton: {
        alignItems: 'center',
        marginLeft: getWidth(20),
        marginRight: getWidth(20),
        height: getHeight(100)
    },
    cancelBtn: {
        borderColor: StyleConfigs.btnBlue,
    },
    confirmBtn: {
        borderColor: StyleConfigs.btnBlue,
        backgroundColor: StyleConfigs.btnBlue
    },
    cancelBtnText: {
        color: StyleConfigs.txtBlue,
    },
    confirmBtnText: {
        color: StyleConfigs.txtWhite,
    },
    EOSWarning:{
        // marginTop: getHeight(34),
        marginTop:getHeight(10),
        marginBottom:getHeight(10),
        color: '#EF5656',
        fontSize: 12,
        lineHeight: 20
    },
    label:{
        textAlign: 'right',
        paddingRight: 6,
        width: getWidth(186),
        color: StyleConfigs.placeholderTextColor
    },
    value:{
        flex: 1,
        lineHeight: 17
    },
    addressTextBox:{
        flexDirection: 'row'
    },
    colorTransparnet:{
        color: 'transparent',
        // color: 'blue'
    },
    transparentBox:{
        paddingTop:getHeight(30),
        // borderWidth: 1,borderColor: 'red',
        paddingRight: getWidth(90),
        paddingLeft: getWidth(20),
    },




	tibiWrap:{
		marginBottom:getHeight(26),
		marginTop:getHeight(40)
	},


	tibiTxt:{
		fontSize:24,
		color:'#172A4D',
		fontWeight:'bold',
		fontFamily:'System'
	},

	xuanzebizhongWrap:{
		width:'100%',
		height:getHeight(88),
        paddingHorizontal:getWidth(30),
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		backgroundColor:'#f7f8fa',
		marginBottom:getHeight(56)

	},

	tibidizhiWrap:{
        flexDirection:'row',
	},
	tibidizhiTxt:{
		fontSize:12,
		color:'#172A4D'
	},
    tibidizhiTxtTips:{
		color:StyleConfigs.txtRed
	},

	inputBoxMiddle2: {
        // backgroundColor:'#ccc',
		marginTop: getHeight(20),
		borderStyle: 'solid',
		borderBottomColor: '#e7ebee',
		borderBottomWidth: StyleSheet.hairlineWidth,
		height: getHeight(68),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom:getHeight(29)
	},
	inputBoxMiddle3: {
		marginTop: getHeight(20),
		borderStyle: 'solid',
		borderBottomColor: '#e7ebee',
		borderBottomWidth: StyleSheet.hairlineWidth,
		height: getHeight(68),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom:getHeight(5)
	},
	input2: {
        padding:0,
        // backgroundColor:'green',
		width: '87%',
		color: StyleConfigs.txt172A4D,
		fontSize: 16,
		borderWidth:0
	},
	input22:{
        padding:0,
		width: '50%',
		color: StyleConfigs.txt172A4D,
		fontSize: 16,
		borderWidth:0
	},


	wordsWrap:{
    	backgroundColor:'#f7f7fb',
		paddingHorizontal:getWidth(36),
		paddingTop:getHeight(36),
		paddingBottom:getHeight(36),

	},
    currencyName:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize16,
        fontWeight:'bold'
    },
    selectCurrency:{
        color:StyleConfigs.txt6B7DA2,
        fontSize:StyleConfigs.fontSize12
    },
    chainNameText:{
        color:StyleConfigs.txt172A4D,
        fontSize:StyleConfigs.fontSize12
    },
    chainNameBtnBox:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:getHeight(30)
    },
    chainNameBtn:{
        width:getWidth(76 * 2),
        height:getHeight(32 * 2),
        borderWidth:1,
        backgroundColor:StyleConfigs.bgF7F8FA,
        borderColor:StyleConfigs.borderF7F8FA,
        borderRadius:StyleConfigs.borderRadius1o5,
        justifyContent:'center',
        alignItems:'center',
        marginRight:getWidth(20)
    },
    chainNameBtnSel:{
        borderColor:StyleConfigs.btnBlue,
    },
    usdtTypeText:{
        color:StyleConfigs.txt6B7DA2,
        fontSize:StyleConfigs.fontSize12
    },
    usdtTypeTextSel:{
        color:StyleConfigs.txtBlue,
    }


})

export default styles