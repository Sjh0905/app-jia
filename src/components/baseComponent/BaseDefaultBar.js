
import React, {Component} from "react"
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import PropTypes from "prop-types"


export default class TabBar extends Component {


    static propTypes = {
        tabLabels: PropTypes.array,
        tabImageShow: PropTypes.array,
        tabImage:PropTypes.any,
        tabBarBackgroundColor:PropTypes.string,
        tabActiveColor:PropTypes.string,
        tabInActiveColor:PropTypes.string,
        tabUnderlineWidth:PropTypes.array

    }
    static defaultProps = {
        tabLabels:['tab1','tab2','tab3'],
        tabImageShow:[0,0,0],
        tabBarBackgroundColor:'#fff',
        tabActiveColor:'#3576F5',
        tabInActiveColor:'#333',
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
        const tabUnderlineColor = this.props.activeTab == i ? this.props.tabActiveColor : 'transparent';

        // console.log('this.tabImageShow================',this.props.tabImageShow[i]);
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={()=>
                    this.props.goToPage(i)
                }
                style={[styles.tabTouch,{width:(100/this.props.tabs.length)+'%'}]}
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
                {this.props.tabs.map((tab, i) => this.renderTabItem(tab, i))}
            </View>
        )
    }
}
const styles = StyleSheet.create({
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


