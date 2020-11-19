import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ListView,
    FlatList,
    SectionList,
    Platform
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable, computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import NavHeader from '../components/baseComponent/NavigationHeader'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
// import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";

import BaseStyle from '../style/BaseStyle'
import device from "../configs/device/device";
import EmptyIcon from '../assets/BaseAssets/no-record-icon.png'
import Loading from '../components/baseComponent/Loading'
import Toast from 'react-native-root-toast'

//用来判断分页距离
const reachedThreshold = Platform.select({
    ios: -0.1,
    android: 0.1
});

const rowV1Width = (getWidth(DefaultWidth) - getWidth(20) * 2) * 0.45
const rowV2Width = (getWidth(DefaultWidth) - getWidth(20) * 2) * 0.27
const rowV3Width = (getWidth(DefaultWidth) - getWidth(20) * 2) * 0.28

@observer
export default class OrderList extends RNComponent {


	componentWillMount() {
		// this.getOrder()
		console.log('this.props',this.props);
		this.initFirst = false
	}

	componentDidMount(){
		super.componentDidMount();
		// this.getOrder();

        this.listen({key:'RE_ORDER_LIST',func:(type)=>{
			if(type == this.props.status && !this.initFirst && !this.loading){
				console.log("this is to refresh orderlist",type);
				this.pageIndex = 1;
				this.list = [];
				this.getOrder()
			}
		}})
	}

    @computed get c2cOrderStatusMap(){
		return this.$store.state.c2cOrderStatusMap;
	}

	//tab类型，从C2CHomePage传过来的，用于标注当前为哪个tab页面，不能和orderStatus混为一谈
    @observable
	status = this.props && this.props.status;
	@observable
	initFirst = true;


	//分页步长,固定值
	pageLimit = 10

    //当前是第几页
    @observable
    pageIndex = 1

	//总页码
    @observable
    totalPages = 1

	//加载中
	@observable
    loadingMore = '上拉加载更多'

    //是否继续加载
    @observable
    loadFlag = true

    // 加载中
    @observable
    loading = false

    @observable
	list = []

