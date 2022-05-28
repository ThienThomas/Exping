import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginProvider, { useLogin } from './LoginProvider';
import Forgot from './screen/Authentication/Forgot';
import SignIn from './screen/Authentication/SignIn';
import Intro from './screen/General/Intro';
import BottomTabNavigatorElement from './elements/BottomTabbarElements';
import Chats from './screen/Chat/Chats';
import { TouchableOpacity } from "react-native-gesture-handler";
import Avatar from './elements/Avatar';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import UserInfo from './screen/User/UserInfo';
import Call from './screen/Call/Call';
import Friends from './screen/Friend/Friends';
import Profile from './screen/Authentication/Profile';
import SearchFriends from './screen/Friend/SearchFriends';
import FriendInfo from './screen/Friend/FriendInfo';
import ChangeBio from './screen/User/ChangeBio';
import { Feather } from '@expo/vector-icons';
import Settings from './screen/Settings/Settings';
import ConfirmEmail from './screen/Authentication/ConfirmEmail';
import axios from 'axios';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import Chat from './screen/Chat/Chat';
import FriendsAvatar from './elements/FriendsAvatar';
import UpdateAvatar from './screen/User/UpdateAvatar';
import TakePhoto from './screen/Chat/Function/TakePhoto';
import PickPhoto from './screen/Chat/Function/PickPhoto';
import PickVideo from './screen/Chat/Function/PickVideo';
import RecordingVideo from './screen/Chat/Function/RecordingVideo';
import PickDoc from './screen/Chat/Function/PickDoc';
import ChatInfo from './screen/Chat/ChatInfo';
import Sharing from './screen/Chat/Sharing';
import CreateGroupChat from './screen/Chat/CreateGroupChat';
import CreateGroupInfo from './screen/Chat/CreateGroupInfo';
import ChatGroup from './screen/Chat/ChatGroup';
import TakePhotoGroup from './screen/Chat/Function/TakePhotoGroup';
import PickPhotoGroup from './screen/Chat/Function/PickPhotoGroup';
import PickVideoGroup from './screen/Chat/Function/PickVideoGroup';
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
function App() {
  return (
    <LoginProvider>
      <NavigationContainer>
        <StatusBar style='transparent'></StatusBar>
        <MainNavigator></MainNavigator>
      </NavigationContainer>
    </LoginProvider>
  );
}
function UnauthenticatedNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerStyle: {
      backgroundColor: 'white',
      shadowOpacity: 0,
      elevation: 0}, 
      headerTintColor: 'white',
    }
  }
  >
    <Stack.Group screenOptions={{headerShown: false}}>
        <Stack.Screen name='intro' component={Intro} />
        <Stack.Screen name='signIn' component={SignIn} />
        <Stack.Screen name='forgot' component={Forgot} />
    </Stack.Group>
  </Stack.Navigator>
  )
}
function AuthenticatedNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerStyle: {
        backgroundColor: 'white',
        shadowOpacity: 0,
        elevation: 0}, 
        headerTintColor: 'white',
      }
    }
    >
      <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name='home' component={Home} />
          <Stack.Screen name='userinfo' component={UserInfo} options={{headerShown: false, title: "Profile"}}/>
          <Stack.Screen name="searchFriends" component={SearchFriends}/>
          <Stack.Screen name='friendinfo' component={FriendInfo}/>
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'card', headerShown : false}}>
        <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
          name="takephoto" 
          component={TakePhoto} 
          />
                  <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
          name="takephotogroup" 
          component={TakePhotoGroup} 
          />
      </Stack.Group> 
      <Stack.Group screenOptions={{presentation: 'card', headerShown : false}}>
        <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
          name="pickphoto" 
          component={PickPhoto} 
          />
      </Stack.Group>    
      <Stack.Group screenOptions={{presentation: 'card', headerShown : false}}>
          <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
          name="pickphotogroup" 
          component={PickPhotoGroup} 
          />
      </Stack.Group>         
      <Stack.Group screenOptions={{presentation: 'card', headerShown : false}}>
        <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
          name="pickvideo" 
          component={PickVideo} 
          />
      </Stack.Group> 
      <Stack.Group screenOptions={{presentation: 'card', headerShown : false}}>
        <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
          name="pickvideogroup" 
          component={PickVideoGroup} 
          />
      </Stack.Group> 
      <Stack.Group screenOptions={{presentation: 'card', headerShown : false}}>
        <Stack.Screen screenOptions={{presentation: 'modal', headerShown : false, headerTitleStyle:{color: 'transparent'}}}
          name="recordvideo" 
          component={RecordingVideo} 
          />
      </Stack.Group>          
      <Stack.Group screenOptions={{presentation: 'modal', headerTitle: "Ảnh đại diện", headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18, color: 'black'}}}>
          <Stack.Screen name="updateavatar" component={UpdateAvatar}
              options={{
                headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                headerBackTitleVisible: true,
                headerBackTitleStyle: {
                color: 'black'
              },
              headerBackImage: () => {""},
              }}
          />
      </Stack.Group>
      
      <Stack.Group>
            <Stack.Screen screenOptions={{presentation: 'modal'}}
                name="chat" 
                component={Chat} 
                options={({route, navigation}) => ({
                  headerBackTitle: <>
                    <Feather name="chevron-left" size={35} color="#42C2FF" />
                  </>,
                  headerLeftLabelVisible: true,
                  headerLeftContainerStyle: {
                    width: 50
                  },
                  headerTitle: () => (
                    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',}} onPress={() => navigation.navigate('friendinfo', {userinfo: route.params.userinfo})}>
                    <FriendsAvatar
                        Img={route.params.user.partnerPhotoURL}
                        Width={40}
                        Height={40} 
                    />
                    <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, }}>{route.params.user.partnerName}</Text>
                    </TouchableOpacity>
                   ),
                  headerTitleContainerStyle: {
                    marginLeft: 0
                  },
                  headerBackTitleVisible: true,
                  headerBackImage: () => (<></>),
                  headerRight: () => (
                    <View style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
                     
                      <TouchableOpacity style={{marginLeft: 10, marginRight: 15}} onPress={() => { navigation.navigate('chatinfo', {user: route.params.user, userinfo: route.params.userinfo})}}>
                      <MaterialIcons name="info" size={26} color="#42C2FF" />
                        </TouchableOpacity>
                    </View>
                    ),
                  })}
                />
            </Stack.Group>
            <Stack.Group>
      </Stack.Group>
      <Stack.Group>
            <Stack.Screen screenOptions={{presentation: 'modal'}}
                name="chatgroup" 
                component={ChatGroup} 
                options={({route, navigation}) => ({
                  headerBackTitle: <>
                    <Feather name="chevron-left" size={35} color="#42C2FF" />
                  </>,
                  headerLeftLabelVisible: true,
                  headerLeftContainerStyle: {
                    width: 50
                  },
                  headerTitle: () => (
                    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',}} >
                      <FriendsAvatar
                          Img={route.params.groupinfo.photoURL}
                          Width={40}
                          Height={40} 
                          Type={true}
                      />
                      <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 15, }}>{route.params.groupinfo.groupname}</Text>
                    </TouchableOpacity>
                   ),
                  headerTitleContainerStyle: {
                    marginLeft: 0
                  },
                  headerBackTitleVisible: true,
                  headerBackImage: () => (<></>),
                  headerRight: () => (
                    <View style={{flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
                      <TouchableOpacity style={{marginLeft: 10, marginRight: 15}}  onPress={() => { navigation.navigate('chatinfogroup', {group_item: route.params.group_item})}}>
                        <MaterialIcons name="info" size={26} color="#42C2FF" />
                      </TouchableOpacity>
                    </View>
                    ),
                  })}
                />
            </Stack.Group>
      <Stack.Group>
              <Stack.Screen 
                name='chatinfo'
                component={ChatInfo}
                options={{
                  headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                  headerBackTitleVisible: true,
                  headerBackTitleStyle: {
                  color: 'black'
                  },
                  headerBackImage: () => {""},
                  }}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'card', headerTitle:"Nội dung đã chia sẻ",  headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18, color: 'black'}}}>
              <Stack.Screen 
                name="sharing" 
                component={Sharing} 
                options={ ({route}) => ({
                  headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                  headerBackTitleVisible: true,
                  headerBackTitleStyle: {
                  color: 'black'
                  },
                  headerBackImage: () => {""},
                  })}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: 'card', headerShown: false, headerTitle: "Tạo nhóm", headerTitleAlign: 'center', headerTitleStyle: {fontSize: 18, color: 'black'}}}>
                <Stack.Screen name="creategroup" component={CreateGroupChat}
                  options={({route, navigation}) => ({
                    headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
                    headerBackTitleVisible: true,
                    headerBackTitleStyle: {
                    color: 'black'
                  },
                  headerBackImage: () => {""},
                  headerRight: () => (
                    <TouchableOpacity style={{marginRight: 15}} onPress={ () => { navigation.navigate('creategroupinfo')}}>
                      <Text style={{fontWeight: 'bold', color: '#42C2FF'}}>Tiếp tục</Text>
                    </TouchableOpacity>
                  )
                })}
              />
            </Stack.Group>      
      <Stack.Group screenOptions={{presentation: 'modal', headerTitle: "Cài đặt",  headerTitleStyle:{color: 'black', fontSize: 18}, headerTitleAlign:'center'}}>
        <Stack.Screen 
          name='settings'
          component={Settings} 
          options={{
            headerBackTitle: <Feather name="chevron-left" size={35} color="black" />,
            headerBackTitleVisible: true,
            headerBackTitleStyle: {
              color: 'black'
            },
            headerBackImage: () => {""},}}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal', headerShown: false}}>
        <Stack.Screen name="creategroupinfo" component={CreateGroupInfo} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
