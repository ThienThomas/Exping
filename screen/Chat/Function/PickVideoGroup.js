import React from "react";
import { Video, AVPlaybackStatus  } from "expo-av";
import { View, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import {Fontisto,AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import vi from "dayjs/locale/vi";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { SendVidMess, SendVidMessGroup } from "../../../mymodules/CompressImg";
export default function PickVideoGroup({route}) {
    const video = route.params.video
    const groupinfo = route.params.groupinfo
    const groupid = route.params.groupid
    const VideoRef = React.useRef(null)
    const navigation = useNavigation()
    async function UploadMyVideo(){
        console.log("=>", video)
        const sent = await SendVidMessGroup(groupid, video)
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
                    borderRadius: 20
                }}
                    resizeMode="cover"
                    isLooping={true}
                    volume={0.5}
                    shouldPlay={true}
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
                        <Text style={{color: 'black'}}>Gửi video đến nhóm:</Text>
                        <Text style={{color: 'black', fontSize: 18, opacity: 1, fontWeight: 'bold'}}>{groupinfo.groupname}</Text>
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