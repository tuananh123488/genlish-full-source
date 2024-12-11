'use client'
import Notification from "@/components/notification";
import { api, TypeHTTP } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
export const practiceContext = createContext()

const PracticeProvider = ({ children }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [questions, setQuestions] = useState([])
    const [myAnswer, setMyAnswer] = useState('')

    const data = {
        questions,
        currentQuestion,
        myAnswer
    }
    const handler = {
        setQuestions,
        setCurrentQuestion,
        setMyAnswer
    }

    return (
        <practiceContext.Provider value={{ practiceData: data, practiceHandler: handler }}>
            {children}
        </practiceContext.Provider >
    )
}

export default PracticeProvider
