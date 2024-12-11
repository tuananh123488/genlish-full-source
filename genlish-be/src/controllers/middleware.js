'use strict'

const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

class Middleware {

    checkToken = async (req, res, next) => {
        try {
            let user_id = ''
            const accessToken = req.headers.accesstoken
            const refreshToken = req.headers.refreshtoken
            if (!accessToken || !refreshToken) {
                return res.status(500).send('Not Found Information');
            }
            jwt.verify(accessToken, process.env.SECRETKEY, (err, decodedAccessToken) => {
                if (err) {
                    jwt.verify(refreshToken, process.env.SECRETKEY, async (error, decodedRefreshToken) => {
                        if (error) {
                            return res.status(500).send('Tokens Expired');
                        }
                        req.userid = decodedRefreshToken.user_id
                        const expR = decodedRefreshToken.exp * 1000;
                        const currentTimestamp = new Date().getTime()
                        const newTokens = await authService.generateTokens({ user_id: decodedRefreshToken.user_id }, `${(expR - currentTimestamp) / 1000}s`)
                        req.tokens = newTokens;
                        next()
                    })
                }
                else {
                    req.userid = decodedAccessToken.user_id
                    req.tokens = { accessToken, refreshToken }
                    next()
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new Middleware()