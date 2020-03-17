const option = {}


option.initialRouteName = 'Navigation'

import DrawerNavigationComponent from '../../components/DrawerNavigation'

option.contentComponent = DrawerNavigationComponent
option.contentOptions = {}
option.navigationOptions = {}
option.navigationOptions.drawerLockMode = 'locked-closed'


export default option