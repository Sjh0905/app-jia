/**
 * hjx 2018.4.16
 */

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
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import StyleConfigs from "../style/styleConfigs/StyleConfigs";
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal'
import BaseButton from '../components/baseComponent/BaseButton'
import Toast from 'react-native-root-toast'
import globalFunc from "../configs/globalFunctionConfigs/GlobalFunction";
import AndroidModule from '../../native/AndroidUtil';


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    @observable
    selected = null;

    @observable
    selectedId = null;

    @observable
    isShowPicker = false

    @observable
    imageList = ['add',null,null]

    @observable
    imageSize = 0;

    @observable
    headerHeight = 0;

    @observable
    orderListType = [];

    // 标题
    @observable
    title = '';

    // 描述
    @observable
    content = '';

    // email
    @observable
    userEmail = '';

    // mobile
    @observable
    userMobile = '';

    @observable
    C2CNUM = '';

    @observable
    showC2C = false;




    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.get_ListOrderType();
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }


    // 获取工单类型列表
    get_ListOrderType = () => {
        this.$http.send('LIST_ORDER_TYPE', {
            bind: this,
            callBack: this.re_ListOrderType,
            errorHandler: this.error_ListOrderType
        })
        this.loading = true;
        return
    }


    // 获取工单类型列表回调
    re_ListOrderType = (data) => {
        this.loading = false;
        typeof data === 'string' && (data = JSON.parse(data));
        console.log(data);
        if(data.code == 200){
            (typeof data.message === 'string') && (data.message = JSON.parse(data.message));
            data.message && (this.orderListType = data.message);
        }
    }
    // 获取工单类型列表出错
    error_ListOrderType = (err) => {
        this.loading = false;
        console.warn("获取工单类型列表出错！", err)
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
        this.selected = index;
        this.selectedId = this.orderListType[index].id;
        if(this.orderListType[index]['id'].toString() === '1343095'){
            this.showC2C = true;
        }else{
            this.showC2C = false;
        }
        this.hidePicker();
    }

    @action
    onPressUpdate = (item,index)=>{
        let count = 1;
        if(item === 'add'){
            count = 3 - this.imageList.filter((v)=>{return v !== null && v != 'add'}).length
        }
        ImagePicker.openPicker({
            multiple: true,
            maxFiles: count,
            showsSelectedCount: true,
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            mediaType: 'photo'
        }).then(images => {
            console.log(images)
            if(item === 'add'){
                images.map((v,i)=>{
                    this.imageList[i + index] = v;
                    (i + index + 1) < 3 && (this.imageList[i + index + 1] = 'add');
                    // this.imageList.pop();
                    // this.imageList.unshift(v);
                })
            }
            if(item !== 'add'){
                this.imageList.some((v,i)=>{
                    if(v.path === item.path){
                        this.imageList[i] = images[0];
                        return true;
                    }
                })
            }
        }).catch((err)=>{
            console.log('err',err);
            if(err && err.code === 'E_PERMISSION_MISSING'){
                PlatformOS === 'ios' && Alert.alert('无法上传','请在iPhone的“设置-隐私-照片”选项中，允许二零二零读取和写入你的照片。');
                PlatformOS === 'android' && Alert.alert(
                    '无法上传',
                    '当前状态无法上传图片或保存图片，请在设置中打开存储权限。'  ,
                    [
                        {text: '不允许', style: 'cancel'},
                        {text: '去设置', onPress: this.androidSetting}
                    ],
                    { cancelable: false });
            }else{
                Toast.show('请重试', {
                    duration: 1000,
                    position: Toast.positions.CENTER
                })
            }
        });
    }

    @action
    testInput = ()=>{
        let result = true;
        let errMessage = '';

        if(result && this.selected === null){
            errMessage = '请选择问题类型';
            result = false;
        }

        if(result && this.title.trim() === ''){
            errMessage = '请输入标题';
            result = false;
        }

        if(result && this.content.trim() === ''){
            errMessage = '请输入描述';
            result = false;
        }

        if(result && this.showC2C && this.C2CNUM.trim() === ''){
            errMessage = '请输入C2C订单单号';
            result = false;
        }
        if(result && this.showC2C && !globalFunc.testC2COrder(this.C2CNUM,this.$store.state.serverTime)){
            errMessage = 'C2C订单单号格式错误';
            result = false;
        }

        if(result && this.userEmail.trim() === ''){
            errMessage = '请输入您的二零二零注册手机号/邮箱地址';
            result = false;
        }
        if(result && !(globalFunc.testEmail(this.userEmail) || globalFunc.testMobile(this.userEmail) )){
            errMessage = '二零二零注册手机号/邮箱地址格式错误';
            result = false;
        }

        if(result && this.userMobile.trim() === ''){
            errMessage = '请输入联系方式';
            result = false;
        }
        if(result && !(globalFunc.testMobile(this.userMobile) || globalFunc.testEmail(this.userMobile))){
            errMessage = '联系方式格式错误';
            result = false;
        }
        if(result && this.imageList[0] === 'add'){
            errMessage = '请添加图片';
            result = false;
        }
        if(result && this.imageList.reduce((total,v)=>{
            if(v && v !== 'add'){
                total = total + v.size;
            }
            return total;
        },0) >= 1024 * 1024 * 5){
            errMessage = '上传图片过大';
            result = false;
        }
        if(!result){
            Toast.show(errMessage, {
                duration: 1000,
                position: Toast.positions.CENTER
            })
        }
        return result;
    }

    @action
    commit = ()=>{
        let cansend = this.testInput();
        if(cansend){
            let params = {
                typeId: this.selectedId,
                title: this.title,
                content: this.content,
                userEmail: this.userEmail,
                userMobile: this.userMobile,
                C2CNUM:this.C2CNUM
            }
            let formData = new FormData();
            formData.append('identityStr',JSON.stringify(params));
            this.imageList.forEach((v)=>{
                if(v !== 'add' && v){
                    let file = {uri: v.path, type: 'application/octet-stream', name: encodeURI(v.path.split('/').pop())};
                    formData.append('file',file);
                }
            })
            this.$http.send('CREATE_ORDER', {
                formData:formData,
                bind: this,
                timeout: 90000,
                callBack: this.re_commit,
                timeoutHandler: this.timeout_commit,
                errorHandler: this.err_commit
            })
            this.loading = true;
        }
    }

    @action
    re_commit = (data)=>{
        this.loading = false;
        console.log('提交工单',data);
        typeof data === 'string' && (data = JSON.parse(data));
        if(data.code == '200'){
            Toast.show('提交成功', {
                duration: 1000,
                position: Toast.positions.CENTER
            })
            setTimeout(()=>{
                if(this){
                    this.goBack();
                }
            },1000);
        }
    }

    @action
    err_commit = (err)=>{
        this.loading = false;
        console.log('提交工单异常',err);
    }

    @action
    timeout_commit = (err)=>{
        this.loading = false;
        Toast.show('操作超时', {
            duration: 1000,
            position: Toast.positions.CENTER
        })
        console.log('提交工单超时',err);
    }

    @action
    onPressDelete = (item)=>{
        this.imageList.some((v,i)=>{
            if(v && v.path === item.path){
                this.imageList.splice(i,1);
                if(this.imageList.indexOf('add') > -1){
                    this.imageList.push(null);
                }else{
                    this.imageList.push('add');
                }
                return true;
            }
        })
    }

    @action
    showPicker = ()=>{
        this.isShowPicker = true;
    }

    @action
    hidePicker = ()=>{
        this.isShowPicker = false;
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

    render() {
        return (
            <View style={[styles.container,styles.background]}>
                <KeyboardAvoidingView style={[styles.container,styles.deviceBox]} behavior={'padding'}>
                    <NavHeader headerTitle={'提交工单'} goBack={this.goBack} onLayout={this.onHeaderLayout}/>
                    <ScrollView
                        keyboardShouldPersistTaps={'always'}
                        style={[styles.container]}>
                        {/*请选择您遇到的问题类型 begin*/}
                        <View style={[styles.inputItemBox]}>
                            <View style={styles.inputTitleBoxRow}>
                                <Text allowFontScaling={false} style={styles.inputStar}>*</Text><Text allowFontScaling={false} style={styles.inputTitle}>请选择您遇到的问题类型</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={this.showPicker}
                                style={[styles.inputView,false && styles.box || {}]}>
                                <Text allowFontScaling={false} style={styles.selectedText}>{this.selected !== null && this.orderListType[this.selected].name}</Text>
                                <View style={styles.arrowUp}>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/*标题 begin*/}
                        <View style={[styles.inputItemBox]}>
                            <View style={styles.inputTitleBoxRow}>
                                <Text allowFontScaling={false} style={styles.inputStar}>*</Text><Text allowFontScaling={false} style={styles.inputTitle}>标题</Text>
                            </View>
                            <TextInput
                                maxLength={30}
                                allowFontScaling={false}
                                style={styles.input}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.title = text
                                }}
                                returnKeyType={'done'}
                            />
                        </View>
                        {/*描述 begin*/}
                        <View style={[styles.inputItemBox]}>
                            <View style={styles.inputTitleBoxRow}>
                                <Text allowFontScaling={false} style={styles.inputStar}>*</Text><Text allowFontScaling={false} style={styles.inputTitle}>描述</Text>
                            </View>
                            <TextInput
                                maxLength={500}
                                placeholder={'请详细描述您遇到的问题'}
                                placeholderTextColor={StyleConfigs.placeholderTextColor}
                                allowFontScaling={false}
                                style={styles.inputTextArea}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.content = text
                                }}
                                multiline={true}
                                textAlignVertical={'top'}
                                returnKeyType={'done'}
                            />
                        </View>
                        {/*C2C订单号 begin*/}
                        {this.showC2C && <View style={[styles.inputItemBox]}>
                            <View style={styles.inputTitleBoxRow}>
                                <Text allowFontScaling={false} style={styles.inputStar}>*</Text><Text allowFontScaling={false} style={styles.inputTitle}>请输入您的C2C订单号</Text>
                            </View>
                            <TextInput
                                allowFontScaling={false}
                                style={styles.input}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.C2CNUM = text
                                }}
                                returnKeyType={'done'}
                                keyboardType={"numeric"}
                            />
                        </View>}
                        {/*请输入您的二零二零注册账号 begin*/}
                        <View style={[styles.inputItemBox]}>
                            <View style={styles.inputTitleBoxRow}>
                                <Text allowFontScaling={false} style={styles.inputStar}>*</Text><Text allowFontScaling={false} style={styles.inputTitle}>请输入您的二零二零注册手机号/邮箱地址</Text>
                            </View>
                            <TextInput
                                allowFontScaling={false}
                                style={styles.input}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.userEmail = text
                                }}
                                returnKeyType={'done'}
                            />
                        </View>
                        {/*请输入您的联系方式：手机号/邮箱 begin*/}
                        <View style={[styles.inputItemBox]}>
                            <View style={styles.inputTitleBoxRow}>
                                <Text allowFontScaling={false} style={styles.inputStar}>*</Text><Text allowFontScaling={false} style={styles.inputTitle}>请输入您的联系方式：手机号/邮箱</Text>
                            </View>
                            <TextInput
                                allowFontScaling={false}
                                style={styles.input}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.userMobile = text
                                }}
                                returnKeyType={'done'}
                            />
                        </View>
                        {/*上传图片 begin*/}
                        <View style={[styles.inputItemBox]}>
                            <View style={styles.inputTitleBoxRow}>
                                <Text allowFontScaling={false} style={styles.inputStar}>*</Text>
                                <Text allowFontScaling={false} style={styles.inputTitle}>添加照片</Text>
                                <Text allowFontScaling={false} style={styles.inputTitleGray}>（最多3张,总共不超过5M）</Text>
                            </View>
                            <View style={styles.imageBox}>
                                {this.imageList.reverse().map((v,i)=>{
                                return <View key={i} style={styles.imageItems}>
                                    {v && <TouchableOpacity activeOpacity={StyleConfigs.activeOpacity} onPress={this.onPressUpdate.bind(this,v,2 - i)}>
                                        <Image
                                            style={styles.image}
                                            resizeMode={'contain'}
                                            source={v == 'add' ? null : {
                                            uri: v.path
                                        }}/>
                                    </TouchableOpacity>}
                                        {
                                            v && v != 'add' && <TouchableOpacity
                                                style={styles.deleteItems}
                                                onPress={this.onPressDelete.bind(this,v)}
                                            >
                                        <Image
                                            style={styles.image}
                                            resizeMode={'contain'}
                                            source={null}
                                        />
                                    </TouchableOpacity> || null}
                                </View>
                            })}
                            </View>
                        </View>
                        {/*确认按钮 begin*/}
                        <BaseButton
                            onPress={this.commit}
                            style={[styles.btn]}
                            text={'确  认'}
                            textStyle={[styles.btnText]}
                        >
                        </BaseButton>
                        {/*确认按钮 end*/}
                    </ScrollView>
                    {/*picker*/}
                    {
                        this.isShowPicker && <TouchableOpacity onPress={this.hidePicker} activeOpacity={1} style={styles.modal}>
                            <View
                                style={{
                                    marginTop: getHeight(76 + 88) + this.headerHeight, //由于每次渲染可能不一样 因此就放在这里了
                                    marginRight:getWidth(24),
                                    marginLeft:getWidth(24),
                                    backgroundColor:'#101319',
                                    borderColor: '#1B2432',
                                    borderWidth: 1
                                }}>
                                {
                                    this.orderListType.map((v,i)=>{
                                        return <TouchableOpacity key={i} activeOpacity={StyleConfigs.activeOpacity} style={[styles.orderListOne,i != 0 && styles.orderListSplitTop || {}]} onPress={this.onChangeSelected.bind(this,i)}>
                                            <Text allowFontScaling={false} style={styles.orderListText}>{v.name}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </TouchableOpacity>
                    }
                    {/*加载中*/}
                    {
                        this.loading && <Loading leaveNav={false}/>
                    }
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = new StyleSheet.create({
    container:{
        flex: 1
    },
    deviceBox:{
        marginTop: getDeviceTop(),
        marginBottom: getDeviceBottom()
    },
    background:{
        backgroundColor:StyleConfigs.bgColor
    },
    box: {
        // overflow:'hidden'
    },
    padding:{
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
    },
    margin:{
        marginLeft: getWidth(24),
        marginRight: getWidth(24),
    },
    inputBox: {
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
    },
    inputItemBox: {
        marginLeft: getWidth(24),
        marginRight: getWidth(24),
    },
    inputTitleBox: {
        height: getHeight(76),
        justifyContent: 'center',
    },
    inputTitleBoxRow: {
        height: getHeight(76),
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputStar:{
        color: '#ed4949',
        fontSize:26,
        marginBottom: -9,
        marginRight: 4
    },
    inputTitle: {
        color: StyleConfigs.txtWhiteOpacity,
        fontSize: 13,
    },
    inputTitleGray:{
        color: StyleConfigs.txtWhiteMoreOpacity,
        fontSize: 13
    },
    input: {
        // borderColor: StyleConfigs.listSplitlineColor,
        borderColor: '#20252E',
        borderRadius: StyleConfigs.borderRadius,
        borderWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(88),
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        paddingLeft: getWidth(20),
        color: StyleConfigs.txtWhite,
        backgroundColor: '#181C22'
    },
    selectedText:{
        color: StyleConfigs.txtWhite,
    },
    inputView:{
        borderColor: '#20252E',
        borderRadius: StyleConfigs.borderRadius,
        borderWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(88),
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        paddingLeft: getWidth(20),
        backgroundColor: '#181C22',
        justifyContent:'center'
    },
    inputTextArea:{
        // borderColor: StyleConfigs.listSplitlineColor,
        borderColor: '#20252E',
        borderRadius: StyleConfigs.borderRadius,
        borderWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        height: getHeight(220),
        // backgroundColor: StyleConfigs.inputBackgroundColor,
        paddingLeft: getWidth(20),
        color: StyleConfigs.txtWhite,
        backgroundColor: '#181C22'
    },
    wrongAns: {
        fontSize: 12,
        paddingTop: getHeight(20),
        paddingLeft: getWidth(20),
    },
    btn: {
        height: getHeight(88),
        marginTop: getHeight(60),
        marginBottom: getHeight(60),
        backgroundColor: StyleConfigs.btnBlue,
        borderRadius: StyleConfigs.borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: getWidth(24),
        marginRight: getWidth(24),
    },
    btnText: {
        // fontWeight: 'bold',
        color: '#fff',
        fontSize: 18,
    },
    pickerButton:{
        width: '200%',
        height: '100%',
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0
    },
    pickerAndroid:{
        width: '200%',
        color: StyleConfigs.txtWhite,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0
    },
    pickerIOS:{
        backgroundColor: '#fff',
        paddingLeft: 0,
        paddingRight: 0
    },
    arrowDown:{
        width: 0,
        height: 0,
        right: 10,
        top: getHeight(88)/2 - 2.5,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 5,
        borderLeftColor: '#181C22',
        borderRightColor: '#181C22',
        borderBottomColor: '#fff',
        position: 'absolute'
    },
    arrowUp:{
        width: 0,
        height: 0,
        right: 10,
        top: getHeight(88)/2 - 2.5,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 5,
        borderLeftColor: '#181C22',
        borderRightColor: '#181C22',
        borderTopColor: '#fff',
        position: 'absolute'
    },
    imageBox:{
        flexDirection: 'row-reverse',
        justifyContent: 'space-around',
    },
    imageItems:{
        width: getWidth(220),
        height: getWidth(160)
    },
    deleteItems:{
        position: 'absolute',
        top: 0,
        right: getWidth(-10),
        height: getWidth(30),
        width :getWidth(30)
    },
    image: {
      width: '100%',
      height: '100%'
    },
    modal:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top:0,
        left: 0,
        backgroundColor: 'transparent'
    },
    orderListOne:{
        flexDirection: 'row',
        alignItems: 'center',
        height: getHeight(88),
    },
    orderListSplitTop:{
        borderTopWidth: 1,
        borderTopColor: '#303031'
    },
    orderListText: {
        paddingLeft: getWidth(24),
        paddingRight: getWidth(24),
        color: '#fff',
        fontSize: 13
    }
})
