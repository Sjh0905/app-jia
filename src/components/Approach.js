/**
 * hjx 2018.4.16
 */

import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import device from "../configs/device/device";
import NavHeader from './baseComponent/NavigationHeader'
// import StyleConfigs from '../style/styleConfigs/StyleConfigs'
import Carousel from '../components/react-native-looped-carousel/index';
import root from '../configs/versionConfigs/Version';

const box1Height = getHeight(180);
const box2Height =  getHeight(180);
const box1XHeight =  getHeight(180);
const box2XHeight =  getHeight(180);

const N2I = [
    // {
    //     image: f0,
    //     width: 131,
    //     height: 195
    //  },
    // {
    //     image: f1,
    //     width: 40,
    //     height: 195
    // },
    // {
    //     image: f2,
    //     width: 122,
    //     height: 195
    // },
    // {
    //     image: f3,
    //     width: 123,
    //     height: 195
    // },
    // {
    //     image: f4,
    //     width: 137,
    //     height: 195
    // },
    // {
    //     image: f5,
    //     width: 121,
    //     height: 195
    // },
    // {
    //     image: f6,
    //     width: 133,
    //     height: 195
    // },
    // {
    //     image: f7,
    //     width: 129,
    //     height: 195
    // },
    // {
    //     image: f8,
    //     width: 134,
    //     height: 195
    // },
    // {
    //     image: f9,
    //     width: 134,
    //     height: 195
    // }
];


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

// 是否显示引道页总开关 为false 则强制不显示 为true 则判断是否第一次后显示 版本内有效
    showApproach = global.showApproach;

    // 加载中
    @observable
    loading = false

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    @observable
    isShow = true;

    @action
    close = ()=>{
        this.isShow = false;
        AsyncStorage.setItem("isFirstOpen",root.version.toString())
    }

    @action
    onNextPage = (count)=>{
        if(count == 4){
            this.close();
        }
    }

    /*----------------------- 挂载 -------------------------*/

    render() {

        return null;

        /*return (
            this.showApproach && this.isShow &&
            <View style={[styles.container, baseStyles.container]}
            >
                <Carousel
                    style={styles.carousel}
                    isLooped={false}
                    bullets={false}
                    autoplay={false}
                    onAnimateNextPage = {this.onNextPage}
                    bulletsLength={5}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.carouselItem}
                    >
                        <Image
                            source={device.DeviceModel === 'iPhone X' ? image1X : image1}
                            style={styles.img}
                            resizeMode={'stretch'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.carouselItem}
                    >
                        <Image
                            source={device.DeviceModel === 'iPhone X' ? image2X : image2}
                            style={styles.img}
                            resizeMode={'stretch'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.carouselItem}
                    >
                        <Image
                            source={device.DeviceModel === 'iPhone X' ? image3X : image3}
                            style={styles.img}
                            resizeMode={'stretch'}
                        />
                        {
                            <View style={device.DeviceModel === 'iPhone X' && styles.imageBox1X || styles.imageBox1}>
                                {
                                    Math.round( this.$store.state.activity * 100 ).toString().split('').join(' ').split('').reverse().map((v,i)=>{
                                        if(v == ' '){
                                            return <View key={i} style={styles.imageSplit}>

                                            </View>;
                                        }
                                        return <Image
                                            key={i}
                                            style={{
                                                height: getHeight(180),
                                                width: (N2I[v].width / N2I[v].height) * getHeight(180)
                                        }} source={N2I[v].image} resizeMode={'contain'} />;
                                    })
                                }
                            </View>
                        }
                        {this.$store.state.activity && <Text style={device.DeviceModel === 'iPhone X' && styles.font1X || styles.font1}>{Math.round(this.$store.state.activity*100)}%</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.close.bind(this)}
                        activeOpacity={1}
                        style={styles.carouselItem}
                    >
                        <Image
                            source={device.DeviceModel === 'iPhone X' ? image4X : image4}
                            style={styles.img}
                            resizeMode={'stretch'}
                        />
                        {
                            <View style={device.DeviceModel === 'iPhone X' && styles.imageBox2X || styles.imageBox2}>
                                {
                                    Math.round( this.$store.state.reward * 100 ).toString().split('').join(' ').split('').reverse().map((v,i)=>{
                                        if(v == ' '){
                                            return <View key={i} style={styles.imageSplit}>

                                            </View>;
                                        }
                                        return <Image
                                            key={i}
                                            style={{
                                                height: getHeight(180),
                                                width: (N2I[v].width / N2I[v].height) * getHeight(180)
                                            }} source={N2I[v].image} resizeMode={'contain'} />;
                                    })
                                }
                            </View>
                        }
                        {this.$store.state.reward && <Text style={device.DeviceModel === 'iPhone X' && styles.font2X || styles.font2}>{Math.round(this.$store.state.reward*100)}%</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.carouselItem}
                    >
                    </TouchableOpacity>
                    <View style={styles.carouselItem}>

                    </View>
                </Carousel>
            </View>
            ||
            null
        )*/
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 999,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    carousel:{
        width: '100%',
        height: '100%',
        alignItems:'stretch'
    },
    carouselItem:{
        width: '100%',
        height: '100%',
        flex:1
    },

    img:{
        width:'100%',
        height: '100%'
    },

    font1:{
        color:'#fff',
        position: 'absolute',
        top:getHeight(955),
        left: getWidth(506),
        fontSize: getWidth(50),
        fontFamily: 'ShiShangZhongHeiJianTi'
    },
    font1X:{
        color:'#fff',
        position: 'absolute',
        top:getHeight(995),
        left: getWidth(506),
        fontSize: getWidth(50),
        fontFamily: 'ShiShangZhongHeiJianTi'
    },
    font2:{
        color:'#fff',
        position: 'absolute',
        top:getHeight(950),
        left: getWidth(296),
        fontSize: getWidth(50),
        fontFamily: 'ShiShangZhongHeiJianTi'
    },
    font2X:{
        color:'#fff',
        position: 'absolute',
        top:getHeight(991),
        left: getWidth(299),
        fontSize: getWidth(48),
        fontFamily: 'ShiShangZhongHeiJianTi'
    },
    imageBox1:{
        position: 'absolute',
        top:getHeight(150),
        right:getWidth(381),
        height: getHeight(180),
        flexDirection: 'row-reverse',
    },
    imageBox2:{
        position: 'absolute',
        top:getHeight(140),
        right:getWidth(401),
        height: getHeight(180),
        flexDirection: 'row-reverse',
    },
    imageBox1X:{
        position: 'absolute',
        top:getHeight(190),
        right:getWidth(398),
        height: getHeight(180),
        flexDirection: 'row-reverse',
    },
    imageBox2X:{
        position: 'absolute',
        top:getHeight(186),
        right:getWidth(398),
        height: getHeight(180),
        flexDirection: 'row-reverse',
    },
    imageSplit:{
        width:getWidth(20),
    }
})