    @action
    goDetail = (() => {
        let last = 0;
        return (data) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();
            this.$router.push('OrderDetail',{order:data,status:this.status})
        }
    })()

    @action
    getOrder = () => {

	    if(this.loading)return

	    console.log('this.list query',{
            offset: this.pageIndex,
            maxResults: this.pageLimit,
            status: this.status, //  “PROCESSING”进行中, “COMPLETE”已完成, “CANCEL”已取消
            ctcOrderId:'',
        });

        this.loading = true;
        this.loadingMore = '加载中';
        // this.loadFlag = false;

        this.$http.send('GET_LIST_ORDERS', {
            params: {
                offset: this.pageIndex,
                maxResults: this.pageLimit,
                status: this.status, //  “PROCESSING”进行中, “COMPLETE”已完成, “CANCEL”已取消
                ctcOrderId:'',
            },
            bind: this,
            callBack: this.re_getOrder,
            errorHandler: this.error_getOrder,
        })
    }

    @action
    re_getOrder = (data) => {
        data = data && JSON.parse(data);
        console.log('状态'+this.props.status+'this.list结束加载=======',data)

		//上拉加载
        this.loadingMore = '上拉加载更多'
        this.loadFlag = true;
        this.loading = false;

        if(data.errorCode > 0){
            Toast.show('未知错误', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
            return
        }


        let orders = data && data.dataMap && data.dataMap.ctcOrders || {};
        orders.results && (this.list = this.list.concat(orders.results));//由于是分页查询，后边加载的数据和之前的拼接到一起
        // if(orders.results && orders.results.length == 0){
        //     this.loadFlag = false;
        //     this.loadingMore = '已经全部加载完毕'
        //     return;
        //
        // }

        if(orders.results && orders.results.length < this.pageLimit){
            this.loadFlag = false;
            this.loadingMore = '已经全部加载完毕'
        }

        if (this.list[0] == null) {
            this.list = [];
            return;
        };
        this.totalPages = orders.page && orders.page.totalPages;
        this.pageIndex++;//自行加一


    }

    error_getOrder = (err)=>{
        this.loading = false;
        Toast.show('请求出错', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
	}
    @action
    loadingMoreData = () => {

        if(!this.loadFlag)
            return;
        // console.log('第'+this.co+'次发起加载===',this.list);

        this.getOrder();
    }
    @action
    goBack = ()=>{
        this.$router.goBack()
    }

    // 列表为空时渲染的组件
    @action
    _renderEmptyComponent = () => {
        return (
            <View style={[styles.emptyBox]}>
                <Image source={EmptyIcon} style={styles.emptyIcon}/>
                <Text allowFontScaling={false} style={[styles.emptyText]}>暂时没有记录</Text>
            </View>
        )
    }

	@action
	listRenderRow = (rowData, index) => {

		rowData = rowData.item;
		item = rowData

		return (
			<TouchableOpacity
				onPress={()=>this.goDetail(rowData)}
				style={{
				height: getHeight(120),
				borderBottomColor: StyleConfigs.listSplitlineColor,
				borderBottomWidth: 1,
				paddingLeft: getWidth(20),
				paddingRight: getWidth(20),
				flexDirection: 'row',
				alignItems: 'center'
			}}>
				<View style={styles.rowV1}>
					<View style={{flexDirection: 'row',alignItems:'center',height: getHeight(120)}}>
						{
                            item.type == 'SELL_ORDER' &&

							<View style={[styles.ballRed]}>
								<Text  allowFontScaling={false} style={[styles.color100, styles.size12]}>{'卖'}</Text>
							</View>
							||
							<View style={[styles.ballGreen]}>
								<Text  allowFontScaling={false} style={[styles.color100, styles.size12]}>{'买'}</Text>
							</View>
						}
						<Text  allowFontScaling={false} numberOfLines={2} style={[styles.color100, styles.size15,{flexWrap: "wrap",width:'50%'}]}>{item.orderId}</Text>
					</View>
				</View>
				<View style={styles.rowV2}>
					<Text  allowFontScaling={false} style={[styles.color100, styles.size15,{marginBottom: 6}]}>￥{this.$globalFunc.accFixed(item.price,2)}</Text>
					<Text  allowFontScaling={false} style={[styles.color80, styles.size13]}>{this.$globalFunc.accFixed(item.amount,2)}</Text>
				</View>

				<View style={styles.rowV3}>
					<Text  allowFontScaling={false} style={[styles.color100, styles.size15, {marginBottom: 5}]}>{this.$globalFunc.accFixed(item.amount * item.price,2)}</Text>
					<View style={[{marginTop: 5,flexDirection:'row',alignItems:'center'}]}>

                        {this.status == 'PROCESSING' &&
							//进行中
							<Text  allowFontScaling={false} style={[item.type == 'SELL_ORDER' && BaseStyle.textRed || BaseStyle.textGreen, styles.size13]}>
								{this.c2cOrderStatusMap[this.status][item.confirmStatus] || this.c2cOrderStatusMap[this.status]}
							</Text>
							|| this.status == 'OTHER' &&
							//其他
							<Text  allowFontScaling={false} style={[item.type == 'SELL_ORDER' && BaseStyle.textRed || BaseStyle.textGreen, styles.size13]}>
								{this.c2cOrderStatusMap[this.status][item.orderStatus]}
							</Text>
							||
							//完成或者已取消
							<Text  allowFontScaling={false} style={[item.type == 'SELL_ORDER' && BaseStyle.textRed || BaseStyle.textGreen, styles.size13]}>
								{this.c2cOrderStatusMap[this.status]}
							</Text>
						}
                        {/*{*/}
                            {/*this.status == 'PROCESSING' &&*/}
                            {/*<Text  allowFontScaling={false} style={[styles.color40, styles.size13,{marginLeft:getWidth(6)}]}>29分12秒</Text>*/}
                        {/*}*/}
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	@action
	rendItemHeader = () => {
		return (
			<View style={{
				paddingLeft: getWidth(20),
				paddingRight: getWidth(20),
				flexDirection: 'row',
				alignItems: 'center',
                borderBottomColor: StyleConfigs.listSplitlineColor,
                backgroundColor: StyleConfigs.sectTitleColor,
				height: getHeight(60)
			}}>
				<Text  allowFontScaling={false} style={[styles.size12, styles.color40, {width: rowV1Width}]}>单号</Text>
				<Text  allowFontScaling={false} style={[styles.size12, styles.color40, {width: rowV2Width}]}>价格/数量</Text>
				<Text  allowFontScaling={false} style={[styles.size12, styles.color40, {width: rowV3Width}, {textAlign: 'right'}]}>金额/状态</Text>
			</View>
		)
	}
    // 渲染充值footer组件
    @action
    rendItemFooter = (loadingMore) => {

        console.log('this.list.length',this.list.length);


        if (this.list.length < 8)
            return null


        return (
            <View style={styles.loadingMore}>

                <Text  allowFontScaling={false} style={[styles.loadingMoreText]}>{loadingMore}</Text>

            </View>
        )
    }



	render() {

		let loadingMore = this.loadingMore
		let	sectionsData = this.list.length > 0 && [{data:this.list.slice(),key:'orderList'}] || [];

		return (

			<View style={styles.container}>
				<View style={styles.flatBox}>


					<SectionList
                        showsVerticalScrollIndicator={false}
                        stickySectionHeadersEnabled={true}
						renderItem={this.listRenderRow}
						renderSectionHeader={() => this.rendItemHeader()}
						ListFooterComponent={() => this.rendItemFooter(loadingMore)}
						keyExtractor={(item, index) => index.toString()}
						onEndReachedThreshold={reachedThreshold}
						onEndReached={this.loadingMoreData}
						sections={
							sectionsData
						}
						getItemLayout={(data, index) => ({
							length: getHeight(120),
							offset: getHeight(120) * index,
							index
						})}
						ListEmptyComponent={this._renderEmptyComponent}

					/>
                    {this.loading &&
						<Loading leaveNav={false}/>
					}

				</View>

			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: StyleConfigs.navBgColor0602,
        // paddingTop: getDeviceTop()
	},
    flatBox: {
        flex: 1,
		height:600,
        marginBottom: (Platform.OS === "ios") && -getHeight(120) || 0,//由于安卓和iOS的分页要求不同
        backgroundColor: StyleConfigs.bgColor,
        paddingBottom: getDeviceBottom()


    },

	listView: {
		// height:getHeight(600),
		marginTop: getHeight(20),
		backgroundColor: '#131316'
	},
	listTitleWrap: {
		height: getHeight(60),
		borderBottomWidth: 1,
		borderBottomColor: '#202126',
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: getWidth(20),
		marginRight: getWidth(20)
	},
	listTitleBase: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.4)'
	},
	listTitle1: {
		width: '40%'
	},
	listTitle2: {
		width: '35%'

	},
	listTitle3: {
		width: '25%',
		textAlign: 'right'
	},
	listRowWrap: {
		height: getHeight(120),
		borderBottomWidth: 1,
		borderBottomColor: '#202126',
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: getWidth(20),
		paddingRight: getWidth(20)
	},
	rowBase: {},
	row1: {
		width: '40%'
	},
	row2: {
		width: '35%'
	},
	row3: {
		width: '25%',
		justifyContent: 'center',
		alignItems: 'flex-end'
	},


	size12: {fontSize: 12},
	size13: {fontSize: 13},
	size14: {fontSize: 14},
	size15: {fontSize: 15},
	size16: {fontSize: 16},
	color100: {color: '#fff'},
	color80: {color: 'rgba(255,255,255,0.8)'},
	color40: {color: 'rgba(255,255,255,0.4)'},
	colorGreen: {color: '#86CB12'},
	colorRed: {color: '#EF5656'},
	bgGreen: {backgroundColor: '#86CB12'},
	bgRed: {backgroundColor: '#EF5656'},
	row3Btn: {
		width: getWidth(156),
		height: getHeight(58),
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},


	indicatorStyle: {
		backgroundColor: StyleConfigs.btnBlue,
		position: 'absolute',
		left: getWidth(750 / 6 - 750 / 8),
		bottom: 0,
		right: 0,
		height: getHeight(4),
		width: getWidth(750 / 4),
		alignSelf: 'center',
	},
	tabBoxStyle: {
		height: getHeight(80),
		justifyContent: 'center'
	},


	container2: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#000',
		padding: 10,
	},
	halfBox1: {
		flex: 1,
	},
	halfBox2: {
		flex: 1,
	},
	iptBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#0E0E0E',
		// width: getWidth(344),
		height: getHeight(72),
		borderRadius: 4,
		borderColor: '#202126',

	},
	ipt: {
		height: getHeight(72),
		color: '#fff',
		flex: 1,
		textAlign: 'center'
		// lineHeight: getHeight(72)
	},
	img: {
		width: getWidth(68),
		height: getHeight(68)
	},
	ratio: {
		width: getWidth(80),
		height: getHeight(40),
		// lineHeight:getHeight(30),
		borderStyle: 'solid',
		borderColor: '#202126',
		borderWidth: 1,
		borderRadius: 4,
		alignItems: 'center'
	},
	totalMoney: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#0E0E0E',
		borderStyle: 'solid',
		borderColor: '#202126',
		borderWidth: 1,
		borderRadius: 4,
		height: getHeight(72)
	},
	dealBtnGreen: {
		backgroundColor: '#86CB12',
		borderRadius: 4,
		height: getHeight(72),
		alignItems: 'center',
		justifyContent: 'center'
	},
	dealBtnRed: {
		backgroundColor: '#EF5656',
		borderRadius: 4,
		height: getHeight(72),
		alignItems: 'center',
		justifyContent: 'center'
	},
	line: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: getHeight(46)


	},
	rowV1: {
		width: rowV1Width,
		// backgroundColor:StyleConfigs.btnBlue
	},
	rowV2: {
		width: rowV2Width,
		flexDirection:'column',
        // backgroundColor:StyleConfigs.txt666666
    },
	rowV3: {
		width: rowV3Width,
		alignItems: 'flex-end',
        // backgroundColor:'#ccc'

    },
	rowV4: {
		width: '16%',
		alignItems: 'flex-end'

	},

	ballRed: {
		width: getWidth(32),
		height: getWidth(32),
		backgroundColor: '#EF5656',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: getWidth(16),
		marginRight: 6
	},
	ballGreen: {
		width: getWidth(32),
		height: getWidth(32),
		backgroundColor: '#86CB12',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: getWidth(16),
		marginRight: 6


	},
	chedan: {
		width: getWidth(72),
		height: getHeight(40),
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#3576F5',
		borderStyle: 'solid',
		alignItems: 'center',
		justifyContent: 'center'
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
        height:getWidth(300)
    },
    emptyBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:getHeight(350)

    },
    emptyText: {
        color:StyleConfigs.txtC5CFD5
    }


});