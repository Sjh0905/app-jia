import {Platform} from 'react-native';

const version = {
    ios: '1.0.23',
    android: '1.0.24'//版本号不能使用global里的值，否则会闪退
}

const root = {
    get version(){
        if(Platform.OS === 'ios'){
            return version.ios;
        }
        if(Platform.OS === 'android'){
            return version.android
        }
        return '';
    }
}

export default root