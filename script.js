document.addEventListener('DOMContentLoaded', function () {
  const inputN = document.getElementById('inputN');
  const generateBtn = document.getElementById('generateBtn');
  const metricsOutput = document.getElementById('metricsOutput');
  const histogramChart = document.getElementById('histogramChart');
  const tableOutput = document.querySelector('#tableOutput tbody');

  generateBtn.addEventListener('click', function () {
    const N = parseInt(inputN.value);
    const dataset = generateGaussianData(N,0,1);
    const metrics = calculateMetrics(dataset);

    displayMetrics(metrics);
    displayHistogram(dataset);
    displayTable(dataset);
  });
  function randomNormal() {
      return Math.cos(2 * Math.PI * Math.random()) * Math.sqrt(-2 * Math.log(Math.random()));
  }
  function generateGaussianData(numSamples, mean, stddev) {
    const gaussianData = [];
    for (let i = 0; i < numSamples; i++) {
        const value = mean + stddev * randomNormal();
        gaussianData.push(Math.max(0, Math.min(1, value))); 
    }
    return gaussianData;
  }
  function calculateMetrics(dataset) {
    const sum = dataset.reduce((acc, value) => acc + value, 0);
    const mean = sum / dataset.length;
    const squaredDifferences = dataset.map(value => Math.pow(value - mean, 2));
    const variance = squaredDifferences.reduce((acc, value) => acc + value, 0) / dataset.length;
    const stdDev = Math.sqrt(variance);
    const minima = Math.min(...dataset);
    const maxima = Math.max(...dataset);
    return {
      mean,
      variance,
      stdDev,
      sum,
      squaredDifferences,
      minima,
      maxima,
    };
  }

  function displayMetrics(metrics) {
    metricsOutput.innerHTML = `
      <p>Mean: ${metrics.mean.toFixed(3)}</p>
      <p>Variance: ${metrics.variance.toFixed(3)}</p>
      <p>Standard Deviation: ${metrics.stdDev.toFixed(3)}</p>
      <p>Sum: ${metrics.sum.toFixed(3)}</p>
      <p>Minima: ${metrics.minima.toFixed(3)}</p>
      <p>Maxima: ${metrics.maxima.toFixed(3)}</p>
    `;
  }

  let histogramChartInstance = null;

  function displayHistogram(dataset) {
    const histogramData = Array.from({ length: 101 }, () => 0);

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

  const toggleTableBtn = document.getElementById('toggleTableBtn');
  toggleTableBtn.addEventListener('click', function () {
    $('#tableCollapse').collapse('toggle'); 
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
