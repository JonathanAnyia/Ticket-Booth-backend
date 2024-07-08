// paymentController.js
import { initializePayment, verifyPayment } from '../services/paystackService.js';

// Controller to create a payment
export const createPayment = async (req, res) => {
  const { email, amount } = req.body; // Get email and amount from the request body
  try {
    const response = await initializePayment(email, amount); // Call the function to initialize payment
    res.status(200).json(response); // Send the response back to the client
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors that occur
  }
};

// Controller to handle the payment callback
export const handleCallback = async (req, res) => {
  const reference = req.query.reference; // Get the payment reference from the query parameters
  try {
    const response = await verifyPayment(reference); // Call the function to verify payment
    res.status(200).json(response); // Send the response back to the client
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors that occur
  }
};
