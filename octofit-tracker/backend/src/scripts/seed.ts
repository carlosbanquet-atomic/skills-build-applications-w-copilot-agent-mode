import mongoose from 'mongoose';
import { connectToDatabase } from '../config/database.js';
import { Activity } from '../models/activity.js';
import { Leaderboard } from '../models/leaderboard.js';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';
import { Workout } from '../models/workout.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectToDatabase();

    const users = await Promise.all([
      User.findOneAndUpdate(
        { username: 'maya.chen' },
        {
          $set: {
            email: 'maya.chen@example.com',
            displayName: 'Maya Chen',
            age: 29,
          },
        },
        { upsert: true, new: true, runValidators: true },
      ),
      User.findOneAndUpdate(
        { username: 'liam.patel' },
        {
          $set: {
            email: 'liam.patel@example.com',
            displayName: 'Liam Patel',
            age: 34,
          },
        },
        { upsert: true, new: true, runValidators: true },
      ),
      User.findOneAndUpdate(
        { username: 'sofia.rossi' },
        {
          $set: {
            email: 'sofia.rossi@example.com',
            displayName: 'Sofia Rossi',
            age: 26,
          },
        },
        { upsert: true, new: true, runValidators: true },
      ),
      User.findOneAndUpdate(
        { username: 'noah.kim' },
        {
          $set: {
            email: 'noah.kim@example.com',
            displayName: 'Noah Kim',
            age: 31,
          },
        },
        { upsert: true, new: true, runValidators: true },
      ),
    ]);

    const [trailblazers, waveRiders] = await Promise.all([
      Team.findOneAndUpdate(
        { name: 'Trailblazers' },
        {
          $set: {
            description: 'A running crew focused on building endurance together.',
            members: [users[0]._id, users[1]._id],
            captain: users[0]._id,
          },
        },
        { upsert: true, new: true, runValidators: true },
      ),
      Team.findOneAndUpdate(
        { name: 'Wave Riders' },
        {
          $set: {
            description: 'A balanced team mixing pool sessions and strength work.',
            members: [users[2]._id, users[3]._id],
            captain: users[2]._id,
          },
        },
        { upsert: true, new: true, runValidators: true },
      ),
    ]);

    await Promise.all([
      User.updateMany(
        { _id: { $in: [users[0]._id, users[1]._id] } },
        { $set: { team: trailblazers._id } },
      ),
      User.updateMany(
        { _id: { $in: [users[2]._id, users[3]._id] } },
        { $set: { team: waveRiders._id } },
      ),
    ]);

    const activities = [
      {
        seedKey: 'maya-morning-run',
        user: users[0]._id,
        activityType: 'running',
        durationMinutes: 42,
        distanceKm: 6.4,
        caloriesBurned: 390,
        date: new Date('2026-10-06T07:15:00Z'),
        notes: 'Easy riverside run.',
      },
      {
        seedKey: 'liam-cycling-commute',
        user: users[1]._id,
        activityType: 'cycling',
        durationMinutes: 55,
        distanceKm: 18.2,
        caloriesBurned: 510,
        date: new Date('2026-10-06T17:30:00Z'),
        notes: 'Steady-paced ride.',
      },
      {
        seedKey: 'sofia-pool-session',
        user: users[2]._id,
        activityType: 'swimming',
        durationMinutes: 35,
        distanceKm: 1.2,
        caloriesBurned: 310,
        date: new Date('2026-10-05T08:00:00Z'),
        notes: 'Technique-focused laps.',
      },
      {
        seedKey: 'noah-strength-session',
        user: users[3]._id,
        activityType: 'strength',
        durationMinutes: 48,
        caloriesBurned: 280,
        date: new Date('2026-10-05T18:00:00Z'),
        notes: 'Full-body strength circuit.',
      },
      {
        seedKey: 'maya-weekend-ride',
        user: users[0]._id,
        activityType: 'cycling',
        durationMinutes: 70,
        distanceKm: 24.5,
        caloriesBurned: 640,
        date: new Date('2026-10-04T09:00:00Z'),
        notes: 'Social weekend ride.',
      },
    ];

    await Promise.all(
      activities.map(({ seedKey, ...activity }) =>
        Activity.findOneAndUpdate(
          { seedKey },
          { $set: activity },
          { upsert: true, new: true, runValidators: true },
        ),
      ),
    );

    await Promise.all(
      [
        { user: users[0]._id, team: trailblazers._id, points: 1240, rank: 1 },
        { user: users[1]._id, team: trailblazers._id, points: 980, rank: 3 },
        { user: users[2]._id, team: waveRiders._id, points: 1130, rank: 2 },
        { user: users[3]._id, team: waveRiders._id, points: 870, rank: 4 },
      ].map((entry) =>
        Leaderboard.findOneAndUpdate(
          { user: entry.user, period: 'all-time' },
          { $set: { ...entry, period: 'all-time' } },
          { upsert: true, new: true, runValidators: true },
        ),
      ),
    );

    const workouts = [
      {
        name: 'Beginner Endurance Run',
        description: 'Build an aerobic base with comfortable, conversational running.',
        activityType: 'running',
        difficulty: 'beginner',
        durationMinutes: 30,
        targetGoals: ['endurance', 'general fitness'],
      },
      {
        name: 'Tempo Cycling Builder',
        description: 'Alternate steady tempo efforts with easy recovery riding.',
        activityType: 'cycling',
        difficulty: 'intermediate',
        durationMinutes: 45,
        targetGoals: ['endurance', 'speed'],
      },
      {
        name: 'Pool Technique Session',
        description: 'Practice relaxed form with short, controlled swim intervals.',
        activityType: 'swimming',
        difficulty: 'beginner',
        durationMinutes: 35,
        targetGoals: ['technique', 'endurance'],
      },
      {
        name: 'Full-Body Strength Circuit',
        description: 'A balanced circuit using foundational bodyweight movements.',
        activityType: 'strength',
        difficulty: 'intermediate',
        durationMinutes: 40,
        targetGoals: ['strength', 'general fitness'],
      },
    ];

    await Promise.all(
      workouts.map(({ name, ...workout }) =>
        Workout.findOneAndUpdate(
          { name },
          { $set: workout },
          { upsert: true, new: true, runValidators: true },
        ),
      ),
    );

    console.log('Database seeding complete');
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Error seeding database:', error);
  process.exitCode = 1;
});
