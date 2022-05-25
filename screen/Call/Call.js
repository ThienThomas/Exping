import React, {useState, useEffect, useContext} from "react";
import { View, Text, KeyboardAvoidingView} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import FriendsAvatar from "../../elements/FriendsAvatar";
import { Feather, FontAwesome} from '@expo/vector-icons';

export default function Call(){
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [listFriends, setListFriends] = useState([])
    const [isBusy, setIsBusy] = useState(true)
    const navigation = useNavigation()
    
      const searchFilterFunction = (text) => {
        if (text) {
          const newData = masterDataSource.filter(function (item) {
            const itemData = item.displayName ? item.displayName.toUpperCase() : ''.toUpperCase();
            
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
        return (
        <>
        {isBusy === false && typeof listFriends === 'undefined' ? (<>
          <View></View>
        </>) : (<>
          {listFriends.find(element => element === item.uid) ? (<>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 15,
              justifyContent:'space-between'
            }}>
             <View style={{flexDirection: 'row', alignItems:'center'}}>
              <FriendsAvatar
                Img={item.photoURL}
                Width={55}
                Height={55}
              />
              <View style={{marginLeft: 15}}>
              <Text  style={{fontWeight: 'bold', fontSize: 18}}>
                  {item.displayName}
              </Text>
                 <Text style={{color: 'grey'}}><Feather name="arrow-down-left" size={15} color="green"  />Hôm nay, 12:00</Text>
              </View>
              </View>
              <View style={{flexDirection: 'row', alignItems:'center'}}>
              <TouchableOpacity style={{ marginRight: 10}} onPress={ () => { navigation.navigate('voicecall', {user:item}) }}>
                <FontAwesome name="phone" size={26} color="#42C2FF" />
              </TouchableOpacity >
                <TouchableOpacity style={{marginLeft: 10}} onPress={ () => { navigation.navigate('videochat', {user:item}) }}>
                 <FontAwesome name="video-camera" size={26} color="#42C2FF" />                      
              </TouchableOpacity >
              </View>
            </View>
           
          </>) : (<></>)}
        </>)}
        </>
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
        </>
    )
}