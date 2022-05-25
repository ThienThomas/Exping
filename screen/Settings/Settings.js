import { Header } from "@react-navigation/stack";
import { View, Text, Image, StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Feather,Entypo, MaterialCommunityIcons, FontAwesome, MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import Avatar from "../../elements/Avatar";
import { useNavigation } from "@react-navigation/native";
const styles = StyleSheet.create({
    viewcontent: {
        backgroundColor: 'white', 
    },
})
export function MiniComponent({label, iconanme, color, size}){
    return (
        <View
            style={{
                alignItems: 'center',
                flexDirection:'row', 
                flexWrap:'wrap',
                marginTop: 20}}>
            <MaterialIcons 
                name={iconanme}
                size={!size ? 24 : size} 
                color="white"
                style={{
                    padding: 8,
                    borderRadius: 100,
                     justifyContent: 'center',
                     alignItems: 'center',
                     width: 40,
                     height: 40,
                     backgroundColor: color
                }} 
                />
            <Text
                style={{
                fontSize: 18,
                color: 'black',
                paddingLeft: 5}}>
                &nbsp;&nbsp;{label}
            </Text>    
        </View>
    )
}
export default function Settings({route}){
    const {userinfo} = route.params
    const navigation = useNavigation()
    return (
        <View style={{flex: 1, backgroundColor: "white"}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Avatar Width={100} Height={100}></Avatar>
            <Text style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', fontSize: 24,marginTop: 15, marginBottom: 15, fontWeight: 'bold'}}>{userinfo.displayName}</Text>
          </View>
          <View style={{flex: 1, marginLeft: 20}}>
              <TouchableOpacity onPress={() => {navigation.navigate('recredential')}}>
                <MiniComponent iconanme="supervisor-account" label="Tài khoản" color="green"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {navigation.navigate('notif')}}>
                <MiniComponent iconanme="notifications" label="Thông báo" color="#FF7474"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {navigation.navigate('darkmode')}} >
                <MiniComponent iconanme="wb-sunny" label="Chế độ tối" color="black"/>
              </TouchableOpacity >
          </View>
        </View>
    )
}
