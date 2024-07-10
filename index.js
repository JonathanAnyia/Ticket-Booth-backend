import express from "express";
import paymentRoutes from "./routes/paymentRoutes.js"

const router = express.Router()

router.use('/payment', paymentRoutes)

export default router;