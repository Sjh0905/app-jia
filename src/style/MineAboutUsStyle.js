import {StyleSheet} from "react-native"
// import StyleConfigs from './styleConfigs/StyleConfigs'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    articleBox: {},
    titleBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: getHeight(76),
        marginBottom: getHeight(80),
    },
    logoIcon: {
        width: getWidth(144),
        height: getWidth(160),
    },
    sloganText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: getHeight(20),

    },
    versionText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: getHeight(14),

    },
    articleText: {
        fontSize: 13,
        marginBottom: getHeight(20),
        lineHeight: 22,
    }
})

export default styles