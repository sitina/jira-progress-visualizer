function processTransitions(issues) {
  console.log('🔄 Starting to process transitions for', issues.length, 'issues');
  const timeline = {};

  issues.forEach((issue, index) => {
    console.log(`📝 Processing issue ${index + 1}/${issues.length}`);

    // Get all transitions for this issue
    const transitions = issue.changelog.histories.flatMap((h) => h.items
      .filter((i) => i.field === 'status')
      .map((i) => ({
        date: new Date(h.created).toISOString().split('T')[0],
        from: i.fromString,
        to: i.toString,
      })));

    // Add initial state
    const creationDate = issue.fields.created.split('T')[0];
    transitions.unshift({
      date: creationDate,
      to: issue.fields.status.name,
    });

    // Group transitions by date
    const transitionsByDate = transitions.reduce((acc, t) => {
      if (!acc[t.date]) {
        acc[t.date] = [];
      }
      acc[t.date].push(t);
      return acc;
    }, {});

    // For each date, use the last transition of the day
    Object.entries(transitionsByDate).forEach(([date, dayTransitions]) => {
      // Get the final status for this day
      const finalStatus = dayTransitions[dayTransitions.length - 1].to;

      if (!timeline[date]) {
        timeline[date] = {};
      }
      if (!timeline[date][finalStatus]) {
        timeline[date][finalStatus] = {
          count: 0,
          tickets: new Set(), // Use Set to automatically handle duplicates
        };
      }

      timeline[date][finalStatus].count += 1;
      timeline[date][finalStatus].tickets.add(issue.key);
    });
  });

  // Convert Sets to Arrays before returning
  Object.values(timeline).forEach((dateData) => {
    Object.values(dateData).forEach((statusData) => {
      const newStatusData = { ...statusData };
      newStatusData.tickets = Array.from(statusData.tickets);
      Object.assign(statusData, newStatusData);
    });
  });

  console.log('📊 Final timeline dates:', Object.keys(timeline));
  return timeline;
}

module.exports = { processTransitions };
