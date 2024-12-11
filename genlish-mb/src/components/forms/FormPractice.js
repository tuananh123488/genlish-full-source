import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, ScrollView, TouchableOpacity, View } from 'react-native';
import { menuContext } from '../../contexts/MenuContext';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { notifyType, utilsContext } from '../../contexts/UtilsContext';
import { practiceContext } from '../../contexts/PracticeContext';
import Type0 from '../learn/Type0';
import Processing from '../learn/Processing';
import Result from '../learn/Result';
import Type1 from '../learn/Type1';
import Type2 from '../learn/Type2';
import Type3 from '../learn/Type3';
import Type4 from '../learn/Type4';
import Type5 from '../learn/Type5';
import Type6 from '../learn/Type6';

const FormPractice = () => {
    const { menuData, menuHandler } = useContext(menuContext);
    const { width, height } = Dimensions.get('window');
    const [translateX] = useState(new Animated.Value(menuData.displayPractice === true ? 0 : width));

    const { practiceData } = useContext(practiceContext)
    const { utilsHandler } = useContext(utilsContext)
    const [questions, setQuestions] = useState([])
    const { practiceHandler } = useContext(practiceContext)
    const [wrong, setWrong] = useState(0)
    const stepRef = useRef()

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: menuData.displayPractice === true ? 0 : width,
            duration: 300, // Thời gian animation (ms)
            useNativeDriver: true, // Sử dụng Native Driver cho hiệu suất tốt hơn
        }).start();
    }, [menuData.displayPractice]);

    useEffect(() => {
        if (practiceData.questions.length < 1) {
            menuHandler.setDisplayPractice(false)
        } else {
            setQuestions(practiceData.questions)
        }
    }, [practiceData.questions])

    useEffect(() => {
        if (stepRef.current) {
            stepRef.current.scrollTo({ x: practiceData.currentQuestion * width, animated: true });
        }
    }, [practiceData.currentQuestion])

    useEffect(() => {
        setWrong(0)
    }, [questions])

    useEffect(() => {
        if (wrong === 5) {
            setWrong(0)
            utilsHandler.notify(notifyType.FAIL, 'Bạn đã trượt bài học này')
            menuHandler.setDisplayPractice(false)
            practiceHandler.setMyAnswer('')
            practiceHandler.setCurrentQuestion(0)
            practiceHandler.setQuestions([])
        }
    }, [wrong])


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
                <TouchableOpacity onPress={() => {
                    // menuHandler.setDisplayPractice(false)
                    practiceHandler.setMyAnswer('')
                    practiceHandler.setCurrentQuestion(0)
                    practiceHandler.setQuestions([])
                    setWrong(0)
                }}>
                    <Icon name="x" style={{ fontSize: 30 }} />
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', paddingTop: 50, height: height, position: 'relative' }}>
                <Processing process={practiceData.currentQuestion} total={questions.length} />
                <ScrollView scrollEnabled={false} ref={stepRef} horizontal style={{ width, flexDirection: 'row', marginTop: 15 }}>
                    {questions.map((question, index) => (<>
                        {question.type === 0 ? (
                            <Type0 question={question} index={index} />
                        ) : question.type === 1 ? (
                            <Type1 question={question} index={index} />
                        ) : question.type === 2 ? (
                            <Type2 question={question} index={index} />
                        ) : question.type === 3 ? (
                            <Type3 question={question} index={index} />
                        ) : question.type === 4 ? (
                            <Type4 question={question} index={index} />
                        ) : question.type === 5 ? (
                            <Type5 question={question} index={index} />
                        ) : question.type === 6 && (
                            <Type6 question={question} index={index} />
                        )}
                    </>))}
                </ScrollView>
                <Result setWrong={setWrong} />
            </View>
        </Animated.View>
    )
}

export default FormPractice