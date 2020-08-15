import {StyleSheet} from "react-native"
import StyleConfigs from './styleConfigs/StyleConfigs'

const ModalDropdownStyle = StyleSheet.create({
        style: {
            // width: 85,
            // marginVertical:9,
            height: getWidth(50),
            backgroundColor: StyleConfigs.parentOpacity0,
            // backgroundColor: '#rgba(255,255,125,0)',
            justifyContent: 'center',
            // borderColor: 'red',
            borderColor:StyleConfigs.borderC8CFD5,
            borderStyle: 'solid',
            borderWidth: StyleSheet.hairlineWidth,
            padding: 2,
            paddingLeft: 0
        },
        textStyle: {
            padding: 5,
            paddingLeft:10,
            includeFontPadding: false,
            textAlignVertical: 'center',
            fontSize: StyleConfigs.fontSize13,
            color: StyleConfigs.txt172A4D,
            fontWeight:'500',
            // borderColor:'red'
        },
        dropdownStyle: {
            marginLeft:-1,
            paddingTop:-20,
            width: getWidth(402),
            height:70,
            paddingVertical:2,
            marginTop: getWidth(15),
            // backgroundColor:'red',
            borderWidth:StyleSheet.hairlineWidth,
            borderColor:StyleConfigs.borderC8CFD5
        },
        dropdownTextStyle: {
            // padding: 0,
            height:34,
            lineHeight:14,
            includeFontPadding: false,
            textAlignVertical: 'center',
            paddingHorizontal: 10,
            // paddingVertical: 5,
            fontSize: StyleConfigs.fontSize13,
            color: StyleConfigs.txt6B7DA2,
            // lineHeight:10,
            borderWidth:0,
            // backgroundColor: 'yellow',
        },
        dropdownTextHighlightStyle: {
            color: StyleConfigs.txt172A4D,
            backgroundColor:StyleConfigs.bgF7F8FA
        },
        rowText: {
            height:34,
            lineHeight:14,
            paddingHorizontal: 10,
            paddingVertical: 1,
            fontSize: StyleConfigs.fontSize13,
            color: StyleConfigs.txt6B7DA2,
            textAlignVertical: 'center'
        },

    }
)

export default ModalDropdownStyle