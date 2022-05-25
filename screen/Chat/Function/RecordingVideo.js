import { StyleSheet, Text, View, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { AntDesign, Ionicons, Fontisto, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RecordingVideo() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
 const navigation = useNavigation()
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <Text>Requestion permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>
  }

  let recordVideo = () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: false
    };

    cameraRef.current.recordAsync().then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });
  };

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  if (video) {
    let shareVideo = () => {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    let saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{uri: video.uri}}
          resizeMode='cover'
          isLooping
          shouldPlay
          volume={0.3}
        />

        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginBottom: 20,
            marginRight: 50,
            marginLeft: 50,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
             onPress={() => setVideo(undefined)} 
              style={{
                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Fontisto name="redo" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
               
              style={{
                alignItems: 'center',
                borderRadius: 50,
                backgroundColor: 'white',
                width: 75,
                height: 75,
                justifyContent: 'center',
                marginLeft: 50, 
                marginRight: 50
              }}
            >
              <FontAwesome name="send" size={35} color="#42C2FF" />
            </TouchableOpacity>
            <TouchableOpacity
             onPress={saveVideo}
              style={{
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <AntDesign name="download" size={34} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <Camera style={{flex: 1, width: '160%'}} ref={cameraRef} >
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: 'transparent',
                    flexDirection: 'row'
                }}
                >
                <View
                    style={{
                        position: 'absolute',
                        right: '22.5%',
                        top: '7.5%',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {navigation.goBack()}}
                        style={{
                        borderRadius: 100,
                        height: 35,
                        width: 35
                        }}
                    >
                        <AntDesign name="close" size={35} color="white" />
                    </TouchableOpacity>
                    </View>
                    <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        flexDirection: 'row',
                        flex: 1,
                        width: '100%',
                        padding: 20,
                        justifyContent: 'space-between'
                    }}
                    >
                    <View
                        style={{
                        //alignSelf: 'center',
                        flex: 1,
                        alignItems: 'center',
                        //justifyContent: 'space-between',
                        flexDirection: 'row',
                        justifyContent: 'center'
                        }}
                    >
                        <View
                            style={{
                                marginRight: 50,
                            }}
                        >
                        <TouchableOpacity
                            style={{
                            borderRadius: 100,
                            height: 34,
                            width: 34
                            }}
                        >
                        </TouchableOpacity>
                        </View>
                        <View
                        style={{
                            backgroundColor:'white',
                            padding: 5,
                            borderRadius: 50,
                        }}
                        >
                        <TouchableOpacity
                        onPress={isRecording ? stopRecording : recordVideo}
                        style={{
                            width: 70,
                            height: 70,
                            bottom: 0,
                            borderRadius: 50,
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: 'grey'
                        }}

                        />
                        </View>
                    <View 
                    style={{
                        marginLeft: 50,
                    }}>                
                    <TouchableOpacity
                        style={{
                        borderRadius: 100,
                        height: 34,
                        width: 34
                        }}
                    >
                    <Ionicons name="md-camera-reverse" size={34} color="white" />
                    </TouchableOpacity>
                    </View> 
                    </View>
                    </View>
                </View>
        </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end"
  },
  video: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});