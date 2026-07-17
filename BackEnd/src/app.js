import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/error.middleware.js';
import ejemploRouter from './routes/auth.routes.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// ruta de ejemplo (temporal)
app.use('/api', ejemploRouter); 


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});