import React, {useState, useContext, useEffect} from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SendRequest from "./SendRequets";
import ReceivedRequest from "./ReceivedRequest";
import AllFriends from "./AllFriends";
import { Text } from "react-native";
import { View } from "react-native";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseurl from "../../env";
const Tab = createMaterialTopTabNavigator()

export default function Friends(){
    const [allfr, setAllfr] = useState(0);
    const [waitforRequest, setWaitforRequest] = useState(0);
    const [invitation, setInvitation] = useState(0);
    const [masterData, setMasterData] = useState(null)
    const [loading, setLoading] = useState(true)
    const BarBadge = ({number}) => {

      return (
        <>
        {number > 0 ? (<>
        <View style={{
          backgroundColor: '#FF5757', 
          padding: 2.5, 
          borderRadius: 100, 
          width: 20, 
          height: 20, 
          justifyContent:'center', 
          alignItems:'center',
          marginTop: 10,
          marginRight: 2
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 10}}>
            {number}
          </Text>
        </View></>) :(<></>) }
        </>
      )
    }
    const fecthBarBadge = async () => {
      const token = await AsyncStorageLib.getItem('token')
      const email = await AsyncStorageLib.getItem('email')
      console.log(email)
      if (token) {
        const result = await axios({
          method: 'get',
          url: `${baseurl}/user/getbarbadge/${email}`,
          headers: {
            Authorization: token
          }
          }).then((response)=>{
            //console.log(response.data)
            return response.data
          }).catch((error) =>{
            return {}
          })
          setMasterData(result)
          setAllfr(result.friends)
          setInvitation(result.received)
          setWaitforRequest(result.sendings)
      }
    }
    useEffect(() => {
      return fecthBarBadge()
    },[masterData])
    return (
      <>
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: {backgroundColor: "#42C2FF"}
          }}
        >
          <Tab.Screen 
            name="allfriends" children={() => <AllFriends />}
            options={{
              tabBarBadge: () => {
                return (
                  <BarBadge number={allfr}></BarBadge>
                )
            },
              tabBarLabel: 'Tất cả',
            }}
            />
          <Tab.Screen name="sendrequest" children={() => <SendRequest />}
          options={{
            tabBarBadge: () => {
                return (
                  <BarBadge number={waitforRequest}></BarBadge>
                )
            },
            tabBarLabel: "Chờ xác nhận",
          }}/>
          <Tab.Screen
            name="receivedrequest" children={() => <ReceivedRequest/>}
            options={{
              tabBarBadge:() => {
                return (
                  <BarBadge number={invitation}></BarBadge>
                )
              },
              tabBarLabel: "Lời mời",
            }}
            />
        </Tab.Navigator>
      </>
    )
}
