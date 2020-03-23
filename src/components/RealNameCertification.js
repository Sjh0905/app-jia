
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Picker,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable,computed} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import styles from '../style/RealNameCertificationStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal'
import BaseButton from '../components/baseComponent/BaseButton'
import Toast from 'react-native-root-toast'
import deleteImage from '../assets/RealNameCertification/deleteImage.png';
import idCardFrontDefault from '../assets/RealNameCertification/idCardFrontDefault.png';
import idCardBackDefault from '../assets/RealNameCertification/idCardBackDefault.png';
import idCardHoldDefault from '../assets/RealNameCertification/idCardHoldDefault.png';
import passportFrontDefault from '../assets/RealNameCertification/passportFrontDefault.png';
import passportBackDefault from '../assets/RealNameCertification/passportBackDefault.png';
import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";
import AndroidModule from '../../native/AndroidUtil';
import BaseTextInput from "./baseComponent/BaseTextInput";


@observer
export default class RealNameCertification extends RNComponent {


    /*----------------------- data -------------------------*/

    //认证过程中的状态
    @computed get identityAuthState() {
        return this.$store.state.getIdentityInfo.identityAuthState || 0
    }

    //驳回详细信息
    @computed get identityAuthInfo() {
        return this.$store.state.getIdentityInfo.identityAuthInfo || []
    }

    //当前选中地区名称
    @computed get areaNameCn() {
        return this.$store.state.areaNameCn || '中国大陆地区'
    }

    // 加载中
    @observable loading = false

    //地区ID
    @observable selected = 0;
    @observable selectedWA = undefined;

    @observable selectedId = null;

    @observable isShowPicker = false

    @observable selectedGender = 0;
    @observable selectedGenderWA = undefined;

    @observable isShowGenderPicker = false

    @observable idCardFront = null
    @observable idCardFrontWA = undefined

    @observable idCardBack = null
    @observable idCardBackWA = undefined

    @observable idCardHold = null
    @observable idCardHoldWA = undefined

    @observable passportFront = null
    @observable passportFrontWA = undefined

    @observable passportBack = null
    @observable passportBackWA = undefined

    @observable passportHold = null
    @observable passportHoldWA = undefined

    @observable currImgType = null

    @observable imageList = ['add',null,null]

    @observable imageSize = 0;

    @observable headerHeight = 0;

    @observable countryType = ['中国大陆地区','其他地区'];

    @observable genderType = ['男','女'];

    @observable pickerTypeMap = {'selected':this.countryType,'selectedGender':this.genderType}
    @observable pickerType = 'selected';//selected:地区选择 selectedGender:性别选择

    // 姓名
    @observable name = '';
    @observable nameWA = undefined;

    // 身份证号
    @observable idNumber = '';
    @observable idNumberWA = undefined;

    // 名字，国外
    @observable firstName = '';
    @observable firstNameWA = undefined;

    // 姓氏，国外
    @observable lastName = '';
    @observable lastNameWA = undefined;

    // 护照ID
    @observable passportID = '';
    @observable passportIDWA = undefined;

    //审核不通过原因
    @observable identityAuthWAReason0 = undefined;
    @observable identityAuthWAReason1 = undefined;

    // Modal弹窗
    @observable showImgModal = false;

    @observable scrollViewContentOffsetY = 0;

    authResultText = {
        1:'审核未通过',
        2:'审核通过'
    };


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
        this.cardType = this.$beforeParams && this.$beforeParams.cardType || 0; // 传进来的身份证类型
        this.from = this.$beforeParams && this.$beforeParams.from || ''; // 传进来的身份证类型
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()

