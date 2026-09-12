import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/error.middleware.js';
import router from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || `http://localhost:5173`

app.use(express.json());
app.use(cors({origin:CORS_ORIGIN}));

app.use('/api', router); 


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});