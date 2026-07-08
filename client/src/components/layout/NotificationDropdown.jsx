import React, { useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { Bell, Heart, MessageCircle, User as UserIcon, CheckCheck, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import * as notificationApi from "../../api/notification";

const NotificationDropdown = () => {
    const { notifications, fetchNotifications } = useNotification();
    const { accessToken, refreshAccessToken } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleMarkAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead({ accessToken, refreshAccessToken });
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationApi.markAsRead(id, { accessToken, refreshAccessToken });
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.isRead) {
            await handleMarkAsRead(notification._id);
        }

        // Navigate to post if slug exists
        if (notification.post?.slug) {
            navigate(`/blogs/${notification.post.slug}`);
            setIsOpen(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "like": return <Heart size={14} className="text-red-500 fill-red-500" />;
            case "reply": return <MessageCircle size={14} className="text-blue-500" />;
            case "mention": return <UserIcon size={14} className="text-purple-500" />;
            default: return <Bell size={14} className="text-gray-500" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all text-gray-600 hover:text-blue-600 group cursor-pointer"
            >
                <Bell size={20} className="group-active:scale-95 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-[24px] shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">Notifications</h4>
                            <div className="flex items-center gap-3">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                                    >
                                        <CheckCheck size={12} />
                                        Mark all read
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-[360px] overflow-y-auto scrollbar-hide">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center space-y-3">
                                    <Bell size={32} className="mx-auto text-gray-200" />
                                    <p className="text-xs text-gray-400 font-medium">All caught up!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-4 flex gap-3 hover:bg-blue-50/30 transition-colors cursor-pointer relative ${!notification.isRead ? 'bg-blue-50/10' : ''}`}
                                        >
                                            <div className="shrink-0 relative">
                                                <div className="w-10 h-10 rounded-2xl overflow-hidden bg-gray-100 ring-2 ring-white">
                                                    {notification.sender?.profileImage?.secure_url ? (
                                                        <img src={notification.sender.profileImage.secure_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xs font-black">
                                                            {notification.sender?.name?.[0]?.toUpperCase() || "?"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    {getTypeIcon(notification.type)}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <p className="text-xs text-gray-700 leading-snug">
                                                    <span className="font-black text-gray-900">{notification.sender?.name}</span>
                                                    {' '}
                                                    {notification.type === 'like' ? 'liked your post' :
                                                        notification.type === 'reply' ? 'replied to your comment' :
                                                            'sent you a notification'}
                                                    {notification.post?.title && (
                                                        <span className="text-gray-400"> on "{notification.post.title.substring(0, 20)}..."</span>
                                                    )}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                                    <Clock size={10} />
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </div>
                                            </div>

                                            {!notification.isRead && (
                                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-gray-50 text-center">
                            <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                                View Activity Log
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationDropdown;
