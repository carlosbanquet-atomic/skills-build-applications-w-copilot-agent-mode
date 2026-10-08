import { connectDatabase } from './config/database.js';
import app from './index.js';

const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

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
