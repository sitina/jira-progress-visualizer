const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { getJiraIssuesWithChangelog } = require('../../src/services/jiraClient');

describe('getJiraIssuesWithChangelog', () => {
  let mock;
  const baseUrl = 'https://goeuro.atlassian.net';
  const email = 'test@example.com';
  const token = 'test-token';

  beforeEach(() => {
    process.env.JIRA_BASE_URL = baseUrl;
    process.env.JIRA_EMAIL = email;
    process.env.JIRA_API_TOKEN = token;
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch issues with changelog', async () => {
    const jql = 'project = TEST';
    const issues = [
      {
        id: '1',
        key: 'ISSUE-1',
        fields: { status: { name: 'Done' }, created: '2024-01-01T10:00:00.000Z' },
        changelog: { histories: [] },
      },
    ];
    mock.onGet(`${baseUrl}/rest/api/3/search`, {
      params: {
        jql,
        expand: 'changelog',
        maxResults: 100,
      },
      auth: {
        username: email,
        password: token,
      },
    }).reply(200, { issues });

    const result = await getJiraIssuesWithChangelog(jql);
    expect(result).toEqual(issues);
  });

  it('should throw on API error', async () => {
    const jql = 'project = TEST';
    mock.onGet(`${baseUrl}/rest/api/3/search`).reply(500);
    await expect(getJiraIssuesWithChangelog(jql)).rejects.toThrow();
  });

  it('should throw on network error', async () => {
    const jql = 'project = TEST';
    mock.onGet(`${baseUrl}/rest/api/3/search`).networkError();
    await expect(getJiraIssuesWithChangelog(jql)).rejects.toThrow();
  });
});
