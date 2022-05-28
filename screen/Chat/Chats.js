import React, {useState, useEffect, useContext} from "react";
import { View, Text} from "react-native";
import {  useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from "axios";
import FriendsAvatar from "../../elements/FriendsAvatar";
import TimeAgo from "react-native-timeago";
import moment from "moment";
import Vi from 'moment/locale/vi'
import baseurl from "../../env";
import { GetallGroupMess } from "../../mymodules/CompressImg";

const Tab = createMaterialTopTabNavigator()
export default function Chats(){
  return (
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {backgroundColor: "#42C2FF"}
        }}
      >
        <Tab.Screen
          component={ListChats}
          name="Bạn bè"
        >
        </Tab.Screen>
        <Tab.Screen
          component={GroupChats}
          name="Nhóm"
        >
        </Tab.Screen>
      </Tab.Navigator>
  )
}
function ListChats(){
    //const globalContext = useContext(GlobalContext);
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [listFriends, setListFriends] = useState([])
    const [listChats, setListChats] = useState([])
    const [listRooms, setListRooms] = useState([])
    const navigation = useNavigation()
    const [isBusy, setIsBusy] = useState(true)
    const [email, setEmail] = useState()
    
    const fetchMessages = async () => {
      const token = await AsyncStorageLib.getItem('token')
      const email = await AsyncStorageLib.getItem('email')
      setEmail(email)
      if (token) {
        const messages = await axios({
            method: 'get',
            headers: {
                Authorization: token,
                email: email
            },
            url: `${baseurl}/message/lastmessages`
        }).then((response)=> {
            //console.log(response.data)
            return response.data
        }).catch((error) => {
            return []
        })
        setMasterDataSource(messages)
        setFilteredDataSource(messages)            
      }
    }
    // useEffect(() => {
    //   return setTimeout(() => {
    //     fetchMessages()
    //   }, 1000) 
    // }, [masterDataSource])
    useEffect(() => {
      const interval = setInterval(async ()=> {
        fetchMessages()
      }, 500)
      return () =>  {
        clearInterval(interval)
      }
    }, [])
    const searchFilterFunction = (text) => {
        if (text) {
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.partnerName ? item.partnerName.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          setFilteredDataSource(masterDataSource);
          setSearch(text);
        }
      };
    const ItemView = ({item}) => {
      //console.log(item)
        return (
          <TouchableOpacity onPress={() => {navigation.navigate('chat', {user: item, fremail: item.partnerEmail})}}>
          <View style={{
            flexDirection: 'row',
            alignItems:'center',
            marginBottom: 15,
          }}>
            <View style={{width: 55}}>
            <FriendsAvatar
              Img={item.partnerPhotoURL}
              Width={55}
              Height={55}
            />
            </View>
            <View style={{marginLeft: 15, marginRight: 5, flex: 1}}>
              <View style={{
                  justifyContent:'space-between', 
                  flexDirection: 'row',                    
                }}>
                  <Text  style={{fontWeight: 'bold', fontSize: 18, textAlign:'center'}}>
                    {item.partnerName} 
                  </Text >
                  <View style={{justifyContent:'center'}}>
                  <Text style={{fontSize: 12, fontWeight: 'bold', color: 'black'}}>
                    <TimeAgo time={item.createdAt} interval={60000}></TimeAgo>
                  </Text>
                  </View>
              </View>
              <View>
              <View style={{
                  justifyContent:'space-between', 
                  flexDirection: 'row',      
                }}>
              <Text>
                {item.system ? (<>{item.text}</>):(<>
                  {item.sentBy === email ? (<><Text>Bạn: </Text></>) : (<></>)}
                    {item.type === 'text' ? (<><Text>{item.text}</Text></>) : (<>
                      {item.type === 'image' ? (<><Text>Hình ảnh</Text></>) : (<>
                        {item.type === 'video' ? (<><Text>video</Text></>) : (<>
                          {item.type === 'gif' ? (<><Text>GIF</Text></>) : (<>
                            {item.type === 'document' ? (<><Text>File đính kèm</Text></>) : (<>
                              {item.type === 'audio' ? (<><Text>Clip thoại</Text></>) : (<>
                              
                              </>)}
                              </>)}
                            </>)}
                          </>)}
                        </>)} </>)}
                </>)}
              </Text>
              </View>
              </View>
            </View>
           
          </View>
          </TouchableOpacity>
        );
    };
    const getItem = (item) => {
     alert(item.uid)
    };
    return (
          <>
            <View style={{backgroundColor: 'white', height: "100%", padding: 5}}>
                <SearchBar 
                round 
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                searchIcon={{ size: 24, color: 'black'}}
                containerStyle={{
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                }}
                inputStyle={{
                    backgroundColor:"#EEEEEE"
                }}
                inputContainerStyle={{
                    backgroundColor:"#EEEEEE"
                }}
                placeholder="Tìm kiếm"
                placeholderTextColor={"#B2B1B9"}
                value={search}
            >
            </SearchBar>
            <KeyboardAvoidingView>
            <FlatList
                data={filteredDataSource}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView}  
                showsHorizontalScrollIndicator={false}  
                showsVerticalScrollIndicator={false}
                style={{ padding: 10}}
            >
            </FlatList>
            </KeyboardAvoidingView>
        </View>
        </>
    )
}

