import React, { useContext, useEffect, useState } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { menuContext } from '../../contexts/MenuContext';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { learnContext } from '../../contexts/LearnContext';
import { colors } from '../../utils/color';

const FormListGate = () => {
    const { menuData, menuHandler } = useContext(menuContext);
    const { width } = Dimensions.get('window');
    const [translateX] = useState(new Animated.Value(menuData.displayListGate === true ? 0 : width));
    const { learnHandler, learnData } = useContext(learnContext)

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: menuData.displayListGate === true ? 0 : width,
            duration: 300, // Thời gian animation (ms)
            useNativeDriver: true, // Sử dụng Native Driver cho hiệu suất tốt hơn
        }).start();
    }, [menuData.displayListGate]);


    return (
        <Animated.View
            style={{
                transform: [{ translateX }],
                position: 'absolute',
                height: '100%',
                width: '100%', // Sử dụng chiều rộng của màn hình
                backgroundColor: 'white',
                zIndex: 3,
                top: 0,
                flexDirection: 'column',
                // alignItems: 'center',
                gap: 20,
                right: 0,
            }}
        >
            <View style={{ position: 'absolute', right: 15, top: 30, zIndex: 1 }}>
                <TouchableOpacity onPress={() => menuHandler.setDisplayListGate(false)}>
                    <Icon name="x" style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 50 }}>
                {learnData.gates.map((gate, index) => (
                    <TouchableOpacity onPress={() => {
                        learnHandler.setCurrentGate(gate)
                        setTimeout(() => {
                            menuHandler.setDisplayListGate(false)
                        }, 1000);
                    }} key={index} style={{ width: '46%', justifyContent: 'center', alignItems: 'center', gap: 5, backgroundColor: colors[index], flexDirection: 'column', paddingBottom: 5, borderRadius: 8, height: 80, marginLeft: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 600 }}>Level {gate.level}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 600 }}>{gate.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    )
}

export default FormListGate