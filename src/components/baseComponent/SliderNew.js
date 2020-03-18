/**
 * Created by zhanghua on 2017/2/8.
 */
//https://github.com/PaulBGD/react-native-image-slider
import React, {Component} from 'react';
import {
	Image,
	Text,
	View,
	ScrollView,
	StyleSheet,
	Animated,
	PanResponder,
	TouchableHighlight,
	TouchableOpacity,
	Platform,
	Dimensions
} from 'react-native';

const reactNativePackage = require('react-native/package.json');
const splitVersion = reactNativePackage.version.split('.');
const majorVersion = +splitVersion[0];
const minorVersion = +splitVersion[1];
const width = Dimensions.get('window').width

var getWidth = px => Dimensions.get('window').width / 750 * px;
var getHeight = px => Dimensions.get('window').height / 1334 * px;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	buttons: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		position: 'absolute',
		bottom: getHeight(30),
		width: width,
	},
	button: {
		margin: 3,
		width: 8,
		height: 8,
		borderRadius: 8 / 2,
		backgroundColor: '#fff',
		opacity: 0.9,
	},
	buttonSelected: {
		opacity: 1,
		backgroundColor: '#3576F5',
	}
});

export default class Slider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			position: 0,
			newPosition: 0,
			height: Dimensions.get('window').width * (4 / 9),
			width: Dimensions.get('window').width,
			scrolling: false,
		};
	}



    componentDidMount() {
       this.startInterval();
    }

    startInterval=()=>{
        this.props.timeInterval && !clearInterval(this.timerId) && (this.timerId= setInterval(() => {
                this.state.position += 1;
                if (this.state.position === this.props.images.length) {
                    this.state.position = 0;
                }
                this._move(this.state.position);
            }
            , this.props.timeInterval));

    }


	_onRef(ref) {
		this._ref = ref;
		if (ref && this.state.position !== this._getPosition()) {
			this._move(this._getPosition());
		}
	}

	_move(index) {
		const isUpdating = index !== this._getPosition();
		const x = this.state.width * index;
		if (majorVersion === 0 && minorVersion <= 19) {
			this._ref.scrollTo(0, x, true); // use old syntax
		} else {
			this._ref.scrollTo({x: this.state.width * index, y: 0, animated: true});
		}
		this.setState({position: index});
		if (isUpdating && this.props.onPositionChanged) {
			this.props.onPositionChanged(index);
		}


	}

	_getPosition() {
		if (typeof this.props.position === 'number') {
			return this.props.position;
		}
		return this.state.position;

	}

	handleScroll = (event) => {
		// onScroll={this.handleScroll}  scrollView滑动时相关事件
		// onTouchStart={() => console.log('onTouchStart')}
		// onTouchMove={() => console.log('onTouchMove')}
		// onTouchEnd={() => console.log('onTouchEnd')}
		// onScrollBeginDrag={() => console.log('onScrollBeginDrag')}
		// onScrollEndDrag={() => console.log('onScrollEndDrag')}
		//onMomentumScrollBegin={() => console.log('onMomentumScrollBegin')}
	};

	positionX = 0;
	setIndicatorPosition = (event) => {
		// console.log("weizhid d sd "+event.nativeEvent.contentOffset.x / width);
		if (Platform.OS == 'android') {
            clearInterval(this.timerId);
			var temp = event.nativeEvent.contentOffset.x / width;
			var position = Math.round(temp);
			this.positionX = position;
			// var floatXX = temp - position;
			// if (floatXX >=0.5) {
			//     position +=1
			// } else {
			//     position -=1;
			//     if (position <=0) position = 0;
			// }
			console.log('当前位置: ' + position);
			this.state.position=position;
            console.log('!this.state.position: ' + this.state.position);
			this._move(this.state.position);
            this.startInterval();

		}
		this.setState({newPosition: position});
	};

	componentDidUpdate(prevProps) {
		if (prevProps.position !== this.props.position) {
			this.setState({newPosition: this.props.position});
			this._move(this.props.position);
		}
	}

	componentWillMount() {
		const width = this.state.width;

		let stopInterval=()=>{
            clearInterval(this.timerId);
            return true;
		}
		let release = (e, gestureState) => {
            console.log('=====手动');
			const width = this.state.width;
			const relativeDistance = gestureState.dx / width;
			const vx = gestureState.vx;
			let change = 0;

			if (relativeDistance < -0.5 || (relativeDistance < 0 && vx <= 0.5)) {
				change = 1;
			} else if (relativeDistance > 0.5 || (relativeDistance > 0 && vx >= 0.5)) {
				change = -1;
			}
			const position = this._getPosition();
			if (position === 0 && change === -1) {
				change = 0;
			} else if (position + change >= this.props.images.length) {
				change = (this.props.images.length) - (position + change);
			}
			this._move(position + change);
            this.startInterval();
			return true;
		};

		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: true,
            onPanResponderGrant:stopInterval,
			onPanResponderRelease: release,

			onPanResponderTerminate: release
		});

		this._interval = setInterval(() => {
			const newWidth = Dimensions.get('window').width;
			if (newWidth !== this.state.width) {
				this.setState({width: newWidth});
			}
		}, 16);

	}

	componentWillUnmount() {
		clearInterval(this._interval);
		clearInterval(this.timerId);
	}

	render() {
		const width = this.state.width;
		const height = this.props.height || this.state.height;
		const position = Platform.OS == 'ios' ? this._getPosition() : this.state.newPosition;
		return (<View>
			<ScrollView
                removeClippedSubviews = {false}
				ref={ref => this._onRef(ref)}
				decelerationRate={0.99}
				horizontal={true}
				pagingEnabled={true}
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={this.setIndicatorPosition}
				{...this._panResponder.panHandlers}
				style={[styles.container, this.props.style, {height: height}]}>
				{this.props.images.map((image, index) => {
					const imageObject = typeof image === 'string' ? {uri: image} : image;
					const imageComponent = <Image
						key={index}
						source={imageObject}
						style={{height, width}}
					/>;
					if (this.props.onPress) {
						return (
							<TouchableOpacity
								key={index}
								style={{height, width}}
								onPress={() => this.props.onPress({image, index})}
								delayPressIn={200}
								activeOpacity={1}
							>
								{imageComponent}
							</TouchableOpacity>
						);
					} else {
						return imageComponent;
					}
				})}
			</ScrollView>
			{!this.props.noDot ?
				<View style={[styles.buttons]}>
					{this.props.images.map((image, index) => {
						return (<TouchableHighlight
							key={index}
							underlayColor="#ccc"
							onPress={() => {
                            return this._move(index);
                        }}
							style={[styles.button, position === index && styles.buttonSelected]}>
							<View ></View>
						</TouchableHighlight>);
					})}
				</View> : null}

		</View>);
	}
}
