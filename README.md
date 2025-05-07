# Jira Project Progress Visualizer

This tool fetches Jira tickets with changelog data and displays how many tickets were in each status over time using a line chart.

## Setup
1. Clone the repo and navigate to the folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Jira credentials:
   ```env
   JIRA_BASE_URL=https://your-domain.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   ```
4. Run the app:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000` in your browser.

## Customize
- Modify the JQL in `index.js` to filter tickets as needed.