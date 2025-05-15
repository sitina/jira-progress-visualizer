const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { getJiraIssuesWithChangelog } = require('../../src/services/jiraClient');

describe('getJiraIssuesWithChangelog', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    process.env.JIRA_BASE_URL = 'https://test.atlassian.net';
    process.env.JIRA_EMAIL = 'test@example.com';
    process.env.JIRA_API_TOKEN = 'test-token';
  });

  afterEach(() => {
    mock.reset();
  });

  it('should fetch issues with changelog', async () => {
    const mockIssues = [
      {
        id: '1',
        fields: {
          status: { name: 'To Do' },
          created: '2024-01-01T10:00:00.000Z'
        },
        changelog: {
          histories: []
        }
      }
    ];

    mock.onGet(`${process.env.JIRA_BASE_URL}/rest/api/3/search`, {
      params: {
        jql: 'test query',
        expand: 'changelog',
        maxResults: 100
      },
      auth: {
        username: process.env.JIRA_EMAIL,
        password: process.env.JIRA_API_TOKEN
      }
    }).reply(200, { issues: mockIssues });

    const result = await getJiraIssuesWithChangelog('test query');
    expect(result).toEqual(mockIssues);
  });

  it('should handle API errors', async () => {
    mock.onGet(`${process.env.JIRA_BASE_URL}/rest/api/3/search`, {
      params: {
        jql: 'test query',
        expand: 'changelog',
        maxResults: 100
      },
      auth: {
        username: process.env.JIRA_EMAIL,
        password: process.env.JIRA_API_TOKEN
      }
    }).reply(500);

    await expect(getJiraIssuesWithChangelog('test query')).rejects.toThrow();
  });

  it('should handle network errors', async () => {
    mock.onGet(`${process.env.JIRA_BASE_URL}/rest/api/3/search`, {
      params: {
        jql: 'test query',
        expand: 'changelog',
        maxResults: 100
      },
      auth: {
        username: process.env.JIRA_EMAIL,
        password: process.env.JIRA_API_TOKEN
      }
    }).networkError();

    await expect(getJiraIssuesWithChangelog('test query')).rejects.toThrow();
  });
}); 