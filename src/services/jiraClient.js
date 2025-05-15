const axios = require('axios');
const config = require('../../config');

async function getJiraIssuesWithChangelog(jql) {
  console.log('🔑 Using Jira credentials:', {
    baseUrl: config.jira.baseUrl,
    email: config.jira.email,
    hasToken: !!config.jira.apiToken,
  });

  try {
    const response = await axios.get(`${config.jira.baseUrl}/rest/api/3/search`, {
      params: {
        jql,
        expand: 'changelog',
        maxResults: 100,
      },
      auth: {
        username: config.jira.email,
        password: config.jira.apiToken,
      },
    });

    console.log('📡 Jira API Response Status:', response.status);
    return response.data.issues;
  } catch (error) {
    console.error('❌ Jira API Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    throw error;
  }
}

module.exports = { getJiraIssuesWithChangelog };
