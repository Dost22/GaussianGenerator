document.addEventListener('DOMContentLoaded', function () {
  const inputN = document.getElementById('inputN');
  const generateBtn = document.getElementById('generateBtn');
  const metricsOutput = document.getElementById('metricsOutput');
  const histogramChart = document.getElementById('histogramChart');
  const tableOutput = document.querySelector('#tableOutput tbody');

  generateBtn.addEventListener('click', function () {
    const N = parseInt(inputN.value);
    const dataset = generateDataset(N);
    const metrics = calculateMetrics(dataset);

    displayMetrics(metrics);
    displayHistogram(dataset);
    displayTable(dataset);
  });

  function generateDataset(N) {
    const dataset = [];

    for (let i = 0; i < N; i++) {
      dataset.push(Math.random());
    }

    return dataset;
  }

  function calculateMetrics(dataset) {
    const sum = dataset.reduce((acc, value) => acc + value, 0);
    const mean = sum / dataset.length;
    const squaredDifferences = dataset.map(value => Math.pow(value - mean, 2));
    const variance = squaredDifferences.reduce((acc, value) => acc + value, 0) / dataset.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean,
      variance,
      stdDev
    };
  }

  function displayMetrics(metrics) {
    metricsOutput.innerHTML = `
      <p>Mean: ${metrics.mean.toFixed(2)}</p>
      <p>Variance: ${metrics.variance.toFixed(2)}</p>
      <p>Standard Deviation: ${metrics.stdDev.toFixed(2)}</p>
    `;
  }

  let histogramChartInstance = null;

  function displayHistogram(dataset) {
    const histogramData = Array.from({ length: 101 }, () => 0); // 0 to 1, 101 bins

    for (const value of dataset) {
      const binIndex = Math.floor(value * 100);
      histogramData[binIndex]++;
    }

    if (histogramChartInstance) {
      histogramChartInstance.data.datasets[0].data = histogramData;
      histogramChartInstance.update();
    } else {
      const ctx = histogramChart.getContext('2d');
      histogramChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Array.from({ length: 101 }, (_, i) => (i / 100).toFixed(2)),
          datasets: [{
            label: 'Occurrences',
            data: histogramData,
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  // Add event listener to toggle the table collapse
  const toggleTableBtn = document.getElementById('toggleTableBtn');
  toggleTableBtn.addEventListener('click', function () {
    $('#tableCollapse').collapse('toggle'); // Use jQuery to toggle collapse state
  });

  function displayTable(dataset) {
    tableOutput.innerHTML = '';
    dataset.forEach((value, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${value.toFixed(2)}</td>
      `;
      tableOutput.appendChild(row);
    });
  }
});
