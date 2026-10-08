import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
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
    await connectDatabase();

    const users = await Promise.all(
      [
        { username: 'maya.chen', email: 'maya.chen@example.com', displayName: 'Maya Chen', age: 29 },
        { username: 'liam.patel', email: 'liam.patel@example.com', displayName: 'Liam Patel', age: 34 },
        { username: 'sofia.rossi', email: 'sofia.rossi@example.com', displayName: 'Sofia Rossi', age: 26 },
        { username: 'noah.kim', email: 'noah.kim@example.com', displayName: 'Noah Kim', age: 31 },
      ].map(async (userData) => {
        const existingUser = await User.findOne({ username: userData.username });
        if (existingUser) {
          existingUser.set(userData);
          return existingUser.save();
        }
        return User.create(userData);
      }),
    );

    const teams = await Promise.all(
      [
        {
          name: 'Trailblazers',
          description: 'A running crew focused on building endurance together.',
          members: [users[0]._id, users[1]._id],
          captain: users[0]._id,
        },
        {
          name: 'Wave Riders',
          description: 'A balanced team mixing pool sessions and strength work.',
          members: [users[2]._id, users[3]._id],
          captain: users[2]._id,
        },
      ].map(async (teamData) => {
        const existingTeam = await Team.findOne({ name: teamData.name });
        if (existingTeam) {
          existingTeam.set(teamData);
          return existingTeam.save();
        }
        return Team.create(teamData);
      }),
    );
    const [trailblazers, waveRiders] = teams;

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
      activities.map(async (activity) => {
        const existingActivity = await Activity.findOne({ seedKey: activity.seedKey });
        if (existingActivity) {
          existingActivity.set(activity);
          return existingActivity.save();
        }
        return Activity.create(activity);
      }),
    );

    await Promise.all(
      [
        { user: users[0]._id, team: trailblazers._id, points: 1240, rank: 1 },
        { user: users[1]._id, team: trailblazers._id, points: 980, rank: 3 },
        { user: users[2]._id, team: waveRiders._id, points: 1130, rank: 2 },
        { user: users[3]._id, team: waveRiders._id, points: 870, rank: 4 },
      ].map(async (entry) => {
        const leaderboardData = { ...entry, period: 'all-time' as const };
        const existingEntry = await Leaderboard.findOne({
          user: entry.user,
          period: 'all-time',
        });
        if (existingEntry) {
          existingEntry.set(leaderboardData);
          return existingEntry.save();
        }
        return Leaderboard.create(leaderboardData);
      }),
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
      workouts.map(async (workoutData) => {
        const existingWorkout = await Workout.findOne({ name: workoutData.name });
        if (existingWorkout) {
          existingWorkout.set(workoutData);
          return existingWorkout.save();
        }
        return Workout.create(workoutData);
      }),
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
