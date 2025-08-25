import React from 'react';

const Roadmap = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 bg-gray-100 rounded-lg">
      {data.map((phase, index) => (
        <div 
          key={index} 
          className="rounded-lg overflow-hidden bg-white shadow-md flex flex-col"
        >
          <div className="text-center p-3 text-white bg-green-500">
            <h3 className="m-0 text-lg font-semibold">{phase.phase}</h3>
            <h4 className="m-0 text-sm font-medium">{phase.timeline}</h4>
          </div>
          <div className="p-4 flex-grow">
            <h5 className="font-bold mt-0 border-b-2 border-gray-200 pb-1 text-base">
              {phase.title}
            </h5>
            {phase.tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="mb-2 p-1 border-l-4 border-green-400">
                <p className="text-sm m-0">{task.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Roadmap;
