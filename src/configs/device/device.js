import DeviceInfo from 'react-native-device-info';

const device = {};
device.DeviceID = DeviceInfo.getUniqueID();
device.getDeviceId = DeviceInfo.getDeviceId();
device.DeviceName = DeviceInfo.getDeviceName();
device.UserAgent = DeviceInfo.getUserAgent();
device.DeviceBrand = DeviceInfo.getBrand();
device.DeviceModel = DeviceInfo.getModel();
device.SystemVersion = DeviceInfo.getSystemVersion();
device.AppVersion = DeviceInfo.getVersion();
device.AppReadableVersion = DeviceInfo.getReadableVersion();
device.Manufacturer = DeviceInfo.getManufacturer();//生产商
console.log('deviceInfo',device);
export default device;