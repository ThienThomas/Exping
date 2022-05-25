import React from "react";
import { View , Text} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import {Fontisto, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseurl from "../../../env";
import { SendFileMess } from "../../../mymodules/CompressImg";
export default function PickDoc({document, user, fremail}){
    
    async function UploadDocs(){
        console.log(document)
        const token = await AsyncStorageLib.getItem('token')
        const email = await AsyncStorageLib.getItem('email')
        const result = await SendFileMess(token, email, fremail, document)
        console.log(result)
    }
    return (
        <View style={{flex: 1, backgroundColor: 'white',  margin: 25}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 25}}>
                <View style={{backgroundColor: "#42C2FF", width: 35, height: 35, padding: 2.5, justifyContent:'center', alignItems: 'center', borderRadius: 50}}>
                    <AntDesign name="filetext1" size={20} color="white" /> 
                </View> 
                <View style={{marginLeft: 10, marginRight: 12}}>
                    <Text>{document.name}</Text>
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginBottom: 20,
                    justifyContent: 'flex-end',
                }}
                >
                <View
                    style={{
                      alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {UploadDocs()}}
                            style={{
                                alignItems: 'center',
                                borderRadius: 50,
                                backgroundColor: 'white',
                                width: '100%',
                                height: 35,
                                justifyContent: 'center',
                                backgroundColor: '#42C2FF',
                                bottom: 0
                            }}
                    >
                        <Text style={{color: 'white', fontWeight:'bold'}}>GỬI</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}