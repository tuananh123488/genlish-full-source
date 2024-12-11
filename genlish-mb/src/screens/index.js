import React, { useContext, useEffect, useRef } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { screenContext } from '../contexts/ScreenContext';
import LandingScreen from './LandingScreen';
import CourseScreen from './CourseScreen';
import DetailCourseScreen from './DetailCourseScreen';
import ViewingCourseScreen from './ViewingCourseScreen';
import LearnScreen from './LearnScreen';
import SearchScreen from './SearchScreen';
import BroadCastScreen from './BroadCastScreen';
import RecordScreen from './RecordScreen';
import PaymentScreen from './PaymentScreen';

const Index = () => {
    const { width } = Dimensions.get('window');
    const { screenData } = useContext(screenContext)
    const scrollViewRef = useRef(null);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: screenData.currentScreen * width, animated: true });
        }
    }, [screenData.currentScreen])

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            style={{ flexDirection: 'row' }}
            scrollEnabled={false}
        >
            <LandingScreen />
            <CourseScreen />
            <DetailCourseScreen />
            <PaymentScreen />
            <ViewingCourseScreen />
            <LearnScreen />
            <SearchScreen />
            <BroadCastScreen />
            <RecordScreen />
            {/* for patient */}

        </ScrollView>
    )
}

export default Index