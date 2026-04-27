// LOAD DATASET
async function loadDataset() {
  try {
    const res = await fetch("bestsellers with categories.csv");
    const text = await res.text();

    const rows = text.trim().split(/\r?\n/).slice(1);

    return rows.map(r => {
      const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      return {
        name: c[0]?.replace(/^"|"$/g, "").trim(),
        author: c[1]?.trim(),
        rating: +c[2],
        reviews: +c[3],
        price: +c[4],
        year: +c[5],
        genre: c[6]?.trim()
      };
    });

  } catch (err) {
    console.error("Failed to load dataset:", err);
    return [];
  }
}

// RENDER TABLE 
function renderTable(data) {
  const tableBody = document.getElementById("table-body");

  let html = "";

  data.forEach((item, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.author}</td>
        <td>${item.rating}</td>
        <td>${item.reviews}</td>
        <td>${item.price}</td>
        <td>${item.year}</td>
        <td>${item.genre}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = html || `
    <tr>
      <td colspan="8">No data found</td>
    </tr>
  `;
}

// FILTER
function filterData(data, q) {
  const query = q.toLowerCase();

  return data.filter(d =>
    Object.values(d).some(val =>
      String(val).toLowerCase().includes(query)
    )
  );
}

// SORT
function sortData(data, key) {
  return [...data].sort((a, b) => {
    if (a[key] == null) return 1;
    if (b[key] == null) return -1;

    if (typeof a[key] === "string") {
      return a[key].localeCompare(b[key]);
    }

    return b[key] - a[key];
  });
}