
import React, {Component} from "react"
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import PropTypes from "prop-types"
import {action, observable, computed} from 'mobx'


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
        tabImageShow:[0,1,1],
        tabBarBackgroundColor:'#141C25',
        tabActiveColor:'#C43E4E',
        tabInActiveColor:'#fff',
        tabUnderlineWidth:[getWidth(75),getWidth(55),getWidth(55)]
    }

    constructor(...props) {
        super(...props)
        this.state = {
            tabULineLeft : getWidth(DefaultWidth * this.props.activeTab/this.props.tabLabels.length)
        }
    }

    // @observable
    // tabULineLeft = getWidth(DefaultWidth * 2/this.props.tabLabels.length);

    // @observable
    tabULineLeft = getWidth(DefaultWidth * this.props.activeTab/this.props.tabLabels.length);
    lastActiveTab = this.props.activeTab;
    @action
    setAnimationValue =({value}) => {
        console.log('setAnimationValue',value);
        console.log('setAnimationValue tabULineLeft',Math.abs(getWidth(DefaultWidth * value/this.props.tabs.length) - this.tabULineLeft));
        // console.log('setAnimationValue activeTab',this.props.activeTab);


        if(Math.abs(getWidth(DefaultWidth * value/this.props.tabLabels.length) - this.tabULineLeft) == getWidth(DefaultWidth/this.props.tabLabels.length))
            return;


        this.tabULineLeft = getWidth(DefaultWidth * value/this.props.tabLabels.length);
        this.setState({tabULineLeft : this.props.tabLabels.length && getWidth(DefaultWidth * value/this.props.tabLabels.length)});
        if(value - this.props.activeTab == 0)
            this.lastActiveTab = this.props.activeTab;

    }
    componentWillMount(){
        // Animated.Value监听范围 [0, tab数量-1]
        // this.props.scrollValue.addListener(this.setAnimationValue);
    }

    componentDidMount() {
        // Animated.Value监听范围 [0, tab数量-1]
        this.props.scrollValue.addListener(this.setAnimationValue);
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
                {/*<View style={[styles.tabUnderlineStyle,{width:this.props.tabUnderlineWidth[i],backgroundColor:tabUnderlineColor}]}/>*/}
            </TouchableOpacity>
        );
    }


    render() {
        // let tabULineLeft = this.tabULineLeft;
        // console.log('setAnimationValue tabULineLeft render',this.state.tabULineLeft - this.tabULineLeft);
        // this.tabULineLeft = this.state.tabULineLeft;
        return (
            <View style={[styles.tabBar,{backgroundColor:this.props.tabBarBackgroundColor}]}>
                {this.props.tabs.map((tab, i) => this.renderTabItem(tab, i))}
                <View style={[styles.titleBarULineBox,{left:this.state.tabULineLeft}]}>
                    <View style={styles.titleBarULine}/>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tabBar:{
        width:'100%',
        // height:getHeight(98),
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
        height:getHeight(82),
        flexDirection:'row',
        alignItems: "center",
        justifyContent: "center",
        marginBottom:-getHeight(7),
        // backgroundColor:i === 0 && 'red' || i===1 && 'green' || i === 2 && '#555'
    },
    tabTextStyle:{
        // width:'50%',
        // height:50
        // borderBottomColor:"#C43E4E"
    },
    tabImageStyle:{
        width:getWidth(44),
        height:getHeight(28),
        marginTop:-getHeight(40),
        marginLeft:getWidth(6)
    },
    tabUnderlineStyle:{
        // position:'absolute',
        // bottom:0,
        width:getWidth(90),
        height:getHeight(3),
        // backgroundColor:'#C43E4E',
        borderRadius:getHeight(3)
    },
    titleBarULineBox:{
        position:'absolute',
        bottom:0,
        width:getWidth(DefaultWidth/3),
        height:getHeight(4),
        backgroundColor:'transparent',
        alignItems: "center",
        justifyContent: "center"
    },
    titleBarULine:{
        width:getWidth(100),
        height:getHeight(4),
        backgroundColor:'#C43E4E',
    }
})


