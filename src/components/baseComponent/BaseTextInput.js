import React, {Component} from 'react';
import {Platform, TextInput} from 'react-native';
import {observer} from 'mobx-react'
import RNComponent from "../../configs/classConfigs/ReactNativeComponent";


@observer
class BaseTextInput extends Component {
    shouldComponentUpdate(nextProps){

        console.log('this is nextProps',this.props.value === nextProps.value,nextProps);
        // return Platform.OS !== 'ios' || this.props.value === nextProps.value;
        return Platform.OS !== 'ios' ||
            // (this.props.value == '' && (nextProps.value != undefined || nextProps.defaultValue == ''))||
            (this.props.value === nextProps.value && (nextProps.defaultValue == undefined || nextProps.defaultValue == '' )) ||
            (this.props.defaultValue === nextProps.defaultValue &&  (nextProps.value == undefined || nextProps.value == '' ));
    }

    render() {
        console.log('this is props',this.props.value);
        return <TextInput {...this.props} />;
    }
};

export default BaseTextInput;