import React, { useContext, useEffect, useState } from "react";
import { View,Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { urlAlphabet } from "nanoid";
import  ImageViewer from 'react-native-image-zoom-viewer';
import { useLogin } from "../LoginProvider";
import axios from "axios";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { AppLoadingAnimation } from "./AppLoadingAnimation";
import baseurl from "../env";

export default function Avatar({Width, Height}){
    const [user, setUser] = useState("none")
    const [loading, setLoading] = useState(true)
    
    const fetchUser = async () => {
      setLoading(true)
      const token = await AsyncStorageLib.getItem('token')
      const email = await AsyncStorageLib.getItem('email')
      if (token){
        const user = await axios({
          method: 'get',
          url:  `${baseurl}/auth/getwhenrestartapp/`,
          headers: {
            Authorization: token,
            email: email
          }
        }).then((response) =>{
          return response.data
        }).catch((err) => {
          console.log(err)
          return "none"
        })
        setUser(user)
      }
      setLoading(false)
    }
    useEffect(() => {
      return fetchUser()
    }, [user])  
    return (
      <>
        {loading && user === "none"  ? (<>
          <AppLoadingAnimation></AppLoadingAnimation>
        </>) : (
          <View>
          <Image
              source={user.photoURL === "none" ? 
                  require('../assets/user_no_avatar.jpg') : {uri: user.photoURL, cache: 'reload'}}
                  style={{width: !Width ? 45 : Width, 
                  height: !Height ? 45 : Height,
                  borderRadius: 200
                  }}
                  resizeMethod="auto">
          </Image>
        </View>)}
      </>
    )
}
export function Name({fontS}){
  return (
    <UseGlobalContext>
      <MyName fonts={fontS}/>
    </UseGlobalContext>
  )
}
function MyName({fonts}){
  return (
    auth.currentUser ? (
      <Text style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 24,marginTop: 15, marginBottom: 15, fontWeight: 'bold'}}>Thiện</Text>
    ) : (<></>)
  )
}