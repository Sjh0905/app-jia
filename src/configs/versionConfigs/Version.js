import {Platform} from 'react-native';

const version = {
    android: '1.0.2',
    ios: '1.0.1'
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