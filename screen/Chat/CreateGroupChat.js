import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { CheckBox, SearchBar } from "react-native-elements";
import { KeyboardAvoidingView } from "react-native";
import { AntDesign, Feather } from '@expo/vector-icons'; 
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getallfriends } from "../../mymodules/CompressImg";
import { useNavigation } from "@react-navigation/native";
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white', height: "100%", padding: 5,
      paddingTop: 25
    },
    tabcontainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between',
    },
    
  })
export default function CreateGroupChat() {
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([])
    const [listFriends, setListFriends] = useState([])
    const [isBusy, setIsBusy] = useState(true)
    const [search, setSearch] = useState('');
    const [checked, setChecked] = useState([])
    const navigation = useNavigation()
    const fetchFriend = async () => {
        const result = await getallfriends()
        setMasterDataSource(result)
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
            <>
            {isBusy === true ? (
            <></>) : (<>
            {typeof listFriends === 'undefined' ? (<></>) : (<>
            {listFriends.find(element => element === item.uid) ? (<>
              <View style={styles.tabcontainer}>
              <View style={{flexDirection: 'row', alignItems:'center', }}>
              <FriendsAvatar
                Img={"none"}
                Width={40}
                Height={40}
              />
              <View style={{marginLeft: 15, marginRight: 15}}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  {item.displayName}
              </Text>
              </View>
              </View>
              <View>
                <CheckBox 
                    checkedColor="#42C2FF"
                    checked={checked.includes(item.uid)}
                    onPress={() => {
                        const newIds = [...checked];
                        const index = newIds.indexOf(item.uid);
                        if (index > -1) {
                            newIds.splice(index, 1);
                            console.log(newIds)
                        }
                        else {
                            newIds.push(item.uid)
                            console.log(newIds)
                        }
                        setChecked(newIds)
                    }}
                >
                </CheckBox>
              </View>
              </View>
            </>) : (<></>)}
            </>)}</>)} 
            </>
        );
    };
  return (
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
  )
}