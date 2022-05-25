import { View, Text } from 'react-native'
import React, { useEffect, useState, useTransition } from 'react'
import AnimatedLottieView from 'lottie-react-native'
import AsyncStorageLib from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useLogin } from '../../LoginProvider'

export default function ConfirmEmail() {
//   const [user, setUser] = useState(null)
//   const {setProfile} = useLogin()
//   const fecthUser = async() => {
//       const email = await AsyncStorageLib.getItem('email')
//       const token = await AsyncStorageLib.getItem('token')
//       if (token) {
//         const user = await axios({
//             method: 'get',
//             url: `http://expinggg.eastus.cloudapp.azure.com/auth/accountstatus/${email}`
//         }).then((response)=> {
//             return response.data
//         }).catch((error) => {
//             console.log(error.response.data.message)
//             return "none"
//         })
//         if (user){
//             setProfile(user)
//             setUser(user)
//         }
//       }
//   }
//   useEffect(() => {
//     return fecthUser()
//   }, [user])
  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
    <View  style={{flex: 0.5}}>
         <AnimatedLottieView source={require('../../assets/json/email.json')} autoPlay loop />
    </View>
    <View style={{margin: 20}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>Bạn cần xác nhận email</Text>
            <Text style={{textAlign: 'center'}}>Chúng tôi đã gửi một liên kết tới email mà bạn đã đăng ký, hãy đi theo liên kết đó để tiếp tục</Text>
         </View>  
    </View>
  )
}