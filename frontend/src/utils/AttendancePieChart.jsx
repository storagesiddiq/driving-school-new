import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendancePieChart = ({ attendancePercentage }) => {
  // Ensure attendancePercentage is valid and within 0-100 range
  const validAttendance = attendancePercentage ? Math.min(Math.max(attendancePercentage, 0), 100) : 0;

  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'Attendance',
        data: [validAttendance, 100 - validAttendance],
        backgroundColor: ['#4CAF50', '#F44336'], // Green for present, Red for absent
        hoverBackgroundColor: ['#45A049', '#E53935'],
        borderColor: ['#4CAF50', '#F44336'], // Border color of the segments
        borderWidth: 1, // Border width of the segments
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart remains circular in its container
    plugins: {
      legend: {
        position: 'top', // Places the legend at the top
        labels: {
          color: '#333', // Color of the legend text
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full my-10 max-w-xs mx-auto" style={{ height: '250px' }}>
      <Doughnut data={data} options={options} />
      <div className="my-5 text-center mt-4">
        <p className="text-xl font-bold">{validAttendance.toFixed(2)}% Attendance</p>
      </div>
    </div>
  );
};

export default AttendancePieChart;
