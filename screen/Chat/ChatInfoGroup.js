import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native'
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
  const [listlastfriends, setListlastfriends] = useState(null)
  const [Listwaiting, setListWating] = useState(null)
  console.log(JSON.stringify(groupinfo.participants))
  const modalize = useRef()
  const modalize2 = useRef()
  const modalize3 = useRef()
  const modalize4 = useRef()
  async function getList() {
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    const result = await axios({
        method: 'get',
        url: `${baseurl}/group/getlistmember/${email}/${JSON.stringify(groupinfo.participants)}`,
        headers: {
            Authorization: token,
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
  async function getFrList() {
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    let result = await axios({
        method: 'get',
        url: `${baseurl}/group/listoflastfriends/${email}/${JSON.stringify(groupinfo.participants)}/${groupinfo.docid}`,
        headers: {
            Authorization: token
        }
    }).then((response) => {
        console.log(response.data)
        return response.data
    }).catch((err) => {
        console.log(err)
        return []
    })
    setListlastfriends(result)
  }
  async function getwaitingList() {
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    let result = await axios({
        method: 'get',
        url: `${baseurl}/group/waitting/${groupinfo.docid}`,
        headers: {
            Authorization: token
        }
    }).then((response) => {
        console.log(response.data)
        return response.data
    }).catch((err) => {
        console.log(err)
        return []
    })
    setListWating(result)

  }
  async function onModalize(){
    getList()
    modalize.current?.open();
  };
  async function onModalize2() {
    getList()
    modalize2.current?.open();
  }
  async function onModalize3(){
      getFrList()
      modalize3.current?.open()
  }
  async function onModalize4(){
    getwaitingList()
    modalize4.current?.open()
}
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
  const ItemView2 = ({item}) => {
        return (
            <>
            <TouchableOpacity
             onPress={() => {navigation.navigate('friendinfo', {userinfo: item})}}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
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

            <View style={{flexDirection: 'row', justifyContent:'center', marginBottom: 25}}>
                <TouchableOpacity style={{backgroundColor: '#FF5757', width: "35%", alignItems: 'center', justifyContent: 'center', height: 40, marginRight: "2%", borderRadius: 20}}
                    onPress={() => {
                        removeMember(item)
                    }}>
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: '700'}}>Xóa khỏi nhóm</Text>
                </TouchableOpacity>
                
            </View>
            </>
            );
  };
  async function addtogroup(itememail){
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    let bool = false
    if (groupinfo.admins.indexOf(email) > -1) { 
        bool = true
    }
    if (token) {
        const result = await axios({
            method: 'post',
            url: `${baseurl}/group/addtogroup`,
            data: {
                groupid: groupinfo.docid,
                email: itememail,
                admin: bool
            },
            headers: {
                Authorization: token
            }
        }).then((respone) => {
            return respone.data
        }).catch((err) => {
            return "fail"
        })
        return result
    }
    
  }
  const ItemView3 = ({item}) => {
            return (
                <>
                <TouchableOpacity
                 onPress={() => {navigation.navigate('friendinfo', {userinfo: item})}}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
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
    
                <View style={{flexDirection: 'row', justifyContent:'center', marginBottom: 25}}>
                    <TouchableOpacity style={{backgroundColor: '#42C2FF', width: "35%", alignItems: 'center', justifyContent: 'center', height: 40, marginRight: "2%", borderRadius: 20}} 
                    onPress={() => {addtogroup(item.email)}}>
                        <Text style={{textAlign: 'center', color: 'white', fontWeight: '700'}}>Thêm</Text>
                    </TouchableOpacity>
                </View>
                </>
                );
   };
  const Listmem = () => {
    if (listmember) {
        return (
            <View style={{marginTop: 20, height: Dimensions.get('window').height * 0.75}}>
                <FlatList
                    data={listmember}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={ItemView}  
                    showsHorizontalScrollIndicator={false}  
                    showsVerticalScrollIndicator={false}
                    style={{padding: 10}}
                >
                </FlatList>
            </View>
        )
    }
    return (
            <></>
        )
   };
  const Listmem2 = () => {
    if (listmember) {
        return (
            <View style={{marginTop: 20, height: Dimensions.get('window').height * 0.75}}>
                <FlatList
                    data={listmember}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={ItemView2}  
                    showsHorizontalScrollIndicator={false}  
                    showsVerticalScrollIndicator={false}
                    style={{padding: 10}}
                >
                </FlatList>
            </View>
        )
    }
    return (
        <></>
    )
   };
  const Listfriend = () => {
    return (
        <View style={{marginTop: 20, height: Dimensions.get('window').height * 0.75}}>
            <FlatList
                data={listlastfriends}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView3}  
                showsHorizontalScrollIndicator={false}  
                showsVerticalScrollIndicator={false}
                style={{padding: 10}}
                >
            </FlatList>
        </View>
    )
  };
  const Waiting = () => {
    return (
        <View style={{marginTop: 20, height: Dimensions.get('window').height * 0.75}}>
            <FlatList
                data={Listwaiting}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ItemView3}  
                showsHorizontalScrollIndicator={false}  
                showsVerticalScrollIndicator={false}
                style={{padding: 10}}
                >
            </FlatList>
        </View>
    )
  };
  async function outgroup(){
      Alert.alert('Rời khỏi nhóm', 'Bạn có chắc là muốn rời khỏi nhóm không ?', [
        {
            text: 'HỦY', onPress: () => {}
        },
        { text: 'OK', onPress: async () => {
            const token = await AsyncStorageLib.getItem('token')
            const email = await AsyncStorageLib.getItem('email')
            if (token) {
                    const result = await axios({
                        method: 'post',
                        url: `${baseurl}/group/outgroup`,
                        data: {
                            groupid: groupinfo.docid,
                            email: email,
                        },
                        headers: {
                            Authorization: token
                        }
                    }).then((respone) =>{ 
                        return respone.data
                    }).catch((err) => {
                        console.log(err.response)
                        return "fail"
                    })
                    if (result === 'removed') {
                        navigation.navigate('home')
                    }
                } 
            }
        }
      ]);
  }
  async function removeMember(member) {
    Alert.alert('Xóa khỏi nhóm', `Bạn có chắc là muốn xóa ${member.displayName} khỏi nhóm không ?`, [
        {
            text: 'HỦY', onPress: () => { navigation.navigate('home')}
        },
        { text: 'OK', onPress: async () => {
            const token = await AsyncStorageLib.getItem('token')
            const email = await AsyncStorageLib.getItem('email')
            if (token) {
                    const result = await axios({
                        method: 'post',
                        url: `${baseurl}/group/removemember`,
                        data: {
                            groupid: groupinfo.docid,
                            email: member.email,
                            remover: email
                        },
                        headers: {
                            Authorization: token
                        }
                    }).then((respone) =>{ 
                        return respone.data
                    }).catch((err) => {
                        console.log(err.response)
                        return "fail"
                    })
                    if (result === 'removed') {
                        Alert.alert('Thành công', `Xóa thành công`, [
                            {
                                text: 'OK', onPress: () => {navigation.navigate('home')}
                            }])
                    }
                } 
            }
        },
    ]);
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
                onPress={() => {navigation.navigate('sharinggroup', {groupid: groupinfo.docid})}}
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
            <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}} 
                onPress={() => {
                    onModalize3()
                }}
                >
                <Text style={{fontSize: 17}}>Thêm thành viên</Text>
                    <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                        <AntDesign  name="addusergroup" size={20} color="black" />
                    </View>
                </TouchableOpacity> 
        </View>
           {groupinfo.admins.indexOf(myemail) > -1 ?  (<> 
            <View style={{margin: 20}}> 
                <Text style={{color: "black", fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>QUẢN TRỊ</Text>
                    <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}
                        onPress={() => {
                            onModalize2()
                        }}
                    >
                        <Text style={{fontSize: 17}}>Quản lý thành viên nhóm</Text>
                            <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                                <AntDesign name="user" size={20} color="black" />
                        </View>
                    </TouchableOpacity>    
                    <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}
                        onPress={() => {
                            Alert.alert('Xóa nhóm này', 'Bạn có chắc là muốn xóa nhóm không ?', [
                                {
                                    text: 'OK', onPress: async () => {
                                        const token = await AsyncStorageLib.getItem('token')
                                        console.log(token)
                                        if (token) {
                                            const result = await axios({
                                                method: 'post',
                                                url: `${baseurl}/group/deletegroup`,
                                                data: {
                                                    groupid: groupinfo.docid,
                                                },
                                                headers: {
                                                    Authorization: token
                                                }
                                            }).then((respone) => {
                                                return respone.data
                                            }).catch((err) => {
                                                return "fail"
                                            })
                                            navigation.navigate('home')
                                        }
                                    }
                                }])
                        }}
                    >
                        <Text style={{fontSize: 17}}>Giải tán nhóm</Text>
                            <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                                <AntDesign name="delete" size={20} color="black" />
                        </View>
                    </TouchableOpacity>    
                </View>
            </>) : null}                
        {groupinfo.admins.indexOf(myemail) > -1 ? null  : (<> 
            <View style={{margin: 20}}> 
            <Text style={{color: "black", fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>QUYỀN RIÊNG TƯ</Text>
                <TouchableOpacity style={{marginBottom: 15, flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}
                onPress={() => outgroup()}>
                    <Text style={{fontSize: 17}}>Rời khỏi nhóm {groupinfo.displayName}</Text>
                            <View style={{borderWidth: 1, borderRadius: 100, padding: 2.5}}>
                                <AntDesign name="logout" size={20} color="black" />
                            </View>
                    </TouchableOpacity>
            </View> 
            </>) }
        <Modalize ref={modalize} adjustToContentHeight={true}>
            <Listmem></Listmem>
        </Modalize>   
        <Modalize ref={modalize2} adjustToContentHeight={true}>
            <Listmem2></Listmem2>
        </Modalize>
        <Modalize ref={modalize3} adjustToContentHeight={true}>
            <Listfriend></Listfriend>
        </Modalize>    
        <Modalize ref={modalize4} adjustToContentHeight={true}>
            <Waiting></Waiting>
        </Modalize>   
    </View>
  )

}