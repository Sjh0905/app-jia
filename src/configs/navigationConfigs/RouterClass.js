/**
 * Created by hjx on 2017/8/22.
 */

export default class RouterClass {

    constructor() {
        this._navigation = null
        this._navigationState = null
        this._drawerNavigation = null
        this._drawerNavigationState = null
    }


    setStackRouter(navigation, navigationState) {
        this._navigation = navigation
        this._navigationState = navigationState
    }

    setDrawerNavigation(navigation, navigationState) {
        this._drawerNavigation = navigation
        this._drawerNavigationState = navigationState
    }


    // stackRouter命令
    push(routeName, params, action) {
        if (!this._navigation) return
        this._navigation.push(routeName, params, action)
    }

    nav(navigateTo, params, action) {
        if (!this._navigation) return
        this._navigation.navigate(navigateTo, params, action)
    }

    replace(routerName, params, action) {
        if (!this._navigation) return
        this._navigation.replace(routerName, params, action)
    }

    goto(routerName,params,action){
        if (!this._navigation) return
        if (!this.state || !this.state.routes) {
            return
        }

        let key = ''
        for (let i = 0; i < this.state.routes.length; i++) {
            if (this.state.routes[i].routeName == routerName) {
                let k = Math.min(i + 1, this.state.routes.length - 1)
                key = this.state.routes[k].key
                break
            }
        }
        console.log(this._navigation,key)
        if(key){
            this._navigation.goBack(key);
        }else{
            this.push(routerName);
            //this._navigation.push(routerName, params, action);
        }
    }

    goBack(key) {
        if (!this._navigation) return
        // console.warn("this. iis state",this.state)
        this._navigation.pop(key)
    }

    goBackToRoute(name) {
        if (!this._navigation) return
        if (!this.state || !this.state.routes) {
            return
        }

        let key = ''
        for (let i = 0; i < this.state.routes.length; i++) {
            if (this.state.routes[i].routeName == name) {
                let k = Math.min(i + 1, this.state.routes.length - 1)
                key = this.state.routes[k].key
                break
            }
        }

        this._navigation.goBack(key)

    }

    popToTop() {
        if (!this._navigation) return
        this._navigation.popToTop()
    }

    dispatch(action) {
        if (!this._navigation) return
        this._navigation.dispatch(action)
    }

    setParams(...params) {
        if (!this._navigation) return
        this._navigation.setParams(...params)
    }

    getParams() {
        if (!this._navigation) return
        return this._navigation.getParam()
    }


    get state() {
        return this._navigationState.state.nav
    }

    get getNav() {
        return this._navigationState
    }


    get params() {
        return {}
    }

    // drawerRouter命令，常用的为DrawerOpen和DrawerClose
    drawerPush(routeName, params, action) {
        if (!this._drawerNavigation) return
        this._drawerNavigation.navigate(routeName, params, action)
    }

    drawerNav(navigateTo, params, action) {
        if (!this._drawerNavigation) return
        this._drawerNavigation.navigate(navigateTo, params, action)
    }

    drawerGoBack(key) {
        if (!this._drawerNavigation) return
        this._drawerNavigation.pop(key)
    }

    drawerDispatch(action) {
        if (!this._drawerNavigation) return
        this._drawerNavigation.dispatch(action)
    }

    drawerSetParams(...params) {
        if (!this._drawerNavigation) return
        this._drawerNavigation.setParams(...params)
    }


    get drawerState() {
        return this._drawerNavigationState
    }

    get drawerParams() {
        return {}
    }

}