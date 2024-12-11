import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { menuContext } from '../../contexts/MenuContext';
import { Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/Feather';
import { payloadContext } from '../../contexts/PayloadContext';

const FormDetailBroadCast = () => {
    const { menuData, menuHandler } = useContext(menuContext);
    const { width } = Dimensions.get('window');
    const [translateX] = useState(new Animated.Value(menuData.displayDetailBroadCast === true ? 0 : width));
    const reactPlayerRef = useRef();
    const [playing, setPlaying] = useState(false);
    const { payloadData } = useContext(payloadContext);
    const subRef = useRef();
    const [id, setId] = useState(-1); // Sử dụng useState cho id
    const itemRefs = useRef([]);

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: menuData.displayDetailBroadCast === true ? 0 : width,
            duration: 300, // Thời gian animation (ms)
            useNativeDriver: true, // Sử dụng Native Driver cho hiệu suất tốt hơn
        }).start();
    }, [menuData.displayDetailBroadCast]);

    useEffect(() => {
        setId(-1); // Reset lại id khi broadcast thay đổi
    }, [payloadData.currentBroadCast?._id]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (reactPlayerRef.current) {
                reactPlayerRef.current.getCurrentTime().then((currentTime) => {
                    handleOnProgress(currentTime, payloadData.currentBroadCast);
                });
            }
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(interval); // Clear interval khi unmount
    }, [reactPlayerRef.current, payloadData.currentBroadCast]);

    const handleOnProgress = (currentTime, broadcast) => {
        let newId = -1;
        broadcast?.englishSubtitle.forEach((item, index) => {
            if (currentTime >= item.firstTime && currentTime <= item.lastTime) {
                newId = index;
            }
        });
        if (newId !== id) {
            setId(newId); // Cập nhật id
        }
    };

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
                gap: 20,
                right: 0,
            }}
        >
            <View style={{ position: 'absolute', right: 15, top: 30, zIndex: 1 }}>
                <TouchableOpacity onPress={() => menuHandler.setDisplayDetailBroadCast(false)}>
                    <Icon name="x" style={{ fontSize: 30, color: 'white' }} />
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center' }}>
                {menuData.displayDetailBroadCast === true && (
                    <>
                        <YoutubePlayer
                            ref={reactPlayerRef}
                            height={width * 9 / 16}
                            width={width}
                            play={playing}
                            videoId={payloadData.currentBroadCast?.urlVideo} // Thay bằng ID video của bạn
                        />
                        <Text style={{ width: '100%', paddingHorizontal: 10, marginTop: 10, fontSize: 18, fontWeight: 600 }}>
                            {payloadData.currentBroadCast?.title}
                        </Text>
                        <Text style={{ width: '100%', paddingHorizontal: 10, marginTop: 5, fontSize: 15 }}>
                            From {payloadData.currentBroadCast?.channelName}
                        </Text>
                        <ScrollView scrollEnabled={true} ref={subRef} style={{ paddingHorizontal: 20, marginTop: 10 }}>
                            {payloadData.currentBroadCast?.englishSubtitle.map((item, i) => (
                                <View ref={el => itemRefs.current[i] = el} key={i} style={{ flexDirection: 'column', marginBottom: i === payloadData.currentBroadCast?.englishSubtitle.length - 1 ? 500 : 15 }}>
                                    <Text style={{ fontSize: 17, fontWeight: 600, color: i === id ? 'blue' : 'black' }}>
                                        {item.content.trim()}
                                    </Text>
                                    <Text style={{ fontSize: 16, color: i === id ? 'blue' : 'black' }}>
                                        {payloadData.currentBroadCast?.vietnameseSubtitle[i].content.trim()}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </>
                )}
            </View >
        </Animated.View >
    );
}

export default FormDetailBroadCast;
