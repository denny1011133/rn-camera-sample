import { Camera, CameraType } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Video } from 'expo-av';

export default function CustomCamera() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [video, setVideo] = useState(null);
  const [recording, setRecording] = useState(false);
  const cameraRef = useRef();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const startRecord = async function () {
    setRecording(true);

    const recordedVideo = await cameraRef.current.recordAsync();

    setVideo(recordedVideo);

    console.log('recording started');
  };

  const stopRecord = function () {
    setRecording(false);
    cameraRef.current.stopRecording();

    console.log('recording stopped');
  };

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={CameraType.back}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPressIn={startRecord}
            onPressOut={stopRecord}
          >
            <Text style={styles.text}>
              {recording ? 'Recording' : 'Record'}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <View style={styles.preview}>
        {video && (
          <Video
            style={styles.video}
            source={{
              uri: video.uri,
            }}
            useNativeControls
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
});

// Note:
// Only one Camera preview can be active at any given time.
// If you have multiple screens in your app,
// you should unmount Camera components whenever a screen is unfocused.

// CustomCamera 是靠 true false 去判斷是否要 render Camera component
// CustomCamera 可以 granted 可以不用 granted
// 系統的 Camera 是靠 true false 去判斷是否要呼叫 launchCameraAsync  launchImageLibraryAsync
