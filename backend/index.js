//imports
const express = require('express')
const dotEnv = require('dotenv').config()
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const requestId = require("./middleware/requestId");

const PORT = process.env.PORT || 4000;

const app = express()

// Middlewares de base
app.use(cors({
  origin: 'https://propulse-zeta.vercel.app', 
  credentials: true
}));
app.use(express.json());
app.use(requestId);

// Rotas
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company')
const clientRoutes = require('./routes/client')

app.use("/api/auth", authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/client', clientRoutes);
app.use("/api/company/:companyId/client/:clientId/quote/:quoteId", require("./routes/ai"));


app.use(errorHandler);

app.listen(PORT, () => {
  if (!process.env.JWT_SECRET) { throw new Error("JWT_SECRET não definido") }
  console.log(`Servidor a correr em http://localhost:${PORT}`);

})
