const User = require('../models/User');

// @desc    Toggle product in wishlist
// @route   PUT /api/users/wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(req.user._id);
    const index = user.wishlist.indexOf(productId);

    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('wishlist', 'name price images brand category rating');

    res.json({
      wishlist: updatedUser.wishlist,
      message: index > -1 ? 'Removed from wishlist' : 'Added to wishlist',
    });
  } catch (error) {
    console.error('ToggleWishlist Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle product in compare list
// @route   PUT /api/users/compare
// @access  Private
const toggleCompare = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(req.user._id);
    const index = user.compareList.indexOf(productId);

    if (index > -1) {
      // Remove from compare
      user.compareList.splice(index, 1);
    } else {
      // Max 3 products in compare
      if (user.compareList.length >= 3) {
        return res.status(400).json({ message: 'Compare list can have maximum 3 products' });
      }
      user.compareList.push(productId);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('compareList', 'name price images brand category specs rating');

    res.json({
      compareList: updatedUser.compareList,
      message: index > -1 ? 'Removed from compare' : 'Added to compare',
    });
  } catch (error) {
    console.error('ToggleCompare Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price originalPrice images brand category rating stock');

    res.json(user.wishlist);
  } catch (error) {
    console.error('GetWishlist Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get compare list
// @route   GET /api/users/compare
// @access  Private
const getCompareList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('compareList', 'name price originalPrice images brand category specs rating stock');

    res.json(user.compareList);
  } catch (error) {
    console.error('GetCompareList Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.json({
      users,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
      },
    });
  } catch (error) {
    console.error('GetAllUsers Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/users/:id/role
// @access  Admin
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent removing the last admin (assuming at least one is needed, but simple check here)
    if (user.email === 'admin@gadgethub.com' && req.body.role === 'user') {
      return res.status(400).json({ message: 'Cannot demote the main admin account' });
    }

    user.role = req.body.role || user.role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('UpdateUserRole Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.email === 'admin@gadgethub.com') {
      return res.status(400).json({ message: 'Cannot delete the main admin account' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('DeleteUser Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      // Option to add email or password updates later if needed
      
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        message: 'Profile updated successfully'
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('UpdateProfile Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  toggleWishlist,
  toggleCompare,
  getWishlist,
  getCompareList,
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUserProfile,
};
