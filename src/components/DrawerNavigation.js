/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Button, ScrollView, Text} from 'react-native';
import {observer} from 'mobx-react'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import {SafeAreaView} from 'react-navigation'
import styles from '../style/DrawerNavigationStyle'

// DrawerItems
// type Props = {};
// export default class App extends Component<Props> {
@observer
export default class App extends RNComponent {

    render() {
        return (
            <ScrollView>
                <SafeAreaView style={styles.container} forceInset={{top: 'always', horizontal: 'never'}}>
                    <Text allowFontScaling={false}>测试drawer!</Text>
                    <Button title="测试！" onPress={() => {
                        this.$router.push('Home', {transition: 'null'})
                        this.$router.drawerPush('DrawerClose')
                        // this.$router.push('Home')
                    }}/>

                    {/*<DrawerItems {...this.props}>*/}
                    {/*<Text allowFontScaling={false}>测试drawer</Text>*/}
                    {/*</DrawerItems>*/}
                </SafeAreaView>
            </ScrollView>
        );
    }
}
