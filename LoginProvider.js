import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {createContext, useContext, useEffect, useState} from "react";
import baseurl from "./env";
const LoginContext = createContext();
const LoginProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState(null)
    const [myemail, setMyEmail] = useState('')
    const [listFriends, setListFriends] = useState({})
    const [listSending, setListSending] = useState({})
    const [listReceiving, setListReceiving] = useState({})
    const [masterData, setMasterData] = useState([])
    
    const fetchUser = async () => {
        const token = await AsyncStorageLib.getItem('token');
        const email = await AsyncStorageLib.getItem('email');
        if (token !== null){
            setMyEmail(email)
            //console.log(token)
            const user = await axios({
                method: 'get',
                headers: {
                    Authorization: token,
                    email: email
                },
                url: `${baseurl}/auth/getwhenrestartapp/`
            }).then((response)=> {
                //console.log(response.data)
                return response.data
            }).catch((error) => {
                //console.log(error.response.data.message)
                return null
            })
            setProfile(user)
            setIsLoggedIn(true)
        }
        else {
            AsyncStorageLib.removeItem('token')
            AsyncStorageLib.removeItem('email')
            setProfile(null)
            setIsLoggedIn(false)
        }
    }
    useEffect(() => {
        return fetchUser()
    }, [profile])
   
    return (
        <LoginContext.Provider
            value={{isLoggedIn, setIsLoggedIn, profile, setProfile, myemail, setMyEmail, listFriends, listSending, listReceiving, masterData}}
        >
            {children}
        </LoginContext.Provider>
    )
}
export const useLogin = () => useContext(LoginContext);
export default LoginProvider