import React, { useState} from "react";
import { Text, View, Image, StyleSheet, Pressable, Dimensions, Alert} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AppLoadingAnimation } from "../../elements/AppLoadingAnimation";
import { resetPassword } from "../../function/auth";

const styles = StyleSheet.create({
    txt_input: {
        color: 'black',
        margin: 5,
        paddingBottom: 10,
        height: 40,
        width: Dimensions.get('window').width * 0.80,
    },
    txt_email: {
        borderBottomWidth: 0.5,
        borderColor: '#D1D1D1',
    },
    
    button: {
        borderRadius: 15,
        marginTop: 10,
        padding: 10,
        backgroundColor: 'red',
        width: Dimensions.get('window').width * 0.80,   
        margin: '1%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    registerbtn: {
        backgroundColor: "#FF5757"
    },
    loginbtn: {
        backgroundColor: "#42C2FF",
        color: "white"
    },
    btntext2: {
        marginTop: '5%',
        fontWeight: 'bold',
        color: '#42C2FF'
    },
    btntext: {
        textAlign: 'center',
        alignItems: 'center',
        fontWeight: 'bold'
    },
    logtext: {
        color: 'white'
    },
    text_log: {
        color: "#42C2FF"
    },
    text_res: {
        color: "#FF5757"
    }
});

export default function ResetPassword({route}) {
    const [password, setPassword] = useState("")
    const [passwordagain, setPasswordagain] = useState("")
    const [mode, setMode] = useState("signIn")
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)
    async function handlePress(){
        Keyboard.dismiss()
        setLoading(true)
        if (password !== passwordagain) {
            Alert.alert('Mật khẩu không khớp', 'Bạn vui lòng kiểm tra lại nhé !', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ]);
        }
        else {
            if (password.length >= 6){
                const result = await resetPassword(route.params.email, password)
                if (result === "password changed"){
                    Alert.alert('Thành công !', 'Mật khẩu của bạn đã được cập nhật !', [
                        { text: 'OK', onPress: () => navigation.navigate('signIn') },
                      ]);
                }
                else {
                    Alert.alert('Lỗi !', 'Có lỗi xảy ra, bạn vui lòng thử lại nhé !', [
                        { text: 'OK', onPress: () => {} },
                      ]);
                }
            }
            else {
                Alert.alert('Mật khẩu không hợp lệ', 'Mật khẩu nên có từ 6 ký tự trở lên !', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]); 
            }
        }
        setLoading(false)
    }
    return (
        <>
        {loading ? (<>
            <AppLoadingAnimation></AppLoadingAnimation>
        </>) : (<>
        <View style={{
            justifyContent: "center", 
            alignItems: "center", 
            flex: 1, 
            backgroundColor: 'white'}
            }>
            <Image 
            source={require('../../assets/welcome-img.png')}
            style={{width: Dimensions.get('window').width * 0.55, height: Dimensions.get('window').width * 0.55}}
            resizeMethod="auto"
             />
             <View style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                    value={route.params.email}
                    placeholder='Email'
                    placeholderTextColor="#D1d1d1"
                    editable={false}
                    style={[styles.txt_input, styles.txt_email]}
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Mật khẩu'
                    placeholderTextColor="#D1d1d1"
                    secureTextEntry={true}
                    style={mode === "signIn" ? styles.txt_input : [styles.txt_input, styles.txt_email]}
                    
                />
                <TextInput
                    value={passwordagain}
                    onChangeText={setPasswordagain}
                    placeholder='Xác nhận mật khẩu'
                    placeholderTextColor="#D1d1d1"
                    secureTextEntry={true}
                    style={mode === "signIn" ? styles.txt_input : [styles.txt_input, styles.txt_email]}
                />
                <View>
                    <Pressable 
                        disabled={!password || !passwordagain}
                        style={[styles.button, styles.loginbtn]}  
                        onPress={handlePress}>
                        <Text style={[styles.btntext, styles.logtext]}>
                            XÁC NHẬN
                        </Text>
                        
                    </Pressable>
                        <TouchableOpacity
                            style={{alignItems: "center",
                                    justifyContent: "center"
                                }}
                             onPress={() => {navigation.navigate("forgot")}}
                            >
                            <Text
                                style={{textAlign: "center", marginTop: 10, color: "#42C2FF"}}
                            >
                                Quay lại
                            </Text>
                        </TouchableOpacity>
                </View>
             </View>
        </View>
        </>)}
        </>
    )
}
