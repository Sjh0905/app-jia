/**
 * Created by chest on 10/04/2019.
 */



import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	PanResponder,
	Platform,
	StyleSheet,
	TouchableOpacity,
	ViewPropTypes,
	View,
	Text,
	Image
} from 'react-native';

export default class DragDelete extends Component {
	constructor(props) {
		super(props);

		this._panResponder = PanResponder.create({
			onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponderCapture,
			onPanResponderGrant: this._handlePanResponderGrant,
			onPanResponderMove: this._handlePanResponderMove,
			onPanResponderRelease: this._handlePanResponderEnd,
			onPanResponderTerminate: this._handlePanResponderEnd,
			onShouldBlockNativeResponder: (event, gestureState) => false,//表示是否用 Native 平台的事件处理，默认是禁用的，全部使用 JS 中的事件处理，注意此函数目前只能在 Android 平台上使用
		});
		//上一次滑动最后的left偏移量
		this._previousLeft = 0;
		//left偏移动画
		this.state = {
			currentLeft: new Animated.Value(this._previousLeft),
		};
	}






	//是否需要成为move事件响应者，返回true直接走onPanResponderMove
	_handleMoveShouldSetPanResponderCapture = (event, gestureState)=> {
		//当垂直滑动的距离<10 水平滑动的距离>10的时候才让捕获事件
		console.log('_handleMoveShouldSetPanResponderCapture');
		return Math.abs(gestureState.dy) < 10 && Math.abs(gestureState.dx) > 10;
	}


	 // 表示申请成功，组件成为了事件处理响应者
	_handlePanResponderGrant = (event, gestureState)=> {
		console.log('_handlePanResponderGrant');
	}

	//手指滑动事件
	_handlePanResponderMove = (event, gestureState) => {
		if (this._previousLeft === null) {
			this._previousLeft = this.state.currentLeft._value
		}
		let nowLeft = this._previousLeft + gestureState.dx / 0.5;
		//右滑最大距离为0（边界值）
		nowLeft = Math.min(nowLeft, 0);
		this.state.currentLeft.setValue(
			nowLeft,
		);
	}

	//手指抬起时
	_handlePanResponderEnd = (event, gestureState)=> {
		console.log('_handlePanResponderEnd',this._previousLeft,this.state.currentLeft,event);
		if(this.state.currentLeft._value<-100){
			this.state.currentLeft.setValue(
				-86,
			);
		}
		if(this.state.currentLeft._value<0&&this.state.currentLeft._value>-86){
			this.state.currentLeft.setValue(
				0,
			);
		}

		this._previousLeft = null;
	}


	clickIcon  = ()=>{
		this.props.item && this.props.deleteFunc && this.props.deleteFunc (this.props.item.id)
	}


	renderDragView() {
		return (
			<Animated.View
				{...this._panResponder.panHandlers}
				style={{
					width:'100%',
					zIndex:5,
					backgroundColor:'#fff',
					paddingHorizontal:getWidth(30),
					paddingTop:getHeight(26),
					transform: [
						{translateX: this.state.currentLeft}
					]
				}}
			>
				{this.props.children}
			</Animated.View>
		);
	}



	render() {
		return (
			<View style={[styles.container,this.props.style]}>
				<View style={styles.deleteBgWrap}>
					<TouchableOpacity style={styles.deleteBtn} onPress={this.clickIcon}>
						<Image source={require('../assets/C2cAssets/delete.png')} style={styles.deleteImg}/>
					</TouchableOpacity>

				</View>
				{this.renderDragView()}


			</View>
		);
	}



}
const styles = StyleSheet.create({
	container:{
		width:'100%',
		flexDirection: 'row',
		alignItems: 'center',
		position:'relative',
	},
	deleteBgWrap: {
		width: '100%',
		overflow: 'hidden',
		...StyleSheet.absoluteFillObject,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems:'center',
		zIndex :-1,
	},
	deleteBtn:{
		marginHorizontal:getWidth(36)
	},
	deleteImg:{
		width:getWidth(100),
		height:getWidth(100)
	}
});
