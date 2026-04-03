const sanitizeUser = (userDoc) => {
    if (!userDoc) return null;

    return {
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        gender: userDoc.gender,
        createdAt: userDoc.createdAt,
        updatedAt: userDoc.updatedAt,
    };
};

export default sanitizeUser;
