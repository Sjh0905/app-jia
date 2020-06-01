import {Platform} from 'react-native';

const version = {
    ios: '1.0.10',
    android: '1.0.10'
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