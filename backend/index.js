//imports
const express = require('express')
const dotEnv = require('dotenv').config()
const cors = require("cors");



const PORT = process.env.PORT || 4000;

const app = express()

//Middlewares
app.use(cors());
app.use(express.json());

//Rotas
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company')
const clientRoutes = require('./routes/client')


app.use("/api/auth", authRoutes);
app.use('/api/company',companyRoutes)
app.use('/api/client',clientRoutes)



app.listen(PORT, () => {
  if (!process.env.JWT_SECRET) { throw new Error("JWT_SECRET não definido") }
  console.log(`Servidor a correr em http://localhost:${PORT}`);
})