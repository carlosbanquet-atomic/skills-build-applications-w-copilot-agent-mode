import { model, Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    seedKey: { type: String, unique: true, sparse: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: {
      type: String,
      enum: ['running', 'cycling', 'swimming', 'strength'],
      required: true,
    },
    durationMinutes: { type: Number, min: 1, required: true },
    distanceKm: { type: Number, min: 0 },
    caloriesBurned: { type: Number, min: 0, required: true },
    date: { type: Date, required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Activity = model('Activity', activitySchema);
