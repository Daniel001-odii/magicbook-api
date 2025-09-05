import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import qrcodeRoutes from './routes/qrcodeRoutes';
import qrcodeExtraRoutes from './routes/qrcodeExtraRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/qrcodes', qrcodeRoutes);
app.use('/api/qrcodes', qrcodeExtraRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.json({ ok: true, name: 'QuickBook API' }));

app.use(errorHandler);

export default app;
