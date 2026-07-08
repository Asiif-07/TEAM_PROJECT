import Notification from "../model/notification.model.js";
import { sendSocketNotification } from "../config/socket.js";

/**
 * Create a notification and emit it in real-time if the recipient is online.
 * Call this helper from any controller (blog, comment, etc.) when you need
 * to notify a user about an event.
 */
export const createNotification = async ({ recipient, sender, type, post, comment }) => {
    try {
        // Don't notify yourself
        console.log(`[Notification] Attempting to notify ${recipient} from ${sender}`);
        if (recipient.toString() === sender.toString()) {
            console.log("[Notification] Skipping because recipient is sender");
            return;
        }

        const notification = await Notification.create({ recipient, sender, type, post, comment });

        // Populate sender and post info for the real-time payload
        await notification.populate("sender", "name profileImage");
        await notification.populate("post", "title slug");

        console.log(`[Notification] Sending socket event to ${recipient.toString()}`);
        sendSocketNotification(recipient.toString(), "notification", {
            _id: notification._id,
            type: notification.type,
            sender: notification.sender,
            post: notification.post,
            comment: notification.comment,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        });

        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
};

export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .populate("sender", "name profileImage")
            .populate("post", "title slug");

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        res.status(200).json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        next(error);
    }
};

export const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user._id;
        await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        next(error);
    }
};
