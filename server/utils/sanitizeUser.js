const sanitizeUser = (userDoc) => {
    if (!userDoc) return null;

    return {
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        gender: userDoc.gender,
        profileImage: userDoc.profileImage,
        googleId: userDoc.googleId,
        linkedinId: userDoc.linkedinId,
        subscriptionStatus: userDoc.subscriptionStatus,
        subscriptionPlan: userDoc.subscriptionPlan,
        createdAt: userDoc.createdAt,
        updatedAt: userDoc.updatedAt,
    };
};

export default sanitizeUser;
