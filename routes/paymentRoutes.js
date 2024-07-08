// routes/paymentRoutes.js
import express from 'express';
import { createPayment, handleCallback } from '../controllers/paymentController.js';

const router = express.Router();

// Route to create a payment
router.post('/pay', createPayment);

// Route to handle payment callback
router.get('/payment/callback', handleCallback);

export default router;
