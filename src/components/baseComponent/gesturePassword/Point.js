import React, {
    Component,
} from 'react'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Image
} from 'react-native'

import Circle from './Circle'
import activeIcon from '../../../assets/baseComponent/gesturePassword/activeIcon.png'
import waringIcon from '../../../assets/baseComponent/gesturePassword/warningIcon.png'
import activeIconq from '../../../assets/baseComponent/gesturePassword/activeQingIcon.png'
import waringIconq from '../../../assets/baseComponent/gesturePassword/warningQingIcon.png'

import normalIcon2 from '../../../assets/baseComponent/gesturePassword/normalIcon2.png'
import normalIcon from '../../../assets/baseComponent/gesturePassword/normalIcon.png'
import pointbgIcon from '../../../assets/baseComponent/gesturePassword/pointbgIcon.jpg'

export default class Point extends Component {

    static defaultProps = {
        isActive: false,
        isWarning: false,
    }

    static propTypes = {
        index: PropTypes.number.isRequired,
        radius: PropTypes.number.isRequired,
        borderWidth: PropTypes.number.isRequired,
        isActive: PropTypes.bool.isRequired,
        isWarning: PropTypes.bool.isRequired,
        backgroundColor: PropTypes.string,
        color: PropTypes.string.isRequired,
        activeColor: PropTypes.string.isRequired,
        warningColor: PropTypes.string.isRequired,
        position: PropTypes.shape({
            left: PropTypes.number.isRequired,
            top: PropTypes.number.isRequired,
        }).isRequired,
    }

    // 构造
    constructor (props) {
        super(props)
        // 初始状态
        this.state = {}

        this._outerCircleRadius = props.radius
        this._outerCirclePosition = props.position
        this._innerCircleRadius = this._outerCircleRadius / 3
        this._innerCirclePosition = {
            left: this._innerCircleRadius * 2 - props.borderWidth,
            top: this._innerCircleRadius * 2 - props.borderWidth,
        }

    }

    render () {

        var topValue = -5.2,leftValue = -6,widthVal = this.props.radius*2.3;
        if(PlatformOS == "ios"){
            topValue = -5.5,leftValue = -6.3,widthVal = this.props.radius*2.3;
            PlatformiOSPlus && (topValue = -6,leftValue = -6.7,widthVal = this.props.radius*2.3);
        }

        this._color = this.props.isWarning ?
            this.props.warningColor :
            ( this.props.isActive ? this.props.activeColor : this.props.color )

        return (

             (this.props.isActive || this.props.isWarning) ? (
                <Circle
                    // backgroundColor={this.props.backgroundColor}
                    backgroundColor={'transparent'}
                    // backgroundColor={'#ccc'}
                    color={this._color}
                    radius={this.props.radius}
                    borderWidth={this.props.borderWidth}
                    position={this._outerCirclePosition}>

                    <Image  source={pointbgIcon} style={{
                        position:'absolute',
                        top:topValue,
                        left:leftValue,
                        width:widthVal,
                        height:widthVal,
                        borderTopLeftRadius:widthVal/2,
                        borderTopRightRadius:widthVal/2,
                        borderBottomLeftRadius:widthVal/2,
                        borderBottomRightRadius:widthVal/2,

                    }}/>

                    {(this.props.isActive && !this.props.isWarning) &&
                        <Image source={activeIcon} style={{
                            position:'absolute',
                            top:topValue,
                            left:leftValue,
                            width:widthVal,
                            height:widthVal,
                            borderTopLeftRadius:widthVal/2,
                            borderTopRightRadius:widthVal/2,
                            borderBottomLeftRadius:widthVal/2,
                            borderBottomRightRadius:widthVal/2,
                            // backgroundColor:'#ffffff'

                        }} />
                    ||
                    <Image source={waringIcon} style={{
                        position:'absolute',
                        top:topValue,
                        left:leftValue,
                        width:widthVal,
                        height:widthVal,
                        borderTopLeftRadius:widthVal/2,
                        borderTopRightRadius:widthVal/2,
                        borderBottomLeftRadius:widthVal/2,
                        borderBottomRightRadius:widthVal/2,
                        // backgroundColor:'#ffffff'
                    }} />}

                </Circle>

                 ):
             <Circle
                backgroundColor={'transparent'}
                color={'transparent'}
                radius={this.props.radius}
                borderWidth={this.props.borderWidth}
                position={this._outerCirclePosition}
             >
                 <Image source={normalIcon} style={{
                     position:'absolute',
                     top:topValue,
                     left:leftValue,
                     width:widthVal,
                     height:widthVal,
                     borderTopLeftRadius:widthVal/2,
                     borderTopRightRadius:widthVal/2,
                     borderBottomLeftRadius:widthVal/2,
                     borderBottomRightRadius:widthVal/2,
                     // backgroundColor:'#ccc'
                 }} />

            </Circle>

        )
    }

}