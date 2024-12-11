import React, { useContext, useEffect, useState } from 'react'
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { menuContext } from '../../contexts/MenuContext';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { payloadContext } from '../../contexts/PayloadContext';
import { convertSecondsToTimeFormat } from '../../utils/time';

const AllNote = () => {
    const { menuData, menuHandler } = useContext(menuContext);
    const { width } = Dimensions.get('window');
    const [translateX] = useState(new Animated.Value(menuData.displayAllNote === true ? 0 : width));
    const { payloadData } = useContext(payloadContext)
    const [notes, setNotes] = useState([])
    const [open, setOpen] = useState(-1)

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: menuData.displayAllNote === true ? 0 : width,
            duration: 300, // Thời gian animation (ms)
            useNativeDriver: true, // Sử dụng Native Driver cho hiệu suất tốt hơn
        }).start();
    }, [menuData.displayAllNote]);

    useEffect(() => {
        if (payloadData.studyCourse?.note && payloadData.course) {
            const listNote = payloadData.studyCourse.note.split('\n')
            let listCourse = payloadData.course.list_course
            listCourse = listCourse.map((item, index) => {
                const filter = listNote.filter(item1 => Number(item1.split('-')[0]) === index + 1)
                return {
                    ...item,
                    notes: filter.map(item1 => ({
                        time: Number(item1.split('-')[1].split(':')[0]),
                        note: item1.split('-')[1].split(':')[1]
                    }))
                }
            })
            setNotes(listCourse)
        }
    }, [payloadData.studyCourse?.note, payloadData.course])


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
                <TouchableOpacity onPress={() => menuHandler.setDisplayAllNote(false)}>
                    <Icon name="x" style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', paddingTop: 20, paddingHorizontal: 10 }}>
                {payloadData.course && (
                    <>
                        <Text style={{ width: '100%', fontSize: 20, fontWeight: 600 }}>Tất Cả Ghi Chú</Text>
                        <Text style={{ width: '100%', fontSize: 17, fontWeight: 600 }}>({payloadData.course.title})</Text>
                        <ScrollView style={{ flexDirection: 'column', width: '100%', height: '90%', marginTop: 10 }}>
                            {notes.map((note, index) => {
                                if (note.notes.length > 0) {
                                    return <View key={index} style={{ flexDirection: 'column', width: '100%' }}>
                                        <TouchableOpacity onPress={() => open === index ? setOpen(-1) : setOpen(index)} key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, paddingVertical: 10, backgroundColor: '#efefef', borderRadius: 7, alignItems: 'start', width: '100%', paddingHorizontal: 10 }}>
                                            <Text style={{ width: '92%', fontSize: 14, lineHeight: 20 }}>{index + 1}. {note.title}</Text>
                                            <View style={{ width: '6%', flexDirection: 'row', alignItems: 'start', justifyContent: 'center' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#5dade2', height: 25, width: 25, borderRadius: 25 }}>
                                                    <Text style={{ color: 'white', textAlign: 'center' }}>{note.notes.length}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ width: '100%', marginBottom: open === index ? 5 : 0, height: open === index ? 'auto' : 0, flexDirection: 'column', overflow: 'hidden', gap: 7 }}>
                                            {note.notes.map((item, index1) => (
                                                <View key={index1} style={{ width: '100%', paddingLeft: 20 }}>
                                                    <Text>{convertSecondsToTimeFormat(item.time)}: {item.note}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                }
                            })}
                        </ScrollView>
                    </>
                )}
            </View>
        </Animated.View >
    )
}

export default AllNote