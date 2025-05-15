const request = require('supertest');
const express = require('express');
const { getJiraIssuesWithChangelog } = require('../../src/services/jiraClient');
const { processTransitions } = require('../../src/services/transform');
const routes = require('../../src/api/routes');

// Mock the dependencies
jest.mock('../../src/services/jiraClient');
jest.mock('../../src/services/transform');

describe('API Endpoints', () => {
  let app;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a new app instance for each test
    app = express();
    app.use('/', routes);
  });

  describe('GET /data', () => {
    it('should return timeline and JQL data', async () => {
      const mockIssues = [
        {
          id: '1',
          fields: {
            status: { name: 'To Do' },
            created: '2024-01-01T10:00:00.000Z',
          },
          changelog: {
            histories: [],
          },
        },
      ];

      const mockTimeline = {
        '2024-01-01': { 'To Do': 1 },
      };

      getJiraIssuesWithChangelog.mockResolvedValue(mockIssues);
      processTransitions.mockReturnValue(mockTimeline);

      const response = await request(app)
        .get('/data')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        timeline: mockTimeline,
        jql: 'textfields ~ "BenerailConnect*"',
      });

      expect(getJiraIssuesWithChangelog).toHaveBeenCalledWith('textfields ~ "BenerailConnect*"');
      expect(processTransitions).toHaveBeenCalledWith(mockIssues);
    });

    it('should handle Jira API errors', async () => {
      getJiraIssuesWithChangelog.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/data')
        .expect(500);

      expect(response.text).toBe('Error fetching Jira data');
    });
  });
});
