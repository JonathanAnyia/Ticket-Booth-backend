import express from 'express';
import { createSubaccount, initializePayment, verifyPayment } from './services/paystackService.js';
import router from './index.js'
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json()); // To parse JSON bodies
app.use('/paystack', router)

// Endpoint to create a subaccount for an event host
app.post('/api/paystack/subaccount', async (req, res) => {
    const { businessName, settlementBank, accountNumber } = req.body;

    try {
        const response = await createSubaccount(businessName, settlementBank, accountNumber);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to initialize a payment
app.post('/api/paystack/pay', async (req, res) => {
    const { email, amount, subaccount, commissionPercentage } = req.body;

    try {
        const response = await initializePayment(email, amount, subaccount, commissionPercentage);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Callback endpoint to handle Paystack's response after payment
app.post('/api/paystack/callback', async (req, res) => {
    const { reference } = req.body;

    try {
        const response = await verifyPayment(reference);

        if (response.data.status === 'success') {
            // Handle successful payment
            res.status(200).json({ message: 'Payment verified successfully', data: response.data });
        } else {
            // Handle failed payment
            res.status(400).json({ message: 'Payment verification failed', data: response.data });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req,res) => {
    res.send('API IS RUNNING')
})