import express from "express";
import { createCheckoutSession, verifyCheckoutSession, cancelSubscription } from "../controller/stripe.controller.js";
import authMiddleWare from "../middleWare/authMiddleWare.js";

const router = express.Router();

// Route to create a Stripe checkout session for a selected plan
router.post("/create-checkout-session", authMiddleWare, createCheckoutSession);
router.post("/verify-session", authMiddleWare, verifyCheckoutSession);
router.post("/cancel-subscription", authMiddleWare, cancelSubscription);

export default router;
