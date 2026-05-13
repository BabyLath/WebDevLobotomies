const inventorySystem = {

    inventory: [],
    nextId: 1,

    renderTable(){

        const tbody = document.getElementById("tableBody");
        tbody.innerHTML = "";

        this.inventory.forEach(product => {

            let stockDisplay;

            if(product.stock === 0){
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
            </tr>`;
        });
    },

    addProduct(name, price, stock){

        const newProduct = {
            id: this.inventory.length + 1,
            name: name,
            price: parseFloat(price),
            stock: parseInt(stock)
        };
        
        this.inventory.push(newProduct);
        this.renderTable();
    }
};

document.getElementById("productForm").addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;

    inventorySystem.addProduct(name, price, stock);

    this.reset();

});

inventorySystem.renderTable();