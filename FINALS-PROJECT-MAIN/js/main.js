let RAW = [];
let CURRENT = [];
let expanded = false;
const LIMIT = 10;

async function init() {
  RAW = await loadDataset();

  CURRENT = [...RAW];
  renderTable(CURRENT, expanded, LIMIT);
  initCharts(CURRENT); // FIXED
  renderStats(CURRENT);

  updateToggleVisibility();
}

// APPLY FILTER + SORT
document.getElementById("apply-btn").onclick = () => {
  let data = [...RAW];

  const q = document.getElementById("filter-input").value;
  const s = document.getElementById("sort-select").value;

  if (q) data = filterData(data, q);
  if (s) data = sortData(data, s);

  CURRENT = data;
  expanded = false;

  renderTable(CURRENT, expanded, LIMIT);
  initCharts(CURRENT); // FIXED
  renderStats(CURRENT);

  updateToggleVisibility();
};

// RESET
document.getElementById("reset-btn").onclick = () => {
  CURRENT = [...RAW];
  expanded = false;

  renderTable(CURRENT, expanded, LIMIT);
  initCharts(CURRENT); // FIXED
  renderStats(CURRENT);

  updateToggleVisibility();
};

// TOGGLE
document.getElementById("toggle-btn").onclick = () => {
  expanded = !expanded;

  document.getElementById("toggle-btn").textContent =
    expanded ? "Show less" : "Show more";

  renderTable(CURRENT, expanded, LIMIT);
};

// SHOW/HIDE BUTTON
function updateToggleVisibility() {
  const btn = document.getElementById("toggle-btn");

  if (CURRENT.length <= LIMIT) {
    btn.style.display = "none";
  } else {
    btn.style.display = "inline-block";
    btn.textContent = expanded ? "Show less" : "Show more";
  }
}

init();