let barChart, scatterChart, histogramChart, pieChart;

// BAR CHART
function drawBarChart(data) {
  const ctx = document.getElementById('barChart').getContext('2d');

  if (barChart) barChart.destroy();

  const categoryMap = {};

  data.forEach(d => {
    if (!categoryMap[d.category]) categoryMap[d.category] = [];
    categoryMap[d.category].push(d.sales);
  });

  const labels = Object.keys(categoryMap);
  const values = labels.map(g => {
    const arr = categoryMap[g];
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  });

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Average Sales',
        data: values
      }]
    }
  });
}

// SCATTER PLOT
function drawScatterPlot(data) {
  const ctx = document.getElementById('scatterPlot').getContext('2d');

  if (scatterChart) scatterChart.destroy();

  scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Orders',
        data: data.map(d => ({
          x: d.sales,
          y: d.profit
        }))
      }]
    }
  });
}

// HISTOGRAM
function drawHistogram(data) {
  const ctx = document.getElementById('histogram').getContext('2d');

  if (histogramChart) histogramChart.destroy();

  const values = data.map(d => d.sales);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / 10;

  const bins = [];
  for (let i = min; i <= max; i += binSize) {
    bins.push(i);
  }

  const counts = new Array(bins.length - 1).fill(0);

  values.forEach(v => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (
        (v >= bins[i] && v < bins[i + 1]) ||
        (i === bins.length - 2 && v === bins[i + 1])
      ) {
        counts[i]++;
        break;
      }
    }
  });

  histogramChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: bins.slice(0, -1).map(b => b.toFixed(0)),
      datasets: [{
        data: counts
      }]
    }
  });
}

// PIE CHART
function drawPieChart(data) {
  const ctx = document.getElementById('pieChart').getContext('2d');

  if (pieChart) pieChart.destroy();

  const counts = {};

  data.forEach(d => {
    counts[d.category] = (counts[d.category] || 0) + 1;
  });

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    }
  });
}

// INIT
function initCharts(data) {
  drawBarChart(data);
  drawScatterPlot(data);
  drawHistogram(data);
  drawPieChart(data);
}