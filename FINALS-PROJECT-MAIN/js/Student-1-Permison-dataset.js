// LOAD DATASET
async function loadDataset() {
  try {
    const res = await fetch("samplesuperstore.csv");
    const text = await res.text();

    const rows = text.trim().split(/\r?\n/).slice(1);

    return rows.map(r => {
      const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      return {
        rowID: +c[0],
        orderID: c[1],
        orderDate: c[2],
        shipDate: c[3],
        shipMode: c[4],
        customerID: c[5],
        customerName: c[6],
        segment: c[7],
        country: c[8],
        city: c[9],
        state: c[10],
        postalCode: c[11],
        region: c[12],
        productID: c[13],
        category: c[14],
        subCategory: c[15],
        productName: c[16]?.replace(/^"|"$/g, "").trim(),
        sales: +c[17],
        quantity: +c[18],
        discount: +c[19],
        profit: +c[20]
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
        <td>${item.productName}</td>
        <td>${item.category}</td>
        <td>${item.subCategory}</td>
        <td>${item.sales}</td>
        <td>${item.quantity}</td>
        <td>${item.discount}</td>
        <td>${item.profit}</td>
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