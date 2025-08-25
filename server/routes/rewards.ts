import express, { Request, Response, Router } from 'express';
import { db } from '../database/db';
import { Reward, CreateRewardRequest, ApiError } from '../types';

const router: Router = express.Router();

// Create a new reward
router.post('/', (req: Request<{}, Reward | ApiError, CreateRewardRequest>, res: Response<Reward | ApiError>) => {
  const { user_email, tokens, source, note } = req.body;

  if (!user_email || tokens === undefined || !source) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const rewardId = `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();

  db.run(
    'INSERT INTO reward_history (id, user_email, tokens, source, note, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [rewardId, user_email, tokens, source, note || null, createdAt],
    function (err: Error | null) {
      if (err) {
        console.error('Error saving reward:', err);
        return res.status(500).json({ error: 'Error saving reward.' });
      }

      res.status(201).json({
        id: rewardId,
        user_email,
        tokens,
        source,
        note: note || null,
        created_at: createdAt,
      });
    }
  );
});

export default router;

