let products = [];

window.onload = () => {
  fetch("products.json")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      sortProducts("id-asc"); // Default sort
      displayProducts(products);
    });

  document.getElementById("sort").addEventListener("change", () => {
    const selected = document.getElementById("sort").value;
    sortProducts(selected);
    displayProducts(products);
  });
};

function displayProducts(list) {
  const tbody = document.querySelector("#product-table tbody");
  tbody.innerHTML = "";

  list.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${p.image}" alt="${p.name}" width="100"></td>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.description}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td><input type="number" id="qty-${p.id}" min="0" value="0" /></td>
    `;
    tbody.appendChild(row);
  });
}

function sortProducts(value) {
  const [key, order] = value.split("-");
  products.sort((a, b) => {
    let A = key === "price" ? a[key] : a[key].toString().toLowerCase();
    let B = key === "price" ? b[key] : b[key].toString().toLowerCase();

    if (A < B) return order === "asc" ? -1 : 1;
    if (A > B) return order === "asc" ? 1 : -1;
    return 0;
  });
}

function submitOrder() {
  const selected = products
    .map((p) => {
      const qty = parseInt(document.getElementById(`qty-${p.id}`).value);
      return qty > 0 ? { id: p.id, name: p.name, qty } : null;
    })
    .filter((i) => i);

  if (selected.length === 0) {
    alert("Please select at least one product.");
    return;
  }

  const summary = selected.map((i) => `${i.name} (Qty: ${i.qty})`).join("\n");
  if (confirm(`Are you sure you want to order the following:\n\n${summary}`)) {
    localStorage.setItem("kuttekOrder", JSON.stringify(selected));
    alert("Thank you! Your order has been placed.");
  }
}

function resetOrder() {
  if (confirm("Are you sure you want to cancel your selections?")) {
    products.forEach((p) => {
      document.getElementById(`qty-${p.id}`).value = 0;
    });
  }
}
