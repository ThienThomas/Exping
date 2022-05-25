import { Header } from "@react-navigation/stack";
import React, {useEffect, useRef, useState} from "react";
import { View, Text, Image, StyleSheet, Alert, ImageBackground, RefreshControl, ScrollView } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Feather,Entypo, MaterialCommunityIcons, FontAwesome} from '@expo/vector-icons';
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { AppLoadingAnimation } from "../../elements/AppLoadingAnimation";
import ImageView from "react-native-image-viewing";
import { StatusBar } from "expo-status-bar";
import LoginProvider, { useLogin } from "../../LoginProvider";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { Logout } from "../../function/auth";
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons';
import baseurl from "../../env";
import { Modalize } from 'react-native-modalize';
import { RemoveAvatar } from "../../mymodules/CompressImg";
import ChangeBio from "./ChangeBio";
import UpdateAvatar from "./UpdateAvatar";
const styles = StyleSheet.create({
    name: {
        fontSize: 20,
        marginBottom: 100,
        marginTop: 25
    },
    button: {
        borderRadius: 15,
        marginTop: 10,
        padding: 10,
        backgroundColor: 'red',
        width: Dimensions.get('window').width * 0.5,   
        margin: '1%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    editbtn: {
        backgroundColor: "#42C2FF",
        color: "white"
    },
    logoutbtn: {
        backgroundColor: "#FF5757",
        color: "white"
    },
    btntext: {
        textAlign: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        color: 'white'
    },
    lineargradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
    },
    img: {
        position: 'absolute',
        zIndex: 5,
        top:  Dimensions.get('window').height * 0.065,
        height: Dimensions.get('window').height * 0.2,
        width: Dimensions.get('window').height * 0.2, 
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 4, 
        
    },
    viewcontent: {
        position: 'absolute', 
        top:  Dimensions.get('window').height * 0.175,  
        backgroundColor: 'white', 
        width: '100%', 
        height:  Dimensions.get('window').height,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,

    },
    textlogout:{color: 'black', 
    fontSize: 18, 
    fontWeight: 'bold',
    color: "#FF7474",
    
    }, 
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
})
export default function UserInfo() {
    const navigation = useNavigation()
    const [visible, setIsVisible] = useState(false);
    // const [IsLoggedIn, setIsLoggedIn] = use(false)
    const [loading, setLoading] = useState(false)
    // const {profile, check} = useLogin()
    const [profile,setProfile1] = useState(null)
    const [value, setValue] = useState(null)
    const [datetime, setDatetime] = useState(null)
    const [cityvalue, setCityvalue] = useState(null)
    const [genderValue, setGenderValue] = useState(null)
    const [bio, setBio] = useState(null)
    const [bioStatus, setBioStatus] = useState(null)
    const {isLoggedIn, setIsLoggedIn} = useLogin()
    const modalizeRef = useRef();
    const modalizebioRef = useRef()
    const modalizechangeAvatar = useRef()
    const onOpen = () => {
        modalizeRef.current?.open();
      };
    const onOpenBio = () => {
        modalizebioRef.current?.open();
    }
    const onChangeAvatarOpen = () => {
        modalizechangeAvatar.current?.open();
    }
    const fetchUserProfile = async () =>{
        const token = await AsyncStorageLib.getItem('token');
        const email = await AsyncStorageLib.getItem('email')
        if (token !== null){
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
            setProfile1(user)
            setIsLoggedIn(true)
        }
        else {
            AsyncStorageLib.removeItem('token')
            setProfile1(null)
            setIsLoggedIn(false)
        }
    }
    useEffect( () => {
      return fetchUserProfile()
    },[profile])
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0')
    }
    function pickedDate() {
        if (datetime){
            return [
                padTo2Digits(datetime.getDate()),
                padTo2Digits(datetime.getMonth() + 1),
                datetime.getFullYear()
            ].join('/')
        }
    }
    const fetchUserBio = async () => {
        
        const email = await AsyncStorageLib.getItem('email')
        const token = await AsyncStorageLib.getItem('token')
        const user = await axios({
            method: 'get',
            url: `${baseurl}/user/mybio/${email}`,
            headers:{
                Authorization: token
            }
        }).then((response) => {
            console.log(response.data)
            return response.data
        }).catch((err) =>{
            console.log(err)
            return "none"
        })
        setBioStatus(user)
        if (user !== "none"){
            if (user.intro) {
                setBio(user.intro)
            }
            if (user.school){
                setValue(user.school)
            }
            if (user.gender){
                setGenderValue(user.gender)
            }
            if (user.from) {
                setCityvalue(user.from)
            }
            if (user.birthDay) {
                setDatetime(new Date(user.birthDay))
            }
        }
    }
    useEffect(() => {
        return fetchUserBio()
    }, [profile])
    
    const signOuthandle = () => {
        Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không ?', [
            {text: 'Hủy', onPress: () => console.log('Hủy đăng xuất')},
            { text: 'OK', onPress: () => {
                    AsyncStorageLib.removeItem('token')
                    setIsLoggedIn(false)
                    // setProfile({})
                } 
            }
        ]); 
    }
    return (
        <>
        {!profile && isLoggedIn ? (<>
            <AppLoadingAnimation></AppLoadingAnimation>
        </>) : (<>
            
            
            <StatusBar style='transparent'></StatusBar>
            <View style={{flex: 1, backgroundColor: "white"}}>
            <LinearGradient 
                    start={{x: 0, y: 0}}
                    end={{x:0.25, y:0.295}}
                    colors={["#2800FF", "#08F19D"]}
                    style={styles.lineargradient}
                />
            <View>
                <View style={{marginTop: 35, marginLeft: 15, marginRight: 15}}>
                    <View style={{flexDirection:'row', flexWrap:'wrap',  justifyContent:'space-between'}}>
                        <View>
                        <View>
                        <TouchableOpacity  onPress={() => {navigation.goBack()}}>
                                <Feather name="chevron-left" size={35} color="white" />
                        </TouchableOpacity>
                        </View>
                        </View>
                        <View style={{marginTop: 5}}>
                        <TouchableOpacity  onPress={() => {navigation.navigate('settings', {userinfo: profile})}}>
                                <Feather name="settings" size={25} color="white" />
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <ImageBackground
                         
                            source={profile.photoURL === "none" ?  require('../../assets/user_no_avatar.jpg') : {uri: profile.photoURL}}
                            style={{
                                position: 'absolute',
                                zIndex: 5,
                                top:  Dimensions.get('window').height * 0.065,
                                height: Dimensions.get('window').height * 0.2,
                                width: Dimensions.get('window').height * 0.2, 
                            }}
                            imageStyle={{
                                borderRadius: 100,
                                borderColor: 'white',
                                borderWidth: 4, 
                            }} >
                            <TouchableOpacity style={{width: "100%", height: "100%"}} onPress={onOpen}>

                            </TouchableOpacity>
                        </ImageBackground>
                    <View style={styles.viewcontent}>
                    <View
                        style={{
                            marginTop: Dimensions.get('window').height * 0.11,
                        }}>
                        <Text style={{ 
                            textAlign: 'center', 
                            fontSize: 24, 
                            fontWeight: 'bold'}}>
                                {profile.displayName}
                        </Text>
                        <View>
                            {bio === null ? (<></>) : (<>
                                <View style={{ alignItems: 'center', justifyContent: 'center', fontSize:15}}>
                                    <Text> &nbsp;{bio}</Text>
                                </View>
                            </>)}
                            {value === null ? (<></>) : (<>
                                <View style={{ marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                                    <Ionicons name="school" size={20} color="#42C2FF" />
                                    <Text style={{ marginLeft: 10, color: "black", flexWrap:'wrap', flex:0.925, fontSize:16, textAlign: 'justify'}}>
                                        Học tại&nbsp;<Text style={{fontWeight: 'bold', color: "black"}}>{value}</Text> 
                                    </Text>
                                </View>
                            </>)}  
                            {cityvalue === null ? (<></>) : (<>
                                <View style={{ marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                                    <Ionicons name="location" size={22} color="#42C2FF" />
                                    <Text style={{ marginLeft: 10, color: "black", flexWrap:'wrap', flex:0.95, fontSize: 16,  textAlign: 'justify'}}>
                                        Đến từ&nbsp;<Text style={{fontWeight: 'bold',color: "black"}}>{cityvalue}</Text> 
                                    </Text>
                                </View>
                            </>)}
                            {datetime === null ? (<></>) : (<>
                                <View style={{ marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                                    <Ionicons name="calendar" size={22} color="#42C2FF" />
                                    <Text style={{ marginLeft: 10, color: "black", flexWrap:'wrap', flex:0.95, fontSize: 16,  textAlign: 'justify'}}>
                                        Sinh ngày&nbsp;<Text style={{fontWeight: 'bold', color: "black"}}>{pickedDate()}</Text> 
                                    </Text>
                                </View>
                            </>)}
                            
                        </View>
                        <View style={{marginTop: 35, height: 35, width: 150, alignSelf: 'center', backgroundColor: '#42C2FF', justifyContent: 'center',  borderRadius: 20}} onPress={() => navigation.navigate('changebio')}>
                            <TouchableOpacity onPress={onOpenBio}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection:'row',
                                    flexWrap:'wrap',
                                    alignSelf: 'center'}}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color:  "white" ,
                                        textAlign: 'center',
                                       }}>
                                        Chỉnh sửa tiểu sử
                                </Text>    
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop: Dimensions.get('window').height * 0.185}}>
                                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={signOuthandle}>
                                    <Text style={styles.textlogout}>
                                        <MaterialCommunityIcons name="logout" size={18} color="#FF7474" fontWeight="bold"/>&nbsp;Đăng xuất
                                    </Text> 
                                </TouchableOpacity>                     
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            </View>
        {profile.photoURL === "none" ? null : (<>
            <ImageView
                
                images={[{uri: profile.photoURL, cache: 'force-cache'}]}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
                >
            </ImageView> 
        </>)}
        <Modalize ref={modalizeRef} adjustToContentHeight={true}>
            <View style={{margin: 20, flex: 1}}>
                {profile.photoURL === "none" ? null : (<>
                    <TouchableOpacity style={{margin: 10}} onPress={() => {
                        setIsVisible(true)
                        }}>
                        <Text style={{fontSize: 17}}>
                        <Ionicons name="ios-eye" size={20} color="#42C2FF" />&nbsp;Xem ảnh đại diện
                        </Text>
                    </TouchableOpacity>
                </>)}
                <TouchableOpacity style={{margin: 10}} onPress={onChangeAvatarOpen}>
                    <Text style={{fontSize: 17}}>
                        <Ionicons name="ios-add-circle-sharp" size={20} color="#42C2FF" />&nbsp;Đổi ảnh đại diện
                    </Text>
                </TouchableOpacity>
                {profile.photoURL === "none" ? null : (<>
                    <TouchableOpacity style={{margin: 10}} onPress={() => {
                        Alert.alert('Xóa ảnh đại diện', 'Bạn có chắc muốn xóa ảnh đại diện ? Hành động này không thể hoàn tác.', [
                            { text: 'Hủy', onPress: () => {
                                } 
                            },
                            { text: 'OK', onPress: () => {
                                    RemoveAvatar()
                                } 
                            }
                        ]);
                    }}>
                        <Text style={{fontSize: 17}}>
                            <Ionicons name="ios-trash-bin" size={20} color="#42C2FF" />&nbsp;Xóa ảnh đại diện
                        </Text>
                    </TouchableOpacity>
                </>)}
                    
            </View>
        </Modalize>
        <Modalize ref={modalizebioRef}>
            <View style={{marginTop: 25}}>
                <ChangeBio></ChangeBio>
            </View>
        </Modalize>
        <Modalize ref={modalizechangeAvatar} adjustToContentHeight={true}>
            <View style={{marginTop: 25}} >
                <UpdateAvatar></UpdateAvatar>
            </View>
        </Modalize>
        </>)}
        </>
    )
}
