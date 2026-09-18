import express from 'express';
import { prisma } from '../lib/prisma';
import { loginUser, generateToken, requireAuth, AuthenticatedRequest } from '../lib/auth';
import { z } from 'zod';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['TRAVELER', 'HOST']),
  password: z.string().min(6),
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const token = await loginUser(email, password);
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, name, role, password } = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user (in production, hash the password with bcrypt)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role as any,
      },
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
    });

    return res.status(201).json({ token, user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }});
  } catch (error) {
    console.error('Register error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Get current user
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    
    // Get user's current subscription
    const subscription = await prisma.subscription.findFirst({
      where: { 
        userId: user.id,
        status: { in: ['active', 'trialing'] }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          }
        }
      }
    });

    // Get current credits balance
    const latestCredit = await prisma.creditLedger.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { balanceAfter: true },
    });

    const creditsBalance = latestCredit?.balanceAfter || 0;

    return res.json({
      user,
      subscription: subscription ? {
        planCode: subscription.planCode,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
      } : null,
      creditsBalance,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to get user data' });
  }
});

export default router;