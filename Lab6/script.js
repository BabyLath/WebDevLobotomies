let inventory = [];

let idCounter = 1;

function renderTable() {

    const tbody = document.getElementById("tableBody");

    tbody.innerHTML = "";

    inventory.forEach(product => {

    let stockDisplay;

    if(product.stock == 0){
        stockDisplay = "<span class='out'>Out of Stock</span>";
    }else{
        stockDisplay = product.stock;
    }

    tbody.innerHTML += `
    <tr>
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>$${product.price.toFixed(2)}</td>
    <td>${stockDisplay}</td>
    </tr>
    `;

    });

}

document.getElementById("productForm").addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value);

    const product = {
    id: idCounter++,
    name: name,
    price: price,
    stock: stock
    };

    inventory.push(product);

    renderTable();

    this.reset();

});

renderTable();