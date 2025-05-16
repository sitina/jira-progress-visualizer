# Jira Project Progress Visualizer

This tool fetches Jira tickets with changelog data and displays how many tickets were in each status over time using a line chart.

<img width="1420" alt="image" src="https://github.com/user-attachments/assets/a4dd4e18-a36a-4827-aa7f-7f0c8438da5e" />


## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with your Jira credentials:
   ```env
   JIRA_BASE_URL=https://your-domain.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   ```
3. Run the app:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000` in your browser.

## Customize
- Modify the JQL in `config/index.js` to filter tickets as needed.



## Relevant commands to control the app:
```bash
npm install
npm start for production
npm run dev for development with auto-reload
npm test for running tests
npm run test:watch for watch mode
npm run test:coverage for coverage reports
npm run lint
npm run lint:fix
```