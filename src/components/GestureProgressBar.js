import React from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    PanResponder,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    ProgressViewIOS,
    ProgressBarAndroid,
    Platform,
    Image
} from "react-native";
import RNComponent from "../configs/classConfigs/ReactNativeComponent";
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import PropTypes from "prop-types"
import greenSlider from '../assets/GestureProgressBar/green-slider.png'
import redSlider from '../assets/GestureProgressBar/red-slider.png'

// var totalWidth = Dimensions.get('window').width;
var totalWidth = (PlatformOS == "ios" && PlatformiOSPlus) && 200 || 200;
 totalWidth = PlatformOS != "ios" && 168 || totalWidth;
var circleWidth = 11;
var circleHeight = 17;
var circleWidthRate = 7/totalWidth;
var stepWidth = (totalWidth - circleWidth)/4;
const touchViewHeight = 21+30
const inActiveBarHeight = 2
const circleArr = [
    {left:0},
    {left:stepWidth * 1 - circleWidth/2},
    {left:stepWidth * 2 - circleWidth/2},
    {left:stepWidth * 3 - circleWidth/2},
    {right:0}
]
export default class GestureProgressBar extends RNComponent {


    static propTypes = {

        // 左侧如果有文字的话
        color: PropTypes.string,
        onProgress: PropTypes.func,
        //样式
        // navStyle: PropTypes.any,

        //事件
        // onLayout: PropTypes.func
    }

    static defaultProps = {
        // navStyle:{}
        color:'#34A753',
        onProgress:()=>{}
    }

    constructor(props){
        super(props)
        this.watcher = null;
        this.state = {
            progress:0,
            left:circleWidth/2,
            activing:0.5,
            showIndexTextBox:false
        };
        this._onPanResponderGrant = this._onPanResponderGrant.bind(this);
        this._onPanResponderMove = this._onPanResponderMove.bind(this);
        this._onPanResponderRelease = this._onPanResponderRelease.bind(this);
    };

