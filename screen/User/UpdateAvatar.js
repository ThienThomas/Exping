import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import {FontAwesome, MaterialCommunityIcons, Fontisto, Ionicons, Entypo } from "@expo/vector-icons"
import { Modalize } from 'react-native-modalize'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorageLib from '@react-native-async-storage/async-storage'
import { FunctionUpdateAvatar } from '../../mymodules/CompressImg'
import { useNavigation } from '@react-navigation/native'
import ChangeBio from './ChangeBio'

const styles = StyleSheet.create({
    avatarselect: {
        marginTop: 30, 
        borderRadius: 150, 
        width: 175,
        height: 175,
        borderColor: "#42C2FF",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})
export default function UpdateAvatar() {
    const [selectedImage, setSelectedImage] = useState(null)
    const modalize = useRef()
    const onOpen = () => {
        modalize.current?.open();
      };
    const navigation = useNavigation()
    async function handleProfilePicture(val){
        //if (hasCameraPermission === 'granted' || hasGalleryPermission === 'granted'){
        if (val === 1){
            const result = await ImagePicker.launchCameraAsync();
            if (!result.cancelled){
                setSelectedImage(result)
            }
        }
        else if (val === 2){
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.cancelled){
                setSelectedImage(result)
            } 
        }
    }   
    async function uploadMyAvatar(){
        if (selectedImage){
            const token = await AsyncStorageLib.getItem('token')
            const email = await AsyncStorageLib.getItem('email')
            const result = await FunctionUpdateAvatar(token, email, selectedImage)
            if (result) {
                Alert.alert('Thành công', 'Cập nhật thành công', [
                    { text: 'OK', onPress: () => {} 
                    }
                ]);
            }
        }
    }   
  return (
    <View style={{flex: 1, paddingBottom: 20, paddingTop: 20}}>
        <View style={{marginLeft: 20, marginRight: 20}}>
            <Text style={{textAlign: 'center'}}>Chọn ảnh đại diện của bạn</Text>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={onOpen}
                    style={styles.avatarselect}>
                    {!selectedImage ? 
                        (<MaterialCommunityIcons name="camera-plus" size={50} color="#42C2FF"  />) : 
                        <Image 
                            source={{uri: selectedImage.uri}}
                            style={{width: "100%", height: "100%", borderRadius: 120}}
                        />}
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor: '#42C2FF', justifyContent: 'center', marginTop: 50, width: 100, alignSelf: 'center', padding: 10, borderRadius: 20}}>
                <TouchableOpacity style={{alignItems: 'center',}} onPress={() => {
                    uploadMyAvatar()
                }}>
                    <Text style={{fontSize: 17, fontWeight: 'bold', color: 'white'}}>
                        Xác nhận
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        <Modalize ref={modalize} adjustToContentHeight={true}>
            <View style={{margin: 20, flex: 1}}>
                <TouchableOpacity style={{margin: 10}} onPress={() => {handleProfilePicture(1)}}>
                    <Text style={{fontSize: 17}}>
                        <FontAwesome name="camera" size={20} color="#42C2FF"/>&nbsp;Máy ảnh
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{margin: 10}} onPress={() => {handleProfilePicture(2)}}>
                    <Text style={{fontSize: 17}}>
                        <FontAwesome name="image" size={20} color="#42C2FF" />&nbsp;Thư viện
                    </Text>
                </TouchableOpacity>
            </View>
        </Modalize>
    </View>
  )
}