import React, {useState} from 'react';
import {View, TextInput, StyleSheet, FlatList, Image, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { SearchBar } from "react-native-elements";
import { Dimensions } from 'react-native';
import { nanoid } from 'nanoid';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { sendGif, sendGifGroup } from '../../../mymodules/CompressImg';
export default function FetchingGifGroup({groupid}) {
  const [gifs, setGifs] = useState([]);
  const [term, updateTerm] = useState('');
  async function fetchGifs(){ 
        try{
          const API_KEY = 'ucTHKMRmHV6iNwJjJv3jqHBRWat2VQTH';
          const BASE_URL = 'http://api.giphy.com/v1/gifs/search';
          const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
          const res = await resJson.json();
          setGifs(res.data);
        }
        catch (error) {
            console.log(error);
        }
  }
  function onEdit(newTerm) {
      updateTerm(newTerm);
      fetchGifs();
  }
  const upGif = async (item) => {
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    sendGifGroup(groupid, item)
  }
  return (
    <View style={styles.view}>
        <SearchBar 
            round={true}
            onChangeText={(text) => onEdit(text)}
            //onClear={(text) => searchFilterFunction('')}
            searchIcon={{ size: 24, color: 'black'}}
            containerStyle={{
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                width: Dimensions.get('window').width * 0.9
            }}
            inputStyle={{
                backgroundColor:"#EEEEEE"
            }}
            inputContainerStyle={{
                backgroundColor:"#EEEEEE"
            }}
            placeholder="Tìm kiếm trên GIFPHY"
            placeholderTextColor={"#B2B1B9"}
            value={term}>
        </SearchBar>      
      <KeyboardAvoidingView  style={{backgroundColor:'#EEEEEE', borderRadius: 10}}>
      <FlatList
        data={gifs}
        renderItem={({item}) => (
            <TouchableOpacity onPress={() => upGif(item)}>
                <Image
                    resizeMode='contain'
                    style={styles.image}
                    source={{uri: item.images.original.url}}
                />
          </TouchableOpacity>
        )}
      />
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
    view: {
      marginTop: 20,
      maxHeight: 400,
      flex: 1,
      alignItems: 'center',
      padding: 10,
      backgroundColor: 'white'
    },
    textInput: {
      width: '100%',
      height: 50,
      color: 'white'
    },
    image: {
      width: 300,
      height: 150,
      borderWidth: 3,
      marginBottom: 5,
    },
  });