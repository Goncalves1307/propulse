//imports
const express = require('express')
const dotEnv = require('dotenv').config()
const cors = require("cors");



const PORT = process.env.PORT || 4050;

const app = express()

//Middlewares
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})