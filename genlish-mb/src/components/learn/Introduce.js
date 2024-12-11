import React, { useContext } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { mainColor } from '../../utils/color'
import { menuContext } from '../../contexts/MenuContext'

const Introduce = ({ door }) => {

    const { menuHandler } = useContext(menuContext)

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: door?.individual?.color, width: '100%', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <TouchableOpacity onPress={() => menuHandler.setDisplayListGate(true)}>
                        <Icon name='arrowleft' style={{ fontSize: 30, color: 'white' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 17, fontWeight: 600, color: 'white' }}>{door?.gate?.title}, Cửa {door?.individual?.door}</Text>
                </View>
                <Text style={{ marginLeft: 35, fontSize: 18, fontWeight: 600, color: 'white' }}>{door?.individual?.title}</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: 'white', width: 100, flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, borderRadius: 12 }}>
                <Text style={{ color: mainColor, fontSize: 17, fontWeight: 600 }}>Chi Tiết</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Introduce