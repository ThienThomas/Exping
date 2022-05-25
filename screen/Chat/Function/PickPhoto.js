import { BackgroundImage } from "@rneui/base";
import React from "react";
import { View, Text, ImageBackground, Image, Dimensions} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {Fontisto,AntDesign, FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { compressImage, SendImgMess } from "../../../mymodules/CompressImg";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
export default function PickPhoto({route}) {
    const image = route.params.image
    const user = route.params.user
    const fremail = route.params.fremail
    //const docid = route.params.docid
    const navigation = useNavigation()
    async function UploadMyImage(){
  
      const maniResult = await compressImage(image)
      console.log(maniResult)
      const token = await AsyncStorageLib.getItem('token')
      const email = await AsyncStorageLib.getItem('email')
      const sent = await SendImgMess(token, email, fremail, maniResult)
      console.log(sent)
      navigation.goBack()
    }
    return (
        <View style={{flex: 1, justifyContent: 'center',  backgroundColor: 'black'}}>
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
                <ImageBackground source={image} style={{width:  Dimensions.get('window').width,height: Dimensions.get('window').height,}} resizeMode='contain' >
                  <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginBottom: 20,
                    marginRight: 20,
                    marginLeft: 20,
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
                        <Text style={{color: 'black'}}>Gửi ảnh đến</Text>
                        <Text style={{color: 'black', fontSize: 18, opacity: 1, fontWeight: 'bold'}}>{user.displayName}</Text>
                    </View>
                    <TouchableOpacity
                   onPress={() => {UploadMyImage()}}
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
              </ImageBackground>
            </View>
        </View>
    )
}