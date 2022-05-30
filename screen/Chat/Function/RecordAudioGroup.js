import React from "react";
import { Audio } from "expo-av";
import { View, Text, TouchableOpacity } from "react-native";
import { useState, useRef, useEffect } from "react";
import AnimatedLottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { SendAudioMess, SendAudioMessGroup } from "../../../mymodules/CompressImg";
const loadinganimation = require('../../../assets/json/recordingaudio.json')
export default function RecordAudioGroup({audioRef,audioplayerRef,  groupid}) {
    const AudioRecorder = audioRef
    const AudioPlayer = audioplayerRef;
    const [recordedURI, setRecordedURI] = useState(null)
    const [AudioPermission, SetAudioPermission] = useState(false);
    const [isPlaying, SetIsPlaying] = useState(false)
    const [IsRecording, SetIsRecording] = useState(false)
    const navigation = useNavigation();
    // const [audioStatus, setAudioStatus] = useState(null) 
    // useEffect(() => {
    //   return async () => {
    //       const AudioStatus = await AudioPlayer.current.getStatusAsync()
    //       //console.log(AudioStatus)
    //       if (AudioStatus.isPlaying){
    //         SetIsPlaying(true)
    //       }
    //       else {
    //         SetIsPlaying(false)
    //       }
    //       setAudioStatus(AudioStatus)
    //   }
    // }, [audioStatus])
    async function UploadMyAudio(){
        if (recordedURI) {
            const token = await AsyncStorageLib.getItem('token')
            const email = await AsyncStorageLib.getItem('email')
            const result = await SendAudioMessGroup(groupid, recordedURI)
        }
    }
 
    const GetPermission = async () => {
      const getAudioPerm = await Audio.requestPermissionsAsync();
      SetAudioPermission(getAudioPerm.granted)
    }
     const StartRecording = async () => {
      try {
        if (AudioPermission) {
          try {
            await AudioRecorder.current.prepareToRecordAsync(
              Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            )
            await AudioRecorder.current.startAsync();
            SetIsRecording(true);
          }
          catch(error) {
            console.log(error)
          }
        }
        else {
          GetPermission()
        }
      }
      catch(error) {
        console.log(error)
      }
    }
    const StopRecording = async () =>  {
        try {
            await AudioRecorder.current.stopAndUnloadAsync()
            const result = AudioRecorder.current.getURI();
            if (result) {
                //console.log(result.length)
                setRecordedURI(result)
            }
            AudioRecorder.current = new Audio.Recording();
            SetIsRecording(false);
        }
        catch(error) {
            console.log(error)
        }
    }
    async function PlayRecordedAudio() {
        try{
            await AudioPlayer.current.loadAsync({uri: recordedURI}, {}, true);
            const playerStatus = await AudioPlayer.current.getStatusAsync();
            if (playerStatus.isLoaded){
                if (!playerStatus.isPlaying){
                    AudioPlayer.current.playAsync();
                    SetIsPlaying(true)
                    //AudioPlayer.current.stopAsync();
                }
            }
        }
        catch(error) {
            console.log(error)
        }
    }
    async function StopPlaying()  {
        try {
            const playerStatus = await AudioPlayer.current.getStatusAsync();
            if (playerStatus.isLoaded) {
                await AudioPlayer.current.unloadAsync();
            }
            SetIsPlaying(false);
        }
        catch(error) {
            console.log(error);
        }
    }
    return (
        <>
        {!recordedURI ? (<>
            {!IsRecording ? (<>
                <View style={{flex: 1,  justifyContent: 'center', alignItems: 'center', margin: 30}}>
                    <TouchableOpacity onPress={() => {StartRecording()}} style={[{  
                                justifyContent: 'center',
                                backgroundColor:'#42C2FF',
                                alignItems: 'center',
                                margin: 10,
                                zIndex: 10,
                                width: 70,
                                height: 70,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 50,
                                
                               }]}>
                    
                    <FontAwesome name="microphone" size={50} color="white" />
                    
                    </TouchableOpacity>
                    <Text style={{color: "#42C2FF", fontWeight: 'bold'}}>Nhấn để bắt đầu ghi âm</Text>
                </View>
            </>) : (<>
                <View style={{flex: 1, justifyContent:'center', alignItems: 'center', alignContent:'center', margin: 30}}>
                <TouchableOpacity onPress={() => {StopRecording()}} style={[{ 
                            alignSelf:'center',
                            width: 100,
                            height: 100,
                            zIndex: 10}]}>
                        <AnimatedLottieView  source={loadinganimation} autoPlay loop speed={1}/>
                </TouchableOpacity>
                
                <Text style={{color: "#42C2FF", fontWeight: 'bold'}}>Nhấn để hoàn tất</Text>

                </View>        
            </>)}
        </>) : (<>
            <View 
            style={{
                flex: 1,
                justifyContent: 'space-between',
                paddingLeft: 50,
                paddingRight: 50,
                flexDirection: 'row',
                alignItems: 'center', margin: 30
            }}>
                <TouchableOpacity onPress={() => {
                    StopPlaying()
                    setRecordedURI(null)}}>
                    <FontAwesome5 name="trash" size={35} color="#FF5757" />
                </TouchableOpacity>
                <TouchableOpacity onPress={!isPlaying ? () => {PlayRecordedAudio()} : () => {StopPlaying()} }>
                    <AntDesign name={!isPlaying ? "playcircleo" : "pausecircle"} size={70} color="#42C2FF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {UploadMyAudio()}}>
                    <FontAwesome name="send" size={35} color="#42C2FF" />
                </TouchableOpacity>
                
            </View>
        </>)}
       
      </>
    )
  }