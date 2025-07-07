import User from "../models/User.js";

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log('Returning user:', user.toObject());

        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUser = async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        bio: req.body.bio,
        preferences: req.body.preferences
    };

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
            );

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.setHeader('Cache-Control', 'no-cache');
        res.json({ user });

        if (updates.name) user.name = updates.name;
        if (updates.email) user.email = updates.email;
        if (updates.phone) user.phone = updates.phone;
        if (updates.bio) user.bio = updates.bio;

        // Save manually
        await user.save();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateBudgets = async (req, res) => {
    const {budget} = req.body;
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: {budget} },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updateUser) {
            return res.status(404).json({ message: 'User not Found' })
        }

        res.json({ user: updateUser })
    } catch (err) {
        console.error('Failed to update budgets:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTransactions = async (req, res) => {
  const { transactions } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { transactions } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ user: updatedUser });
  } catch (err) {
    console.error('Transaction update failed:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getCurrentUser, updateUser, updateBudgets, updateTransactions };