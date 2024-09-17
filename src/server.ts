import cors from 'cors';
import express from 'express';
import { router as policyRouter } from '@/routes/policy.route';
import { router as transactionRouter } from '@/routes/transaction.route';
import { loadWorkers } from '@/workers';
import { handler } from '@/exceptions/handler.exception';
import swaggerUi from 'swagger-ui-express';
import { router } from '@/routes';
import { swaggerOutput } from '@/swagger_output';

const app = express();

loadWorkers();

app.use(cors());

app.use(express.json());

app.use(router);

app.get('/health', (req, res, next) => {
  res.json({ status: 'ok' });
});

app.use('/policies', policyRouter);

app.use('/transactions', transactionRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.get('/', (req, res) => res.send('Server is running!'));

app.use(handler);

export default app;
