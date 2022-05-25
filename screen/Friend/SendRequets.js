import React, {useState, useEffect, useContext} from "react";
import { View, Text, Dimensions} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import { Swipeable } from "react-native-gesture-handler";
import { revokeRequest } from "../../mymodules/FriendsTabProcessing";
import { KeyboardAvoidingView } from "react-native";
import { useLogin } from "../../LoginProvider";
import axios from "axios";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import baseurl from "../../env";
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white', height: "100%", padding: 5
    },
    tabcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent:'space-between'
    },
    button: {
      borderRadius: 100, 
      paddingLeft: 10, 
      paddingRight: 10, 
      paddingTop: 5, 
      paddingBottom: 5,
    },
      sendingRequest: { 
        backgroundColor: "#1590C4"},
      revokeRequest:{ 
        backgroundColor: "#FF5757"
      },
      textingme: {
        backgroundColor: "#FF5757"
      },
      accept: {
        backgroundColor: "green"
      }
  })
export default function SendRequest(){
    const {listSending} = useLogin()
    const [masterData, setMasterData] = useState(null)

    const fetchSending = async()=>{
          const token = await AsyncStorageLib.getItem('token');
          const email = await AsyncStorageLib.getItem('email');
          if (token) {
              const user = await axios({
                  method: 'get',
                  headers: {
                      Authorization: token,
                  },
                  url: `${baseurl}/user/sendings/${email}`
              }).then((response)=> {
                  //console.log(response.data)
                  return response.data
              }).catch((error) => {
                  //console.log(error.response.data.message)
                  return []
              })
              setMasterData(user)            
            }
        }
    useEffect(() => {
      return fetchSending()
    },[masterData])
    const ItemView = ({item}) => {
      return (
        <View style={styles.tabcontainer}> 
        <View style={{flexDirection: 'row', alignItems:'center'}}>
          <FriendsAvatar
            Img={item.photoURL}
            Width={55}
            Height={55}
          />
          <View style={{marginLeft: 15, marginRight: 15}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
              {item.displayName}
          </Text>
          <Text>
              {item.email}
          </Text>
          </View>
          </View>
          <View>
            <TouchableOpacity 
                  style={[styles.button, styles.revokeRequest]}
                  onPress={() => revokeRequest(item)}
            >
            <AntDesign name="deleteuser" size={25} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      );
    };
      return (
        <KeyboardAvoidingView style={styles.container}>
          <FlatList
              data={masterData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}  
              showsHorizontalScrollIndicator={false}  
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 85, padding: 10}}
          >
          </FlatList>
        </KeyboardAvoidingView>
      )
  }