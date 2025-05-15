const express = require('express');
const { getJiraIssuesWithChangelog } = require('../services/jiraClient');
const { processTransitions } = require('../services/transform');
const config = require('../../config');

const router = express.Router();

router.get('/data', async (req, res) => {
  console.log('📥 Received request for /data');
  try {
    const jql = config.jql.default;
    console.log('🔍 Using JQL:', jql);
    
    console.log('📡 Fetching issues from Jira...');
    const issues = await getJiraIssuesWithChangelog(jql);
    console.log(`📊 Retrieved ${issues.length} issues`);
    
    console.log('🔄 Processing transitions...');
    const timeline = processTransitions(issues);
    console.log('📈 Generated timeline with dates:', Object.keys(timeline));
    
    res.json({ timeline, jql });
    console.log('✅ Successfully sent response');
  } catch (error) {
    console.error('❌ Error fetching Jira data:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).send('Error fetching Jira data');
  }
});

module.exports = router; 