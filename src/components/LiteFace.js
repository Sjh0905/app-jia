/**
 * hjx 2018.4.16
 */

import React from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
// todo 要修改这个地方哦
import styles from '../style/BaseTemplateStyle'
// import StyleConfigs from '../style/styleConfigs/StyleConfigs'


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false

    @observable
    token = '';

    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
        this.getFaceToken()
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }

    @action
    getFaceToken = ()=>{
        this.$http.send('GET_FACE_TOKEN', {
            bind: this,
            params:{
                return_url: "https://www.2020.exchange",
                biz_no: new Date().getTime().toString()
            },
            callBack: this.re_getFaceToken,
            errorHandler: this.err_getFaceToken,
            timeoutHandler: this.timeout_getFaceToken
        })
    }
    @action
    timeout_getFaceToken = ()=>{
        console.log('获取litefacetoken超时')
    }

    @action
    re_getFaceToken = (data)=>{
        console.log(data);
        this.token = data.dataMap.token;
        this.$router.push('WebPage',{
            url: 'https://api.megvii.com/faceid/lite/ocridcard/front?token=' + this.token
        })
    }

    @action
    err_getFaceToken = (ex)=>{
        console.log('获取facetoken失败',ex);
    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container, baseStyles.container]}>
                <NavHeader headerTitle={'title'} goBack={this.goBack}/>

                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
