import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
export let baseURL = 'https://genlish-be.vercel.app/api/v1'
axios.defaults.baseURL = `${baseURL}`

export const TypeHTTP = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
}

export const api = async ({ path, body, type, sendToken, port }) => {
    if (port) {
        baseURL = 'http://localhost:' + port + '/api/v1'
        axios.defaults.baseURL = `${baseURL}`
    } else {
        // baseURL = 'http://192.168.88.206:8080/api/v1'
        baseURL = 'https://genlish-be.vercel.app/api/v1'
        axios.defaults.baseURL = `${baseURL}`
    }
    const accessToken = await AsyncStorage.getItem('accessToken')
    const refreshToken = await AsyncStorage.getItem('refreshToken')
    return new Promise((rejects, resolve) => {
        switch (type) {
            case TypeHTTP.GET:
                axios.get(path, { headers: sendToken ? { accessToken, refreshToken } : {} })
                    .then(async (res) => {
                        if (sendToken) {
                            await AsyncStorage.setItem('accessToken', res.data.tokens.accessToken)
                            await AsyncStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
            case TypeHTTP.POST:
                axios.post(path, body, { headers: sendToken ? { accessToken, refreshToken } : {} })
                    .then(async (res) => {
                        if (sendToken) {
                            await AsyncStorage.setItem('accessToken', res.data.tokens.accessToken)
                            await AsyncStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
            case TypeHTTP.PUT:
                axios.put(path, body, { headers: sendToken ? { accessToken, refreshToken } : {} })
                    .then(async (res) => {
                        if (sendToken) {
                            await AsyncStorage.setItem('accessToken', res.data.tokens.accessToken)
                            await AsyncStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
            case TypeHTTP.DELETE:
                axios.delete(path, { headers: sendToken ? { accessToken, refreshToken } : {} })
                    .then(async (res) => {
                        if (sendToken) {
                            await AsyncStorage.setItem('accessToken', res.data.tokens.accessToken)
                            await AsyncStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
        }
    })
}
