import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import AnimatedLottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { checkmyOTP } from '../../function/auth';
import { AppLoadingAnimation } from '../../elements/AppLoadingAnimation';
const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#42C2FF",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 3.5,
    color: "black",
    fontWeight: 'bold',
    fontSize: 20
  },

  underlineStyleHighLighted: {
    borderColor: "black",
  },
});
export default function OtpInput({route}) {
  const email = route.params.email
  const [isloading, setIsloading] = useState(false)
  const navigation = useNavigation()
  async function checkOTP(code) {
    setIsloading(true)
    const result = await checkmyOTP(email, code)
    if (result === 'checked') {
      Alert.alert('Thành công', 'Đã xác thực mã OTP !', [
        { text: 'OK', onPress: () => navigation.navigate('resetpass', {email: email}) },
      ]);
    }
    else if (result === 'expired'){
      Alert.alert('Mã OTP đã hết hiệu lực', 'Bạn vui lòng yêu cầu đặt lại mật khẩu một lần nữa nhé !', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
    else {
      Alert.alert('Có lỗi xảy ra', 'Bạn vui lòng thử lại sau !', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
    setIsloading(false)
  }
  
  return (
    <>
    {isloading ? (<>
      <AppLoadingAnimation></AppLoadingAnimation>
    </>) : (<>
    <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems :'center'}}>
        <OTPInputView
          style={{width: '80%', height: 75}}
          pinCount={6}
          // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          // onCodeChanged = {code => { this.setState({code})}}
          autoFocusOnLoad ={true}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled = {async (code) => await checkOTP(code)}
      />
      <View  style={{flex: 0.5, height: '100%', width: '100%'}}>
        <AnimatedLottieView source={require('../../assets/json/email.json')} speed={0.5} autoPlay loop />
      </View>
      <View style={{marginTop: 10}}>
        <Text style={{fontWeight: 'bold'}}>Nhập mã OTP đã được gửi vào email của bạn</Text>
      </View>
    </View>
    </>)}
    </>
  )
}