import Stripe from "stripe";
import User from "../model/user.model.js";

// Initialize Stripe with the secret key from env (or string as fallback during setup)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_here");

// Maps service titles to their corresponding Stripe Price IDs
// The user needs to create these recurring prices in their Stripe Dashboard
const PLAN_PRICE_IDS = {
    "CV Writing": process.env.STRIPE_PRICE_CV_WRITING || "price_1TQkV9Jmjm2lxFW8aBHIHC7Q",
    "LinkedIn Optimization": process.env.STRIPE_PRICE_LINKEDIN || "price_1TQkWAJmjm2lxFW8LETWQwK6",
    "Cover Letter Service": process.env.STRIPE_PRICE_COVER_LETTER || "price_1TQkXJJmjm2lxFW8hQILT1xi",
};

export const createCheckoutSession = async (req, res) => {
    try {
        const { planTitle } = req.body;
        const userId = req.user._id;

        // Get the corresponding Stripe Price ID
        const priceId = PLAN_PRICE_IDS[planTitle];
        if (!priceId) {
            return res.status(400).json({ success: false, message: "Invalid plan selected" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Prepare session configuration
        const sessionConfig = {
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/profile?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/services?canceled=true`,
            client_reference_id: userId.toString(),
            customer_email: user.email,
        };

        // If we already have a generated customer ID in our DB, use it directly
        if (user.stripeCustomerId) {
            sessionConfig.customer = user.stripeCustomerId;
            delete sessionConfig.customer_email; // customer and customer_email cannot be used together
        }

        // Create the checkout session
        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Session Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyCheckoutSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Session ID required" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }

        const userId = session.client_reference_id;
        if (userId) {
            const updatedUser = await User.findByIdAndUpdate(userId, {
                stripeCustomerId: session.customer,
                subscriptionStatus: "active",
            }, { new: true });

            return res.status(200).json({ success: true, user: updatedUser });
        }

        res.status(400).json({ success: false, message: "User reference not found in session" });
    } catch (error) {
        console.error("Verify Session Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user || (!user.stripeCustomerId && user.subscriptionStatus !== "active")) {
            return res.status(400).json({ success: false, message: "No active subscription found to cancel." });
        }

        if (user.stripeCustomerId) {
            try {
                // Fetch the customer's active subscriptions from Stripe
                const subscriptions = await stripe.subscriptions.list({
                    customer: user.stripeCustomerId,
                    status: "active",
                    limit: 1,
                });

                if (subscriptions.data.length > 0) {
                    // Cancel it on Stripe
                    await stripe.subscriptions.cancel(subscriptions.data[0].id);
                }
            } catch (stripeErr) {
                console.error("Stripe Cancellation Warning (ignoring):", stripeErr.message);
            }
        }

        // Immediately sync local database
        user.subscriptionStatus = "canceled";
        await user.save();

        res.status(200).json({ success: true, message: "Subscription explicitly canceled.", user });
    } catch (error) {
        console.error("Cancel Subscription Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Stripe Webhook Endpoint to sync Data
export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // req.body must be the raw buffer here, so we will need to configure express to pass raw body for this route
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const userId = session.client_reference_id;
                const customerId = session.customer;

                if (userId) {
                    await User.findByIdAndUpdate(userId, {
                        stripeCustomerId: customerId,
                        subscriptionStatus: "active",
                        // You can extract exactly which plan they bought if needed by expanding session.line_items, 
                        // but for simplicity we rely on the main status.
                    });
                    console.log(`User ${userId} successfully subscribed.`);
                }
                break;
            }
            case "customer.subscription.deleted":
            case "customer.subscription.updated": {
                const subscription = event.data.object;
                const customerId = subscription.customer;

                await User.findOneAndUpdate(
                    { stripeCustomerId: customerId },
                    { subscriptionStatus: subscription.status }
                );
                console.log(`Subscription status for ${customerId} updated to ${subscription.status}.`);
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).send("Webhook received");
    } catch (err) {
        console.error("Error processing webhook:", err);
        res.status(500).send("Internal Server Error");
    }
};
