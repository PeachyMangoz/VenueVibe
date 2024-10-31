// useCharts.js
import Chart from 'chart.js/auto';

export function useCharts() {
  const chartColors = {
    primary: '#36b598',
    secondary: '#2d9b82',
    gradient: [
      '#36b598',
      '#2d9b82',
      '#248169',
      '#1b6751',
      '#124d3a',
      '#093322'
    ]
  };

  const createRatingChart = (canvas, data) => {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [
          '1 - Poor',
          '2 - Fair',
          '3 - Good',
          '4 - Very Good',
          '5 - Excellent'
        ],
        datasets: [{
          label: 'Number of Reviews',
          data: data,
          backgroundColor: chartColors.primary,
          borderColor: chartColors.secondary,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                if (Math.floor(value) === value) {
                  return value;
                }
              }
            }
          }
        }
      }
    });
  };

  const createDemographicsChart = (canvas, data) => {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: chartColors.gradient,
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              boxWidth: 12
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  };

  const destroyChart = (chart) => {
    if (chart) {
      chart.destroy();
    }
  };

  return {
    createRatingChart,
    createDemographicsChart,
    destroyChart
  };
}