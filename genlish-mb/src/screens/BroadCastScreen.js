import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { menuContext } from '../contexts/MenuContext';
import { payloadContext } from '../contexts/PayloadContext';
import { userContext } from '../contexts/UserContext';
import { api, TypeHTTP } from '../utils/api';
import { Image } from 'react-native';

const BroadCastScreen = () => {
    const { width } = Dimensions.get('window');
    const { menuHandler } = useContext(menuContext)
    const { payloadHandler } = useContext(payloadContext)
    const { userData } = useContext(userContext)
    const [broadcasts, setBroadCasts] = useState([])

    useEffect(() => {
        api({ type: TypeHTTP.GET, path: '/broadcast/get-all', sendToken: false })
            .then(broadcasts => setBroadCasts(broadcasts))
    }, [])

    return (
        <ScrollView>
            {/* {screenData.currentScreen === 1 && ( */}
            <View style={{ flexWrap: 'wrap', flexDirection: 'column', width, gap: 10, paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text style={{ fontSize: 22, fontWeight: 600 }}>BroadCasts</Text>
                <View style={{ flexDirection: 'row', gap: 10, position: 'relative', flexWrap: 'wrap', justifyContent: 'space-evenly', width: '100%' }}>
                    {broadcasts.map((broadcast, index) => (
                        <TouchableOpacity onPress={() => {
                            payloadHandler.setCurrentBroadCast(broadcast)
                            menuHandler.setDisplayDetailBroadCast(true)
                        }} key={index} style={{ width: '48%', gap: 5, backgroundColor: '#f2f3f4', flexDirection: 'column', paddingBottom: 5, borderRadius: 8 }}>
                            <Image source={{ uri: broadcast.thum }} style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 8 }} />
                            <Text style={{ fontSize: 13, fontWeight: 600, paddingHorizontal: 5, color: '#3b3b3b' }}>{broadcast.title}</Text>
                            <Text style={{ fontSize: 13, fontWeight: 400, paddingHorizontal: 5, color: '#3b3b3b' }}>{broadcast.duration}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {/* )} */}
        </ScrollView>
    )
}

export default BroadCastScreen