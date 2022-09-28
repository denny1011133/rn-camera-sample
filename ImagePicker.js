import React, { useState } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import {
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
  MediaTypeOptions,
  PermissionStatus,
} from 'expo-image-picker';
import { Video } from 'expo-av';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [mediaLibraryPermissionInformation, requestPermission] =
    useMediaLibraryPermissions();
  const verifyPermissions = async function () {
    if (
      mediaLibraryPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (mediaLibraryPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant camera permissions to use this app.'
      );
      return false;
    }

    return true;
  };

  const pickMedia = async () => {
    const hasPermission = await verifyPermissions(); // 2. 判斷系統本身是否 granted 的依據 ( mediaLibrary 不一定需要 permission check)
    if (!hasPermission) {
      return;
    }

    let result = await launchImageLibraryAsync({
      //launchImageLibraryAsync 可以直接呼叫
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    //有可能被取消
    if (!result.cancelled) {
      result.type === 'image' ? setImage(result.uri) : setVideo(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/*1. fire a function */}
      <Button
        title="Pick an image / video from camera roll"
        onPress={pickMedia}
      />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      {video && (
        <Video
          style={styles.video}
          source={{
            uri: video,
          }}
          useNativeControls
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
});
