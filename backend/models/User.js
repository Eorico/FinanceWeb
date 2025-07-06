import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is Invalid');
            }
        },
    },
     password: {
    type: String,
    required: true,
    minlength: 6,
    },
    phone: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    preferences: {
        theme: { type: String, default: 'light' },
        currency: { type: String, default: 'USD' },
        language: { type: String, default: 'en' },
        dateFormat: { type: String, default: 'MM/DD/YYYY' }
    },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);