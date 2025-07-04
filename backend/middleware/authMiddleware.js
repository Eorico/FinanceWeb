import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    let token;

    token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Not Authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Token not valid' })
    }
};

export default protect;