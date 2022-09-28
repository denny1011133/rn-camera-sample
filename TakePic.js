import { Alert, Button, View, StyleSheet, Image } from 'react-native';
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-image-picker';
import { useState } from 'react';

function TakePic() {
  const [pickedImage, setPickedImage] = useState(null);

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions(); //check or request permissions to access the camera
  // console.log(cameraPermissionInformation); //{"canAskAgain": true, "expires": "never", "granted": true, "status": "granted"}
  const verifyPermissions = async function () {
    // undetermined => call requestPermission
    // denied => return false
    // granted => return true
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission(); //實際請求系統權限的地方
      // console.log(permissionResponse); //{"canAskAgain": true, "expires": "never", "granted": true, "status": "granted"}
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant camera permissions to use this app.'
      );
      return false;
    }

    return true;
  };

  const takeImageHandler = async function () {
    const hasPermission = await verifyPermissions(); // 2. 判斷系統本身是否 granted

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      // 開啟系統本身的 UI, launchCameraAsync needs system permission (如果系統本身沒有 granted 的話直接呼叫此 function 還是會出錯)
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });
    // console.log('image', image); // 取消的話 image => {"cancelled": true}
    setPickedImage(image.uri);
  };

  return (
    <View>
      <View>
        {pickedImage ? (
          <Image style={styles.imagePreview} source={{ uri: pickedImage }} />
        ) : null}
      </View>
      {/*1. fire a function */}
      <Button title="Take Picture" onPress={takeImageHandler} />
    </View>
  );
}

export default TakePic;
const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: '90%',
  },
});
