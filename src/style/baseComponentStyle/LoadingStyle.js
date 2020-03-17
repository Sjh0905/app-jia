import {StyleSheet} from "react-native"

const styles = StyleSheet.create({

    loadingBox: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    leaveNavStyle: {
        top: getHeight(128),
    },
    loading: {
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    leaveNavLoading: {
        position: 'relative',
        top: -getHeight(128 / 2),
    }
})

export default styles