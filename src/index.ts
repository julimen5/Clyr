import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import { router as webhookRouter } from '@/routes/webhook.route';
import { router as transactionRouter } from '@/routes/transaction.route';

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(express.json());
app.use('/webhooks', webhookRouter);
app.use('/transactions', transactionRouter);

app.get('/', (req, res) => res.send('Server is running!'));

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