function GroupChats() {
  //const globalContext = useContext(GlobalContext);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [listFriends, setListFriends] = useState([])
  const [listChats, setListChats] = useState([])
  const [listRooms, setListRooms] = useState([])
  const navigation = useNavigation()
  const [isBusy, setIsBusy] = useState(true)
  const [email, setEmail] = useState(null)

    const searchFilterFunction = (text) => {
      if (text) {
        const newData = listRooms.filter(function (item) {
          const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
      } else {
        setFilteredDataSource([]);
        setSearch(text);
      }
    };
  const ItemView = ({item}) => {
      return (
        <TouchableOpacity onPress={() => {navigation.navigate('chatgroup', {groupinfo: item.groupinfo})}}>
        <View style={{
          flexDirection: 'row',
          alignItems:'center',
          marginBottom: 15,
        }}>
          <View style={{width: 55}}>
          <FriendsAvatar
            Img={item.groupinfo.photoURL}
            Width={55}
            Height={55}
            Type={true}
          />
          </View>
          <View style={{marginLeft: 15, marginRight: 5, flex: 1}}>
            <View style={{
                justifyContent:'space-between', 
                flexDirection: 'row',                    
              }}>
                <Text  style={{fontWeight: 'bold', fontSize: 18, textAlign:'center'}}>
                  {item.groupinfo.groupname} 
                </Text >
                <View style={{justifyContent:'center'}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: 'black'}}>
                  <TimeAgo time={item.message.createdAt} interval={60000}></TimeAgo>
                </Text>
                </View>
            </View>
            <View>
            <View style={{
                justifyContent:'space-between', 
                flexDirection: 'row',      
              }}>
            <Text>
              {item.message.system ? (<>{item.message.text}</>):(<>
                    {item.sender.displayName === "system" ? null : (<>
                      {item.sender.email !== email ? `${item.sender.displayName}: `: "Bạn: "}
                    </>)}
                    {item.message.type === "text" ? item.message.text : (<>
                    {item.message.type === "video" ? "Video" : (<>
                      {item.message.type === "image" ? "Hình ảnh" : <>
                        {item.message.type === "document" ? "Đã gửi một tệp đính kèm" : (<>
                          {item.message.type === "audio" ? "Đã gửi một clip thoại" : (<>
                            {item.message.type === "gif" ? "GIF" : <></>}</>)}
                        </>)}</>}
                    </>)}
                  </>)} 
                  </>)}
            </Text>
            </View>
            </View>
          </View>
         
        </View>
        </TouchableOpacity>
      );
  };
  const fetchMessages = async () => {
   const result = await GetallGroupMess()
   const email =  await AsyncStorageLib.getItem('email')
   setEmail(email)
   setMasterDataSource(result)
   setFilteredDataSource(result)
  }
  const getItem = (item) => {
   alert(item.uid)
  };
  useEffect(() => {
    const interval = setInterval(async ()=> {
      fetchMessages()
    }, 1000)
    return () =>  {
      clearInterval(interval)
    }
  }, []) 
  return (
        <>
          <View style={{backgroundColor: 'white', height: "100%", padding: 5}}>
              <SearchBar 
              round 
              onChangeText={(text) => searchFilterFunction(text)}
              onClear={(text) => searchFilterFunction('')}
              searchIcon={{ size: 24, color: 'black'}}
              containerStyle={{
                  backgroundColor: 'transparent',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
              }}
              inputStyle={{
                  backgroundColor:"#EEEEEE"
              }}
              inputContainerStyle={{
                  backgroundColor:"#EEEEEE"
              }}
              placeholder="Tìm kiếm"
              placeholderTextColor={"#B2B1B9"}
              value={search}
          >
          </SearchBar>
          <FlatList
              data={masterDataSource}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}  
              showsHorizontalScrollIndicator={false}  
              showsVerticalScrollIndicator={false}
              style={{padding: 10, backgroundColor: 'white'}}
          >
          </FlatList>
      </View>
      </>
  )
}