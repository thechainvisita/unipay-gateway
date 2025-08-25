import express, { Request, Response, Router } from 'express';
import { db } from '../database/db';
import { Purchase, CreatePurchaseRequest, ApiError } from '../types';

const router: Router = express.Router();

// Create a new purchase
router.post('/', (req: Request<{}, Purchase | ApiError, CreatePurchaseRequest>, res: Response<Purchase | ApiError>) => {
  const {
    user_email,
    item,
    amount_paid,
    payment_method,
    points,
    status,
    merchant_name,
  } = req.body;

  if (!user_email || !item || amount_paid === undefined || !payment_method || !merchant_name) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const purchaseId = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();

  db.run(
    'INSERT INTO purchase_history (id, user_email, item, amount_paid, payment_method, points, status, merchant_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      purchaseId,
      user_email,
      item,
      amount_paid,
      payment_method,
      points || 0,
      status || 'Completed',
      merchant_name,
      createdAt,
    ],
    function (err: Error | null) {
      if (err) {
        console.error('Error saving purchase:', err);
        return res.status(500).json({ error: 'Error saving purchase.' });
      }

      res.status(201).json({
        id: purchaseId,
        user_email,
        item,
        amount_paid,
        payment_method,
        points: points || 0,
        status: status || 'Completed',
        merchant_name,
        created_at: createdAt,
      });
    }
  );
});

export default router;

