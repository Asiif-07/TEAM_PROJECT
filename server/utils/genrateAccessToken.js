import jwt from 'jsonwebtoken';

function generateAccessToken(user){

    const token = jwt.sign({
        userId: user._id,
    },     process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    } )

    return token;

}

function generateRefreshToken(user){

    const token = jwt.sign({
        userId: user._id,
    },     process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '2d'
    } )

    return token;

}

export { generateAccessToken, generateRefreshToken };