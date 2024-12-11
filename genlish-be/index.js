const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv')
const https = require('http')
const cors = require('cors');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');
const bodyParser = require('body-parser');
const socket = require('./src/utils/socket')
const port = 8080

const baseURL = 'http://127.0.0.1:3000'
const baseURLMobile = 'http://127.0.0.1:8081'

// config
dotenv.config();

const corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Accesstoken', 'Refreshtoken', 'userid', 'admin']
};

// Tăng giới hạn kích thước yêu cầu lên 50MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(cors(corsOptions));
app.use(express.json());

// init db
require('./src/dbs/init.mongodb')

// init routes
app.use('', require('./src/routes/index'))

// socket realtime
const server = https.createServer(app)

socket(server, baseURL)

server.listen(port, () => {
    console.log("Running with port " + port)
})
