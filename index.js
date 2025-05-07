const express = require('express');
const path = require('path');
const { getJiraIssuesWithChangelog } = require('./jiraClient');
const { processTransitions } = require('./transform');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/data', async (req, res) => {
  try {
    const jql = 'textfields ~ "BenerailConnect*"'; // Replace with your project's JQL or make configurable
    const issues = await getJiraIssuesWithChangelog(jql);
    const timeline = processTransitions(issues);
    res.json({ timeline, jql });
  } catch (error) {
    console.error('Error fetching Jira data:', error.message);
    res.status(500).send('Error fetching Jira data');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));