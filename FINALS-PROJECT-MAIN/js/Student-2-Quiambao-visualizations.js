let barChart, scatterChart, histogramChart, pieChart;

function initCharts(data) {
  drawBar(data);
  drawScatter(data);
  drawHistogram(data);
  drawPie(data);
}

//BARCHART
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
        data: values,
        backgroundColor: "#60a5fa"
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "white" } }
      },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" }, beginAtZero: true }
      }
    }
  });
}

//SCATTERPLOT

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
        })),
        backgroundColor: "#34d399"
      }]
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: "Sales", color: "white" },
          ticks: { color: "white" }
        },
        y: {
          title: { display: true, text: "Profit", color: "white" },
          ticks: { color: "white" }
        }
      }
    }
  });
}

//HISTOGRAM

function drawHistogram(data) {
  if (histogramChart) histogramChart.destroy();

  const canvas = document.getElementById("histogram");
  const ctx = canvas.getContext("2d");

  // extract values safely
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
        label: "Frequency",
        data: counts,
        backgroundColor: "#f59e0b"
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Sales Range",
            color: "white"
          },
          ticks: { color: "white" }
        },
        y: {
          title: {
            display: true,
            text: "Frequency",
            color: "white"
          },
          beginAtZero: true,
          ticks: { color: "white" }
        }
      },
      barPercentage: 1.0,
      categoryPercentage: 1.0
    }
  });
}

// PIECHART
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
        data: Object.values(map),
        backgroundColor: [
          "#60a5fa",
          "#34d399",
          "#f59e0b",
          "#f87171"
        ]
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "white" }
        }
      }
    }
  });
}
