import React from "react";
import { View,Text, TouchableOpacity, Image } from "react-native";
export default function FriendsAvatar({Width, Height, Img, Type = false}) {
    return (
          <View>
            {!Type  ? (<>
                <Image
                    source={Img === "none" ? require('../assets/user_no_avatar.jpg') : {uri: Img}}
                    style={{
                            width: !Width ? 45 : Width, 
                            height: !Height ? 45 : Height,
                            borderRadius: 200
                        }}
                        resizeMethod="auto">
                </Image></>) : (<>
                        <Image
                            source={Img === "none" ? require('../assets/user_no_avatar.jpg') : {uri: Img}}
                            style={{width: !Width ? 45 : Width, 
                            height: !Height ? 45 : Height,
                            borderRadius: 200
                        }}
                        resizeMethod="auto">
                </Image>
            </>)}
         
        </View>
    )
}