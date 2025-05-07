function processTransitions(issues) {
    const timeline = {};
  
    issues.forEach(issue => {
      const transitions = issue.changelog.histories.flatMap(h => 
        h.items
          .filter(i => i.field === 'status')
          .map(i => ({
            date: new Date(h.created).toISOString().split('T')[0],
            from: i.fromString,
            to: i.toString,
          }))
      );
  
      let currentState = issue.fields.status.name;
      let creationDate = issue.fields.created.split('T')[0];
  
      transitions.unshift({ date: creationDate, to: currentState });
  
      transitions.forEach(t => {
        if (!timeline[t.date]) timeline[t.date] = {};
        timeline[t.date][t.to] = (timeline[t.date][t.to] || 0) + 1;
      });
    });
  
    return timeline;
  }
  
  module.exports = { processTransitions };