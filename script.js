document.addEventListener('DOMContentLoaded', function () {
  const inputN = document.getElementById('inputN');
  const generateBtn = document.getElementById('generateBtn');
  const metricsOutput = document.getElementById('metricsOutput');
  const histogramChart = document.getElementById('histogramChart');
  const tableOutput = document.querySelector('#tableOutput tbody');
  const Bars = document.getElementById('Bars');

  let histogramChartInstance = null;

  generateBtn.addEventListener('click', function () {
    const N = parseInt(inputN.value);
    const BIN = parseInt(Bars.value);
    const dataset = generateGaussianData(N);
    const metrics = calculateMetrics(dataset);
    displayMetrics(metrics);
    displayHistogram(dataset, BIN);
    displayTable(dataset);
  });

  function randomNormal() {
    return Math.cos(2 * Math.PI * Math.random()) * Math.sqrt(-2 * Math.log(Math.random()));
  }

  function generateGaussianData(numSamples) {
    const gaussianData = [];
    for (let i = 0; i < numSamples; i++) {
      const value = (randomNormal() / 2 + 1);
      gaussianData.push(value);
    }
    var mini = Math.min(...gaussianData);
    var maxi = Math.max(...gaussianData);
    for (var i = 0; i < numSamples; i++) {
      gaussianData[i] = (gaussianData[i] - mini) / (maxi - mini);
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

  function displayHistogram(dataset, BIN) {
    const histogramData = Array.from({ length: BIN }, () => 0);
    const minima = Math.min(...dataset);
    for (const value of dataset) {
      const binIndex = Math.floor(value / (1 / BIN));
      histogramData[binIndex]++;
    }

    if (histogramChartInstance) {
      histogramChartInstance.destroy();
      histogramChartInstance = null;
    }

    const ctx = histogramChart.getContext('2d');
    histogramChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({ length: BIN }, (_, i) => (i / BIN).toFixed(2)),
        datasets: [{
          label: 'Occurrences',
          data: histogramData,
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          borderColor: 'rgba(0,0,0, 1)',
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
