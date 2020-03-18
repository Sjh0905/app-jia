import {StyleSheet} from "react-native"
import device from "../configs/device/device";
import StyleConfigs from "./styleConfigs/StyleConfigs";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: StyleConfigs.bgColor,
        // backgroundColor: StyleConfigs.bgColor,
        // padding:getWidth(30),
        paddingTop: getDeviceTop(),//+getHeight(40),
        paddingBottom: getDeviceBottom(),
    },
    container2: {
        // flex: 1,
        backgroundColor: StyleConfigs.bgColor,
        padding:getWidth(35),
        paddingTop: getDeviceTop()
    },
    bankImg:{
        width:getWidth(34),
        height:getWidth(28)
    },
    bankTitleText:{
        marginLeft:getWidth(10),
        lineHeight:getHeight(50),
        fontSize:StyleConfigs.fontSize14,
        color:StyleConfigs.txtWhite
    },
    bankListItem:{
        width:'100%',
        alignItems:'center'
    },
    bankListTitle:{
        height:getHeight(80),
        flexDirection:'row',
        alignItems:'center',

    },
    inputTitleBoxRow: {
        height: getHeight(80),
        alignItems: 'center',
        flexDirection: 'row'
    },
    bankInfoOper:{
        width:'100%',
        height:getHeight(80),
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        // backgroundColor:'#ccc'
    },
    inputTitle: {
        color: StyleConfigs.txtWhiteOpacity,
        fontSize: 13,
    },
    bankInfoBox:{
        paddingVertical:getHeight(15),
        paddingHorizontal:getWidth(60),
        width:getWidth(690),
        // height:getHeight(200),
        borderRadius:6,
        borderTopWidth:StyleSheet.hairlineWidth,
        borderTopColor:StyleConfigs.lineBlue,
        backgroundColor:StyleConfigs.blockNewBg,
        // opacity:0.6,
        paddingBottom:getHeight(15)
    },
    bankInfoText:{
        lineHeight:getHeight(55),
        fontSize:StyleConfigs.fontSize15,
        color:StyleConfigs.txtWhite
    },
    operBox:{
        flexDirection:'row',
        alignItems:'center',
        // backgroundColor:'red'
    },
    copyBtn:{
        // position:'absolute',
        width:getWidth(88),
        height:getHeight(40),
        // right:getWidth(20),
        borderColor:StyleConfigs.lineBlue,
        borderWidth:StyleSheet.hairlineWidth,
        borderRadius:StyleConfigs.borderRadius,
        alignItems:'center',
        justifyContent:'center',
        marginRight:getWidth(20)
    },
    addImg:{
        width:getWidth(28),
        height:getWidth(28),
        marginRight:getWidth(20)
    },
    bbtn: {
        width:PlatformOS === 'ios' && getWidth(344*2) || getWidth(330*2),
        height: getHeight(80),
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row'
    },
    cancleBtn:{
        borderWidth:1,
        borderColor:StyleConfigs.lineBlue
    },
    confirmBtn:{
        backgroundColor:StyleConfigs.btnBlue
    },
    emptyBox:{
        width:'100%',
        height:'50%',
        alignItems:'center',
        // justifyContent:'center',
        // backgroundColor:StyleConfigs.btnBlue
    },
    emptyText:{
        fontSize:StyleConfigs.fontSize15,
        color:StyleConfigs.txtC5CFD5,
    },
	containerMake:{
		height:getHeight(116),
		paddingLeft:getWidth(30),
		flexDirection:'row',
		alignItems:'center',
		// backgroundColor:'red',
		// color: '#ffff00',
	},
	title:{
        color:StyleConfigs.txt172A4D,
    	fontSize: 28,
		fontWeight: '600',
		fontFamily:'System'
	},
	containerAdd:{
    	flex:1,
		display:'flex',
		// justifyContent: 'center',
		alignItems: 'center',
		paddingTop: getWidth(192)
		// backgroundColor:'pink',
		// flexDirection:'row',
	},

	ImageMake:{
		// width: getWidth(416),
		// fontSize: 16,
		justifyContent:'center',
		alignItems:'center'
	},
	ImageMB:{

	},
	addA:{
		width: getWidth(171.4),
		height:getHeight(131),
		marginBottom: getHeight(32),
		borderTopLeftRadius:getWidth(12),
		borderTopRightRadius:getWidth(12),
	},
	addBor: {
        width: getWidth(248),
		height: getHeight(68),
		marginTop: getHeight(60),
		// backgroundColor:'pink',
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		borderStyle: 'solid',
		borderWidth:getWidth(1),
		borderColor: '#cccccc',
	},
	realText: {
        fontSize: 16,
        color: '#8994A5',
	},
	addBtn:{
		width: getWidth(26),
		height: getHeight(26),
		marginRight: getWidth(6)
	},
	addText: {
        fontSize: 14,
		color:'#3576F5',
		fontWeight: '600',
		fontFamily:'System'
	},



	real:{
    	width:'100%',
	},
    size11: {fontSize: 11},
    size12: {fontSize: 12},
	size28: {fontSize: 28},
    color100: {color: '#fff'},
    color80: {color: 'rgba(255,255,255,0.8)'},
    color60: {color: 'rgba(255,255,255,0.6)'},
    color40: {color: 'rgba(255,255,255,0.4)'},
    colorGreen: {color: '#02987D'},
    colorRed: {color: '#C73F4F'},

    bgGreen: {backgroundColor: '#02987D'},
    bgRed: {backgroundColor: '#C73F4F'},





	listContainer:{
		backgroundColor:'#F7F7FB',
		paddingTop:getHeight(20)
	},
	itemWrap:{
		// backgroundColor:'red',
		// paddingHorizontal:getWidth(30),
		// paddingTop:getHeight(26),
		marginBottom:getHeight(20)

	},
	itemLine1:{
    	flexDirection:'row',
		justifyContent:'space-between',
		marginBottom:getHeight(32)
	},
	bankbank:{
		flexDirection:'row',
		alignItems:'center'
	},
	bank:{
    	width:getWidth(30),
		height:getWidth(30),
		marginRight:getWidth(10),
	},
	bankTxt:{
		padding: 0,
		includeFontPadding: false,
		textAlignVertical: 'center',
		fontFamily: 'System',
		fontWeight: '600',
		color:'#172A4D',
	},
	itemLine2:{
		marginBottom:getHeight(12),



	},
	lineName:{
        fontSize:14,
		color:'#8994A5',
		fontFamily: 'PingFangSC-Regular',
	},
	itemLine3:{
		marginBottom:getHeight(30),

	},
	lineCard:{
		fontFamily: 'PingFangSC-Regular',
		fontSize:16,
		color:'#172A4D',
		fontWeight: '600',
	},
	btn:{
    	// width:'100%',
        // height:getHeight(148),
		// paddingHorizontal:15,
		// marginTop:getHeight(151),
	},
    btnbotbg: {//带有白色背景的底部样式
        position:'absolute',
        left:0,
        bottom:0,
        width:getWidth(DefaultWidth),
        // height: getHeight(148),
        padding:getWidth(30),
        paddingBottom:getWidth(30)+getDeviceBottom(),
        backgroundColor: StyleConfigs.bgColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: StyleConfigs.borderRadius1o5,
    },
	buttonsave:{
		justifyContent:'center',
		alignItems:'center',
		width:getWidth(DefaultWidth-60),
		height:getHeight(88),
		borderRadius:StyleConfigs.borderRadius1o5,
		backgroundColor:StyleConfigs.btnBlue,
	},
	button:{
		fontSize:16,
		color:'white',
	},
	radioWrap:{
    	flexDirection:'row',
		alignItems:'center'
	},
	radioBorder:{
		width: getHeight(30),
		height: getHeight(30),
		justifyContent:'center',
		alignItems:'center',
		marginRight:getWidth(10),
		borderStyle: 'solid',
		borderWidth:getWidth(4),
		borderColor:'#E8EBEE'
	},
	radioSelect:{
		width:getWidth(14),
		height:getWidth(14),
		backgroundColor:'#3576F5'
	},


	text14Red:{
		fontSize:14,
		color:'#3576F5'
	},
	text14Gray:{
		fontSize:14,
		color:'#8994A5'
	}







});
export default styles