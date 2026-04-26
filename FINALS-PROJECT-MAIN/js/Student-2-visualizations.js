let barChart, scatterChart, histogramChart, pieChart;

// BAR CHART
function drawBarChart(data) {
  const ctx = document.getElementById('barChart').getContext('2d');

  if (barChart) barChart.destroy(); 
  const genreMap = {};

  data.forEach(d => {
    if (!genreMap[d.genre]) genreMap[d.genre] = [];
    genreMap[d.genre].push(d.reviews);
  });

  const labels = Object.keys(genreMap);
  const values = labels.map(g => {
    const arr = genreMap[g];
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  });

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Average Reviews',
        data: values
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: 'white' } }
      },
      scales: {
        x: { ticks: { color: 'white' } },
        y: { ticks: { color: 'white' } }
      }
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
        label: 'Books',
        data: data.map(d => ({
          x: d.reviews,
          y: d.rating
        }))
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: 'white' } }
      },
      scales: {
        x: {
          title: { display: true, text: 'Reviews', color: 'white' },
          ticks: { color: 'white' }
        },
        y: {
          title: { display: true, text: 'Rating', color: 'white' },
          ticks: { color: 'white' }
        }
      }
    }
  });
}

// HISTOGRAM
function drawHistogram(data) {
  const ctx = document.getElementById('histogram').getContext('2d');

  if (histogramChart) histogramChart.destroy();

  // Extract ratings
  const values = data.map(d => d.rating);

  
  const min = 3.0;
  const max = 5.0;
  const binSize = 0.1; 
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
      labels: bins.slice(0, -1).map(b => b.toFixed(1)),
      datasets: [{
        label: 'Frequency',
        data: counts,
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Histogram of Book Ratings',
          color: 'white'
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Rating',
            color: 'white'
          },
          ticks: {
            color: 'white',
            maxRotation: 0,
            autoSkip: true
          }
        },
        y: {
          title: {
            display: true,
            text: 'Frequency',
            color: 'white'
          },
          ticks: { color: 'white' }
        }
      },
      elements: {
        bar: {
          borderRadius: 0, edges
        }
      },
      barPercentage: 1.0,
      categoryPercentage: 1.0
    }
  });
}
// PIE CHART
function drawPieChart(data) {
  const ctx = document.getElementById('pieChart').getContext('2d');

  if (pieChart) pieChart.destroy();

  const counts = {};

  data.forEach(d => {
    counts[d.genre] = (counts[d.genre] || 0) + 1;
  });

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts)
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: 'white' } }
      }
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