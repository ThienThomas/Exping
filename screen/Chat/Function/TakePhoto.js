import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image, Dimensions} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {Camera} from 'expo-camera'
import { Video } from 'expo-av';
import { compressImage, SendImgMess } from '../../../mymodules/CompressImg';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
let camera = Camera
export default function TakePhoto({route}) {
  const fremail = route.params.fremail
  //const docid = route.params.docid
  const [startCamera, setStartCamera] = React.useState(true)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState(null)
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = React.useState('off')
  const navigation = useNavigation()
  const __startCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
  }
  const __takePicture = async () => {
    const photo = await camera.takePictureAsync()
    console.log(photo)
    setPreviewVisible(true)
    //setStartCamera(false)
    setCapturedImage(photo)
  }
  const __savePhoto = () => {
    //await camer
  }
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }
  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }
  return (
    <>
    <View style={styles.container}>

      {startCamera ? (
        < >
          {previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} fremail={fremail}/>
          ) : (
            <Camera
              type={cameraType}
              flashMode={flashMode}
              style={{flex: 1, width: '160%'}}
              ref={(r) => {
                camera = r
              }}
            >
              
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
                    onPress={__handleFlashMode}
                    style={{
                      borderRadius: 100,
                      height: 34,
                      width: 34
                    }}
                    >

                    <Ionicons name={flashMode !== 'off' ? "flash" : "flash-off"} size={34} color="white" />
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
                      onPress={__takePicture}
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
                    onPress={__switchCamera}
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
          )}
        </>
      ) : (
        <></>
      )}

      <StatusBar style='transparent'></StatusBar>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const CameraPreview = ({photo, retakePicture, savePhoto, fremail}) => {
  console.log('sdsfds', photo)
  const navigation = useNavigation()
  console.log(fremail)
    async function UploadMyImage(photo){
    const compressed = await compressImage(photo)
    console.log(compressed)
    const token = await  AsyncStorageLib.getItem('token')
    const email = await  AsyncStorageLib.getItem('email')
    await SendImgMess(token, email, fremail, compressed)
    navigation.goBack()
  }
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1
        }}
      >
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
              onPress={retakePicture}
              style={{
                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Fontisto name="redo" size={34} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {UploadMyImage(photo)}}
              style={{
                alignItems: 'center',
                borderRadius: 50,
                backgroundColor: 'white',
                width: 75,
                height: 75,
                justifyContent: 'center',
                
              }}
            >
              
              <FontAwesome name="send" size={35} color="#42C2FF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto()}
              style={{
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <AntDesign name="download" size={34} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}