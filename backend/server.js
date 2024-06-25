const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json({ limit: '10mb' }))
require('dotenv').config();
const router = require('./routes/route')
app.use(cors())
app.use(router)

app.listen(5000, () => {
    console.log("Server started on port 5000");
})