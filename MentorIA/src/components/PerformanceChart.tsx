import React from 'react';
import { QuestionAttempt } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

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

interface PerformanceChartProps {
  attempts: QuestionAttempt[];
  type?: 'line' | 'bar';
  title?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  attempts, 
  type = 'line',
  title = 'Rendimiento a lo largo del tiempo'
}) => {
  const labels = attempts.map((_, index) => `Q${index + 1}`);
  
  const difficultyData = {
    labels,
    datasets: [
      {
        label: 'Nivel de dificultad',
        data: attempts.map(attempt => attempt.difficulty),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
      },
    ],
  };

  const timeData = {
    labels,
    datasets: [
      {
        label: 'Tiempo empleado (segundos)',
        data: attempts.map(attempt => attempt.timeTaken),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
      },
    ],
  };

  const correctnessData = {
    labels,
    datasets: [
      {
        label: 'Respuestas correctas',
        data: attempts.map(attempt => attempt.correct ? 1 : 0),
        backgroundColor: attempts.map(attempt => 
          attempt.correct ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderChart = (data: ChartData<'line' | 'bar', number[], string>, chartTitle: string) => {
    const chartOptions = {
      ...options,
      plugins: {
        ...options.plugins,
        title: {
          ...options.plugins.title,
          text: chartTitle,
        },
      },
    };

    if (type === 'line') {
      return <Line options={chartOptions} data={data} />;
    }
    return <Bar options={chartOptions} data={data} />;
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow">
        {renderChart(difficultyData, 'Progresi\u00f3n de dificultad')}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        {renderChart(timeData, 'Tiempo por pregunta')}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <Bar 
          options={{
            ...options,
            plugins: {
              ...options.plugins,
              title: {
                ...options.plugins.title,
                text: 'Resultados de las preguntas',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 1,
                ticks: {
                  callback: function(value: number) {
                    return value === 0 ? 'Incorrecta' : value === 1 ? 'Correcta' : '';
                  }
                }
              }
            }
          }} 
          data={correctnessData} 
        />
      </div>
    </div>
  );
};

export default PerformanceChart;