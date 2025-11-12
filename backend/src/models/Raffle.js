import mongoose from 'mongoose';

const raffleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    postId: {
      type: String,
      required: true,
    },
    postUrl: {
      type: String,
      required: true,
    },
    postCaption: {
      type: String,
    },
    postImage: {
      type: String,
    },
    numberOfWinners: {
      type: Number,
      required: true,
      min: 1,
    },
    totalComments: {
      type: Number,
      required: true,
    },
    uniqueParticipants: {
      type: Number,
      required: true,
    },
    winners: [
      {
        username: String,
        userId: String,
        comment: String,
        timestamp: Date,
      },
    ],
    allParticipants: [
      {
        username: String,
        userId: String,
        commentCount: Number,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para consultas eficientes
raffleSchema.index({ user: 1, createdAt: -1 });
raffleSchema.index({ postId: 1 });

const Raffle = mongoose.model('Raffle', raffleSchema);

export default Raffle;
