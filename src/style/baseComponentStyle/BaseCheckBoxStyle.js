import {StyleSheet} from "react-native"

const styles = StyleSheet.create({
    container: {},
    checkBox: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    unChecked: {
        flex: 1
    },
    checked: {
        flex: 1,
        paddingTop: getHeight(4),
        paddingBottom: getHeight(4),
        paddingLeft: getWidth(4),
        paddingRight: getWidth(4),
    },
    checkIcon: {
        width: '100%',
        height: '100%',
    },
    testAnimated: {
        backgroundColor: '#C43E4E',
        width: getWidth(50),
        height: getHeight(50)
    }

})

export default styles