        this.listen({key: 'CHANGE_AREA',func:(inx)=>{
            this.selected = inx;
            this.selectedWA = undefined
        }});
        // this.get_ListOrderType();
    }

    componentDidMount(){
        super.componentDidMount()
        console.log('this is identityAuthInfo',this.identityAuthInfo)

        //如果是驳回，显示驳回信息
        if(this.identityAuthState == 1){
            let name, nameWA,
                country, countryWA,
                gender, genderWA,
                idCode, idCodeWA,
                certificate_positive_url, certificate_positive_url_WA,
                certificate_negative_url, certificate_negative_url_WA,
                held_certificate_url, held_certificate_url_WA,
                surname, surnameWA,
                identityAuth, identityAuthWA
            let arr = this.identityAuthInfo
            for (let i = 0; i < arr.length; i++) {

                if(arr[i].type === 'area'){
                    this.$store.commit('SET_AREA_NAMECN',arr[i].value)
                    country = arr[i].value === '中国大陆地区' ? 0 : 1;
                    // country = arr[i].value === 'ChineseMainland' ? 0 : 1;
                    countryWA = arr[i].authResult;
                }

                arr[i].type === 'name' && (name = arr[i].value) && (nameWA = arr[i].authResult)
                arr[i].type === 'gender' && (gender = arr[i].value === 'MALE' ? 0 : 1) && (genderWA = arr[i].authResult)
                arr[i].type === 'idCode' && (idCode = arr[i].value) && (idCodeWA = arr[i].authResult)
                arr[i].type === 'certificate_positive_url' && (certificate_positive_url = arr[i].value) && (certificate_positive_url_WA = arr[i].authResult)
                arr[i].type === 'certificate_negative_url' && (certificate_negative_url = arr[i].value) && (certificate_negative_url_WA = arr[i].authResult)
                arr[i].type === 'held_certificate_url' && (held_certificate_url = arr[i].value) && (held_certificate_url_WA = arr[i].authResult)
                arr[i].type === 'surname' && (surname = arr[i].value) && (surnameWA = arr[i].authResult)
                arr[i].type === 'identityAuth' && (identityAuth = arr[i].value) && (identityAuthWA = arr[i].authResult)
            }

            // 如果是身份证
            if (country === 0) {
                this.selected = country
                this.selectedWA = countryWA
                this.selectedGender = gender
                this.selectedGenderWA = genderWA
                this.name = name
                this.nameWA = nameWA
                this.idNumber = idCode
                this.idNumberWA = idCodeWA

                this.idCardFront = {path:certificate_positive_url}
                this.idCardFrontWA = certificate_positive_url_WA
                this.idCardBack = {path:certificate_negative_url}
                this.idCardBackWA = certificate_negative_url_WA
                this.idCardHold = {path:held_certificate_url}
                this.idCardHoldWA = held_certificate_url_WA

                this.identityAuthWAReason0 = identityAuth
            }
            // 如果是护照
            if (country === 1) {
                this.selected = country
                this.selectedWA = countryWA
                this.selectedGender = gender
                this.selectedGenderWA = genderWA
                this.firstName = name
                this.firstNameWA = nameWA
                this.lastName = surname
                this.lastNameWA = surnameWA
                this.passportID = idCode
                this.passportIDWA = idCodeWA

                this.passportFront = {path:certificate_positive_url}
                this.passportFrontWA = certificate_positive_url_WA
                this.passportBack = {path:certificate_negative_url}
                this.passportBackWA = certificate_negative_url_WA
                this.passportHold = {path:held_certificate_url}
                this.passportHoldWA = held_certificate_url_WA

                this.identityAuthWAReason1 = identityAuth
            }
        }
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    onHeaderLayout = (e)=>{
        console.log(e.nativeEvent);
        this.headerHeight = e.nativeEvent.layout.height;
    }

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }

    @action
    onChangeSelected = (index)=>{
        this[this.pickerType] = index
        this[this.pickerType+'WA'] = undefined

        // this.selected = index;
        // this.selectedWA = undefined
        this.hidePicker();
    }

    @action
    onGenderSelected = (index)=>{
        this.selectedGender = index;
        this.selectedGenderWA = undefined
        this.hideGenderPicker();
    }

    @action
    testInput = ()=>{
        let result = true;
        let errMessage = '';

        if(result && this.selected === null){
            errMessage = '请选择地区';
            result = false;
        }

        if(this.selected == 0){

            if(result && this.selectedGender === null){
                errMessage = '请选择性别';
                result = false;
            }

            if(result && this.name.trim() === ''){
                errMessage = '请输入姓名';
                result = false;
            }

            if(result && this.idNumber.trim() === ''){
                errMessage = '请输入身份证号码';
                result = false;
            }

            if(result && !this.$globalFunc.testIdCode(this.idNumber)){
                errMessage = '身份证号码输入不合法';
                result = false;
            }

            // if(result && this.idCardFront === null){
            //     errMessage = '请上传身份证正面照片';
            //     result = false;
            // }
            // if(result && this.idCardBack === null){
            //     errMessage = '请上传身份证背面照片';
            //     result = false;
            // }
            // if(result && this.idCardHold === null){
            //     errMessage = '请上传手持身份证照片';
            //     result = false;
            // }
        }

        if(this.selected == 1){

            if(result && this.selectedGender === null){
                errMessage = '请选择性别';
                result = false;
            }

            if(result && this.firstName.trim() === ''){
                errMessage = '请输入名字';
                result = false;
            }

            if(result && this.lastName.trim() === ''){
                errMessage = '请输入姓氏';
                result = false;
            }

            if(result && this.passportID.trim() === ''){
                errMessage = '请输入护照ID';
                result = false;
            }
            // if(result && this.passportFront === null){
            //     errMessage = '请上传护照正面照片';
            //     result = false;
            // }
            // if(result && this.passportBack === null){
            //     errMessage = '请上传护照背面照片';
            //     result = false;
            // }
            // if(result && this.passportHold === null){
            //     errMessage = '请上传手持护照照片';
            //     result = false;
            // }
        }
        if(!result){
            Toast.show(errMessage, {
                duration: 1000,
                position: Toast.positions.CENTER
            })
        }
        return result;
    }

    //测试能否跳转
    testToNext = () => {
        let result = true;
        let errMessage = '';

        if(result && this.selectedWA != undefined){
            errMessage = '国籍'
            result = false;
        }
        if(result && this.selectedGenderWA != undefined){
            errMessage = '性别'
            result = false;
        }

        if(this.selected == 0){
            if(result && this.nameWA != undefined){
                errMessage = '姓名'
                result = false;
            }
            if(result && this.idNumberWA != undefined){
                errMessage = '身份证号码'
                result = false;
            }
        }

        if(this.selected == 1){
            if(result && this.firstNameWA != undefined){
                errMessage = '名字'
                result = false;
            }
            if(result && this.lastNameWA != undefined){
                errMessage = '姓氏'
                result = false;
            }
            if(result && this.passportIDWA != undefined){
                errMessage = '护照ID'
                result = false;
            }
        }

        if(!result){
            Toast.show(errMessage+'审核不通过', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
        }
        return result;
    }


    // 跳到face++实名认证
    @action
    goToAuth = (() => {
        let last = 0;
        return (...paras) => {
            if (Date.now() - last < 1000) return;
            last = Date.now();

            this.$router.push('IDCardA',{
                cardType: this.cardType,
                from: this.from,
            })


            // 这里要根据获取到的步骤情况跳转到身份证 或者 身份证反面 或者 视频验证 这里先按照身份证计算
            // if(this.$store.state.getIdentityInfo.identityAuthState === '5'){
            //     Toast.show('请耐心等待认证反馈', {
            //         duration: 3000,
            //         position: Toast.positions.CENTER
            //     })
            //     return;
            // }
            // if(!this.$store.state.getIdentityInfo.identityAuth){
            //     this.$router.push(
            //         this.$store.state.getIdentityInfo.cerificatePage
            //         ,{
            //             cardType: this.$store.state.getIdentityInfo.cardType,
            //             from: 'RealNameCertification'
            //         });
            //     return;
            // }
        }
    })()

    @action
    commit = ()=>{

        //国内face++
        // if(this.selected == 0){
        //     this.goToAuth()
        //     return
        // }

        let cansend = this.testInput();
        if(!cansend)return

        // let canToNext = this.testToNext();
        // if(!canToNext)return

        /*let formData = new FormData();

        if(this.selected == 0){
            let params = {
                'name': this.name,
                'idCode': this.idNumber,
                'area': 'ChineseMainland',
                'gender': this.selectedGender == 0 ? 'MALE' : 'FEMALE',
            }
            formData.append('identityStr',JSON.stringify(params));

            // let frontImg = {uri: this.idCardFront.path, type: 'application/octet-stream', name: encodeURI('certificate_positive_url.' + this.idCardFront.path.split('.').pop())};
            // let backImg = {uri: this.idCardBack.path, type: 'application/octet-stream', name: encodeURI('certificate_negative_url.' + this.idCardBack.path.split('.').pop())};
            // let holdImg = {uri: this.idCardHold.path, type: 'application/octet-stream', name: encodeURI('held_certificate_url.' + this.idCardHold.path.split('.').pop())};

            let frontImg = {uri: this.idCardFront.path, type: 'application/octet-stream', name: encodeURI('certificate_positive.' + this.idCardFront.path.split('.').pop())};
            let backImg = {uri: this.idCardBack.path, type: 'application/octet-stream', name: encodeURI('certificate_negative.' + this.idCardBack.path.split('.').pop())};
            let holdImg = {uri: this.idCardHold.path, type: 'application/octet-stream', name: encodeURI('held_certificate.' + this.idCardHold.path.split('.').pop())};

            formData.append('file', frontImg)
            formData.append('file', backImg)
            formData.append('file', holdImg)
        }
        if(this.selected == 1){
            let params = {
                'name': this.firstName,
                'surname': this.lastName,//姓氏
                'idCode': this.passportID,
                'area': 'other',
                'gender': this.selectedGender == 0 ? 'MALE' : 'FEMALE',
            }
            formData.append('identityStr',JSON.stringify(params));

            let frontImg = {uri: this.passportFront.path, type: 'application/octet-stream', name: encodeURI('certificate_positive.' + this.passportFront.path.split('.').pop())};
            let backImg = {uri: this.passportBack.path, type: 'application/octet-stream', name: encodeURI('certificate_negative.' + this.passportBack.path.split('.').pop())};
            let holdImg = {uri: this.passportHold.path, type: 'application/octet-stream', name: encodeURI('held_certificate.' + this.passportHold.path.split('.').pop())};

            formData.append('file', frontImg)
            formData.append('file', backImg)
            formData.append('file', holdImg)
        }

        console.log(formData);

        this.$http.send('SEND_IDENTITY', {
            formData:formData,
            bind: this,
            // timeout: 9000,
            callBack: this.re_commit,
            timeoutHandler: this.timeout_commit,
            errorHandler: this.err_commit
        })
        this.loading = true;*/

        this.$router.push('RealNameCertificationStep2',{
             selected : this.selected,
             selectedWA : this.selectedWA,

             selectedGender : this.selectedGender,
             selectedGenderWA : this.selectedGenderWA,

             idCardFront : this.idCardFront,
             idCardFrontWA : this.idCardFrontWA,

             idCardBack : this.idCardBack,
             idCardBackWA : this.idCardBackWA,

             idCardHold : this.idCardHold,
             idCardHoldWA : this.idCardHoldWA,

             passportFront : this.passportFront,
             passportFrontWA : this.passportFrontWA,

             passportBack : this.passportBack,
             passportBackWA : this.passportBackWA,

             passportHold : this.passportHold,
             passportHoldWA : this.passportHoldWA,

             currImgType : this.currImgType,

             name : this.name,
             nameWA : this.nameWA,

             idNumber : this.idNumber,
             idNumberWA : this.idNumberWA,

             firstName : this.firstName,
             firstNameWA : this.firstNameWA,

             lastName : this.lastName,
             lastNameWA : this.lastNameWA,

             passportID : this.passportID,
             passportIDWA : this.passportIDWA,

             identityAuthWAReason0 : this.identityAuthWAReason0,
             identityAuthWAReason1 : this.identityAuthWAReason1,
        });
    }

    @action
    re_commit = (data)=>{
        this.loading = false;
        typeof data === 'string' && (data = JSON.parse(data));
        console.log('人工认证',data);
        if (!data) return

        if (data.errorCode) {

            let errorText = '';
            switch (data.errorCode){
                case 2:
                    errorText = '图片过大'
                    break;
                case 3:
                    errorText = '您输入的证件信息有误，请重新填写！'
                    break;
                case 4:
                    errorText = '您的年龄不符合平台注册要求18-65周岁！'
                    break;
                case 5:
                    errorText = 'face++认证中'
                    break;
                case 6:
                    errorText = 'face++用户认证已通过'
                    break;
            }

            Toast.show(errorText, {
                duration: 1000,
                position: Toast.positions.CENTER
            })
            return
        }
        Toast.show('提交成功', {
            duration: 1000,
            position: Toast.positions.CENTER
        })

        this.notify({key: 'GET_IDENTITY_INFO'})

        setTimeout(()=>{
            this.goBack();
        },1000);

    }

    @action
    err_commit = (err)=>{
        this.loading = false;
        console.log('人工认证异常',err);
    }

    @action
    timeout_commit = (err)=>{
        this.loading = false;
        Toast.show('操作超时', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
        console.log('人工认证超时',err);
    }

    @action
    onPressDelete = (imgType)=>{
        this[imgType] = null
        this[imgType+'WA'] = ''
    }

    @action
    showPicker = (type)=>{
        this.pickerType = type;
        this.isShowPicker = true;
        setTimeout(()=>{
            this.refs.scrollView.scrollToEnd();
        })
    }

    @action
    hidePicker = ()=>{
        if(!this.isShowPicker)return;
        this.refs.scrollView.scrollTo({
            y: 0,animated: true
        });
        setTimeout(()=>{
            this.isShowPicker = false;
        },17)
    }

    @action
    showGenderPicker = ()=>{
        this.isShowGenderPicker = true;
    }

    @action
    hideGenderPicker = ()=>{
        this.isShowGenderPicker = false;
    }

    // @action
    // androidSetting = ()=>{
    //     try{
    //         AndroidModule.openAndroidPermission();
    //     }catch(ex){
    //         console.log('跳到设置失败',ex);
    //     }
    // }

    @action
    showImgModalFunc = (currImgType)=>{
        this.currImgType = currImgType;
        this.showImgModal = true
        setTimeout(()=>{
            this.refs.scrollView.scrollToEnd();
        })
    }

    @action
    hideImgModalFunc = ()=>{
        if(!this.showImgModal)return;
        this.refs.scrollView.scrollTo({
            y: 0,animated: true
        });
        setTimeout(()=>{
            this.showImgModal = false;
        },17)
    }

    @action
    onChinaMainland = ()=>{
        this.hidePicker();
        // this.uploadIDCard('openCamera')
    }

    @action
    onOtherCountry = ()=>{
        this.hidePicker();
        // this.uploadIDCard('openPicker')
    }

    @action
    uploadIDCard = (type)=>{
        let option = {}
        if(type === 'openPicker'){
            option = {
                compressImageMaxWidth: 500,
                compressImageMaxHeight: 500,
                compressImageQuality: 0.7,
                mediaType: 'photo',
                cropperChooseText:'确认',
                cropperCancelText: '取消'
            }
        }
        if(type === 'openCamera'){
            option = {
                compressImageMaxWidth: 500,
                compressImageMaxHeight: 500,
                compressImageQuality: 0.7,
                cropperChooseText:'确认',
                cropperCancelText: '取消'
            }
        }
        ImagePicker[type](option).then(images => {
            // console.log(images)
            this[this.currImgType] = images
            this[this.currImgType+'WA'] = ''
            console.log(this[this.currImgType])
        }).catch((err)=>{
            console.log('err',err,err.code);
            if(err && (err.code === 'E_PERMISSION_MISSING')){
                PlatformOS === 'ios' && Alert.alert('无法上传','请在iPhone的“设置-隐私-照片”选项中，允许二零二零读取和写入你的照片。');
                PlatformOS === 'android' && Alert.alert(
                    '无法上传',
                    '当前状态无法上传图片或保存图片，请在设置中打开存储权限。',
                    [
                        {text: '不允许', style: 'cancel'},
                        {text: '去设置', onPress: this.androidSetting}
                    ],
                    { cancelable: false });
                return;
            }
            if(err && (err.code === 'E_PICKER_NO_CAMERA_PERMISSION')){
                PlatformOS === 'ios' && Alert.alert('无法拍摄','请在iPhone的“设置-隐私-相机”选项中，开启二零二零相机权限。');
                PlatformOS === 'android' && Alert.alert(
                    '无法拍摄',
                    '当前状态无法拍摄，开启二零二零相机权限。',
                    [
                        {text: '不允许', style: 'cancel'},
                        {text: '去设置', onPress: this.androidSetting}
                    ],
                    { cancelable: false });
                return;
            }
            if(err && err.code === 'E_PICKER_CANCELLED'){
                return;
            }
            Toast.show('请重试', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
        });
    }

    @action
    androidSetting = ()=>{
        try{
            AndroidModule.openAndroidPermission();
        }catch(ex){
            console.log('跳到设置失败',ex);
        }
    }

    /*----------------------- 挂载 -------------------------*/
    //
    renderChinaMainland = (idCardFront,idCardBack,idCardHold,currImgType,name,idNumber)=>{

        // let idCardFront = this.idCardFront;

        return(
            <View>
                {/*姓名 begin*/}
                <View style={[styles.inputItemBox]}>
                    <Text style={styles.inputTitleBoxTitle}>姓名</Text>
                    <BaseTextInput
                        // maxLength={30}
                        allowFontScaling={false}
                        placeholder={'请输入姓名'}
                        placeholderTextColor={StyleConfigs.placeholderTextColor}
                        style={styles.input}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => {
                            this.name = text
                            this.nameWA && (this.nameWA = undefined)
                        }}
                        returnKeyType={'done'}
                        value={name}
                        autoFocus={PlatformOS == 'ios'}
                    />
                    {/*<Text style={styles.inputTitleBoxRow}>{this.nameWA && this.authResultText[this.nameWA] || ''}</Text>*/}
                    <Text style={styles.inputTitleBoxRow}>{''}</Text>
                </View>
                {/*身份证号 begin*/}
                <View style={[styles.inputItemBox]}>
                    <Text style={styles.inputTitleBoxTitle}>身份证号</Text>
                    <TextInput
                        // maxLength={30}
                        allowFontScaling={false}
                        placeholder={'请输入身份证号'}
                        placeholderTextColor={StyleConfigs.placeholderTextColor}
                        style={styles.input}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => {
                            this.idNumber = text
                            this.idNumberWA && (this.idNumberWA = undefined)
                        }}
                        returnKeyType={'done'}
                        value={idNumber}
                    />
                    {/*<Text style={styles.inputTitleBoxRow}>{this.idNumberWA && this.authResultText[this.idNumberWA] || ''}</Text>*/}
                    <Text style={styles.inputTitleBoxRow}>{''}</Text>
                </View>
                {/*<Text style={styles.imageTitle}>*/}
                    {/*请拍摄并上传您的身份证照片*/}
                {/*</Text>*/}

                {/*<Text style={styles.idCardTips}>*/}
                    {/** 确保身份证在有效期内，拍照字体清晰，无遮挡反光，图片不超过2M，否则可能会审核不通过哦。*/}
                {/*</Text>*/}

                {/*<View style={styles.idCardBox}>*/}

                    {/*/!*正面*!/*/}
                    {/*<View>*/}
                        {/*<View style={styles.idCardItems}>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*style={styles.image}*/}
                                {/*onPress={()=>{*/}
                                    {/*this.showImgModalFunc('idCardFront');*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*{*/}
                                    {/*idCardFront == null &&*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'stretch'}*/}
                                        {/*source={idCardFrontDefault}*/}
                                    {/*/>*/}
                                    {/*||*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'stretch'}*/}
                                        {/*source={{uri:idCardFront.path}}*/}
                                    {/*/>*/}
                                {/*}*/}

                            {/*</TouchableOpacity>*/}
                            {/*{*/}
                                {/*idCardFront != null &&*/}
                                {/*<TouchableOpacity*/}
                                    {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                    {/*style={styles.deleteItems}*/}
                                    {/*onPress={this.onPressDelete.bind(this,'idCardFront')}*/}
                                {/*>*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'contain'}*/}
                                        {/*source={deleteImage}*/}
                                    {/*/>*/}
                                {/*</TouchableOpacity>*/}
                                {/*|| null*/}
                            {/*}*/}
                        {/*</View>*/}
                        {/*{this.idCardFrontWA &&*/}
                            {/*<Text style={[styles.idCardItemTips,baseStyles.textBlue]}>*/}
                                {/*{this.authResultText[this.idCardFrontWA]}*/}
                            {/*</Text>*/}
                                {/*||*/}
                            {/*<Text style={styles.idCardItemTips}>*/}
                                {/*正面*/}
                            {/*</Text>*/}
                        {/*}*/}
                    {/*</View>*/}
                    {/*/!*反面*!/*/}
                    {/*<View>*/}
                        {/*<View style={styles.idCardItems}>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*style={styles.image}*/}
                                {/*onPress={()=>{*/}
                                    {/*this.showImgModalFunc('idCardBack');*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*{*/}
                                    {/*idCardBack == null &&*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'stretch'}*/}
                                        {/*source={idCardBackDefault}*/}
                                    {/*/>*/}
                                    {/*||*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'stretch'}*/}
                                        {/*source={{uri:idCardBack.path}}*/}
                                    {/*/>*/}
                                {/*}*/}
                            {/*</TouchableOpacity>*/}
                            {/*{*/}
                                {/*idCardBack != null &&*/}
                                {/*<TouchableOpacity*/}
                                    {/*style={styles.deleteItems}*/}
                                    {/*onPress={this.onPressDelete.bind(this,'idCardBack')}*/}
                                {/*>*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'contain'}*/}
                                        {/*source={deleteImage}*/}
                                    {/*/>*/}
                                {/*</TouchableOpacity>*/}
                                {/*|| null*/}
                            {/*}*/}
                        {/*</View>*/}
                        {/*{this.idCardBackWA &&*/}
                            {/*<Text style={[styles.idCardItemTips,baseStyles.textBlue]}>*/}
                                {/*{this.authResultText[this.idCardBackWA]}*/}
                            {/*</Text>*/}
                                {/*||*/}
                            {/*<Text style={styles.idCardItemTips}>*/}
                                {/*反面*/}
                            {/*</Text>*/}
                        {/*}*/}
                    {/*</View>*/}

                {/*</View>*/}

                {/*<Text style={styles.idCardTips}>*/}
                    {/** 本人手持证件和手写签名合照（手写内容包含姓名、日期和 www.2020.exchange）*/}
                {/*</Text>*/}
                {/*<View style={styles.idCardHoldBox}>*/}
                    {/*/!*手持证件照*!/*/}
                    {/*<View style={styles.idCardHold}>*/}
                        {/*<TouchableOpacity*/}
                            {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                            {/*style={styles.image}*/}
                            {/*onPress={()=>{*/}
                                {/*this.showImgModalFunc('idCardHold');*/}
                            {/*}}*/}
                        {/*>*/}
                            {/*{*/}
                                {/*idCardHold == null &&*/}
                                {/*<Image*/}
                                    {/*style={styles.image}*/}
                                    {/*resizeMode={'stretch'}*/}
                                    {/*source={idCardHoldDefault}*/}
                                {/*/>*/}
                                {/*||*/}
                                {/*<Image*/}
                                    {/*style={styles.image}*/}
                                    {/*resizeMode={'stretch'}*/}
                                    {/*source={{uri:idCardHold.path}}*/}
                                {/*/>*/}
                            {/*}*/}
                        {/*</TouchableOpacity>*/}
                        {/*{*/}
                            {/*idCardHold != null &&*/}
                            {/*<TouchableOpacity*/}
                                {/*style={styles.deleteItems}*/}
                                {/*onPress={this.onPressDelete.bind(this,'idCardHold')}*/}
                            {/*>*/}
                                {/*<Image*/}
                                    {/*style={styles.image}*/}
                                    {/*resizeMode={'contain'}*/}
                                    {/*source={deleteImage}*/}
                                {/*/>*/}
                            {/*</TouchableOpacity>*/}
                            {/*|| null*/}
                        {/*}*/}
                    {/*</View>*/}
                    {/*{this.idCardHoldWA &&*/}
                        {/*<Text style={[styles.idCardItemTips,baseStyles.textBlue]}>*/}
                            {/*{this.authResultText[this.idCardHoldWA]}*/}
                        {/*</Text>*/}
                            {/*||*/}
                        {/*<Text style={styles.idCardItemTips}>*/}
                            {/*手持证件照*/}
                        {/*</Text>*/}
                    {/*}*/}
                {/*</View>*/}
            </View>
        )
    }

    @action
    renderOtherCountry = (passportFront,passportBack,passportHold,currImgType,firstName,lastName,passportID)=>{
        return(
            <View>
                {/*名字 begin*/}
                <View style={[styles.inputItemBox]}>
                    <Text style={styles.inputTitleBoxTitle}>名字</Text>
                    <BaseTextInput
                        maxLength={30}
                        allowFontScaling={false}
                        placeholder={'请输入名字'}
                        placeholderTextColor={StyleConfigs.placeholderTextColor}
                        style={styles.input}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => {
                            this.firstName = text
                            this.firstNameWA && (this.firstNameWA = undefined)
                        }}
                        returnKeyType={'done'}
                        value={firstName}
                        autoFocus={PlatformOS == 'ios'}
                        // value={ `${this.firstName}`}
                    />
                    {/*<Text style={styles.inputTitleBoxRow}>{this.firstNameWA && this.authResultText[this.firstNameWA]}</Text>*/}
                    <Text style={styles.inputTitleBoxRow}>{''}</Text>
                </View>

                {/*姓氏 begin*/}
                <View style={[styles.inputItemBox]}>
                    <Text style={styles.inputTitleBoxTitle}>姓氏</Text>
                    <BaseTextInput
                        maxLength={30}
                        allowFontScaling={false}
                        placeholder={'请输入姓氏'}
                        placeholderTextColor={StyleConfigs.placeholderTextColor}
                        style={styles.input}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => {
                            this.lastName = text
                            this.lastNameWA && (this.lastNameWA = undefined)
                        }}
                        returnKeyType={'done'}
                        value={lastName}
                    />
                    {/*<Text style={styles.inputTitleBoxRow}>{this.lastNameWA && this.authResultText[this.lastNameWA]}</Text>*/}
                    <Text style={styles.inputTitleBoxRow}>{''}</Text>
                </View>

                {/*护照ID begin*/}
                <View style={[styles.inputItemBox]}>
                    <Text style={styles.inputTitleBoxTitle}>护照ID</Text>
                    <TextInput
                        maxLength={30}
                        allowFontScaling={false}
                        placeholder={'请输入护照ID'}
                        placeholderTextColor={StyleConfigs.placeholderTextColor}
                        style={styles.input}
                        underlineColorAndroid={'transparent'}
                        onChangeText={(text) => {
                            this.passportID = text
                            this.passportIDWA && (this.passportIDWA = undefined)
                        }}
                        returnKeyType={'done'}
                        value={passportID}
                    />
                    {/*<Text style={styles.inputTitleBoxRow}>{this.passportIDWA && this.authResultText[this.passportIDWA]}</Text>*/}
                    <Text style={styles.inputTitleBoxRow}>{''}</Text>
                </View>

                {/*<Text style={styles.imageTitle}>*/}
                    {/*请拍摄并上传您的护照照片*/}
                {/*</Text>*/}

                {/*<Text style={styles.idCardTips}>*/}
                    {/** 确保护照在有效期内，拍照字体清晰，无遮挡反光，图片不超过2M，否则可能会审核不通过哦。*/}
                {/*</Text>*/}

                {/*<View style={styles.idCardBox}>*/}
                    {/*/!*正面*!/*/}
                    {/*<View>*/}
                        {/*<View style={styles.idCardItems}>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*style={styles.image}*/}
                                {/*onPress={()=>{*/}
                                    {/*this.showImgModalFunc('passportFront');*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*{*/}
                                    {/*passportFront == null &&*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'stretch'}*/}
                                        {/*source={passportFrontDefault}*/}
                                    {/*/>*/}
                                    {/*||*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'stretch'}*/}
                                        {/*source={{uri:passportFront.path}}*/}
                                    {/*/>*/}
                                {/*}*/}

                            {/*</TouchableOpacity>*/}
                            {/*{*/}
                                {/*passportFront != null &&*/}
                                {/*<TouchableOpacity*/}
                                    {/*style={styles.deleteItems}*/}
                                    {/*onPress={this.onPressDelete.bind(this,'passportFront')}*/}
                                {/*>*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'contain'}*/}
                                        {/*source={deleteImage}*/}
                                    {/*/>*/}
                                {/*</TouchableOpacity>*/}
                                {/*|| null*/}
                            {/*}*/}
                        {/*</View>*/}
                        {/*{this.passportFrontWA &&*/}
                            {/*<Text style={[styles.idCardItemTips,baseStyles.textBlue]}>*/}
                                {/*{this.authResultText[this.passportFrontWA]}*/}
                            {/*</Text>*/}
                            {/*||*/}
                            {/*<Text style={styles.idCardItemTips}>*/}
                                {/*正面*/}
                            {/*</Text>*/}
                        {/*}*/}
                    {/*</View>*/}
                    {/*/!*反面*!/*/}
                    {/*<View>*/}
                        {/*<View style={styles.idCardItems}>*/}
                            {/*<TouchableOpacity*/}
                                {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                                {/*style={styles.image}*/}
                                {/*onPress={()=>{*/}
                                    {/*this.showImgModalFunc('passportBack');*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*{*/}
                                    {/*passportBack == null &&*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'stretch'}*/}
                                        {/*source={passportBackDefault}*/}
                                    {/*/>*/}
                                    {/*||*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'stretch'}*/}
                                        {/*source={{uri:passportBack.path}}*/}
                                    {/*/>*/}
                                {/*}*/}

                            {/*</TouchableOpacity>*/}
                            {/*{*/}
                                {/*passportBack != null &&*/}
                                {/*<TouchableOpacity*/}
                                    {/*style={styles.deleteItems}*/}
                                    {/*onPress={this.onPressDelete.bind(this,'passportBack')}*/}
                                {/*>*/}
                                    {/*<Image*/}
                                        {/*style={styles.image}*/}
                                        {/*resizeMode={'contain'}*/}
                                        {/*source={deleteImage}*/}
                                    {/*/>*/}
                                {/*</TouchableOpacity>*/}
                                {/*|| null*/}
                            {/*}*/}
                        {/*</View>*/}
                        {/*{this.passportBackWA &&*/}
                            {/*<Text style={[styles.idCardItemTips,baseStyles.textBlue]}>*/}
                                {/*{this.authResultText[this.passportBackWA]}*/}
                            {/*</Text>*/}
                            {/*||*/}
                            {/*<Text style={styles.idCardItemTips}>*/}
                                {/*反面*/}
                            {/*</Text>*/}
                        {/*}*/}
                    {/*</View>*/}

                {/*</View>*/}

                {/*<Text style={styles.idCardTips}>*/}
                    {/** 本人手持证件和手写签名合照（手写内容包含姓名、日期和 www.2020.exchange）*/}
                {/*</Text>*/}
                {/*<View style={styles.idCardHoldBox}>*/}
                    {/*/!*手持证件照*!/*/}
                    {/*<View style={styles.idCardHold}>*/}
                        {/*<TouchableOpacity*/}
                            {/*activeOpacity={StyleConfigs.activeOpacity}*/}
                            {/*style={styles.image}*/}
                            {/*onPress={()=>{*/}
                                {/*this.showImgModalFunc('passportHold');*/}
                            {/*}}*/}
                        {/*>*/}
                            {/*{*/}
                                {/*passportHold == null &&*/}
                                {/*<Image*/}
                                    {/*style={styles.image}*/}
                                    {/*resizeMode={'stretch'}*/}
                                    {/*source={idCardHoldDefault}*/}
                                {/*/>*/}
                                {/*||*/}
                                {/*<Image*/}
                                    {/*style={styles.image}*/}
                                    {/*resizeMode={'stretch'}*/}
                                    {/*source={{uri:passportHold.path}}*/}
                                {/*/>*/}
                            {/*}*/}
                        {/*</TouchableOpacity>*/}
                        {/*{*/}
                            {/*passportHold != null &&*/}
                            {/*<TouchableOpacity*/}
                                {/*style={styles.deleteItems}*/}
                                {/*onPress={this.onPressDelete.bind(this,'passportHold')}*/}
                            {/*>*/}
                                {/*<Image*/}
                                    {/*style={styles.image}*/}
                                    {/*resizeMode={'contain'}*/}
                                    {/*source={deleteImage}*/}
                                {/*/>*/}
                            {/*</TouchableOpacity>*/}
                            {/*|| null*/}
                        {/*}*/}
                    {/*</View>*/}
                    {/*{this.passportHoldWA &&*/}
                        {/*<Text style={[styles.idCardItemTips,baseStyles.textBlue]}>*/}
                            {/*{this.authResultText[this.passportHoldWA]}*/}
                        {/*</Text>*/}
                        {/*||*/}
                        {/*<Text style={styles.idCardItemTips}>*/}
                            {/*手持证件照*/}
                        {/*</Text>*/}
                    {/*}*/}
                {/*</View>*/}


            </View>
        )
    }

    render() {
        return (
            <View style={[styles.container,styles.background]}>
                <KeyboardAvoidingView style={[styles.container,styles.deviceBox]} behavior={'padding'}>
                    <NavHeader goBack={this.goBack} onLayout={this.onHeaderLayout}/>
                    <Text style={[baseStyles.securityCenterTitle]}>身份认证</Text>
                    <ScrollView
                        onMomentumScrollEnd={(event)=>{
                            // 加了这个函数是为了避免ios ScrollView 下拉特效导致的坐标偏移
                            console.log('onMomentumScrollEnd垂直滚动距离'+event.nativeEvent.contentOffset.y);//垂直滚动距离
                            this.scrollViewContentOffsetY = event.nativeEvent.contentOffset.y
                        }}
                        onScrollEndDrag={(event)=>{
                            // console.log('手指离开时 垂直滚动距离',event.nativeEvent);//水平滚动距离
                            console.log('手指离开时 垂直滚动距离'+event.nativeEvent.contentOffset.y);//垂直滚动距离
                            this.scrollViewContentOffsetY = event.nativeEvent.contentOffset.y
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}
                        style={[styles.container]}>
                        {/*请选择地区 begin*/}
                        <View style={[styles.inputItemBox]}>
                            <Text style={styles.inputTitleBoxTitle}>国籍</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={()=>{
                                    // this.showPicker('selected')
                                    this.$router.push('RegisterArea')

                                }}
                                style={[styles.inputView,false && styles.box || {}]}>
                                {
                                    this.selected !== null &&
                                    <Text allowFontScaling={false} style={styles.selectedText}>{this.areaNameCn}</Text>
                                ||
                                    <Text allowFontScaling={false} style={styles.placeholderSelf}>请选择国籍</Text>
                                }

                                <View style={styles.arrowUp}/>

                            </TouchableOpacity>
                            {/*<Text style={styles.inputTitleBoxRow}>{this.selectedWA && this.authResultText[this.selectedWA] || ''}</Text>*/}
                            <Text style={styles.inputTitleBoxRow}>{''}</Text>
                        </View>
                        {/*请选择性别 begin*/}
                        <View style={[styles.inputItemBox]}>
                            <Text style={styles.inputTitleBoxTitle}>性别</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                // onPress={this.showGenderPicker}
                                onPress={()=>{
                                    this.showPicker('selectedGender')
                                }}
                                style={[styles.inputView,false && styles.box || {}]}>
                                {this.selectedGender !== null &&
                                    <Text allowFontScaling={false} style={styles.selectedText}>{this.selectedGender !== null && this.genderType[this.selectedGender]}</Text>
                                ||
                                    <Text allowFontScaling={false} style={styles.placeholderSelf}>请选择性别</Text>
                                }
                                <View style={styles.arrowUp}/>
                            </TouchableOpacity>
                            {/*<Text style={styles.inputTitleBoxRow}>{this.selectedGenderWA && this.authResultText[this.selectedGenderWA] || ''}</Text>*/}
                            <Text style={styles.inputTitleBoxRow}>{''}</Text>
                        </View>

                        {
                            (this.selected == null || this.selected == 0) &&
                            this.renderChinaMainland(this.idCardFront,this.idCardBack,this.idCardHold,this[this.currImgType+'WA'],this.name,this.idNumber)

                        }
                        {(this.selected == 1) &&
                            this.renderOtherCountry(this.passportFront,this.passportBack,this.passportHold,this[this.currImgType+'WA'],this.firstName,this.lastName,this.passportID)
                        }


                        {(this.selected == 0 && this.identityAuthWAReason0) &&
                            <View style={[styles.identityAuthWAReasonBox,{marginTop:15}]}>
                                <Text style={styles.identityAuthWAReasonText}>
                                    {'审核未通过原因：'+this.identityAuthWAReason0}
                                </Text>
                            </View>
                        }

                        {(this.selected == 1 && this.identityAuthWAReason1) &&
                            <View style={[styles.identityAuthWAReasonBox,{marginTop:15}]}>
                                <Text style={styles.identityAuthWAReasonText}>
                                    {'审核未通过原因：'+this.identityAuthWAReason1}
                                </Text>
                            </View>
                        }
                    </ScrollView>
                    {/*确认按钮 begin*/}
                    <BaseButton
                        onPress={this.commit}
                        style={[styles.btnbot]}
                        text={'下一步'}
                        textStyle={[styles.btnText]}
                    >
                    </BaseButton>
                    {/*确认按钮 end*/}
                    {/*国籍picker*/}
                    {
                        /*this.isShowPicker && <TouchableOpacity onPress={this.hidePicker} activeOpacity={1} style={styles.modal}>
                            <View
                                style={[styles.pickerViewBox,{
                                    marginTop: getHeight(32 + 88) + this.headerHeight - this.scrollViewContentOffsetY, //由于每次渲染可能不一样 因此就放在这里了
                                }]}>
                                {
                                    this.countryType.map((v,i)=>{
                                        return <TouchableOpacity key={i} activeOpacity={StyleConfigs.activeOpacity} style={[styles.orderListOne,i != 0 && styles.orderListSplitTop || {}]} onPress={this.onChangeSelected.bind(this,i)}>
                                            <Text allowFontScaling={false} style={styles.orderListText}>{v}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </TouchableOpacity>*/
                    }
                    {/*性别picker*/}
                    {
                        /*this.isShowGenderPicker && <TouchableOpacity onPress={this.hideGenderPicker} activeOpacity={1} style={styles.modal}>
                            <View
                                style={[styles.pickerViewBox,{
                                    marginTop: getHeight(32 + 88) * 2 + this.headerHeight - this.scrollViewContentOffsetY, //由于每次渲染可能不一样 因此就放在这里了
                                }]}>
                                {
                                    this.genderType.map((v,i)=>{
                                        return <TouchableOpacity key={i} activeOpacity={StyleConfigs.activeOpacity} style={[styles.orderListOne,i != 0 && styles.orderListSplitTop || {}]} onPress={this.onGenderSelected.bind(this,i)}>
                                            <Text allowFontScaling={false} style={styles.orderListText}>{v}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </TouchableOpacity>*/
                    }
                    {/*加载中*/}
                    {
                        this.loading && <Loading leaveNav={false}/>
                    }

                </KeyboardAvoidingView>
                {/*选择地区模态框 begin*/}
                {this.isShowPicker &&

                    <ScrollView
                        ref={'scrollView'}
                        scrollEnabled={false}
                        style={styles.modalScrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            onPress={this.hidePicker}
                            activeOpecity={1}
                            style={{height: RealWindowHeight}}
                        />
                        <View style={{backgroundColor:StyleConfigs.bgColor}}>
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                style={styles.modalBtn}
                                textStyle={styles.modalBtnTxt}
                                text={this.pickerTypeMap[this.pickerType][0]}
                                onPress={this.onChangeSelected.bind(this,0)}
                            />
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                style={styles.modalPhotoBtn}
                                textStyle={styles.modalBtnTxt}
                                text={this.pickerTypeMap[this.pickerType][1]}
                                onPress={this.onChangeSelected.bind(this,1)}
                            />
                            <BaseButton
                                activeOpecity={StyleConfigs.activeOpacity}
                                onPress={this.hidePicker}
                                style={styles.modalBtn}
                                textStyle={styles.modalBtnCancleTxt}
                                text={'取消'}
                            />
                        </View>

                    </ScrollView>

                // </Modal>
                }
                {/*选择地区模态框 end*/}
            </View>
        )
    }
}
