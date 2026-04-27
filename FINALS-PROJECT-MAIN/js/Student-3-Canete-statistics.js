function mean(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function mode(arr) {
  if (!arr.length) return "";
  const freq = {};
  arr.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const max = Math.max(...Object.values(freq));
  return Object.keys(freq)
    .filter(k => freq[k] === max)
    .join(" & ");
}

function variance(arr) {
  if (!arr.length) return 0;
  const m = mean(arr);
  return arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length;
}

function stdDev(arr) {
  return Math.sqrt(variance(arr));
}

function pearsonCorr(x, y) {
  if (!x.length || x.length !== y.length) return 0;

  const mx = mean(x);
  const my = mean(y);

  let num = 0, dx = 0, dy = 0;

  for (let i = 0; i < x.length; i++) {
    const a = x[i] - mx;
    const b = y[i] - my;

    num += a * b;
    dx += a * a;
    dy += b * b;
  }

  return dx && dy ? num / Math.sqrt(dx * dy) : 0;
}

function linearRegression(x, y) {
  if (!x.length || x.length !== y.length) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }

  const mx = mean(x);
  const my = mean(y);

  let num = 0, den = 0;

  for (let i = 0; i < x.length; i++) {
    num += (x[i] - mx) * (y[i] - my);
    den += (x[i] - mx) ** 2;
  }

  const slope = den ? num / den : 0;
  const intercept = my - slope * mx;
  const r = pearsonCorr(x, y);

  return {
    slope,
    intercept,
    rSquared: r * r
  };
}

function renderStats(data) {
  if (!data || !data.length) return;

  const scores = data.map(d => d.sales);
  const profits = data.map(d => d.profit);

  document.getElementById("statMean").textContent = mean(scores).toFixed(2);
  document.getElementById("statMedian").textContent = median(scores).toFixed(2);
  document.getElementById("statStdDev").textContent = stdDev(scores).toFixed(2);
  document.getElementById("statMode").textContent = mode(scores);

  const min = Math.min(...scores);
  const max = Math.max(...scores);

  document.getElementById("dCount").textContent = scores.length;
  document.getElementById("dMin").textContent = min.toFixed(2);
  document.getElementById("dMax").textContent = max.toFixed(2);
  document.getElementById("dRange").textContent = (max - min).toFixed(2);
  document.getElementById("dVariance").textContent = variance(scores).toFixed(2);
  document.getElementById("dStdDev").textContent = stdDev(scores).toFixed(2);

  const r = pearsonCorr(profits, scores);
  const reg = linearRegression(profits, scores);

  document.getElementById("rPearson").textContent = r.toFixed(4);

  const strength =
    Math.abs(r) >= 0.7 ? "Strong" :
    Math.abs(r) >= 0.4 ? "Moderate" : "Weak";

  const direction = r >= 0 ? "Positive" : "Negative";

  document.getElementById("rInterp").textContent =
    `${strength} ${direction}`;

  document.getElementById("rSlope").textContent = reg.slope.toFixed(4);
  document.getElementById("rIntercept").textContent = reg.intercept.toFixed(4);
  document.getElementById("rSquared").textContent = reg.rSquared.toFixed(4);

  document.getElementById("rEquation").textContent =
    `sales = ${reg.slope.toFixed(4)}·profit + ${reg.intercept.toFixed(4)}`;
}