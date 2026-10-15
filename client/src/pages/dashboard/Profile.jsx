import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FileText, User, Mail, Calendar, Camera, XCircle, Lock, ChevronDown, ArrowLeft, Crown, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { updateProfilePic, updateEmail, changePassword } from "../../api/user";
import { verifySession, cancelSubscription } from "../../api/stripe";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function Profile() {
    const { t } = useTranslation();
    const { user, setUser, accessToken, refreshAccessToken } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const fileInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [emailData, setEmailData] = useState({ email: "" });
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);


    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        const success = searchParams.get("success");

        if (success === "true" && sessionId && !verifying) {
            setVerifying(true);
            toast.loading(t("Verifying your payment..."), { id: "verify-payment" });

            verifySession({ sessionId, accessToken, refreshAccessToken })
                .then((res) => {
                    if (res && res.user) {
                        setUser(res.user);
                        localStorage.setItem("currentUser", JSON.stringify(res.user));
                        toast.success(t("Payment Successful! Premium activated."), { id: "verify-payment" });
                    }
                    searchParams.delete("session_id");
                    searchParams.delete("success");
                    setSearchParams(searchParams, { replace: true });
                })
                .catch((err) => {
                    toast.error(err.message || t("Could not verify payment."), { id: "verify-payment" });
                })
                .finally(() => {
                    setVerifying(false);
                });
        }
    }, [searchParams, accessToken, refreshAccessToken, t, setUser, setSearchParams, verifying]);

    const handleCancelSubscription = async () => {
        setCanceling(true);
        toast.loading(t("Canceling subscription..."), { id: "cancel-sub" });

        try {
            const res = await cancelSubscription({ accessToken, refreshAccessToken });
            if (res && res.user) {
                setUser(res.user);
                localStorage.setItem("currentUser", JSON.stringify(res.user));
                toast.success(t("Your subscription has been successfully canceled."), { id: "cancel-sub" });
            }
        } catch (error) {
            toast.error(error.message || t("Failed to cancel subscription."), { id: "cancel-sub" });
        } finally {
            setCanceling(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await updateProfilePic({
                accessToken,
                refreshAccessToken,
                file
            });

            if (response.success && response.data) {
                setUser(response.data);
                localStorage.setItem("currentUser", JSON.stringify(response.data));
                toast.success(t("Profile picture updated!"));
            }
        } catch (error) {
            console.error("Failed to upload profile picture:", error);
            toast.error(t("Failed to update profile picture"));
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        if (!emailData.email) return toast.error(t("Please enter a new email"));
        if (emailData.email === user.email) return toast.error(t("New email must be different"));

        setUpdatingEmail(true);
        try {
            const res = await updateEmail({
                accessToken,
                refreshAccessToken,
                email: emailData.email
            });
            if (res.success) {
                setUser(res.data);
                localStorage.setItem("currentUser", JSON.stringify(res.data));
                toast.success(t("Email updated successfully!"));
                setShowEmailForm(false);
                setEmailData({ email: "" });
            }
        } catch (error) {
            toast.error(error.message || t("Failed to update email"));
        } finally {
            setUpdatingEmail(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = passwordData;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return toast.error(t("Please fill in all fields"));
        }
        if (newPassword !== confirmPassword) {
            return toast.error(t("Passwords do not match"));
        }
        if (newPassword.length < 6) {
            return toast.error(t("Password must be at least 6 characters"));
        }

        setUpdatingPassword(true);
        try {
            const res = await changePassword({
                accessToken,
                refreshAccessToken,
                oldPassword,
                newPassword
            });
            if (res.success) {
                toast.success(t("Password updated successfully!"));
                setShowPasswordForm(false);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            toast.error(error.message || t("Failed to update password"));
        } finally {
            setUpdatingPassword(false);
        }
    };

    if (!user) {
        return (
            <div className="mx-auto max-w-md px-4 py-24 text-center">
                <h1 className="text-xl font-bold text-slate-900">{t("Login To View Profile")}</h1>
            </div>
        );
    }

    const isPremium = user.subscriptionStatus === "active";
    const status = user.subscriptionStatus || "none";
    const STATUS_LABELS = {
        active: t("Active"),
        trialing: t("Trial"),
        past_due: t("Payment past due"),
        unpaid: t("Unpaid"),
        incomplete: t("Incomplete"),
        incomplete_expired: t("Expired"),
        canceled: t("Canceled"),
    };
    const planName = isPremium ? t("Premium Member") : t("Free Plan");
    const statusLabel = STATUS_LABELS[status];
    const username = user.username || user.email?.split("@")[0];
    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
        : t("Active Member");

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10";

    return (
        <div className="bg-mesh min-h-screen px-4 pb-24 pt-8 sm:px-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                >
                    <ArrowLeft size={16} />
                    {t("Back to Dashboard", "Back to Dashboard")}
                </Link>

                {/* Identity card */}
                <section className="animate-fade-in-up overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-28 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 sm:h-32" />
                    <div className="px-6 pb-8 sm:px-10">
                        <div className="-mt-14 flex flex-col items-center gap-5 sm:-mt-16 sm:flex-row sm:items-end">
                            <div className="relative shrink-0">
                                {user.profileImage?.secure_url ? (
                                    <img
                                        src={user.profileImage.secure_url}
                                        alt={user.name}
                                        className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-md sm:h-32 sm:w-32"
                                    />
                                ) : (
                                    <span className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-slate-900 text-4xl font-extrabold text-white shadow-md sm:h-32 sm:w-32">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={uploading}
                                    aria-label={t("Change profile picture", "Change profile picture")}
                                    className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition hover:scale-105 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                                </button>
                            </div>

                            <div className="min-w-0 flex-1 text-center sm:pb-2 sm:text-left">
                                <h1 className="truncate text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{user.name}</h1>
                                <p className="truncate text-sm text-slate-500">@{username}</p>
                            </div>

                            <div className="flex flex-col items-center gap-2 sm:items-end sm:pb-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                                        isPremium
                                            ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm"
                                            : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {isPremium && <Crown size={12} />}
                                    {isPremium ? t("Premium Member") : t("Free Plan")}
                                </span>
                                {isPremium && (
                                    <button
                                        type="button"
                                        onClick={handleCancelSubscription}
                                        disabled={canceling}
                                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {canceling ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                        {canceling ? t("Canceling...") : t("Cancel Premium")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Account details */}
                <section
                    style={{ animationDelay: "80ms" }}
                    className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3"
                >
                    <h2 className="px-4 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        {t("Account", "Account")}
                    </h2>

                    {/* Email */}
                    <Row icon={Mail} tone="blue" label={t("Email Address")} value={user.email}>
                        <ToggleButton open={showEmailForm} onClick={() => setShowEmailForm(!showEmailForm)} label={t("Edit")} />
                    </Row>
                    <Collapsible open={showEmailForm}>
                        <form onSubmit={handleUpdateEmail} className="mx-3 mb-3 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <input
                                type="email"
                                placeholder={t("Enter new email")}
                                value={emailData.email}
                                onChange={(e) => setEmailData({ email: e.target.value })}
                                className={inputClass}
                            />
                            <button
                                type="submit"
                                disabled={updatingEmail}
                                className="flex w-full items-center justify-center rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {updatingEmail ? <Loader2 size={18} className="animate-spin" /> : t("Update Email")}
                            </button>
                        </form>
                    </Collapsible>

                    {/* Password */}
                    <Row icon={Lock} tone="red" label={t("Password")} value="••••••••">
                        <ToggleButton open={showPasswordForm} onClick={() => setShowPasswordForm(!showPasswordForm)} label={t("Change")} />
                    </Row>
                    <Collapsible open={showPasswordForm}>
                        <form onSubmit={handleUpdatePassword} className="mx-3 mb-3 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <input
                                type="password"
                                placeholder={t("Current Password")}
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                className={inputClass}
                            />
                            <input
                                type="password"
                                placeholder={t("New Password")}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className={inputClass}
                            />
                            <input
                                type="password"
                                placeholder={t("Confirm New Password")}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className={inputClass}
                            />
                            <button
                                type="submit"
                                disabled={updatingPassword}
                                className="flex w-full items-center justify-center rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {updatingPassword ? <Loader2 size={18} className="animate-spin" /> : t("Change Password")}
                            </button>
                        </form>
                    </Collapsible>

                    <Row icon={User} tone="green" label={t("Username")} value={`@${username}`} />
                    <Row icon={Calendar} tone="violet" label={t("Member Since")} value={memberSince} />
                </section>

                {/* Subscription */}
                <section
                    style={{ animationDelay: "120ms" }}
                    className="animate-fade-in-up rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                    <h2 className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        {t("Subscription", "Subscription")}
                    </h2>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <span
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                                    isPremium ? "bg-amber-50 text-amber-500" : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {isPremium ? <Crown size={22} /> : <Sparkles size={22} />}
                            </span>
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    {t("Current Plan", "Current Plan")}
                                </p>
                                <p className="truncate text-lg font-bold text-slate-900">
                                    {user.subscriptionPlan || planName}
                                </p>
                                {statusLabel && (
                                    <span
                                        className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            isPremium || status === "trialing"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-amber-50 text-amber-700"
                                        }`}
                                    >
                                        {statusLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Link
                            to="/services"
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                        >
                            {isPremium ? t("View Plans", "View Plans") : t("Upgrade Plan", "Upgrade Plan")}
                            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>

                {/* Quick action */}
                <Link
                    to="/my-cvs"
                    style={{ animationDelay: "200ms" }}
                    className="animate-fade-in-up group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    <span className="flex items-center gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                            <FileText size={20} />
                        </span>
                        <span className="font-semibold text-slate-900">{t("My CV Dashboard")}</span>
                    </span>
                    <ArrowLeft size={18} className="rotate-180 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                </Link>
            </div>
        </div>
    );
}

const TONES = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-500",
    green: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
};

function Row({ icon, tone, label, value, children }) {
    const Icon = icon;
    return (
        <div className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition hover:bg-slate-50">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
                <Icon size={20} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                <span className="block truncate text-[15px] font-semibold text-slate-900">{value}</span>
            </span>
            {children}
        </div>
    );
}

function ToggleButton({ open, onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
            {label}
            <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
    );
}

// Height-animating wrapper using the grid 0fr -> 1fr technique.
function Collapsible({ open, children }) {
    return (
        <div
            className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
            aria-hidden={!open}
        >
            <div className="overflow-hidden">{children}</div>
        </div>
    );
}
