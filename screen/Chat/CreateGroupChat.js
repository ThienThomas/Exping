import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { CheckBox, SearchBar } from "react-native-elements";
import { KeyboardAvoidingView } from "react-native";
import { AntDesign, Feather } from '@expo/vector-icons'; 
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from "axios";
import FriendsAvatar from "../../elements/FriendsAvatar";

import { getallfriends } from "../../mymodules/CompressImg";
import { useNavigation } from "@react-navigation/native";
import { AppLoadingAnimation } from "../../elements/AppLoadingAnimation";
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white', height: "100%", padding: 5,
      paddingTop: 25
    },
    tabcontainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between',      
      marginBottom: 15,
    },
    
  })
export default function CreateGroupChat() {
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([])
    const [listFriends, setListFriends] = useState([])
    const [isBusy, setIsBusy] = useState(true)
    const [search, setSearch] = useState('');
    const [checked, setChecked] = useState([])
    const [isloading, setIsLoading] = useState(true)
    const navigation = useNavigation()
    const fetchFriend = async () => {
        setIsBusy(true)
        const result = await getallfriends()
        setMasterDataSource(result)
        setFilteredDataSource(result)
        console.log(result)
        setIsBusy(false)
        setIsLoading(false)
    }
    useEffect(() => {
        return fetchFriend()
    },[])
    const searchFilterFunction = (text) => {
        if (text) {
            const newData = masterDataSource.filter(function (item) {
            const itemData = item.displayName ? item.displayName.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
         } 
         else {
          setFilteredDataSource(masterDataSource);
          setSearch(text);
        }
      };
    const ItemView = ({item}) => {
        return (
              <View style={styles.tabcontainer}>
                <View style={{flexDirection: 'row', alignItems:'center', }}>
                  <FriendsAvatar
                    Img={item.photoURL}
                    Height={55}
                    Width={55}
                  >
                  </FriendsAvatar>
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
                <CheckBox 
                    checkedColor="#42C2FF"
                    checked={checked.includes(item.email)}
                    onPress={() => {
                        const newIds = [...checked];
                        const index = newIds.indexOf(item.email);
                        if (index > -1) {
                            newIds.splice(index, 1);
                            console.log(newIds)
                        }
                        else {
                            newIds.push(item.email)
                            console.log(newIds)
                        }
                        setChecked(newIds)
                    }}
                >
                </CheckBox>
              </View>
              </View>
        );
    };
  return (
    <>
    {isloading ? (<>
      <View style={styles.container}>
        <AppLoadingAnimation></AppLoadingAnimation>
      </View>
    </>) : (<>
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', marginLeft: 10, marginRight: 10, marginTop: 15}}> 
            <TouchableOpacity onPress={() => navigation.goBack()} >
              <Feather name="chevron-left" size={35} color="black" />
            </TouchableOpacity> 
            <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>Tạo nhóm</Text>
              <TouchableOpacity onPress={() => navigation.navigate('creategroupinfo', {users: checked})} disabled={checked.length <= 1}>
                <Text style={{fontWeight: 'bold', color: '#42C2FF'}}>Tiếp tục</Text>
              </TouchableOpacity>
            </View>
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
            style={{marginBottom: 85, padding: 10,}}
          >
        </FlatList>
        </KeyboardAvoidingView>
      </View>
    </>)}

    </>      
  )
}