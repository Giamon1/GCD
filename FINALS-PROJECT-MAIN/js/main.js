let RAW = [];
let CURRENT = [];

// INIT
async function init() {
  RAW = await loadDataset();

  CURRENT = [...RAW];

  renderTable(CURRENT);
  initCharts(CURRENT);
  renderStats(CURRENT);
}

// APPLY
document.getElementById("apply-btn").onclick = () => {
  let data = [...RAW];

  const q = document.getElementById("filter-input").value;
  const s = document.getElementById("sort-select").value;

  if (q) data = filterData(data, q);
  if (s) data = sortData(data, s);

  CURRENT = data;

  renderTable(CURRENT);
  initCharts(CURRENT);
  renderStats(CURRENT);
};

// RESET
document.getElementById("reset-btn").onclick = () => {
  CURRENT = [...RAW];

  document.getElementById("filter-input").value = "";
  document.getElementById("sort-select").value = "";

  renderTable(CURRENT);
  initCharts(CURRENT);
  renderStats(CURRENT);
};

init();