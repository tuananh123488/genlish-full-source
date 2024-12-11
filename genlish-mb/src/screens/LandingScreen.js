import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Image, ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { menuContext } from '../contexts/MenuContext';
import { payloadContext } from '../contexts/PayloadContext';
import { userContext } from '../contexts/UserContext';
import Logo from '../components/Logo';
import Couple from '../../assets/couple.png'
import Book from '../../assets/book.png'
import Hat from '../../assets/hat.png'

const LandingScreen = () => {
    const { width } = Dimensions.get('window');
    const { menuHandler } = useContext(menuContext)
    const { payloadHandler } = useContext(payloadContext)
    const { userData } = useContext(userContext)

    return (
        <ScrollView>
            {/* {screenData.currentScreen === 1 && ( */}
            <View style={{ flexWrap: 'wrap', flexDirection: 'column', width, gap: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <Logo />
                    <Text style={{ fontSize: 15, marginBottom: 5 }}>Ngôn ngữ: Tiếng Việt</Text>
                </View>
                <View style={{ flexDirection: 'column', gap: 10, width: '100%', alignItems: 'center' }}>
                    <Image source={Couple} style={{ width: '90%', height: 280 }} />
                    <Text style={{ fontSize: 20, paddingHorizontal: 30, lineHeight: 25, textAlign: 'center', fontWeight: 600, marginVertical: 10 }}>Cách học tiếng Anh miễn phí, vui nhộn, và hiệu quả</Text>
                    <TouchableOpacity onPress={() => {
                        menuHandler.setDisplaySignUp(true)
                    }} style={{ backgroundColor: '#149dff', width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Bắt Đầu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        menuHandler.setDisplaySignIn(true)
                    }} style={{ backgroundColor: '#ecf0f1', width: '80%', flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 }}>
                        <Text style={{ color: '#149dff', fontSize: 17 }}>Tôi Đã Có Tài Khoản</Text>
                    </TouchableOpacity>
                    <View style={{ borderRadius: 10, flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center', width: '100%', backgroundColor: '#4dac96', marginTop: 10 }}>
                        <Image source={Book} style={{ height: 130, width: 130 }} />
                        <View style={{ flexDirection: 'column', width: 200 }}>
                            <Text style={{ color: 'white', fontWeight: 600, fontSize: 17, lineHeight: 22 }}>Accumulate knowledge and skills that will help you succeed in the future.</Text>
                        </View>
                    </View>
                    <View style={{ borderRadius: 10, flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center', width: '100%', marginTop: 20 }}>
                        <View style={{ flexDirection: 'column', width: 170 }}>
                            <Text style={{ color: 'black', fontWeight: 600, fontSize: 17, lineHeight: 22 }}>We must actively study and supplement knowledge and skills every day.</Text>
                        </View>
                        <Image source={Hat} style={{ height: 80, width: 130 }} />
                    </View>
                </View>
            </View>
            {/* )} */}
        </ScrollView>
    )
}

export default LandingScreen