import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    //conatiner
    container: {
        flex: 1,
        //height: getHeight(DefaultHeight),
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    show: {
        position: "absolute",
        flex: 1,
        width: "100%",
        height: "100%",
    },
    hidden: {
        position: "absolute",
        left: -2 * DefaultWidth,
        width: "100%",
        height: "100%",
        opacity: 0,
    },
    //子视图conatiner样式
    childrenView: {
        //height: getHeight(DefaultHeight - 98),
        flex: 1,
        // flex: 11,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    //导航条样式
    nav: {
        height: getHeight(98),
        // flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
        borderStyle: "solid",
        // borderTopWidth: 1,
        borderTopColor: "#e2e2e2",
        backgroundColor: 'transparent',
    },

    //图标容器
    navTouchable: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
    },
    //图标
    icon: {
        width: imgWidth(getWidth(40)),
        height: imgHeight(getHeight(40))
    },

    text: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: getHeight(35),
        height: getHeight(35),
    },

    selectedText: {
        color: "red"
    },

    emptyView: {
        textAlign: "center",
    }
})

export default styles