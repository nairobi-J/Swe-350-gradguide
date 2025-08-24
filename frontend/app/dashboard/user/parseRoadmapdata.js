const parseRoadmapData = (text) => {
  const sections = text.split('Phase ').slice(1);
  const data = sections.map((section, index) => {
    const phaseNumber = index + 1;
    const [titleLine, ...contentLines] = section.split('\n');
    const titleMatch = titleLine.match(/(\d+): (.*?) \((.*?)\)/);
  
    // Extracting Phase Title and Timeline
    const phaseTitle = titleMatch ? titleMatch[2] : `Phase ${phaseNumber}`;
    const timeline = titleMatch ? titleMatch[3] : '';

    // A simple way to get tasks for each phase
    const tasks = contentLines.filter(line => line.trim().startsWith('Month') || line.trim().startsWith('Project')).map(line => {
      const isTask = line.trim().startsWith('Month');
      return {
        type: isTask ? 'task' : 'project',
        text: line.trim()
      };
    });

    return {
      phase: `Phase ${phaseNumber}`,
      title: phaseTitle,
      timeline,
      tasks,
    };
  });
  console.log(data);
  return data;
};