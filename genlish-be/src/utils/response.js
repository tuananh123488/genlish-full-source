const responseWithTokens = (req, res, data, status) => {
    return res.status(status).json({ data, tokens: req.tokens })
}

const responseWithNoTokens = (req, res, data, status) => {
    return res.status(status).json(data)
}

module.exports = {
    responseWithNoTokens,
    responseWithTokens
}