import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

const ModalDropdownStyle = StyleSheet.create({
        style: {
            // width: 85,
            marginVertical:9,
            height: getWidth(50),
            backgroundColor: StyleConfigs.bgColor,
            justifyContent: 'center',
            // borderColor: '#ccc',
            // borderStyle: 'solid',
            // borderWidth: StyleSheet.hairlineWidth,
            padding: 2,
            paddingLeft: 0
        },
        textStyle: {
            padding: 0,
            includeFontPadding: false,
            textAlignVertical: 'center',
            fontSize: StyleConfigs.fontSize13,
            color: StyleConfigs.txt172A4D
        },
        dropdownStyle: {
            width: getWidth(400),
            height:80,
            paddingVertical:2,
            marginTop: getWidth(15),
            // backgroundColor:'red',
            borderWidth:StyleSheet.hairlineWidth,
            borderColor:StyleConfigs.inputBorderColor
        },
        dropdownTextStyle: {
            padding: 0,
            height:25,
            includeFontPadding: false,
            textAlignVertical: 'center',
            paddingHorizontal: 3,
            paddingVertical: 5,
            fontSize: StyleConfigs.fontSize13,
            color: StyleConfigs.txt6B7DA2,
            // lineHeight:10,
            borderWidth:0
        },
        dropdownTextHighlightStyle: {
            color: StyleConfigs.txt172A4D,
            backgroundColor:StyleConfigs.bgF7F8FA
        },
        rowText: {
            height:25,
            paddingHorizontal: 3,
            paddingVertical: 1,
            fontSize: StyleConfigs.fontSize13,
            color: StyleConfigs.txt6B7DA2,
            textAlignVertical: 'center'
        },

    }
)

export default ModalDropdownStyle