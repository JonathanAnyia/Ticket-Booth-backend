import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Create an axios instance to interact with Paystack's API
const paystack = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
    },
});

// Function to create a subaccount
export const createSubaccount = async (businessName, settlementBank, accountNumber) => {
    const payload = {
        business_name: businessName,
        settlement_bank: settlementBank,
        account_number: accountNumber,
        percentage_charge: 0.0, // No charge by Paystack on this subaccount
    };

    try {
        const response = await paystack.post('/subaccount', payload);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Subaccount creation failed');
    }
};

// Function to initialize a payment
export const initializePayment = async (email, amount, subaccount, commissionPercentage) => {
    const payload = {
        email,
        amount: amount * 100, // Paystack expects the amount in kobo
        subaccount,
        transaction_split: {
            type: 'percentage',
            bearer_type: 'account',
            bearers: [
                {
                    subaccount: subaccount, // Event host's subaccount
                    share: 100 - commissionPercentage, // Host's share
                },
                {
                    subaccount: process.env.COMMISSION_SUBACCOUNT, // Your subaccount
                    share: commissionPercentage, // Your commission percentage
                },
            ],
        },
        callback_url: 'http://localhost:3000/api/paystack/callback', // Change this URL based on your environment
    };

    try {
        const response = await paystack.post('/transaction/initialize', payload);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Payment initialization failed');
    }
};

// Function to verify a payment
export const verifyPayment = async (reference) => {
    try {
        const response = await paystack.get(`/transaction/verify/${reference}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Payment verification failed');
    }
};
