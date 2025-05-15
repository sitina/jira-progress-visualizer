const { processTransitions } = require('./transform');

describe('processTransitions', () => {
  it('should process an issue with no transitions', () => {
    const issues = [{
      fields: {
        status: { name: 'Done' },
        created: '2024-01-01T10:00:00.000Z'
      },
      changelog: {
        histories: []
      }
    }];

    const result = processTransitions(issues);
    expect(result).toEqual({
      '2024-01-01': { 'Done': 1 }
    });
  });

  it('should process an issue with multiple transitions', () => {
    const issues = [{
      fields: {
        status: { name: 'Done' },
        created: '2024-01-01T10:00:00.000Z'
      },
      changelog: {
        histories: [
          {
            created: '2024-01-02T10:00:00.000Z',
            items: [
              {
                field: 'status',
                fromString: 'To Do',
                toString: 'In Progress'
              }
            ]
          },
          {
            created: '2024-01-03T10:00:00.000Z',
            items: [
              {
                field: 'status',
                fromString: 'In Progress',
                toString: 'Done'
              }
            ]
          }
        ]
      }
    }];

    const result = processTransitions(issues);
    expect(result).toEqual({
      '2024-01-01': { 'Done': 1 },
      '2024-01-02': { 'In Progress': 1 },
      '2024-01-03': { 'Done': 1 }
    });
  });

  it('should process multiple issues with overlapping dates', () => {
    const issues = [
      {
        fields: {
          status: { name: 'Done' },
          created: '2024-01-01T10:00:00.000Z'
        },
        changelog: {
          histories: []
        }
      },
      {
        fields: {
          status: { name: 'In Progress' },
          created: '2024-01-01T10:00:00.000Z'
        },
        changelog: {
          histories: []
        }
      }
    ];

    const result = processTransitions(issues);
    expect(result).toEqual({
      '2024-01-01': { 'Done': 1, 'In Progress': 1 }
    });
  });
}); 