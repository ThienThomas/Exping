import { View, Text, TouchableOpacity, Image, Dimensions, Alert, Linking, Keyboard } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import AsyncStorageLib from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Audio } from "expo-av";
import { Actions, Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import vi from 'dayjs/locale/vi'
import Vi from 'dayjs/locale/vi';
import { Ionicons, MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import FriendsAvatar from '../../elements/FriendsAvatar'
import baseurl from '../../env'
import { Camera } from 'expo-camera'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { Video } from 'expo-av'
import { Modalize } from 'react-native-modalize'
import ConvertExtension from './Function/ConvertExtension'
import * as DocumentPicker from 'expo-document-picker';
import PickDoc from './Function/PickDoc'
import RecordAudio from './Function/RecordAudio'
import EmojiPicker, { EmojiKeyboard } from 'rn-emoji-keyboard';
import FetchingGif from './Function/FetchingGif';
import {AppLoadingAnimation} from "../../elements/AppLoadingAnimation" 
export default function Chat({route}) {
  let {user, fremail} = route.params
  
  const [myemail, setMyemail] = useState(null)
  //const [fremail, setFremail] = useState(null)
  const [mess, setMess] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation()
  const modalizedocpickerRef = useRef()
  const modalizeRecordingAudio = useRef()
  const modalizegifRef = useRef()
  const [pickedDoc, setPickedDoc] = useState(null)
  const [convertedExt, setConvertedExt] = useState(null)
  const [isloading, setIsLoading] = useState(true)
  let AudioRecorder = useRef(new Audio.Recording())
  let AudioPlayer = useRef(new Audio.Sound())
  //console.log(user)
  const fetchEmail = async () => {
    const email = await AsyncStorageLib.getItem('email')
    const token = await AsyncStorageLib.getItem('token')
    //const fremail = user.participants.find((e) => e !== email)

    //setFremail(fremail)
    setMyemail(email)
    if (token) {
        const userinfo = await axios({
            method: 'get',
            url: `${baseurl}/user/${fremail}`,
            headers: {
                Authorization: token
            }
            }).then((response) => {
            //console.log(response.data)
            return response.data
          }).catch((err) =>{
            //console.log(err.response.data.message)
        }) 
        if (userinfo){
            route.params.userinfo = userinfo
        }
    }
  }
  useState(() => {
    return () => fecthMess()
  })
  const FetchAudio = async () =>{
    AudioRecorder = useRef(new Audio.Recording())
  }
  function onOpenDocPicker(){
    modalizedocpickerRef.current?.open();
  };
  function onOpenRecordingAudio(){
    modalizeRecordingAudio.current?.open();
  };
  function onOpenGif() {
    modalizegifRef.current?.open()
  }
  async function handleDocumentPicker(){
    //let result = []
    const result = await DocumentPicker.getDocumentAsync({type: ['application/*',  ], multiple: true, copyToCacheDirectory: true})
    //const result = await DocumentPicker.pickMultiple({type: [DocumentPicker.types.pdf], allowMultiSelection: true})
    if (result.type === 'success'){
      let extension = result.uri.substring(result.uri.lastIndexOf('.') + 1);
      let converted_extension = ConvertExtension(extension)
      if (converted_extension !== 'not_support') {
          setPickedDoc(result)
          setConvertedExt(converted_extension)
          onOpenDocPicker()
        //navigation.navigate('pickdoc', {document: result,  user: route.params.userinfo, fremail : fremail, ext: converted_extension})
      }
      else {
        Alert.alert('Có lỗi xảy ra', 'Định dạng file không được hỗ trợ !', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      }
    }
  }
  async function handleProfilePicture(val){
    if (val === 1){
        const result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled){
              await UploadMyImage(result.uri)
          }
      }
      else if (val === 2){
          const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.All, videoMaxDuration: 60, videoQuality: ImagePicker.UIImagePickerControllerQualityType.Low});
          if (!result.cancelled){
            if (result.type == 'image') {
              navigation.navigate('pickphoto', {image: result, user: route.params.userinfo, fremail: fremail})
            }
            else {
              navigation.navigate('pickvideo', {video: result, user: route.params.userinfo, fremail: fremail})
            }
        } 
      }
    }
    const HandleEmojiSelect = (emoji) => {
      setMess(emoji.emoji)
  }
  const fecthMess = async() => {
      const email = await AsyncStorageLib.getItem('email')
      const token = await AsyncStorageLib.getItem('token')

      if (token) {
          const mess = await axios({
              method: 'get',
              url: `${baseurl}/message/getmess/${email}/${fremail}`,
              headers: {
                  Authorization: token,
              }
            }).then((response) => {
                //console.log(response.data)
                return response.data
            }).catch((error)=> {
                //console.log(error)
            })
        setMessages(mess)
        setIsLoading(false)
      }
  }
  useEffect(() => {
    return fetchEmail()
  },[])
  useEffect(() => {
    const KeyboardDidShowListenner = Keyboard.addListener('keyboardDidShow', () => {setIsOpen(false)})
    return () =>  {KeyboardDidShowListenner.remove()}
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      fecthMess()
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [messages])

  const onSend = async () =>{
      if (mess){
        const token = await AsyncStorageLib.getItem('token')
        const arr = myemail > fremail ? [myemail, fremail] : [fremail, myemail] 
        const time = new Date()
        const result = await axios({
            method: 'post',
            headers: {
                Authorization: token
            },
            data:{
                participants: arr,
                createdAt: time,
                text: mess,
                sentBy: myemail,
                sendTo: fremail,
                type: "text",
            },
            url: `${baseurl}/message/sendmessage`
        }).then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log(error.response.data.message)
        })
    }
  }
  const avatar = () => {
    return (
    <FriendsAvatar
     Img={user.partnerPhotoURL}
      Width={36}
      Height={36} 
    />
    )
  }
  return (
    <>
    {isloading ? (<>
    <AppLoadingAnimation></AppLoadingAnimation>
    </>) : (<>
      <View style={{flex: 1, backgroundColor: 'white', paddingBottom: 10}}>
        <GiftedChat
            text={mess}
            onInputTextChanged={(text)=> {setMess(text)
              //console.log(mess)
            }}
            maxComposerHeight={10}
            scrollToBottom={true}
            scrollToBottomStyle={{
              backgroundColor: 'white'
            }}
            alwaysShowSend={false}
            scrollToBottomOffset={10}
            scrollToBottomComponent ={() => {
              return (
                <View style={{justifyContent: 'center',}}>
                  <Entypo name="chevron-down" size={24} color="black" />
                </View>
              )
            }
            }
            renderCustomView={(props) => {
              if (props.currentMessage.attachmentid) {
                return (
                  <View style={{padding: 10}}>
                    <TouchableOpacity onPress={() => {
                      Alert.alert(props.currentMessage.attachmentname, `Kích thước: 1  MB`, [
                        { text: 'HỦY', onPress: () => console.log('OK Pressed') },
                        { text: 'TẢI XUỐNG', onPress: () => {Linking.openURL(props.currentMessage.attachmentid)} },
                      ])
                      }} style={{flexDirection: 'row', alignItems: 'center'}} >
                    <MaterialCommunityIcons name="download-circle" size={20} color="#42C2FF" /><Text>&nbsp;</Text>
                    <Text style={{fontSize: 14, textDecorationLine: 'underline'}}>{props.currentMessage.attachmentname}</Text>
                    </TouchableOpacity>
                  </View>
                )
              }
              else if (props.currentMessage.gif) {
                return (
                  <View style={{padding: 10}}>
                      <Image
                        resizeMode='contain'
                        style={{
                            width: 150,
                            height: 150,
                            borderWidth: 3,
                            borderRadius: 10,
                        }}
                        source={{uri: props.currentMessage.gif}}
                       ></Image>
                    </View>
                )
              }
              return null
            }}
            renderMessageAudio = {(props) => {
                return (
                  <View style={{
                    //height: Dimensions.get('window').height * 0.4,
                    width: Dimensions.get('window').width * 0.7,
                    height: Dimensions.get('window').width * 0.45,
                    borderRadius: 20,
                    margin: 1
                    
                  }}>
                    <Video 
                      resizeMode='contain'
                      usePoster={true}
                      useNativeControls
                      source={{uri: props.currentMessage.audio}}
                      //shouldPlay={true}
                      style={{
                        //height: Dimensions.get('window').height * 0.4,
                        width: Dimensions.get('window').width * 0.7,
                        height: Dimensions.get('window').width * 0.45,
                        borderRadius: 20,
                        margin: 1
                      }}
                      >
                    </Video>
                  </View>
                );
            }}
            renderMessageVideo ={(props) => {
              if (props.currentMessage.type === 'video') {
                return (
                  <View style={{
                    //height: Dimensions.get('window').height * 0.4,
                    width: Dimensions.get('window').width * 0.7,
                    height:   Dimensions.get('window').width * 0.45,
                    borderRadius: 20,
                    margin: 1
                    
                  }}>
                    <Video 
                      resizeMode='cover'
                      usePoster={true}
                      useNativeControls
                      source={{uri: props.currentMessage.video}}
                      //shouldPlay={true}
                      style={{
                        //height: Dimensions.get('window').height * 0.4,
                        width: Dimensions.get('window').width * 0.7,
                        height:   Dimensions.get('window').width * 0.45,
                        borderRadius: 20,
                        margin: 1
                      }}
                      
                      >

                    </Video>
                    
                  </View>
                )
              }
            }}
            renderMessageImage={(props) => {
              return (
                <View style={{ borderRadius: 15, padding: 2 }}>
                  <TouchableOpacity>
                    <Image
                      style={{
                        width: Dimensions.get('window').width * 0.55,
                        height: Dimensions.get('window').height * 0.55,
                        padding: 6,
                        borderRadius: 20,
                       
                      }}
                     resizeMode='cover'
                      source={{ uri: props.currentMessage.image }}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
            renderBubble={(props) => <Bubble
               {...props}
              onLongPress={() => {alert("Hmm")}}
              textStyle={{
                  left:{
                    color: 'black'
                  },
                  right:{
                    color: 'black'
                  }
                }
              }
              wrapperStyle={{
                right: {
                  backgroundColor: "transparent",
                  borderRadius: 20,
                  borderWidth: 0.5,
                  borderColor: "#d1d1d1",
                  padding: 1,
                },
                left: {
                  borderRadius: 20,
                  padding: 1,
                  backgroundColor: "#eeeeee",
                  //borderRadius: 10,
                  borderWidth: 0.65,
                  borderColor: "#eeeeee"
                }
              }}
              
            />}
            minInputToolbarHeight={55}
            locale={vi}
            showAvatarForEveryMessage={false}
            placeholder="Aa"
            renderAvatar={avatar}
            messages={messages}
            onSend={onSend}
            user={{
                _id: myemail,
            }}
            renderSend={(props) => { 
              return (
                <Send
                {...props}
                  containerStyle={{ justifyContent: 'center', alignItems:'center', paddingRight: 10, paddingLeft: 10}}
                >
                  <Ionicons name="send" size={30} color="#42C2FF" />
                </Send>
              );
            }}
            timeTextStyle={{left:{color: 'grey'}, right: {color: 'grey'}}}
            renderInputToolbar={(props) => (
              <InputToolbar
                {...props}
                primaryStyle={{
                    margin: 5,
                    borderRadius: 20,
                    paddingTop:2.5,
                    paddingBottom: 2.5,
                  }}
                containerStyle={{
                  borderTopWidth: 0.25,
                  borderTopColor: "#d1d1d1",
                  justifyContent:'center',
                }}
              />
            )}
            
            renderActions={(props) => (
              <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
              }}>
              <Actions
                {...props}
                containerStyle={{ width: 27, alignItems: 'center', alignContent: 'center', height: 27}}
                icon={() => (
                  <Ionicons name="camera" size={27} color="#42C2FF" />
                )}
                
                optionTintColor="black"
                options={{
                  ['Máy ảnh']:  async () => { 
                      if(Camera.requestCameraPermissionsAsync()){
                        navigation.navigate('takephoto', {fremail: fremail})
                      }
                    },
                  ['Video'] : () => {
                      
                        //navigation.navigate('recordvideo', {fremail: fremail})
                      
                    },
                  ['Thư viện']: () => {
                      handleProfilePicture(2)
                    }
                }}  
              />
              <Actions
                {...props}
                containerStyle={{width: 27, alignItems: 'center', alignContent: 'center', height: 27, backgroundColor: 'transparent'}}
                icon={() => (
                  <MaterialIcons name="emoji-emotions" size={27} color="#42C2FF" /> 
                  )}
                //onPressActionButton={() => {setIsOpen(!isOpen);  Keyboard.dismiss()}}
                optionTintColor="black"
                options={{
                  ['Biểu tượng cảm xúc'] : () => {
                      setIsOpen(!isOpen); 
                      Keyboard.dismiss()
                    },
                  ['GIF'] : () => {
                      setIsOpen(false);
                      Keyboard.dismiss()
                      onOpenGif()
                    }
                }}
              />
              <Actions
                {...props}
                containerStyle={{width: 27, alignItems: 'center', alignContent: 'center', height: 27, backgroundColor: 'transparent'}}
                icon={() => (
                  <MaterialIcons name="more-horiz" size={27} color="#42C2FF" />
                )}
                optionTintColor="black"
                options={{
                  ['Tệp đính kèm']: () => {
                      handleDocumentPicker()
                    },
                  ['Ghi âm']: () => {
                    onOpenRecordingAudio()
                    }
                }}  
              />
              </View>
            )}
          />
        <Modalize ref={modalizedocpickerRef} adjustToContentHeight={true}>
            <PickDoc document={pickedDoc} user={route.params.userinfo} fremail={fremail} ext={convertedExt}></PickDoc>
        </Modalize>
        <Modalize ref={modalizeRecordingAudio} adjustToContentHeight={true} onClosed={async () =>{
          const re  = await AudioRecorder.current.getStatusAsync()
          const player = await AudioPlayer.current.getStatusAsync()
          if (re.isRecording){
            await AudioRecorder.current.stopAndUnloadAsync()
          }
          if (player.isPlaying){
            await AudioPlayer.current.stopAsync()
          }
          AudioRecorder.current = new Audio.Recording()
          AudioPlayer.current = new Audio.Sound()

        }}>
            <RecordAudio user={route.params.userinfo} fremail={fremail} audioRef={AudioRecorder} audioplayerRef={AudioPlayer}></RecordAudio>
        </Modalize> 
        <Modalize ref={modalizegifRef} adjustToContentHeight={true}>
          <FetchingGif fremail={fremail} ></FetchingGif>
        </Modalize>
        {isOpen === true ? (
        <EmojiKeyboard 
          translation={{
            smileys_emotion: 'BIỂU TƯỢNG CẢM XÚC',
            people_body: 'MỌI NGƯỜI',
            animals_nature: 'ĐỘNG VẬT VÀ THIÊN NHIÊN',
            food_drink: 'THỰC PHẨM VÀ ĐỒ UỐNG',
            travel_places: 'DU LỊCH VÀ ĐỊA ĐIỂM',
            activities: 'HOẠT ĐỘNG VÀ SỰ KIỆN',
            objects: 'ĐỐI TƯỢNG',
            symbols: 'BIỂU TƯỢNG',
            flags: 'CỜ',
          }}
          //categoryColor='white'
          //categoryContainerColor='#42C2FF'
            activeCategoryColor='#42C2FF'
            categoryContainerStyles={{marginBottom: 10}}
            onEmojiSelected={HandleEmojiSelect}
            categoryPosition="bottom"
         />) : <></>}
      </View>
      </>)}
    </>
  )
}