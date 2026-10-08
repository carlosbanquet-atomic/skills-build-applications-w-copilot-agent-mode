import { model, Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    activityType: {
      type: String,
      enum: ['running', 'cycling', 'swimming', 'strength'],
      required: true,
    },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, min: 1, required: true },
    targetGoals: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export const Workout = model('Workout', workoutSchema);
