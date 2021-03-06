
import React, {Component} from "react"
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import PropTypes from "prop-types"
// import /Users/zuopengyu/ex-2020/ex-2020-app/src/style/styleConfigs/StyleConfigs.js
import StyleConfigs from "../../style/styleConfigs/StyleConfigs"
export default class TabBar extends Component {


    static propTypes = {
        tabLabels: PropTypes.array,
        tabImageShow: PropTypes.array,
        tabImage:PropTypes.any,
        tabBarBackgroundColor:PropTypes.string,
        tabActiveColor:PropTypes.string,
        tabInActiveColor:PropTypes.string,
        tabUnderlineActiveColor:PropTypes.string,
        tabUnderlineWidth:PropTypes.array

    }
    static defaultProps = {
        tabLabels:['tab1','tab2','tab3'],
        tabImageShow:[0,0,0],
        tabBarBackgroundColor:'#fff',
        tabActiveColor:StyleConfigs.txt0D0E23,
        tabInActiveColor:StyleConfigs.txtA2B5D9,
        tabUnderlineActiveColor:StyleConfigs.lineBlue,
        tabUnderlineWidth:[getWidth(75),getWidth(55),getWidth(55),getWidth(75)]
    }

    constructor(...props) {
        super(...props)
        this.state = {
        }
    }

    setAnimationValue({value}) {
        // console.log('setAnimationValue',value);
    }

    componentDidMount() {
        // Animated.Value监听范围 [0, tab数量-1]
        // this.props.scrollValue.addListener(this.setAnimationValue);
    }


    renderTabItem(tab, i) {
        const tabTextColor = this.props.activeTab == i? this.props.tabActiveColor : this.props.tabInActiveColor;
        const textMarginLeft = this.props.tabImageShow[i] ? getWidth(50) : getWidth(0);
        const tabUnderlineColor = this.props.activeTab == i ? this.props.tabUnderlineActiveColor : 'transparent';

        // console.log('this.tabImageShow================',this.props.tabImageShow[i]);
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={()=>
                    this.props.goToPage(i)
                }
                // style={[styles.tabTouch,{width:(100/this.props.tabs.length)+'%'}]}
                style={[styles.tabTouch]}
                key={"tab" + i}
            >
                <View style={[styles.tabItem,{marginLeft:textMarginLeft}]}>
                    <Text style={[styles.tabTextStyle,{color:tabTextColor}]}>
                        {this.props.tabLabels[i]}
                    </Text>
                    {
                        this.props.tabImageShow[i] && <Image
                            source={this.props.tabImage}
                            style={styles.tabImageStyle}
                        >
                        </Image> || null
                    }
                </View>
                <View style={[styles.tabUnderlineStyle,{width:this.props.tabUnderlineWidth[i],backgroundColor:tabUnderlineColor}]}/>
            </TouchableOpacity>
        );
    }


    render() {
        return (
            <View style={[styles.tabBar,{backgroundColor:this.props.tabBarBackgroundColor}]}>
                <ScrollView
                    style={[styles.tabScrollView]}
                    contentContainerStyle={styles.contentContainer}
                    ref={(scrollView) => { this._scrollView = scrollView; }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    directionalLockEnabled={true}
                    bounces={false}
                    scrollsToTop={false}
                >

                    {this.props.tabs.map((tab, i) => this.renderTabItem(tab, i))}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tabScrollView:{
        // height:getDealHeight(98),
        // backgroundColor:'green',
    },
    contentContainer:{
        paddingRight:getWidth(30),
        // alignItems: "center",
        // justifyContent: "space-around",
    },
    tabBar:{
        width:'100%',
        // height:getDealHeight(98),
        flexDirection:'row',
        alignItems: "center",
        justifyContent: "space-around",
        // backgroundColor:'#FFFFFF'
    },
    tabTouch:{
        alignItems: "center",
        // backgroundColor:'yellow',
        paddingLeft:getWidth(30),
        // paddingRight:getWidth(10),
    },
    tabItem:{
        // width:,
        height:getDealHeight(82),
        flexDirection:'row',
        alignItems: "center",
        justifyContent: "center",
        marginBottom:-getDealHeight(7),
        // backgroundColor:i === 0 && 'red' || i===1 && 'green' || i === 2 && '#555'
    },
    tabTextStyle:{
        // width:'50%',
        // height:50
        // borderBottomColor:"#3576F5"
        // backgroundColor:'#ccc',
        fontSize:StyleConfigs.fontSize13
    },
    tabImageStyle:{
        width:getWidth(44),
        height:getDealHeight(28),
        marginTop:-getDealHeight(40),
        marginLeft:getWidth(6)
    },
    tabUnderlineStyle:{
        // position:'absolute',
        // bottom:0,
        width:getWidth(90),
        height:getDealHeight(4),
        // backgroundColor:'#3576F5',
        borderRadius:getDealHeight(4)
    }

})


