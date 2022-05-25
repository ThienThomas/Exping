import { Header } from "@react-navigation/stack";
import React, {useEffect, useState} from "react";
import { View, Text, Image, StyleSheet, Alert, ImageBackground } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Feather,Entypo, MaterialCommunityIcons, FontAwesome} from '@expo/vector-icons';
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { AppLoadingAnimation } from "../../elements/AppLoadingAnimation";
import ImageView from "react-native-image-viewing";
import { StatusBar } from "expo-status-bar";
import LoginProvider, { useLogin } from "../../LoginProvider";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from 'axios'
import AnimatedLottieView from "lottie-react-native";
import { Ionicons } from '@expo/vector-icons';
import { sendingMyRequest, revokeRequest, denyRequest , acceptRequest } from "../../mymodules/FriendsTabProcessing";
import baseurl from "../../env";
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
    textaddfriend: {
        color: "white",
        fontSize: 15,
        fontWeight: 'bold'
    },
    button1: {
        borderRadius: 100, 
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingTop: 5, 
        paddingBottom: 5,
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
    sendingRequest: { 
        backgroundColor: "#1590C4"},
    revokeRequest:{ 
        backgroundColor: "#FF5757"
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    textingme: {
        backgroundColor: "orange"
    },
    jsonanimation: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    }
})
export default function FriendInfo({route}) {

    const {userinfo} = route.params
    console.log(userinfo)
    const navigation = useNavigation()
    const [visible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const [profile,setProfile1] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [bio, setBio] = useState(null)
    const fetchFriendInfo = async () => {
        setIsLoading(true)
        const token = await AsyncStorageLib.getItem('token');
        const email = await AsyncStorageLib.getItem('email')
        if (token !== null){
            const user = await axios({
                method: 'get',
                headers: {
                    Authorization: token
                },
                url: `${baseurl}/user/getuserbio/${email}/${userinfo.email}`,
               
            }).then((response)=> {
                console.log(response.data)
                return response.data
            }).catch((error) => {
                console.log(error.response.data.message)
                return "none"
            })
            setBio(user)
            }
        setIsLoading(false)
    }
    useEffect(() => {
        return fetchFriendInfo()
    },[bio])
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0')
    }
    function pickedDate(datetime) {
        if (datetime){
            return [
                padTo2Digits(datetime.getDate()),
                padTo2Digits(datetime.getMonth() + 1),
                datetime.getFullYear()
            ].join('/')
        }
    }
    return (
        <>
        {bio === null && isLoading ?  (<>
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
                    </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <ImageBackground
                            source={userinfo.photoURL === "none" ?  require('../../assets/user_no_avatar.jpg') : {uri: userinfo.photoURL, cache: 'force-cache'}}
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
                            <TouchableOpacity style={{width: "100%", height: "100%"}} onPress={() =>{setIsVisible(true)}}>

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
                                {userinfo.displayName}
                        </Text>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 15,
                                    flexDirection:'row', 
                                    flexWrap:'wrap'}}>
                                
                               { bio.checked !== "friend" ?  (
                                    <View>
                                        <View>
                                            <Text>
                                                <Entypo name="lock" size={24} color="#1590C4" /> 
                                                    Tiểu sử chỉ hiển thị khi các bạn là bạn bè
                                                </Text>
                                                <View style={[styles.jsonanimation]}>
                                                    <AnimatedLottieView source={require('../../assets/json/contact.json')} autoPlay loop />
                                                </View>
                                        </View>
                                    </View>
                                ) : 
                               (<>{ bio.biostatus === 'no'   ? (<>
                                    <View>
                                        <View>
                                            <Text>
                                                <Entypo name="lock" size={24} color="black" /> {userinfo.displayName} chưa cập nhật tiểu sử
                                            </Text>
                                        </View>
                                    </View>
                                    
                               </>) : (
                                   <View style={{flex: 1}}>
                                       {bio.intro === null ? (<></>) : (<>
                                            <View style={{ alignItems: 'center', justifyContent: 'center', fontSize:15}}>
                                                <Text> &nbsp;{bio.intro}</Text>
                                            </View>
                                        </>)}
                                        {bio.school === null ? (<></>) : (<>
                                            <View style={{ marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                                                <Ionicons name="school" size={20} color="#42C2FF" />
                                                <Text style={{ marginLeft: 10, color: "black", flexWrap:'wrap', flex:0.925, fontSize:16, textAlign: 'justify'}}>
                                                    Học tại&nbsp;<Text style={{fontWeight: 'bold', color: "black"}}>{bio.school}</Text> 
                                                </Text>
                                            </View>
                                        </>)}  
                                        {bio.from === null ? (<></>) : (<>
                                            <View style={{ marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                                                <Ionicons name="location" size={22} color="#42C2FF" />
                                                <Text style={{ marginLeft: 10, color: "black", flexWrap:'wrap', flex:0.95, fontSize: 16,  textAlign: 'justify'}}>
                                                    Đến từ&nbsp;<Text style={{fontWeight: 'bold',color: "black"}}>{bio.from}</Text> 
                                                </Text>
                                            </View>
                                        </>)}
                                        {bio.birthDay === null ? (<></>) : (<>
                                            <View style={{ marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                                                <Ionicons name="calendar" size={22} color="#42C2FF" />
                                                <Text style={{ marginLeft: 10, color: "black", flexWrap:'wrap', flex:0.95, fontSize: 16,  textAlign: 'justify'}}>
                                                    Sinh ngày&nbsp;<Text style={{fontWeight: 'bold', color: "black"}}>{pickedDate(new Date(bio.birthDay))}</Text> 
                                                </Text>
                                            </View>
                                        </>)}
                                   </View>
                               )}</>) }   
                            </View>
                            
                        </View>
                        {bio.checked === "none" ? 
                            (<>
                                <View style={{marginTop: Dimensions.get('window').height * 0.025, justifyContent: 'center', alignItems: 'center'}}>
                                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'#1590C4', width: '50%', padding: 10, borderRadius: 20}}
                                        onPress={() => {sendingMyRequest(userinfo)}}>
                                        <Text style={styles.textaddfriend}>
                                        Thêm bạn bè
                                        </Text> 
                                    </TouchableOpacity>                     
                                </View>
                            </>) : 
                        (<>
                            {bio.checked === "sending" ? 
                            (<>
                                <View style={{marginTop: Dimensions.get('window').height * 0.075, justifyContent: 'center', alignItems: 'center'}}>
                                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'#FF5757', width: '50%', padding: 10, borderRadius: 20}}
                                        onPress={() => {revokeRequest(userinfo)}}>
                                        <Text style={styles.textaddfriend}>
                                            Đã gửi lời mời
                                        </Text> 
                                    </TouchableOpacity>
                                </View>
                            </>) : (<>
                                {bio.checked === "recevied" ?  (
                                    <>
                                        <View>
                                            <Text style={{marginTop: Dimensions.get('window').height * 0.05, textAlign: 'center'}}>Đang gửi cho bạn lời mời kết bạn</Text>

                                        <View style={{marginTop: Dimensions.get('window').height * 0.025, justifyContent: 'center', alignItems: 'center', flexDirection:'row'}}>
                                            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'#FF5757',  width: 100,padding: 10, borderRadius: 20, marginRight: 10}}
                                                onPress={() => {denyRequest(userinfo)}}>
                                                <Text style={styles.textaddfriend}>
                                                    Xóa
                                                </Text> 
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'#1590C4', width: 100, padding: 10, borderRadius: 20, marginLeft: 10}}
                                                onPress={() => {acceptRequest(userinfo)}}>
                                                <Text style={styles.textaddfriend}>
                                                    Chấp nhận 
                                                </Text> 
                                            </TouchableOpacity>
                                        </View>
                                        </View>
                                    </>) : (<>
                                        <View style={{marginTop: Dimensions.get('window').height * 0.075, justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', backgroundColor:'green', width: '50%', padding: 10, borderRadius: 20}}
                                                onPress={() => {}}>
                                                <Text style={styles.textaddfriend}>
                                                    Hủy kết bạn
                                                </Text> 
                                            </TouchableOpacity>
                                        </View>
                                    </>)}
                                </>) 
                                 }
                        </>)}
                    </View>
                </View>
            </View>
            
        </View>
        {userinfo.photoURL === "none" ? null : (<>
            <ImageView
                
                images={[{uri: userinfo.photoURL, cache: 'force-cache'}]}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
                >
            </ImageView> 
        </>)}
        </>)}
        </>
    )
}
