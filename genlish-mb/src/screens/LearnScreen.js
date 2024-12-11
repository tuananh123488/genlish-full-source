import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, ImageBackground, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { menuContext } from '../contexts/MenuContext';
import { payloadContext } from '../contexts/PayloadContext';
import { userContext } from '../contexts/UserContext';
import { learnContext } from '../contexts/LearnContext';
import Gate from '../components/learn/Gate';

const LearnScreen = () => {
    const { width, height } = Dimensions.get('window');
    const { menuHandler } = useContext(menuContext)
    const { payloadHandler } = useContext(payloadContext)
    const { learnData, learnHandler } = useContext(learnContext)
    const { userData } = useContext(userContext)
    const [top, setTop] = useState(0)

    return (
        <ScrollView>
            {/* {screenData.currentScreen === 1 && ( */}
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width, gap: 20, paddingHorizontal: 20, paddingVertical: 10 }}>
                {learnData.doors.length > 0 ? learnData.doors.map((door, index) => (
                    <Gate key={index} door={door} setTop={setTop} />
                ))
                    : (
                        <View style={{ flexDirection: 'column', gap: 10, height: height - 70, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18 }}>Hiện Chưa Có Bài Học Cho Chương Này</Text>
                            <TouchableOpacity onPress={() => {
                                menuHandler.setDisplayListGate(true)
                            }}>
                                <Text style={{ fontSize: 17, fontWeight: 600 }}>Trở Về</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
            {/* )} */}
        </ScrollView>
    )
}

export default LearnScreen