function UploadNewProfile() {
  return (
    <Stack.Navigator screenOptions={{headerStyle: {
        backgroundColor: 'white',
        shadowOpacity: 0,
        elevation: 0}, 
        headerTintColor: 'white',
      }
    }
    >
      <Stack.Group screenOptions={{headerShown: false}}>
        <Stack.Screen name='profile' component={Profile} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
function ConfirmMyEmail() {
  return (
    <Stack.Navigator screenOptions={{headerStyle: {
      backgroundColor: 'white',
      shadowOpacity: 0,
      elevation: 0}, 
      headerTintColor: 'white',
    }
  }
  >
    <Stack.Group screenOptions={{headerShown: false}}>
      <Stack.Screen name='confirmEmail' component={ConfirmEmail} />
    </Stack.Group>
  </Stack.Navigator>
  )
}
function MainNavigator(){
  const {isLoggedIn, profile} = useLogin();
  return (
    <>
    {!isLoggedIn ? <UnauthenticatedNavigator /> : (<>
      { profile ? (<><AuthenticatedNavigator /></>) : 
        (<>
          <UploadNewProfile />
        </>)}
      </>)}
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
function Home() {
  const navigation = useNavigation()
  return (
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            height: 100,
            backgroundColor:'white',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20
          },
          headerBackgroundContainerStyle:{
            backgroundColor: 'white'
          },
          tabBarHideOnKeyboard:true,
          headerTitleStyle:{
            color: 'black',
            fontSize: 25
          },
          
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 15,
            marginLeft: 15,
            marginRight: 15,
            backgroundColor: "white",
            borderRadius: 20,
            height: 65
          },
          headerLeft: props => (
            <TouchableOpacity onPress={() => {navigation.navigate('userinfo')}} style={{marginLeft: 15}}>
              <Avatar></Avatar>
            </TouchableOpacity>
          ),
          headerRight: () => (<>
            <View style={{flexDirection: 'row'}} >
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginRight: 15,  padding: 5}} onPress={() => {navigation.navigate('searchFriends')}}>
                <FontAwesome name="search" size={24} color="#42C2FF" />
              </TouchableOpacity>
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', marginRight: 15}} onPress={() => {navigation.navigate('creategroup')}}>
                <MaterialIcons name="groups" size={35} color="#42C2FF" />
              </TouchableOpacity>
            </View>
            </>
          )
      }
    }
    >
    <Tab.Screen 
        name="Đoạn chat" 
        component={Chats} 
        options={{ 
          tabBarBadge: "99+",
          tabBarBadgeStyle:{
            marginTop: 10,
          },
          tabBarIcon: ({focused}) => (
              <BottomTabNavigatorElement 
                name="message-circle"
                focused={focused}
                text='Đoạn chat'/>),
        }}
        />
        <Tab.Screen 
            name="Bạn bè" 
            component={Friends} 
            options={{ 
              tabBarIcon: ({focused}) => (
                <BottomTabNavigatorElement 
                  name="users"
                  focused={focused}
                  text='Bạn bè'/>)}} 
            />
    </Tab.Navigator>
  )
}
export default class Main extends React.Component{
  state = {
    isReady: false
  }

  render(){
    if (!this.state.isReady){
        return <AppLoading
          startAsync={this._loadingRresources}
          onFinish={() => this.setState({isReady : true})}
          onError={console.warn}>
        <Text>Hii</Text>
      </AppLoading>
    }
    return (
        <App/>
    ) ;
  } 
  async _loadingRresources() {
  }
}