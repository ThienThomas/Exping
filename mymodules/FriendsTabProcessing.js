

import AsyncStorageLib from "@react-native-async-storage/async-storage";
import axios from "axios";
import { nanoid } from "nanoid";
import baseurl from "../env";
export async function sendingMyRequest(item) {
  const token = await AsyncStorageLib.getItem('token')
  const email = await AsyncStorageLib.getItem('email')
  console.log(email)
  console.log(item['email'])
  await axios({
    method: 'post',
    url: `${baseurl}/user/sendingrequest`,
    headers: {
      Authorization: token,
      email: email
    },
    data: {
      fremail: item['email']
    }
  }).then((response) => {
    console.log(response.data)
  }).catch((error) => {
    console.log(error.response.data.message)
  })
}
export async function acceptRequest(item){
  const token = await AsyncStorageLib.getItem('token')
  const email = await AsyncStorageLib.getItem('email')
  console.log(email)
  console.log(item['email'])
  await axios({
    method: 'post',
    url: `${baseurl}/user/acceptrequest`,
    headers: {
      Authorization: token,
      email: email
    },
    data: {
      fremail: item['email']
    }
  }).then((response) => {
    console.log(response.data)
  }).catch((error) => {
    console.log(error.response.data.message)
  })
}
export async function revokeRequest(item) {
  const token = await AsyncStorageLib.getItem('token')
  const email = await AsyncStorageLib.getItem('email')
  console.log(email)
  console.log(item['email'])
  await axios({
    method: 'post',
    url: `${baseurl}/user/revokerequest`,
    headers: {
      Authorization: token,
      email: email
    },
    data: {
      fremail: item['email']
    }
  }).then((response) => {
    console.log(response.data)
  }).catch((error) => {
    console.log(error.response.data.message)
  })
};
export async function denyRequest(item) {
  const token = await AsyncStorageLib.getItem('token')
  const email = await AsyncStorageLib.getItem('email')
  console.log(email)
  console.log(item['email'])
  await axios({
    method: 'post',
    url: `${baseurl}/user/denyrequest`,
    headers: {
      Authorization: token,
      email: email 
    },
    data: {
      fremail: item['email']
    }
  }).then((response) => {
    console.log(response.data)
  }).catch((error) => {
    console.log(error.response.data.message)
  })
};
export async function unfriend(item) {
  
}