import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useCallback, useEffect, useState }  from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, SafeAreaView} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { TextInput } from "react-native-gesture-handler";
import { AppLoadingAnimation } from "../../elements/AppLoadingAnimation";
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import baseurl from "../../env";
export default function ChangeBio({route, navigation}){
    const [bio, setBio] = useState('')
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [datetimevisible, setDatetimevisible] = useState(false)
    
    const [datetime, setDatetime] = useState(new Date())
    const onGengerOpen = useCallback(() => {
        setOpen(false)
        setCityopen(false)
    })
    const onOpen = useCallback(() =>{
        setGenderOpen(false)
        setCityopen(false)
    })
    const oncityOpen = useCallback(() => {
        setOpen(false)
        setGenderOpen(false)
    })
    const [genderItems, setgenderItems] = useState([
        {label: "Nam", value: "Nam"},
        {label: "Nữ", value: "Nữ"},
        {label: "Khác", value: "Khác"}
    ])
    const [genderOpen, setGenderOpen ]= useState(false);
    const [genderValue, setGenderValue] = useState(null)
    const [cityItems, setCityItems] = useState([]);
    const [cityvalue, setCityvalue] = useState(null)
    const [cityopen, setCityopen] = useState(false)
    const fetchSchool = async () => {
        setLoading(true)
        const school = await axios({
            method: 'get',
            url: `${baseurl}/school`
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.log(err)
        })
        
        if (school) setItems(school)
        setLoading(false)

    }
    const fetchCity = async () => {
        setLoading(true)
        const school = await axios({
            method: 'get',
            url: `${baseurl}/city`
        }).then((response) => {
            return response.data
        }).catch((err) => {
            console.log(err)
        })
        
        if (school) setCityItems(school)
        setLoading(false)
    }
    const fetchUserBio = async () => {
        setLoading(true)
        const email = await AsyncStorageLib.getItem('email')
        const token = await AsyncStorageLib.getItem('token')
        const user = await axios({
            method: 'get',
            url: `${baseurl}/user/mybio/${email}`,
            headers:{
                Authorization: token
            }
        }).then((response) => {
            console.log(response.data)
            return response.data
        }).catch((err) =>{
            console.log(err)
            return "none"
        })
        if (user !== "none"){
            if (user.intro) {
                setBio(user.intro)
            }
            if (user.school){
                setValue(user.school)
            }
            if (user.gender){
                setGenderValue(user.gender)
            }
            if (user.from) {
                setCityvalue(user.from)
            }
            if (user.birthDay) {
                setDatetime(new Date(user.birthDay))
            }
        }
        else {
            setDatetime(new Date())
        }
        setLoading(false)
    }
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0')
    }
    function pickedDate() {
        if (datetime){
            return [
                padTo2Digits(datetime.getDate()),
                padTo2Digits(datetime.getMonth() + 1),
                datetime.getFullYear()
            ].join('/')
        }
    }
    useEffect(() => {
        return fetchSchool()
    }, [])
    useEffect(() => {
        return fetchCity()
    }, [])
    useEffect(() => {
        return fetchUserBio()
    }, [])
    async function updatemyprofile(){
        setLoading(true)
        const token = await AsyncStorageLib.getItem('token')
        const email = await AsyncStorageLib.getItem('email')
        const result = await axios({
            method: 'put',
            url: `${baseurl}/user/updatemybio/${email}`,
            data: {
                intro: bio,
                school: value,
                from: cityvalue,
                gender: genderValue,
                birthDay: datetime
            },
            headers:{
                Authorization: token
            }
        }).then((response) => {
            if (response.data === "ok") {
                Alert.alert('Thành công', 'Cập nhật thành công !', [
                    { text: 'OK', onPress: () => {} },
                ]);
            }
        })
        setLoading(false)
    }
    return (
        <>
        {loading ? (
            <View style={{backgroundColor: 'red', flex: 1}}>
                <AppLoadingAnimation>
                </AppLoadingAnimation>
        </View>) : (
            <View style={{backgroundColor: 'white', flex: 1}}>
                <View snapToEnd={true}>
                    <View style={{ alignItems: 'center', marginLeft: 20, flexDirection: 'row'}}>
                        <Ionicons name="information-circle" size={20} color="#42C2FF" />
                        <Text style={{color: "#42C2FF", fontWeight:'bold'}}>
                            &nbsp;Lời giới thiệu
                        </Text>
                    </View>
                    <TextInput
                        value={bio}
                        onChangeText={(text) => {setBio(text)}}
                        multiline={true}
                        numberOfLines={3}
                        placeholder="Thêm giới thiệu bản thân"
                        style={{
                            marginLeft: 15,
                            marginRight: 15,
                            marginTop: 15,
                            backgroundColor: "#eeeeee",
                            borderRadius: 20,
                            padding: 10,
                            textAlignVertical: 'top'
                        }}
                    >
                    </TextInput>
                    
                    <View>
                        <View style={{ alignItems: 'center', marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                            <Ionicons name="school" size={20} color="#42C2FF" />
                        <Text style={{color: "#42C2FF", fontWeight:'bold'}}>
                            &nbsp;Trường đại học
                        </Text>
                    </View>
                        <DropDownPicker 
                            onOpen={onOpen}
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            style={{
                                borderWidth: 1,
                                marginTop: 15,
                                marginLeft: 15,
                                marginRight: 15,
                                width: '92.5%',
                                borderRadius: 20,
                                alignSelf: 'center',
                                zIndex: 2,
                                borderColor: "grey"
                            }}
                            placeholder="Trường Đại học"
                            ListEmptyComponent={({
                                listMessageContainerStyle, listMessageTextStyle, ActivityIndicatorComponent, loading, message
                            }) => (
                                <View style={listMessageContainerStyle}>
                                {loading ? (
                                    <ActivityIndicatorComponent />
                                ) : (
                                    <Text style={listMessageTextStyle}>
                                    Không có kết quả
                                    </Text>
                                )}
                                </View>
                            )}
                            searchable={true}
                            dropDownContainerStyle={{
                                borderWidth: 1,
                                marginTop: 15,
                                width: '92.5%',
                                alignSelf: 'center',
                                borderRadius: 20,
                                borderColor: "grey"
                            }}
                            searchPlaceholder="Tìm kiếm"
                            searchTextInputStyle={{borderWidth: 0.25, borderRadius: 20}}
                            searchContainerStyle={{borderWidth: 0}}
                        />
                    </View>
                    <View>
                        <View style={{ alignItems: 'center', marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                            <Ionicons name="location" size={20} color="#42C2FF" />
                            <Text style={{color: "#42C2FF", fontWeight:'bold'}}>
                                &nbsp;Đến từ
                            </Text>
                        </View>
                        <DropDownPicker 
                            onOpen={oncityOpen}
                            open={cityopen}
                            value={cityvalue}
                            items={cityItems}
                            setOpen={setCityopen}
                            setValue={setCityvalue}
                            setItems={setCityItems}
                            style={{
                                borderWidth: 1,
                                marginTop: 15,
                                marginLeft: 15,
                                marginRight: 15,
                                width: '92.5%',
                                borderRadius: 20,
                                alignSelf: 'center',
                                borderColor: "grey",
                                zIndex: 1
                            }}
                            placeholder="Chọn thành phố"
                            ListEmptyComponent={({
                                listMessageContainerStyle, listMessageTextStyle, ActivityIndicatorComponent, loading, message
                            }) => (
                                <View style={listMessageContainerStyle}>
                                {loading ? (
                                    <ActivityIndicatorComponent />
                                ) : (
                                    <Text style={listMessageTextStyle}>
                                    Không có kết quả
                                    </Text>
                                )}
                                </View>
                            )}
                            searchable={true}
                            dropDownContainerStyle={{
                                borderWidth: 1,
                                marginTop: 15,
                                width: '92.5%',
                                alignSelf: 'center',
                                borderRadius: 20,
                                borderColor: "grey"
                            }}
                            searchPlaceholder="Tìm kiếm"
                            searchTextInputStyle={{borderWidth: 0.25, borderRadius: 20}}
                            searchContainerStyle={{borderWidth: 0}}
                        />
                    </View>
                    <View>
                        <View style={{ alignItems: 'center', marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                            <FontAwesome5 name="genderless" size={24} color="#42C2FF" />
                            <Text style={{color: "#42C2FF", fontWeight:'bold'}}>
                                &nbsp;Giới tính
                            </Text>
                        </View>
                        <DropDownPicker 
                            onOpen={onGengerOpen}
                            open={genderOpen}
                            value={genderValue}
                            items={genderItems}
                            setOpen={setGenderOpen}
                            setValue={setGenderValue}
                            setItems={setgenderItems}
                            style={{
                                borderWidth: 1,
                                marginTop: 15,
                                marginLeft: 15,
                                marginRight: 15,
                                width: '92.5%',
                                borderRadius: 20,
                                alignSelf: 'center',
                                borderColor: "grey",
                                zIndex: 1
                            }}
                            placeholder="Giới tính"
                            ListEmptyComponent={({
                                listMessageContainerStyle, listMessageTextStyle, ActivityIndicatorComponent, loading, message
                            }) => (
                                <View style={listMessageContainerStyle}>
                                {loading ? (
                                    <ActivityIndicatorComponent />
                                ) : (
                                    <Text style={listMessageTextStyle}>
                                    Không có kết quả
                                    </Text>
                                )}
                                </View>
                            )}
                            dropDownContainerStyle={{
                                borderWidth: 1,
                                marginTop: 15,
                                width: '92.5%',
                                alignSelf: 'center',
                                borderRadius: 20,
                                borderColor: "grey"
                            }}
                        />
                    </View>
                    <View>
                        <View style={{ alignItems: 'center', marginLeft: 20, marginTop: 20, flexDirection: 'row'}}>
                            <Ionicons name="calendar" size={20} color="#42C2FF" />
                            <Text style={{color: "#42C2FF", fontWeight:'bold'}}>
                                &nbsp;Ngày sinh
                            </Text>
                        </View>
                            <TouchableOpacity style={{
                                borderWidth: 1, 
                                borderColor: "grey", 
                                marginLeft: 17.5, 
                                marginRight: 17.5, 
                                marginTop: 15, 
                                width: '92.5%', 
                                paddingTop: 14, 
                                paddingBottom: 14,
                                alignSelf:'center',
                                borderRadius: 20, 
                                paddingLeft: 10}}
                                onPress={() => {setDatetimevisible(true)}}>
                            <Text>{pickedDate()}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={datetimevisible}
                            mode="date"
                            onCancel={() => {
                                setDatetimevisible(false)
                            }}
                            onConfirm={(date) => {
                                setDatetime(date)
                                setDatetimevisible(false)
                            }}
                            date={datetime}
                        >
                        </DateTimePickerModal>
                    </View>
                
                    <View style={{flexDirection:'row', justifyContent:'center', marginTop: 10}}>
                        <TouchableOpacity 
                            style={{
                                width: '42%',
                                backgroundColor: "#42C2FF", 
                                margin: '2%', 
                                padding: 10, 
                                borderRadius: 20
                            }} 
                            onPress={() => {updatemyprofile()}}
                            >
                            <Text style={{textAlign: 'center' ,fontSize: 16, fontWeight: 'bold', color:'white'}}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
            )}
        </>
    )
}