function processTransitions(issues) {
  console.log('🔄 Starting to process transitions for', issues.length, 'issues');
  const timeline = {};

  issues.forEach((issue, index) => {
    console.log(`📝 Processing issue ${index + 1}/${issues.length}`);
    
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

    console.log(`📅 Issue created on ${creationDate} with status ${currentState}`);
    console.log(`🔄 Found ${transitions.length} status transitions`);

    transitions.unshift({ date: creationDate, to: currentState });

    transitions.forEach(t => {
      if (!timeline[t.date]) timeline[t.date] = {};
      timeline[t.date][t.to] = (timeline[t.date][t.to] || 0) + 1;
    });
  });

  console.log('📊 Final timeline dates:', Object.keys(timeline));
  return timeline;
}

module.exports = { processTransitions };