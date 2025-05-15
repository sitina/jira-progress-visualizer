require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jira: {
    baseUrl: process.env.JIRA_BASE_URL,
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN
  },
  jql: {
    default: 'textfields ~ "BenerailConnect*"'
  }
}; 