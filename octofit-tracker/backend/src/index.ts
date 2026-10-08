import express from 'express';
import { connectDatabase } from './config/database.js';
import { Activity } from './models/activity.js';
import { Leaderboard } from './models/leaderboard.js';
import { Team } from './models/team.js';
import { User } from './models/user.js';
import { Workout } from './models/workout.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/users', async (_request, response) => {
  const users = await User.find().populate('team', 'name').sort({ username: 1 });
  response.json(users);
});

app.get('/api/teams', async (_request, response) => {
  const teams = await Team.find()
    .populate('members', 'username displayName')
    .populate('captain', 'username displayName')
    .sort({ name: 1 });
  response.json(teams);
});

app.get('/api/activities', async (_request, response) => {
  const activities = await Activity.find()
    .populate('user', 'username displayName')
    .sort({ date: -1 });
  response.json(activities);
});

app.get('/api/leaderboard', async (_request, response) => {
  const leaderboard = await Leaderboard.find({ period: 'all-time' })
    .populate('user', 'username displayName')
    .populate('team', 'name')
    .sort({ rank: 1 });
  response.json(leaderboard);
});

app.get('/api/workouts', async (_request, response) => {
  const workouts = await Workout.find().sort({ name: 1 });
  response.json(workouts);
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit API available at ${apiBaseUrl}`);
    });
  } catch (error) {
    console.error('Error starting OctoFit API:', error);
    process.exitCode = 1;
  }
}

void startServer();
