import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const generateTokenAndSetCookie = (userId,username, res) => {
    const token = jwt.sign({ userId,username }, JWT_SECRET, {
        expiresIn: "15d",
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // Prevent XSS
        sameSite: 'None' , // Prevent CSRF
        secure: true, // Use secure cookies only in production
    });
};

export default generateTokenAndSetCookie;