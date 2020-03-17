import SecurityCenter from "../../components/SecurityCenter";


const option = {}

// 跳转动画效果，三个值： CardStackStyleInterpolator.forVertical从下向上进入，forHorizontal从右向左进入，forFadeFromBottomAndroid从底部淡出
// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import GestureProgressBar from "../../components/GestureProgressBar";


// 初始路由
option.initialRouteName = 'Home'
// option.initialRouteName = 'ReleaseMobile'


option.navigationOptions = {}
option.navigationOptions.headerMode = 'none'
option.navigationOptions.header = function () {
    return null
}


/**
 * 控制单个页面的动画效果，CardStackStyleInterpolator属性在react-navigation/src/views/CardStack/CardStackStyleInterpolator里
 * 有几种动画效果：forVertical从下向上进入，forHorizontal从右向左进入，forFadeFromBottomAndroid从底部淡出
 * 如果是null，表示无动画效果
 * @param transitionProps
 * @param prevTransitionProps
 * @param isModal
 * @returns {{screenInterpolator: *}}
 */
option.transitionConfig = function (transitionProps, prevTransitionProps, isModal) {
    let transition = transitionProps.scene.route.params && transitionProps.scene.route.params.transition

    if (prevTransitionProps && prevTransitionProps.navigation.state.index > transitionProps.scene.index) {
        let params = prevTransitionProps.navigation.state.routes[prevTransitionProps.navigation.state.index].params
        transition = params && params.transition
    }


    let animated = null
    switch (transition) {
        case 'null':
            animated = CardStackStyleInterpolator.forFade
            break;
        case 'forVertical':
            animated = CardStackStyleInterpolator.forVertical
            break;
        case 'forHorizontal':
            animated = CardStackStyleInterpolator.forHorizontal
            break;
        default:
            animated = CardStackStyleInterpolator.forHorizontal
    }

    return {
        screenInterpolator: animated
    }
}

export default option