import axios from "axios";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import baseurl from "../env";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

export async function compressImage(image){
    return await manipulateAsync(
        image.localUri || image.uri,
        [{resize: {width: image.width * 0.7, height: image.height * 0.7}}],
        {
            compress: 0.5, format: SaveFormat.JPEG
        }
    )
}

export async function UploadAvatar(email, token, image){
    var bodyFormData = new FormData() 
    //console.log(image.uri.slice(0, 5) + image.uri.slice(6))
    bodyFormData.append('file',{
        uri: image.uri,
        name:`${email}.jpg`,
        type:'image/jpg'
    })
    const result = await axios({
        method:'post',
        url: `${baseurl}/user/avatar/upload`,
        headers: {
            Authorization: token,
            email: email,
            Accept: '*/*',
            'Content-Type': 'multipart/form-data',
        },
        data: bodyFormData
    }).then((response) => {
       //console.log("1=>", response.data)
        return response.data
    }).catch((error) =>{
        console.log(error.response)
        return "none"
    })
    return result
}
export async  function FunctionUpdateAvatar(token, email, image){
    const compressedImage = await compressImage(image)
    //console.log(compressedImage)
    console.log(token)
    const result = await UploadAvatar(email, token, compressedImage)
    if (result){
        const uploaded = await axios({
            method: 'post',
            url: `${baseurl}/user/avatar/update`,
            headers: {
                Authorization: token,
                email: email
            },
            data:{
                url: result
            }
        }).then((response) =>{
            return response.data
        }).catch((err) => {
            return null
        })
        return uploaded
    }
    return null
}
export async function RemoveAvatar(){
    const token = await AsyncStorageLib.getItem('token');
    const email = await AsyncStorageLib.getItem('email');
    if (token){
        const result = await axios({
            method: 'post',
            headers: {
                Authorization: token,
                email: email
            },
            url: `${baseurl}/user/avatar/remove`,
        }).then((respone) => {
            console.log(respone.data)
        }).catch((error) =>{
            console.log(error)
        })
    }
}
export async function SendImgMess(token, email, fremail, image){
    if (token) {
        const mess = {
            participants :  email > fremail ? [email, fremail] : [fremail, email],
            sentBy: email,
            sendTo: fremail,
            createdAt: new Date(),
            type: 'image'
        }
        let formData = new FormData()
        formData.append('image' ,{
            uri: image.uri,
            name:`${email + fremail}.jpg`,
            type:'image/jpg'
        })
        formData.append('data', JSON.stringify(mess))
        const uploaded = await axios({
            method: 'post',
            url: `${baseurl}/message/sendimagemess`,
            headers: {
                Authorization: token,
                Accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
            data: formData
        }).then((response) =>{
            console.log(response.data)
        }).catch((err) => {
            console.log(err.response)
        })
    }
}
export async function SendVidMess(token, email, fremail, video){
    if (token) {
        const mess = {
            participants :  email > fremail ? [email, fremail] : [fremail, email],
            sentBy: email,
            sendTo: fremail,
            createdAt: new Date(),
            type: 'video'
        }
        let formData = new FormData()
        formData.append('video' ,{
            uri: video.uri,
            name:`${email + fremail}.mp4`,
            type:'video/mp4'
        })
        formData.append('data', JSON.stringify(mess))
        const uploaded = await axios({
            method: 'post',
            url: `${baseurl}/message/sendvideomess`,
            headers: {
                Authorization: token,
                Accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
            data: formData
        }).then((response) =>{
            console.log(response.data)
        }).catch((err) => {
            console.log(err.response)
        })
    }
}
export async function SendFileMess(token, email, fremail, file, ext){
    if (token) {
        console.log(new Date())
        const mess = {
            participants: email > fremail ? [email, fremail] : [fremail, email],
            sentBy: email,
            sendTo: fremail,
            createdAt: new Date(),
            type: "document",
            attachmentname: file.name
        }
        let formData = new FormData()
        formData.append('file' ,{
            uri: file.uri,
            name:`${email + fremail}`,
            type: `application/${ext}`
        })
        formData.append('data', JSON.stringify(mess))
        const uploaded = await axios({
            method: 'post',
            url: `${baseurl}/message/senddocmess`,
            headers: {
                Authorization: token,
                Accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
            data: formData
        }).then((response) =>{
            console.log(response.data)
        }).catch((err) => {
            console.log(err.response)
        })
    }
}
export async function SendAudioMess(token, email, fremail, file){
 
        if (token) {
            console.log(new Date())
            const mess = {
                participants: email > fremail ? [email, fremail] : [fremail, email],
                sentBy: email,
                sendTo: fremail,
                createdAt: new Date(),
                type: "audio",
            }
            let formData = new FormData()
            formData.append('audio' ,{
                uri: file,
                name:`${email + fremail}`,
                type:'audio/mp3'
            })
            formData.append('data', JSON.stringify(mess))
            const uploaded = await axios({
                method: 'post',
                url: `${baseurl}/message/sendaudiomess`,
                headers: {
                    Authorization: token,
                    Accept: '*/*',
                    'Content-Type': 'multipart/form-data',
                },
                data: formData
            }).then((response) =>{
                console.log(response.data)
            }).catch((err) => {
                console.log(err.response)
            })
        }
}
export async function sendGif(token, email, fremail, gif){
    if (token) {
        const result = await axios({
            method: 'post',
            headers: {
                Authorization: token
            },
            data: {
                participants: email > fremail ? [email, fremail] : [fremail, email],
                sendTo: fremail,
                sentBy: email,
                gif: gif.images.original.url,
                type: "gif"
            },
            url: `${baseurl}/message/sendgifmessage`
        }).then((response) => {
            console.log(response.data)
        }).catch((err) => {
            console.log(err.respone)
        })
    }
}
export async function getImageList(fremail) {
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token) {
        const result = await axios({
            method: 'get',
            headers: {
                Authorization: token
            },
            url: `${baseurl}/message/getimagelist/${email}/${fremail}`
        }).then((respone) =>{
            return respone.data
        }).catch((err) =>{
            console.log(err)
            return []
        })
        return result
    }
}
export async function getVidList(fremail) {
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token) {
        const result = await axios({
            method: 'get',
            headers: {
                Authorization: token
            },
            url: `${baseurl}/message/getvideolist/${email}/${fremail}`
        }).then((respone) =>{
            return respone.data
        }).catch((err) =>{
            console.log(err)
            return []
        })
        return result
    }
}
export async function getDocList(fremail) {
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token) {
        const result = await axios({
            method: 'get',
            headers: {
                Authorization: token
            },
            url: `${baseurl}/message/getdoclist/${email}/${fremail}`
        }).then((respone) =>{
            return respone.data
        }).catch((err) =>{
            console.log(err)
            return []
        })
        return result
    }
}
export async function getallfriends(){
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    const result = await axios({
        method: 'get',
        headers: {
            Authorization: token
        },
        url: `${baseurl}/user/getallfriends/${email}`
    }).then((response) =>{
        return response.data
    }).catch((err) => {
        console.log(err)
        return []
    })
    return result
}
export async function CreateGRoup(users, displayName, image){
        const token = await AsyncStorageLib.getItem('token')
        const email = await AsyncStorageLib.getItem('email')
        console.log(users)
        let formData = new FormData()
        console.log(image)
        if (image !== "none"){
            formData.append('avatar', {
                uri: image,
                name:`${displayName}.jpg`,
                type:'image/jpg'
            })
        }
        console.log(image)
        let arr = users
        //arr.push(email)
        const data = {
            participants: arr,
            displayName: displayName,
            email: email
        }
        console.log(JSON.stringify(data))
        formData.append('data', JSON.stringify(data))
        const result = await axios({
            method: 'post',
            headers: {
                Authorization: token,
                email: email,
                Accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
            url: `${baseurl}/group/creategroupinfo`
        }).then((response) => {
            console.log(response.data)
            return response.data
        }).catch((err) => {
            console.log(err.response)
            return "fail"
        })
        return result
}
export async function GetallGroupMess(){
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token) {
      const messages = await axios({
          method: 'get',
          headers: {
              Authorization: token,
          },
          url: `${baseurl}/group/getallmess/${email}`
      }).then((response)=> {
          //console.log(response.data)
          return response.data
      }).catch((error) => {
          //console.log(error)
          return []
      })
      return messages           
    }
    return []
}
export async function GetGroupMessages(groupid){
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token){
        const messages = await axios({
            method: 'get',
            url: `${baseurl}/group/getmessages/${groupid}`,
            headers: {
                Authorization: token
            }
        }).then((response) => {
           // console.log(response.data)
            return response.data
        }).catch((err) => {
            //console.log(err)
            return []
        })
        return messages
    }
}
///////----------------
export async function SendImgMessGroup(groupid, image){
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token) {
        const mess = {
            groupid: groupid,
            sentBy: email,
            createdAt: new Date(),
        }
        let formData = new FormData()
        formData.append('file' ,{
            uri: image.uri,
            name:`${email + groupid + mess.createdAt}.jpg`,
            type:'image/jpg' 
        })
        formData.append('data', JSON.stringify(mess))
        const uploaded = await axios({
            method: 'post',
            url: `${baseurl}/group/sendimgmess`,
            headers: {
                Authorization: token,
                Accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
            data: formData
        }).then((response) =>{
            console.log(response.data)
        }).catch((err) => {
            console.log(err.response)
        })
    }
}
export async function SendVidMessGroup(groupid, video){
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token) {
        const mess = {
            groupid: groupid,
            sentBy: email,
            createdAt: new Date(),
        }
        let formData = new FormData()
        formData.append('file' ,{
            uri: video.uri,
            name:`${email + groupid + mess.createdAt}.mp4`,
            type:'video/mp4' 
        })
        formData.append('data', JSON.stringify(mess))
        console.log(formData)
        const uploaded = await axios({
            method: 'post',
            url: `${baseurl}/group/sendvidmess`,
            headers: {
                Authorization: token,
                Accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
            data: formData
        }).then((response) =>{
            console.log(response.data)
        }).catch((err) => {
            console.log(err.response)
        })
    }
}
export async function SendFileMessGroup(groupid, file, ext){
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token) {
        console.log(new Date())
        const mess = {
            groupid: groupid,
            sentBy: email,
            createdAt: new Date(),
            type: "document",
            attachmentname: file.name
        }
        let formData = new FormData()
        formData.append('file' ,{
            uri: file.uri,
            name:`${email + groupid}`,
            type:`application/${ext}`
        })
        formData.append('data', JSON.stringify(mess))
        const uploaded = await axios({
            method: 'post',
            url: `${baseurl}/group/senddocmess`,
            headers: {
                Authorization: token,
                Accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
            data: formData
        }).then((response) =>{
            console.log(response.data)
        }).catch((err) => {
            console.log(err.response)
        })
    }
}
export async function SendAudioMessGroup(groupid, file){
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token) {
        console.log(new Date())
        const mess = {
            sentBy: email,
            groupid: groupid,
            createdAt: new Date(),
            type: "audio",
        }
        let formData = new FormData()
        formData.append('file' ,{
            uri: file,
            name:`${email + groupid}`,
            type:'audio/mp3'
        })
        formData.append('data', JSON.stringify(mess))
        const uploaded = await axios({
            method: 'post',
            url: `${baseurl}/group/sendaudiomess`,
            headers: {
                Authorization: token,
                Accept: '*/*',
                'Content-Type': 'multipart/form-data',
            },
            data: formData
        }).then((response) =>{
            console.log(response.data)
        }).catch((err) => {
            console.log(err.response)
        })
    }
}
export async function sendGifGroup(groupid, file){
    console.log(file.images.original.url)
    const token = await AsyncStorageLib.getItem('token')
    const email = await AsyncStorageLib.getItem('email')
    if (token) {
        const result = await axios({
            method: 'post',
            headers: {
                Authorization: token
            },
            data: {
                groupid: groupid,
                sentBy: email,
                gif: file.images.original.url,
                createdAt: new Date()
            },
            url: `${baseurl}/group/sendgifmessage`
        }).then((response) => {
            console.log(response.data)
        }).catch((err) => {
            console.log(err.respone)
        })
    }
}
export async function getImageListGroup(groupid) {
    const token = await AsyncStorageLib.getItem('token')
    if (token) {
        const result = await axios({
            method:'get',
            url: `${baseurl}/group/getimagelist/${groupid}`,
            headers: {
                Authorization: token
            }
        }).then((respone) => {
            return respone.data
        }).catch((err) => {
            return []
        })
        return result
    }
}
export async function getVidListGroup(groupid){
    const token = await AsyncStorageLib.getItem('token')
    if (token) {
        const result = await axios({
            method:'get',
            url: `${baseurl}/group/getvideolist/${groupid}`,
            headers: {
                Authorization: token
            }
        }).then((respone) => {
            return respone.data
        }).catch((err) => {
            return []
        })
        return result
    }
}
export async function getDocListGroup(groupid){
    const token = await AsyncStorageLib.getItem('token')
    if (token) {
        const result = await axios({
            method:'get',
            url: `${baseurl}/group/getdoclist/${groupid}`,
            headers: {
                Authorization: token
            }
        }).then((respone) => {
            return respone.data
        }).catch((err) => {
            return []
        })
        return result
    }
}