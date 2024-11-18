import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProjectAnalytics({ projectData }) {
  const commitData = {
    labels: projectData.dates,
    datasets: [
      {
        label: 'Commits',
        data: projectData.commits,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const contributorsData = {
    labels: projectData.contributors.map(c => c.name),
    datasets: [
      {
        label: 'Contributions',
        data: projectData.contributors.map(c => c.contributions),
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Commit Activity</h3>
        <Line data={commitData} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Top Contributors</h3>
        <Bar data={contributorsData} />
      </div>
    </div>
  );
}