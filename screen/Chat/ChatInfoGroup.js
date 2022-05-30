import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { Modalize } from 'react-native-modalize';
import axios from 'axios';
import baseurl from '../../env';
import FriendsAvatar from '../../elements/FriendsAvatar';
export default function ChatInfoGroup({route}) {
  const {groupid,groupinfo, myemail} = route.params
  console.log(groupinfo)
  const navigation = useNavigation()
  console.log(groupinfo.admins)
  const [listmember, setListmember] = useState(null)
  console.log(JSON.stringify(groupinfo.participants))
  const modalize = useRef()
  function onModalize(){
    modalize.current?.open();
  };
  useEffect(() => {
    const unsubcribe = async () => {
        const token = await AsyncStorageLib.getItem('token')
        const result = await axios({
            method: 'get',
            url: `${baseurl}/group/getlistmember/${JSON.stringify(groupinfo.participants)}`,
            headers: {
                Authorization: token
            },
        }).then((response) => {
            console.log(response.data)
            return response.data
        }).catch((err) => {
            console.log(err)
            return []
        })
        setListmember(result)
    }
    return () => unsubcribe()
  }, [])
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
  const Listmem = () => {
    if (listmember) {
        return (
            <View style={{marginTop: 20, height: Dimensions.get('window').height * 0.45}}>
                <FlatList
                    data={listmember}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={ItemView}  
                    showsHorizontalScrollIndicator={false}  
                    showsVerticalScrollIndicator={false}
                    style={{marginBottom: 85, padding: 10}}
                >
                </FlatList>
            </View>
        )
    }
    return (
        <></>
    )
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{alignItems:'center'}}>
            <TouchableOpacity>
                <Image 
                    source={groupinfo.photoURL !== "none"? {uri: groupinfo.photoURL, cache: 'force-cache'} : require('../../assets/group_no_avatar.png')}
                    style={{
                            width: 125, 
                            height: 125,
                            borderRadius: 200
                        }}
                        resizeMethod="auto">
                </Image>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={{fontSize: 24, fontWeight: 'bold', marginTop: 10}}>
                    {groupinfo.groupname}
                </Text>
            </TouchableOpacity>
        </View>
        <View style={{margin: 20}}> 
        <Text style={{color: "black", fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>HÀNH ĐỘNG KHÁC</Text>
            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}} 
                //onPress={() => {navigation.navigate('sharing', {user: userinfo})}}
                >
                <Text style={{fontSize: 17}}>Xem phương tiện và file đã chia sẻ</Text>
                    <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                        <Ionicons  name="image" size={20} color="black" />
                    </View>
            </TouchableOpacity>      
            {groupinfo.admins.indexOf(myemail) > -1 ? null : (<> 
            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}} 
                onPress={() => {
                    onModalize()
                }}
                >
                <Text style={{fontSize: 17}}>Xem danh sách thành viên</Text>
                    <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                        <Feather  name="user" size={20} color="black" />
                    </View>
            </TouchableOpacity> 

            </>)}
        </View>
           {groupinfo.admins.indexOf(myemail) > -1 ?  (<> 
            <View style={{margin: 20}}> 
                <Text style={{color: "black", fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>QUẢN TRỊ</Text>
                    <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}
                        onPress={() => {
                            onModalize()
                        }}
                    >
                        <Text style={{fontSize: 17}}>Quản lý thành viên nhóm</Text>
                            <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                                <AntDesign name="addusergroup" size={20} color="black" />
                        </View>
                    </TouchableOpacity>    
                </View>
            </>) : null}                
        <View style={{margin: 20}}> 
            <Text style={{color: "black", fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>QUYỀN RIÊNG TƯ</Text>
                <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize: 17}}>Rời khỏi nhóm {groupinfo.displayName}</Text>
                        <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                            <AntDesign name="logout" size={20} color="black" />
                        </View>
                </TouchableOpacity>
        </View> 
        <Modalize ref={modalize} adjustToContentHeight={true}>
            <Listmem></Listmem>
        </Modalize>      
    </View>
  )

}