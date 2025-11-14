import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // Required only for email/password auth (not OAuth)
      required: function () {
        return this.provider === 'local';
      },
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'facebook', 'instagram'],
      required: true,
      default: 'local',
    },
    providerId: {
      type: String,
      // Required only for OAuth providers
      required: function () {
        return this.provider !== 'local';
      },
    },
    profilePicture: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    tokenExpiry: {
      type: Date,
    },
    instagramBusinessAccountId: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para melhor performance
userSchema.index({ providerId: 1, provider: 1 });
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
