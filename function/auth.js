import axios from "axios";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useLogin } from "../LoginProvider";
import baseurl from "../env";
export async function getUserInfo(token){
    const user = await axios({
        method: 'get',
        headers: {
            Authorization: token
        },
        url: `${baseurl}/auth/getwhenrestartapp/`
    }).then((response)=> {
        //console.log(response.data)
        return response.data
    }).catch((error) => {
        console.log(error.response.data.message)
        return null
    })
    //console.log(user)
    return user
    // try{
    //            console.log(token)
    //     const user = await axios.post(`https://exping.herokuapp.com/auth/getwhenrestartapp`,{headers: {
    //         Authorization: token
    //     }})
 
    //     console.log(user.data)
    // }catch(e)
    // {
    //     console.log(e)
    // }

}
export async function signIn(email, password) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === true){
        const data = {
            email: email,
            password: password
        }
        const responseData = await axios({
            method: 'post',
            url: `${baseurl}/auth/login`,
            data: data
        }).then((response) => {
            AsyncStorageLib.setItem('token', `Bearer ${response.data}`)
            AsyncStorageLib.setItem('email', email) 
            return true;
        }).catch((error) => {
            if (error.response.data.message === 'invalid user'){
                Alert.alert('Có lỗi xảy ra', 'Bạn vui lòng kiểm tra lại thông tin đăng nhập và thử lại !', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
                
            }
            return false
        })
        return responseData
    }
    return false
}
export async function signUp(email, password, password1){
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === true){
        if (password === password1){
            const data = {
                email: email,
                password: password
            }
            const responseData = await axios({
                method: 'post',
                url: `${baseurl}/auth/register`,
                data: data
            }).then((response) => {
                console.log(response.data)
                AsyncStorageLib.setItem('token', `Bearer ${response.data}`)
                AsyncStorageLib.setItem('email', email) 
                return true;
            }).catch((error) => {
                if (error.response.data.message === 'user existed'){
                    Alert.alert('Có lỗi xảy ra', 'Email đã được sử dụng ', [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                }
                return false
            })
            return responseData
        }
        else {
            Alert.alert('Mật khẩu không khớp', 'Bạn vui lòng kiểm tra lại nhé !', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false
        }
    }
    else {
        Alert.alert('Email không hợp lệ', 'Bạn vui lòng kiểm tra lại nhé !', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return false
    }
}
