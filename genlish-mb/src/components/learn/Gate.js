import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView, View } from 'react-native'
import Introduce from './Introduce'
import { userContext } from '../../contexts/UserContext'
import Step from './Step'
import { getPosition } from '../../utils/other'

const Gate = ({ door, setTop }) => {
    const { width, height } = Dimensions.get('window');
    const wrapperRef = useRef()
    const [steps, setSteps] = useState([])
    const [numberOfBeast, setNumberOfBeast] = useState([])
    const { userData } = useContext(userContext)

    useEffect(() => {
        if (steps.length > 0) {
            const num = Math.floor(steps.length / 4)
            setNumberOfBeast(() => {
                const arr = []
                for (let i = 0; i < num; i++)
                    arr.push(1)
                return arr
            })
        }
    }, [steps])

    useEffect(() => {
        if (door) {
            const arr = []
            for (let i = 1; i <= door.individual.numberOfTest; i++) {
                arr.push(i)
            }
            setSteps(arr)
        }
    }, [door])

    return (
        <ScrollView ref={wrapperRef} style={{ flexDirection: 'column', width: '100%' }}>
            <Introduce door={door} />
            <View style={{ flexDirection: 'column', position: 'relative', width: '100%', alignItems: 'center', gap: 5, marginTop: 10, paddingBottom: 10 }}>
                {steps.map((step, index) => (
                    <Step setTop={setTop} level={index + 1} final={index === steps.length - 1 ? true : false} door={door} left={door.individual.door % 2 ? true : false} margin={getPosition(width, index + 1)} key={index} />
                ))}
            </View>
        </ScrollView>
    )
}

export default Gate