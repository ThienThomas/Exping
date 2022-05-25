import React, {useState, useEffect, useContext} from "react";
import { View, Text, Dimensions} from "react-native";
import { SearchBar } from "react-native-elements";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import { KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from "axios";
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
export default function AllFriends(){
    const [search, setSearch] = useState('');
    const [listFriends, setListFriends] = useState([])
    const [masterData, setMasterData] = useState(null)
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [isBusy, setIsBusy] = useState(true)
    const navigation = useNavigation()
    
      const searchFilterFunction = (text) => {
        console.log(text)
        if (text) {
            const newData = masterData.filter(function (item) {
            const itemData = item.displayName ? item.displayName.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
         } 
         else {
          setFilteredDataSource(masterData);
          setSearch('');
        }
        console.log(filteredDataSource)
      };
   
    const ItemView = ({item}) => {
        return (
          <TouchableOpacity onPress={() => {navigation.navigate('friendinfo', {userinfo: item})}}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
            justifyContent:'space-between'
           }}> 
           <View style={{flexDirection: 'row',alignItems:'center'}}>
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

        );
    };
    const fetchAllFriends = async () => {
      const token = await AsyncStorageLib.getItem('token')
      const email = await AsyncStorageLib.getItem('email')
      const result = await axios({
        method: 'get',
        url: `${baseurl}/user/getallfriends/${email}`,
        headers :{
          Authorization: token
        }
      }).then((response)=> {
        return response.data
      }).catch((err) => {
        return []
      })
      setMasterData(result.reverse())
      setFilteredDataSource(result.reverse())
    }
    useEffect(() => {
      return fetchAllFriends()
    },[masterData])
    return (
        <View style={styles.container}>
              <SearchBar 
              round={true}
              onChangeText={(text) => searchFilterFunction(text)}
              onClear={(text) => searchFilterFunction('')}
              searchIcon={{ size: 24, color: 'black'}}
              containerStyle={{
                  backgroundColor: 'transparent',
                  borderTopWidth: 0,
                  borderBottomWidth: 0
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
              style={{marginBottom: 85, padding: 10}}
          >
          </FlatList>
          </KeyboardAvoidingView>
        </View>
    )
  }