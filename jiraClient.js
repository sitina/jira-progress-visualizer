const axios = require('axios');
require('dotenv').config();

const auth = {
  username: process.env.JIRA_EMAIL,
  password: process.env.JIRA_API_TOKEN,
};

const getJiraIssuesWithChangelog = async (jql) => {
  const response = await axios.get(
    `${process.env.JIRA_BASE_URL}/rest/api/3/search`,
    {
      auth,
      params: {
        jql,
        expand: 'changelog',
        maxResults: 100,
      },
    }
  );
  return response.data.issues;
};

module.exports = { getJiraIssuesWithChangelog };