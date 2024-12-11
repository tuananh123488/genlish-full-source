import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { mainColor } from '../../utils/color';
import { practiceContext } from '../../contexts/PracticeContext';

const Processing = ({ process, total }) => {

    const { width } = Dimensions.get('window');
    const [processing, setProcessing] = useState(0)
    const { practiceData } = useContext(practiceContext)

    useEffect(() => {
        if (process && total) {
            const percent = process / total
            setProcessing(width * percent)
        }
    }, [process, total])

    useEffect(() => {
        if (practiceData.questions.length === 0) {
            setProcessing(0)
        }
    }, [practiceData.questions])

    return (
        <View style={{ width, flexDirection: 'row', justifyContent: 'center', height: 8 }}>
            <View style={{ height: 8, borderRadius: 10, overflow: 'hidden', width: '90%', backgroundColor: '#e5e5e5' }}>
                <View style={{ height: '100%', backgroundColor: mainColor, width: processing }} />
            </View>
        </View>
    )
}

export default Processing