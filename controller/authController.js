import User from '../models/User.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const login = async (req, res) => {
    try {
        console.log("I am triggered")
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // Check if user exists and password matches directly (plain text)
        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, username, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullName,
            username: user.username,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        // Clear the token from the cookie by setting an expired date
        res.clearCookie('jwt'); // Assuming the token is stored in a cookie named 'token'

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};