    componentWillMount(){
        this.watcher  = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant:this._onPanResponderGrant,

            onPanResponderMove:this._onPanResponderMove,

            onPanResponderRelease:this._onPanResponderRelease,
        });
    };

    _onPanResponderGrant(e,gestureState){

        this._onPanResponderMove(e,gestureState)

        this.setState({
            showIndexTextBox:true
        })

        // let touchPointX = gestureState.x0;
        // let progress;
        // if(touchPointX < circleWidth / 2){
        //     progress = 0;
        // } else{
        //     if(touchPointX > (totalWidth + circleWidth/2)){
        //         progress = 1;
        //     }else {
        //         progress = (touchPointX - circleWidth/2) / (totalWidth - circleWidth);
        //     }
        // }
    };

    _onPanResponderMove(e,gestureState){
        let touchPointX = gestureState.moveX - 10;
        let progress;
        if(touchPointX < circleWidth / 2){
            progress = 0;
        } else{
            console.log('this is touchPointX',touchPointX);
            // console.log('this is totalWidth + circleWidth/2',totalWidth + circleWidth/2);

            if(touchPointX > (totalWidth - circleWidth/2)){
                progress = 1;
            }else {
                progress = (touchPointX - circleWidth/2) / (totalWidth - circleWidth);
            }
        }

        //不能直接取余，因为要得到num
        let inx = -1;
        let item = 0.25;
        let num = parseInt(progress / item);
        let step = progress - item * num
        if(step < circleWidthRate/2){
            inx = num
            progress = item * num
        };
        if(step > circleWidthRate/2 && step < item - circleWidthRate/2)inx = num + 0.5
        if(step > item - circleWidthRate/2){
            inx = num + 1
            progress = item * (num+1)
        }
        this.setState({
            progress:progress,
            left:touchPointX,
            activing:inx < 1 ? 0.5 : inx
        });
        this.props.onProgress(Math.round(progress * 100))
    };

    _onPanResponderRelease =(e,gestureState)=>{

        this._onPanResponderMove(e,gestureState)

        setTimeout(()=>{
            this.setState({
                showIndexTextBox:false
            })
        },150)

    }


    render() {
        // console.log('this is ',this.state.left);
        let indexTextBoxLeft = this.state.left - 15 > (totalWidth - circleWidth/2 -15) ? (totalWidth - circleWidth/2 - 15) : this.state.left - 15
        indexTextBoxLeft < (circleWidth/2 - 15) && (indexTextBoxLeft = circleWidth/2 -15)

        let sliderImgLeft = this.state.left - 10 > (totalWidth - 28/2 -10) ? (totalWidth - 28/2 - 10) : this.state.left - 10
        sliderImgLeft < (28/2 - 14) && (indexTextBoxLeft = circleWidth/2 -14)

        return (
            <View style={styles.container}>


                {
                    this.state.showIndexTextBox &&
                    <View style={[{backgroundColor:this.props.color,left:indexTextBoxLeft},styles.indexTextBox]}>
                        <Text style = {[styles.indexTextStyle]}>
                            {Math.round(this.state.progress * 100)} %
                        </Text>
                        <View style={[styles.arrow,{borderTopColor:this.props.color}]}/>
                    </View>
                }
                <View style = {styles.touchViewStyle}
                      {...this.watcher.panHandlers} >
                    <View style={styles.inActiveBar}/>
                    <View style={[styles.activeBar,{backgroundColor:this.props.color,width:(this.state.progress * (totalWidth - circleWidth))}]}/>
                    {circleArr.map((v,i)=>{

                        if(i > 0 && i == this.state.activing){
                            return <View
                                key={i}
                                style={[styles.circleItem]}
                                activeOpecity={0.8}
                            >
                                <View style={[styles.circleActivingItemChild,{backgroundColor:this.props.color}]}>
                                    {/*<View style={[styles.circleItemChild2,{backgroundColor:this.props.color}]}/>*/}
                                </View>
                            </View>
                        }

                        if(i < this.state.activing){
                            return <View
                                key={i}
                                style={[styles.circleItem]}
                                activeOpecity={0.8}
                            >
                                <View style={[styles.circleItemChild,{backgroundColor:this.props.color}]}>
                                    {/*<View style={[styles.circleItemChild2]}/>*/}
                                </View>
                            </View>
                        }

                        return <View
                            key={i}
                            style={[styles.circleItem]}
                            activeOpecity={0.8}
                        >
                            <View style={[styles.circleItemChild]}>
                                {/*<View style={[styles.circleItemChild2]}/>*/}
                            </View>
                        </View>

                    })}

                    <Image source={this.props.type == 0 && greenSlider || redSlider} style={[styles.sliderImg,{left:sliderImgLeft < -4 ? -4 : sliderImgLeft}]}/>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        // height:60,
        marginBottom:-22,
        // paddingTop:getDealHeight(15),
        // zIndex:999,
        // backgroundColor:'#ccc'
    },
    ProgressViewStyle:{
        width: totalWidth - 40,
        height:40,
        left:20,
        top:100,
    },
    // ProgressViewStyle:{
    //     width: '100%',
    //     position:'absolute',
    //     height:inActiveBarHeight,
    //     top:(touchViewHeight-inActiveBarHeight)/2,
    //     left:0,
    //     // backgroundColor:'#E7EBEE'
    // },
    indexTextBox:{
        marginTop:-25,
        marginBottom:5,
        width:30,
        height:20,
        // backgroundColor:'#34A753',
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 2,
    },
    indexTextStyle:{
        fontSize:10,
        color:'#fff',
    },
    arrow:{
        position:'absolute',
        left:10,
        top:20,
        width: 0,
        height: 0,
        right: 10,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 5,
        borderLeftColor: '#fff',
        borderRightColor: '#fff',
        borderTopColor: '#34A753'
    },
    touchViewStyle:{
        paddingTop:getDealHeight(15),
        // paddingVertical:getDealHeight(15),
        width:totalWidth,
        height:touchViewHeight,
        // backgroundColor:'#bc890780',
        // position:'absolute',
        left:0,
        top:0,
        // top:262,
        flexDirection:'row',
        // alignItems:'center',
        justifyContent:'space-between',
        zIndex:999
    },



    pan1: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'red',
        justifyContent: 'center'
    },
    pan2: {
        height: 200,
        justifyContent: 'center',
        backgroundColor: 'yellow'
    },
    pan3: {
        height: 100,
        backgroundColor: 'blue'
    },
    inActiveBar:{
        position:'absolute',
        width:totalWidth -circleWidth,
        height:inActiveBarHeight,
        // top:(touchViewHeight-inActiveBarHeight)/2,
        top:getDealHeight(15) + circleHeight/2 -inActiveBarHeight/2,
        left:circleWidth/2,
        backgroundColor:'#E7EBEE'
    },
    activeBar:{
        position:'absolute',
        height:inActiveBarHeight,
        top:getDealHeight(15) + circleHeight/2 -inActiveBarHeight/2,
        // top:(touchViewHeight-inActiveBarHeight)/2,
        left:circleWidth/2,
        backgroundColor:'#34A753'
    },
    circleItem:{
        width:circleWidth,
        height:circleHeight,
        // borderRadius:circleWidth/2,
        borderRadius:1,
        // borderWidth:1,
        // borderColor:'#E7EBEE',
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
        // position:'absolute',
        // top:(touchViewHeight - circleWidth)/2
    },
    circleActivingItem:{
        width:circleWidth + 2,
        height:circleHeight + 2,
        borderRadius:(circleWidth+2)/2,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
    },
    circleItemChild:{
        width:circleWidth-4,
        height:circleHeight-4,
        // borderRadius:(circleWidth-3)/2,
        borderRadius:1,
        backgroundColor:'#E7EBEE',
        alignItems:'center',
        justifyContent:'center'
        // position:'absolute',
        // top:(touchViewHeight - circleWidth)/2
    },
    circleActivingItemChild:{
        width:circleWidth-4,
        height:circleHeight-4,
        // borderRadius:(circleWidth-4)/2,
        borderRadius:1,
        backgroundColor:'#E7EBEE',
        alignItems:'center',
        justifyContent:'center'
    },
    circleItemChild2:{
        width:circleWidth-7,
        height:circleHeight-7,
        // borderRadius:(circleWidth-7)/2,
        borderRadius:1,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center'
        // position:'absolute',
        // top:(touchViewHeight - circleWidth)/2
    },
    circleSelected:{
        backgroundColor:'#34A753',
    },
    margin2:{
        margin:2
    },
    sliderImg:{
        position:'absolute',
        top:2,
        // top:getDealHeight(15) + circleHeight/2 -inActiveBarHeight/2,
        left:-4,
        width:28,
        height:34,
        // backgroundColor:'#fff',
    }

})