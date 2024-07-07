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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Sync the database and start the server
const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default app;
