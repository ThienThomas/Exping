import { View, Text, FlatList, Image, Dimensions, TouchableOpacity, Linking, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Vi from 'dayjs/locale/vi'
import GridImageView from 'react-native-grid-image-viewer';
import { Video } from 'expo-av'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseurl from '../../env';
import { getDocList, getDocListGroup, getImageList, getImageListGroup, getVidList, getVidListGroup } from '../../mymodules/CompressImg';
const Tab = createMaterialTopTabNavigator()
export default function SharingGroup({route}) {
const groupid = route.params.groupid
  const [imageList, setImageList] = useState(null)
  const [videoList, setVideoList] = useState(null)
  const [DocsList, setDocsList] = useState(null)
  useEffect(() => {
    const interval = setInterval(async () => {
        const res = await getImageListGroup(groupid)
        setImageList(res)
      }, 1000)
      return () => clearInterval(interval)
  },[])
  useEffect(() => {
    const interval = setInterval(async () => {
        const res = await getVidListGroup(groupid)
        setVideoList(res)
      }, 1000)
      return () => clearInterval(interval)
  },[])
  useEffect(() => {
    const interval = setInterval(async () => {
        const res = await getDocListGroup(groupid)
        setDocsList(res)
      }, 1000)
      return () => clearInterval(interval)
  },[])
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {backgroundColor: "#42C2FF"}
            }}
        >
            <Tab.Screen children={() => <SharedImage imageList={imageList}></SharedImage>} name="Hình ảnh"></Tab.Screen>
            <Tab.Screen children={() => <SharedVideo videoList={videoList}></SharedVideo>} name="Video"></Tab.Screen>
            <Tab.Screen children={() => <SharedDocs DocsList={DocsList}></SharedDocs>} name="File đính kèm"></Tab.Screen>
        </Tab.Navigator>
    </View>
  )
}
function SharedImage({imageList}){
    const renderItem = ({item}) => {
        return (
            <View style={{
                //height: Dimensions.get('window').height * 0.4,
                width: Dimensions.get('screen').width * 0.33333334, height: Dimensions.get('screen').width * 0.33333334,
                borderRadius: 20,
                justifyContent: "center"
              }}>
                <Image source={{uri: item.image}} style={{width: "100%", height: "100%"}} resizeMode='cover' />
            </View>
        )
    }
    return (
        <View style={{flex: 1, backgroundColor: 'white', justifyContent: "space-between"}}>
            <FlatList data={imageList} renderItem={renderItem} numColumns={3}>

            </FlatList>
        </View>
    )
}
function SharedVideo({videoList}){
    const renderItem = ({item}) => {
        return (
            <View style={{
                //height: Dimensions.get('window').height * 0.4,
                width: Dimensions.get('screen').width * 0.33333334, height: Dimensions.get('screen').width * 0.33333334,
                borderRadius: 20,
                justifyContent: "center"
              }}>
                <Video source={{uri: item}} style={{width: "100%", height: "100%"}} usePoster={true} useNativeControls resizeMode='cover'></Video>
            </View>
        )
    }
    return (
        <View style={{flex: 1, backgroundColor: 'white', justifyContent: "space-between"}}>
            <FlatList data={videoList} renderItem={renderItem} numColumns={3}>
            </FlatList>
        </View>
    )
}
function SharedDocs({DocsList}){
    const renderItem = ({item}) => {
        return (
            <View style={{margin: 5}}>
                <TouchableOpacity onPress={() => {
                     Alert.alert("Tải xuống", item.attachmentname, [
                        { text: 'HỦY', onPress: () => {} },
                        { text: 'OK', onPress: () => Linking.openURL(item.attachmentid) },
                    ]);
                }} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons name="download-circle" size={20} color="#42C2FF" /><Text>&nbsp;</Text><Text>{item.attachmentname}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={{flex: 1, backgroundColor: 'white', padding: 10}}>
           <FlatList data={DocsList} renderItem={renderItem}></FlatList>
        </View>
    )
}