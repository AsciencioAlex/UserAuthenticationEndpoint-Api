import express from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import organisationRoutes from './routes/organisationRoutes';
import sequelize from './sequelize';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/organisations', organisationRoutes);

sequelize.sync({ force: true }).then(() => {
  console.log('Database synced');
});

export default app;
