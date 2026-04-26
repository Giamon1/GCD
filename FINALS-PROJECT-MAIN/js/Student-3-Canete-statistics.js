function mean(arr) {
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
}

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return (s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2).toFixed(2);
}

function mode(arr) {
  const freq = {};
  arr.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const max = Math.max(...Object.values(freq));
  return Object.keys(freq).filter(k => freq[k] === max).join(" & ");
}

function variance(arr) {
  const m = mean(arr);
  return (arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length).toFixed(2);
}

function stdDev(arr) {
  return Math.sqrt(variance(arr)).toFixed(2);
}

function pearsonCorr(x, y) {
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

  return (num / Math.sqrt(dx * dy)).toFixed(4);
}

function linearRegression(x, y) {
  const mx = mean(x);
  const my = mean(y);

  let num = 0, den = 0;

  for (let i = 0; i < x.length; i++) {
    num += (x[i] - mx) * (y[i] - my);
    den += (x[i] - mx) ** 2;
  }

  const slope = num / den;
  const intercept = my - slope * mx;
  const r = pearsonCorr(x, y);

  return {
    slope: slope.toFixed(4),
    intercept: intercept.toFixed(4),
    rSquared: (r * r).toFixed(4)
  };
}

function renderStats(data) {
  const scores = data.map(d => d.rating);
  const hours = data.map(d => d.reviews);

  document.getElementById("statMean").textContent = mean(scores);
  document.getElementById("statMedian").textContent = median(scores);
  document.getElementById("statStdDev").textContent = stdDev(scores);
  document.getElementById("statMode").textContent = mode(scores);

  const min = Math.min(...scores);
  const max = Math.max(...scores);

  document.getElementById("dCount").textContent = scores.length;
  document.getElementById("dMin").textContent = min;
  document.getElementById("dMax").textContent = max;
  document.getElementById("dRange").textContent = max - min;
  document.getElementById("dVariance").textContent = variance(scores);
  document.getElementById("dStdDev").textContent = stdDev(scores);

  const r = pearsonCorr(hours, scores);
  const reg = linearRegression(hours, scores);

  document.getElementById("rPearson").textContent = r;

  const strength =
    Math.abs(r) >= 0.7 ? "Strong" :
    Math.abs(r) >= 0.4 ? "Moderate" : "Weak";

  const direction = r >= 0 ? "Positive" : "Negative";

  document.getElementById("rInterp").textContent =
    `${strength} ${direction}`;

  document.getElementById("rSlope").textContent = reg.slope;
  document.getElementById("rIntercept").textContent = reg.intercept;
  document.getElementById("rSquared").textContent = reg.rSquared;

  document.getElementById("rEquation").textContent =
    `rating = ${reg.slope}·reviews + ${reg.intercept}`;
}