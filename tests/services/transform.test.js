const { processTransitions } = require('../../src/services/transform');

describe('processTransitions', () => {
  it('should process an issue with no transitions', () => {
    const issues = [
      {
        key: 'ISSUE-1',
        fields: {
          created: '2024-01-01T10:00:00.000Z',
          status: { name: 'Done' },
        },
        changelog: { histories: [] },
      },
    ];
    const result = processTransitions(issues);
    expect(result).toEqual({
      '2024-01-01': {
        Done: {
          count: 1,
          tickets: ['ISSUE-1'],
        },
      },
    });
  });

  it('should process an issue with multiple transitions', () => {
    const issues = [
      {
        key: 'ISSUE-2',
        fields: {
          created: '2024-01-01T10:00:00.000Z',
          status: { name: 'Done' },
        },
        changelog: {
          histories: [
            {
              created: '2024-01-02T09:00:00.000Z',
              items: [
                { field: 'status', fromString: 'Done', toString: 'In Progress' },
              ],
            },
            {
              created: '2024-01-03T09:00:00.000Z',
              items: [
                { field: 'status', fromString: 'In Progress', toString: 'Done' },
              ],
            },
          ],
        },
      },
    ];
    const result = processTransitions(issues);
    expect(result).toEqual({
      '2024-01-01': {
        Done: {
          count: 1,
          tickets: ['ISSUE-2'],
        },
      },
      '2024-01-02': {
        'In Progress': {
          count: 1,
          tickets: ['ISSUE-2'],
        },
      },
      '2024-01-03': {
        Done: {
          count: 1,
          tickets: ['ISSUE-2'],
        },
      },
    });
  });

  it('should process multiple issues with overlapping dates', () => {
    const issues = [
      {
        key: 'ISSUE-3',
        fields: {
          created: '2024-01-01T10:00:00.000Z',
          status: { name: 'Done' },
        },
        changelog: { histories: [] },
      },
      {
        key: 'ISSUE-4',
        fields: {
          created: '2024-01-01T11:00:00.000Z',
          status: { name: 'In Progress' },
        },
        changelog: { histories: [] },
      },
    ];
    const result = processTransitions(issues);
    expect(result).toEqual({
      '2024-01-01': {
        Done: {
          count: 1,
          tickets: ['ISSUE-3'],
        },
        'In Progress': {
          count: 1,
          tickets: ['ISSUE-4'],
        },
      },
    });
  });
});
