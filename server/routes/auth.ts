import express, { Request, Response, Router } from 'express';
import { db } from '../database/db';
import bcrypt from 'bcryptjs';
import { User, LoginRequest, SignupRequest, ApiError } from '../types';

const router: Router = express.Router();

// Helper function to generate user ID
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Login endpoint
router.post('/login', async (req: Request<{}, User | ApiError, LoginRequest>, res: Response<User | ApiError>) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (!role || !['user', 'merchant'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    // Find user by email
    db.get<User>(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase().trim()],
      async (err: Error | null, user: User | undefined) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error occurred.' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Check role match
        if (user.role !== role) {
          const otherPage = role === 'user' ? 'merchant' : 'user';
          return res.status(403).json({
            error: `This page is for ${role}s. Try logging in as a ${otherPage}.`
          });
        }

        // Return user object (without password)
        const userObject: Omit<User, 'password'> & { user_metadata: { name: string; role: 'user' | 'merchant' } } = {
          id: user.id,
          email: user.email,
          user_metadata: {
            name: user.name,
            role: user.role,
          },
          created_at: user.created_at,
        };

        res.json(userObject as User);
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

// Signup endpoint
router.post('/signup', async (req: Request<{}, User | ApiError, SignupRequest>, res: Response<User | ApiError>) => {
  try {
    const { email, username, role, password } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }

    if (!role || !['user', 'merchant'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if user already exists
    db.get<User>(
      'SELECT * FROM users WHERE email = ?',
      [emailLower],
      async (err: Error | null, existingUser: User | undefined) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error occurred.' });
        }

        if (existingUser) {
          return res.status(409).json({
            error: 'This email is already registered. Please sign in instead.'
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = generateUserId();
        const createdAt = new Date().toISOString();

        // Insert new user
        db.run(
          'INSERT INTO users (id, email, name, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, emailLower, username.trim(), hashedPassword, role, createdAt],
          function (err: Error | null) {
            if (err) {
              console.error('Error creating user:', err);
              return res.status(500).json({ error: 'Error creating user account.' });
            }

            // Return user object (without password)
            const userObject: Omit<User, 'password'> & { user_metadata: { name: string; role: 'user' | 'merchant' } } = {
              id: userId,
              email: emailLower,
              user_metadata: {
                name: username.trim(),
                role: role,
              },
              created_at: createdAt,
            };

            res.status(201).json(userObject as User);
          }
        );
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred during signup.' });
  }
});

export default router;

