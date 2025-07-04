import User from "../models/User.js";

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUser = async (req, res) => {
    const updates = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true,
            select: '-password'
        });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch {
        res.status(500).json({ message: err.message });
    }
};

export { getCurrentUser, updateUser };