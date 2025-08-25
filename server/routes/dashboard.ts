import express, { Request, Response, Router } from 'express';
import { db } from '../database/db';
import { User, Purchase, Reward, Crypto, ApiError } from '../types';

const router: Router = express.Router();

interface DashboardResponse {
  user: Omit<User, 'password'> & { user_metadata: { name: string; role: 'user' | 'merchant' } };
  cryptos: Crypto[]; // Full Crypto objects with type, name, price, change, icon
  purchaseHistory: Purchase[];
  rewardHistory: Reward[];
}

// Get dashboard data for a user
router.get('/:userEmail', (req: Request<{ userEmail: string }>, res: Response<DashboardResponse | ApiError>) => {
  const { userEmail } = req.params;

  // Get user info
  db.get<User>('SELECT * FROM users WHERE email = ?', [userEmail], (err: Error | null, user: User | undefined) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error occurred.' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Get purchase history
    db.all<Purchase>(
      'SELECT * FROM purchase_history WHERE user_email = ? ORDER BY created_at DESC',
      [userEmail],
      (err: Error | null, purchaseHistory: Purchase[] | undefined) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error occurred.' });
        }

        // Get reward history
        db.all<Reward>(
          'SELECT * FROM reward_history WHERE user_email = ? ORDER BY created_at DESC',
          [userEmail],
          (err: Error | null, rewardHistory: Reward[] | undefined) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Database error occurred.' });
            }

            // Fetch real-time crypto prices from CoinGecko
            const fetchCryptoPrices = async (): Promise<Crypto[]> => {
              try {
                const response = await fetch(
                  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,tether,usd-coin,solana&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
                );

                if (!response.ok) {
                  throw new Error(`CoinGecko API error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.map((coin: any, index: number) => ({
                  id: index + 1,
                  type: coin.symbol.toUpperCase(),
                  name: coin.name,
                  price: coin.current_price.toFixed(2),
                  change: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`,
                  icon: coin.image,
                }));
              } catch (error) {
                console.error('Error fetching crypto prices:', error);
                return [];
              }
            };

            // Format user object
            const userObject: Omit<User, 'password'> & { user_metadata: { name: string; role: 'user' | 'merchant' } } = {
              id: user.id,
              email: user.email,
              user_metadata: {
                name: user.name,
                role: user.role,
              },
              created_at: user.created_at,
            };

            fetchCryptoPrices().then((cryptos) => {
              // Return full Crypto format with icons and change percentages
              res.json({
                user: userObject,
                cryptos: cryptos, // Full Crypto objects with type, name, price, change, icon
                purchaseHistory: purchaseHistory || [],
                rewardHistory: rewardHistory || [],
              });
            }).catch((err) => {
              console.error('Error fetching crypto prices:', err);
              // Return empty array if API fails
              res.json({
                user: userObject,
                cryptos: [],
                purchaseHistory: purchaseHistory || [],
                rewardHistory: rewardHistory || [],
              });
            });
          }
        );
      }
    );
  });
});

export default router;

