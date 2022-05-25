import React from "react";
import { Video, AVPlaybackStatus  } from "expo-av";
import { View, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import {Fontisto,AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import vi from "dayjs/locale/vi";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { SendVidMess } from "../../../mymodules/CompressImg";
export default function PickVideo({route}) {
    const video = route.params.video
    const user = route.params.user
    const fremail = route.params.fremail
    console.log(video)
    const VideoRef = React.useRef(null)
    const navigation = useNavigation()
    async function UploadMyVideo(){
        const token = await AsyncStorageLib.getItem('token')
        const email = await AsyncStorageLib.getItem('email')
        const sent = await SendVidMess(token, email, fremail, video)
        navigation.goBack()
    }
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems:'center', backgroundColor: 'black'}}>
            <Video
                ref={VideoRef}
                source={video}
                style={{
                    alignSelf: 'center',
                    width:  Dimensions.get('window').width * 0.925,
                    height: Dimensions.get('window').height * 0.9,
                    borderRadius: 20,
                }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping={true}
                    volume={10}
                >
            </Video>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginBottom: 20,
                    justifyContent: 'flex-end',
                }}
                >
                <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                >
                    <View
                    
                    style={{
                        borderRadius: 10,
                        backgroundColor: '#eeeeee',
                        padding: 10,
                        width: '60%'
                    }}
                    >   
                        <Text style={{color: 'black'}}>Gửi video đến</Text>
                        <Text style={{color: 'black', fontSize: 18, opacity: 1, fontWeight: 'bold'}}>{user.displayName}</Text>
                    </View>
                    <TouchableOpacity
                   onPress={() => {UploadMyVideo()}}
                    style={{
                        alignItems: 'center',
                        borderRadius: 50,
                        backgroundColor: 'white',
                        width: 60,
                        height: 60,
                        justifyContent: 'center',
                    }}
                    >
                    <FontAwesome name="send" size={25} color="#42C2FF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}