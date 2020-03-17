import React from 'react';
import {Text, TouchableOpacity, View, ScrollView, StyleSheet} from 'react-native';
import propTypes from 'prop-types';
import RNComponent from '../../configs/classConfigs/ReactNativeComponent';
import Toast from "react-native-root-toast";

export default class ScrollUpText extends RNComponent {

    /*----------------------- props -------------------------*/

    static propTypes = {
        text: propTypes.string,
        onPress: propTypes.func.isRequired,
        activeOpacity: propTypes.number,
        style: propTypes.any,
        textStyle: propTypes.any,
        duration: propTypes.number,
        DataList: propTypes.object.isRequired
    }
    index = 0;
    timeout = null;
    /*----------------------- data -------------------------*/

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super();
        this.state = {
            top: 0
        }
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount();
    }

    componentDidMount(){
        super.componentDidMount();
        // this.interval = setInterval(this.next, this.props.duration || 500)
	    this.listen({key: 'CONTROL_NOTICE', func: this.doClearTimeout})

    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount();
        clearTimeout(this.timeout);
    }

    isScroll = true;
    doClearTimeout(para){
        para && (this.isScroll = true);
        !para && (this.isScroll = false);
		clearTimeout(this.timeout);
		para && (this.timeout = setTimeout(this.next, this.props.duration || 3000))

    }
    scrollEnd = ()=>{
        clearTimeout(this.timeout)
        this.isScroll &&
        (this.timeout = setTimeout(this.next, this.props.duration || 3000))
    }

    /*----------------------- 函数 -------------------------*/
    //下一个
    next = (index)=>{
        if(this.index === this.props.DataList.length) {
            this.index++;
            this.refs.scrollBox.scrollTo({
                y: 0,
                animated: false
            })
        }
        this.index++;
            typeof(index) == 'number' && (this.index = index);
            this.index = this.index % (this.props.DataList.length + 1)
        let top = this.index * (this.props.lineHeight || getHeight(40));
        this.refs.scrollBox.scrollTo({
            y: top,
            animated:true
        })
    }

    /*----------------------- 挂载 -------------------------*/
    render() {
        return (
            <View style={[this.props.style, {
                 overflow:'hidden',position:'relative'
            }]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    onMomentumScrollEnd={this.scrollEnd}
                    canCancelContentTouches={false}
                    ref={'scrollBox'}
                    style={{
                    width:'100%'
                    }}
                >
                    {
                        !!this.props.DataList.length
                        &&
                        this.props.DataList.concat([this.props.DataList[0]])
                            .reduce((res,val,i)=>{
                                return res.concat([<Text
                                    allowFontScaling={false}
                                    numberOfLines={1}
                                    activeOpacity={0.8}
                                    onPress={()=>{this.props.onPress && this.props.onPress(val)}}
                                    key={i}
                                    style={this.props.textStyle}
                                >{val.title.replace(/<[^>]+>/g,'')}</Text>]);
                            },[])
                        ||
                        null
                    }
                </ScrollView>
            </View>
        )
    }
}

