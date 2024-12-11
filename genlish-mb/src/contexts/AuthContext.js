import { createContext, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { userContext } from "./UserContext";
import { screenContext } from "./ScreenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { utilsContext } from "./UtilsContext";
import { api, TypeHTTP } from "../utils/api";
import { menuContext } from "./MenuContext";
import { payloadContext } from "./PayloadContext";
export const authContext = createContext()

const AuthProvider = ({ children }) => {
    const { utilsHandler } = useContext(utilsContext)
    const { userData, userHandler } = useContext(userContext)
    const { screenData } = useContext(screenContext)
    const { menuHandler } = useContext(menuContext)
    const { payloadHandler } = useContext(payloadContext)
    const { screenHandler } = useContext(screenContext)

    useEffect(() => {
        const fetchTokens = async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (accessToken && refreshToken && screenData.currentScreen === 0) {
                api({ type: TypeHTTP.POST, path: '/auth/find-user-by-token', sendToken: true })
                    .then(res => {
                        if (res) {
                            userHandler.setUser(res)
                            if (res?.statusSignUp === 7) {
                                screenHandler.navigate('course')
                            } else {
                                menuHandler.setDisplaySignUp(true)
                                payloadHandler.setCurrentStepSignUp(res.statusSignUp)
                            }
                        }
                    })
            }
        };

        fetchTokens();
    }, [screenData.currentScreen]);

    const data = {

    }

    const handler = {

    }

    return (
        <authContext.Provider value={{ authData: data, authHandler: handler }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider
