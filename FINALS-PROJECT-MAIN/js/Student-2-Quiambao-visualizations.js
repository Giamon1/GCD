let barChart, scatterChart, histogramChart, pieChart;

function initCharts(data) {
  drawBar(data);
  drawScatter(data);
  drawHistogram(data);
  drawPie(data);
}

// BAR CHART
function drawBar(data) {
  if (barChart) barChart.destroy();

  const map = {};
  data.forEach(d => {
    if (!map[d.category]) map[d.category] = [];
    map[d.category].push(d.sales);
  });

  const labels = Object.keys(map);
  const values = labels.map(k =>
    map[k].reduce((a, b) => a + b, 0) / map[k].length
  );

  const ctx = document.getElementById("barChart").getContext("2d");

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Average Sales",
        data: values
      }]
    }
  });
}

// SCATTER PLOT
function drawScatter(data) {
  if (scatterChart) scatterChart.destroy();

  const ctx = document.getElementById("scatterPlot").getContext("2d");

  scatterChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [{
        label: "Sales vs Profit",
        data: data.map(d => ({
          x: d.sales,
          y: d.profit
        }))
      }]
    }
  });
}

// HISTOGRAM (UPDATED ONLY THIS PART)
function drawHistogram(data) {
  if (histogramChart) histogramChart.destroy();

  const ctx = document.getElementById("histogram").getContext("2d");

  const values = data
    .map(d => d.sales)
    .filter(v => !isNaN(v));

  if (values.length === 0) return;

  const min = Math.min(...values);
  const max = Math.max(...values);

  const bins = 10;
  const binSize = (max - min) / bins || 1;

  const counts = new Array(bins).fill(0);

  values.forEach(v => {
    let index = Math.floor((v - min) / binSize);
    if (index >= bins) index = bins - 1;
    if (index < 0) index = 0;
    counts[index]++;
  });

  const labels = counts.map((_, i) =>
    (min + i * binSize).toFixed(0)
  );

  histogramChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Number of Sales in Range",
        data: counts
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const i = context.dataIndex;
              const start = (min + i * binSize).toFixed(0);
              const end = (min + (i + 1) * binSize).toFixed(0);
              const count = context.raw;

              return `Sales ${start}-${end}: ${count}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Sales Range"
          }
        },
        y: {
          title: {
            display: true,
            text: "Frequency"
          }
        }
      },
      barPercentage: 1.0,
      categoryPercentage: 1.0
    }
  });
}

// PIE CHART (FIXED PARAM ONLY)
function drawPie(data) {
  if (pieChart) pieChart.destroy();

  const map = {};
  data.forEach(d => {
    map[d.category] = (map[d.category] || 0) + 1;
  });

  const ctx = document.getElementById("pieChart").getContext("2d");

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(map),
      datasets: [{
        data: Object.values(map)
      }]
    }
  });
}