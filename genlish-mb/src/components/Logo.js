import React from 'react'
import { Image, Text, View } from 'react-native'
import LogoImage from '../../assets/logo.png'

const Logo = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
            <Image source={LogoImage} style={{ width: 35, height: 50 }} />
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>GenLish</Text>
        </View>
    )
}

export default Logo