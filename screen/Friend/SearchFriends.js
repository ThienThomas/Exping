import React, { useContext, useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { SearchBar } from "react-native-elements";
import { Feather } from '@expo/vector-icons';
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { KeyboardAvoidingView } from "react-native";
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { sendingMyRequest, revokeRequest } from "../../mymodules/FriendsTabProcessing";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useLogin } from "../../LoginProvider";
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
        backgroundColor: "orange"
      },
      accept: {
        backgroundColor: "green"
      }
  })
export default function SearchFriends() {
    const input = React.createRef();
    const navigation = useNavigation()
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterData, setMasterData] = useState([])
    //const {listFriends, listSending, listReceiving, masterData} = useLogin()
    useEffect(() => {
        input.current.focus()
    }, [])
    
    const searchFilterFunction = async (text) => {
        if (text) {
              setSearch(text)
              console.log(text)
              //const text1 = text.toLowerCase();
              const token = await AsyncStorageLib.getItem('token');
              const email = await AsyncStorageLib.getItem('email');
              const result = await axios({
                method: "get",
                headers: {
                  Authorization: token
                },
                url: `${baseurl}/user/search/${email}/${text}`
              }).then((response) => {
                console.log(response.data)
                return response.data
              }).catch((err) => {
                console.log(err.response.data.message)
                return []
              })
            setMasterData(result)
        } 
        else {
          setFilteredDataSource({});
          setSearch(text);
        }
      };
    const ItemView = ({item}) => {
        return (
        <TouchableOpacity onPress={() => {navigation.navigate('friendinfo', {userinfo: item})}}>
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
          </View>
        </TouchableOpacity>
      )
    };
    return (
    <>
        <View style={{backgroundColor: 'white', flex: 1, paddingTop: 40, paddingLeft: 10, paddingRight: 10 }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <Feather name="chevron-left" size={35} color="black" />
                </TouchableOpacity>
           <SearchBar 
                ref={input}
                round={true}
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                searchIcon={{ size: 24, color: 'black'}}
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  width: Dimensions.get('window').width * 0.812
                }}
                inputStyle={{
                  backgroundColor:"#EEEEEE"
                }}
                inputContainerStyle={{
                  backgroundColor:"#EEEEEE"
                }}
                placeholder="Tìm kiếm"
                placeholderTextColor={"#B2B1B9"}
                value={search}></SearchBar>
            </View>
            <KeyboardAvoidingView>
            <FlatList
              data={masterData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}  
              showsHorizontalScrollIndicator={false}  
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 85, padding: 10}}>
            </FlatList>
            </KeyboardAvoidingView>
        </View>
    </>)
}