<?php

    $serverName = "localhost";
    $username = "root";
    $password = "sCgwUtxaFUb10yDvbG";
    $database = "PizzaDB";
    
    $conn = new mysqli($serverName, $username, $password, $database);

    if ($conn->connect_error) {
        die("Failed to Connect: ". $conn->connect_error);
    }
    echo "<div align='Center'>". "Connected to server". "</div>";

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        // ---  PIZZA ADMIN ---
        if (isset($_POST['add_pizza'])) {
            
            $newPizza = $_POST['name'] ?? '';
            $newPrice = $_POST['price'] ?? 1;

            $prepValidPizza = $conn -> prepare("SELECT id FROM pizzas WHERE name=?");
            $prepValidPizza->bind_param("s", $newPizza);
            $prepValidPizza->execute();
            $validPizza = $prepValidPizza->get_result();

            if($validPizza->num_rows > 0) {
                echo "<script>alert('Error: This pizza already exists!'); window.location.href='LAB10.php';</script>";
                exit;
            }

        
            $prepInsertData = $conn->prepare("INSERT INTO pizzas (name, price) VALUES (?, ?)");
            $prepInsertData->bind_param("sd", $newPizza, $newPrice);

            if($prepInsertData->execute()) {
                echo "<script>alert('Pizza inserted to Database!'); window.location.href='LAB10.php';</script>";
                
            }
            else {
                echo "<script>alert('Pizza Insertion ERROR!'); window.location.href='LAB10.php';</script>";
                
            }

            $prepInsertData->close();
            $prepValidPizza->close();
        }
        if (isset($_POST['update_pizza'])) {

            $pizzaName = $_POST['namePizza'] ?? '';
            $newPizzaPrice = $_POST['newPrice'] ?? '';

            if($newPizzaPrice < 0) {
                 echo "<script>alert('No Negative Pizza Price!'); window.location.href='LAB10.php';</script>";
                 exit;

            }

            $prepUptPizza = $conn->prepare("UPDATE pizzas SET price=? WHERE name=?");
            $prepUptPizza->bind_param("ds", $newPizzaPrice, $pizzaName);
            

            if($prepUptPizza->execute()) {
                if($prepUptPizza->affected_rows > 0) {
                    echo "<script>alert('Pizza Price Updated!'); window.location.href='LAB10.php';</script>";
                }
                else {
                    echo "<script>alert('Pizza Price error!'); window.location.href='LAB10.php';</script>";
                }
            }
            $prepUptPizza->close();
        }
        if (isset($_POST['delete_pizza'])) {

            $deletePizza = $_POST['sacPizza'] ?? '';

            $prepDelPizza = $conn->prepare("DELETE FROM pizzas WHERE name= ?");
            $prepDelPizza->bind_param("s", $deletePizza);
            
            
            if($prepDelPizza->execute()) {
                if($prepDelPizza->affected_rows > 0) {
                     echo "<script>alert('Pizza Deleted!'); window.location.href='LAB10.php';</script>";
                }
                else {
                     echo "<script>alert('Pizza does not Exist!'); window.location.href='LAB10.php';</script>";
                }
            }
            $prepDelPizza->close();
        }

        // ---  TOPPINGS ADMIN ---
        if (isset($_POST['add_topping'])) {

            $newTopps = $_POST['name'] ?? '';
            $newPriceTops = $_POST['price'] ?? 1;

            $prepValidTops = $conn -> prepare("SELECT id FROM toppings WHERE name=?");
            $prepValidTops->bind_param("s", $newTopps);
            $prepValidTops->execute();
            $validTopping = $prepValidTops->get_result();

            if($validTopping->num_rows > 0) {
                echo "<script>alert('Error: This topping already exists!'); window.location.href='LAB10.php';</script>";
                exit;
            }

        
            $prepInsertDataT = $conn->prepare("INSERT INTO toppings (name, price) VALUES (?, ?)");
            $prepInsertDataT->bind_param("sd", $newTopps, $newPriceTops);

            if($prepInsertDataT->execute()) {
                echo "<script>alert('Topping inserted to Database!'); window.location.href='LAB10.php';</script>";
                
            }
            else {
                echo "<script>alert('Topping Insertion ERROR!'); window.location.href='LAB10.php';</script>";
                
            }

            $prepInsertDataT->close();
            $prepValidTops->close();
        }
        if (isset($_POST['update_topping'])) {

            $toppingName = $_POST['nameTopping'] ?? '';
            $newToppingPrice = $_POST['newTopPrice'] ?? '';

            if($newToppingPrice < 0) {
                 echo "<script>alert('No Negative Topping Price!'); window.location.href='LAB10.php';</script>";
                 exit;

            }

            $prepUptTopping = $conn->prepare("UPDATE toppings SET price=? WHERE name=?");
            $prepUptTopping->bind_param("ds", $newToppingPrice, $toppingName);
            
            if($prepUptTopping->execute()) {
                if($prepUptTopping->affected_rows > 0) {
                    echo "<script>alert('Topping Price Updated!'); window.location.href='LAB10.php';</script>";
                }
                else {
                    echo "<script>alert('Topping Price error!'); window.location.href='LAB10.php';</script>";
                }
            }
            $prepUptTopping->close();
        }
        if (isset($_POST['delete_topping'])) {

            $deleteTopping = $_POST['sacTopping'];

            $prepDelTopping = $conn->prepare("DELETE FROM toppings WHERE name= ?");
            $prepDelTopping->bind_param("s", $deleteTopping);
            
            if($prepDelTopping->execute()) {
                if($prepDelTopping->affected_rows > 0) {
                     echo "<script>alert('Topping Deleted!'); window.location.href='LAB10.php';</script>";
                }
                else {
                     echo "<script>alert('Topping does not Exist!'); window.location.href='LAB10.php';</script>";
                }
            }
            $prepDelTopping->close();
        }

        // --- 🛒 ORDERING SYSTEM ---
        if (isset($_POST['create_order'])) {

            $customerPizza = $_POST['customer'] ?? '';
            $pizzaOrder = $_POST['pizza'] ?? '';
            $pizzaToppings = $_POST['topping'] ?? [];
            $pizzaQuants = $_POST['qty'] ?? 1;

            // Pizza price
            $pizzaPrice = $conn->prepare("SELECT price FROM pizzas WHERE name=?");
            $pizzaPrice->bind_param("s", $pizzaOrder);
            $pizzaPrice->execute();
            $priceResl = $pizzaPrice->get_result();

            $basePrice = 0;
            if($row = $priceResl->fetch_assoc()) {
                $basePrice = $row['price'];
            }
            $pizzaPrice->close();


            // Topping price
            $totalToppPrice = 0;
            if(!empty($pizzaToppings)) {
                $prepTopPrice = $conn->prepare("SELECT price FROM toppings WHERE name=?");

                foreach($pizzaToppings as $nameTopp) {
                    $prepTopPrice->bind_param("s", $nameTopp);
                    $prepTopPrice->execute();
                    $resl = $prepTopPrice->get_result();

                    if($row = $resl->fetch_assoc()) {
                        $totalToppPrice += $row['price'];
                    }
                }
                $prepTopPrice->close();
            }
            
            // Calculate Grand total
            function grandTotal($pizzaPrice, $toppingPrice, $quants) {
                return ($pizzaPrice + $toppingPrice) * $quants;
            }

            $fullTotal = grandTotal($basePrice, $totalToppPrice, $pizzaQuants);
            $toppingString = ""; // use to compile toppings into single string
            $status = "Pending";

            if(!empty($pizzaToppings)) {
                foreach($pizzaToppings as $topping) {
                    $toppingString .= $topping. ", ";
                }
                $toppingString = rtrim($toppingString, ", ");
            }
            else {
                    $toppingString = "No Selected Topping/s";
            }


            $orderSum = $conn->prepare("INSERT INTO orders (customer, pizza, toppings, qty, total, status) VALUES(?, ?, ?, ?, ?, ?)");
            $orderSum->bind_param("sssids", $customerPizza, $pizzaOrder, $toppingString, $pizzaQuants, $fullTotal, $status);

            if($orderSum->execute()) {
                echo "<script>alert('Order Placed'); window.location.href='LAB10.php';</script>";
            }
            else {
                echo "<script>alert('Ordering Error!'); window.location.href='LAB10.php';</script>";
            }
            $orderSum->close();
        }

        // --- 📋 MANAGE ORDERS ---
        if (isset($_POST['update_status'])) {

            $orderID = $_POST['update_status'];

            $updateStats = $conn->prepare("UPDATE orders SET status='Completed' WHERE id=?");
            $updateStats->bind_param("i", $orderID);

            if($updateStats->execute()) {
                header("Location: LAB10.php");
                exit;
            }
        }
        if (isset($_POST['delete_order'])) {

            $deleteOrder = $_POST['delete'];

            $prepDelOrder = $conn->prepare("DELETE FROM orders WHERE id=?");
            $prepDelOrder->bind_param("i", $deleteOrder);
            
            if($prepDelOrder->execute()) {
                if($prepDelOrder->affected_rows > 0) {
                     echo "<script>alert('Topping Deleted!'); window.location.href='LAB10.php';</script>";
                }
                else {
                     echo "<script>alert('Topping does not Exist!'); window.location.href='LAB10.php';</script>";
                }
            }
            $prepDelOrder->close();
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>🍕 Pizza Master Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%); min-height: 100vh; padding: 40px 20px; color: #333;}
        .container { max-width: 1200px; margin: 0 auto; }
        header { text-align: center; color: white; margin-bottom: 40px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        h1 { font-size: 3em; margin-bottom: 10px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;}
        .full-width { grid-column: 1 / -1; }
        @media(max-width: 800px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        .card h2 { color: #FF6B6B; border-bottom: 3px solid #FFA500; padding-bottom: 10px; margin-bottom: 20px; }
        
        .form-group { display: flex; gap: 10px; margin-bottom: 20px; align-items: flex-end; }
        .form-stack { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
        input[type="text"], input[type="number"] { padding: 10px; border: 2px solid #FF6B6B; border-radius: 8px; width: 100%; }
        
        .radio-group, .checkbox-group { display: flex; flex-direction: column; gap: 10px; }
        .selection-item { display: flex; align-items: center; padding: 10px; border-radius: 8px; cursor: pointer; background: #fff5f5;}
        .selection-item:hover { background-color: #ffe8e8; }
        .selection-item input { margin-right: 10px; width: 18px; height: 18px; accent-color: #FF6B6B; }
        .price { color: #FFA500; font-weight: bold; }
        
        button { padding: 10px 15px; background: #FF6B6B; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        button:hover { background: #FFA500; }
        .btn-large { width: 100%; padding: 15px; font-size: 1.1em; }
        .btn-update { background: #4CAF50; padding: 6px 12px; font-size: 0.9em; }
        .btn-delete { background: #f44336; padding: 6px 12px; font-size: 0.9em; }
        
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ecf0f1; }
        th { background-color: #FFF5E6; color: #FF6B6B; }
        .price-input { width: 90px !important; padding: 6px !important; margin-right: 5px; border: 1px solid #ccc !important;}
        
        .badge { padding: 5px 10px; border-radius: 20px; font-size: 0.8em; font-weight: bold; color: white; }
        .bg-pending { background-color: #FFA500; }
        .bg-completed { background-color: #4CAF50; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🍕 Pizza Master Dashboard</h1>
            <p>Admin Menu Management & Live Ordering System</p>
        </header>

        <div class="grid-layout">
            
            <div class="card">
                <h2>⚙️ Manage Pizzas</h2>
                <form method="post" class="form-group">
                    <div style="flex: 2;"><input type="text" name="name" placeholder="New Pizza Name" required></div>
                    <div style="flex: 1;"><input type="number" name="price" step="0.01" min="0" placeholder="Price" required></div>
                    <button type="submit" name="add_pizza">Add</button>
                </form>
                <table>
                    <tbody>
                        <?php
                            // TODO 3: Read from 'pizzas' table using mysqli_query and mysqli_fetch_assoc
                            // Remember to use htmlspecialchars() for security!
                            $sql = "SELECT id, name, price FROM pizzas";
                            $dispPizzaData = $conn->query($sql);
                            
                            if($dispPizzaData -> num_rows > 0) {
                                while($rows = $dispPizzaData -> fetch_assoc()) {

                                    echo "".htmlspecialchars($rows['name']). " - ". " ₱". htmlspecialchars($rows["price"]). "<br>";

                                    }
                                    echo "<br><strong>Edit Existing Pizza Atributes</strong>
                                            <tr>
                                                <td>
                                                    <form method='post' style='display:flex; gap: 10px'>
                                                        <div style='flex: 2'><input type='text' name='namePizza' placeholder='Existing Pizza Name'></div>
                                                        <div style='flex: 2'><input type='number' name='newPrice' placeholder='New Pizza Price'></div>
                                                        <button type='submit' name='update_pizza' class='btn-update'>Update</button>
                                                    </form>
                                                </td>
                                            </tr>
        
                                            <tr>
                                                <td>
                                                    <form method='post' style='display:flex; gap: 10px'>
                                                        <div style='flex: 2'><input type='text' name='sacPizza' placeholder='Existing Pizza'></div>
                                                        <button type='submit' name='delete_pizza' class='btn-delete'>Delete</button>
                                                    </form>
                                                </td>
                                            </tr>";
                            }
                        ?>
                    </tbody>
                </table>
            </div>

            <div class="card">
                <h2>⚙️ Manage Toppings</h2>
                <form method="post" class="form-group">
                    <div style="flex: 2;"><input type="text" name="name" placeholder="New Topping Name" required></div>
                    <div style="flex: 1;"><input type="number" name="price" step="0.01" min="0" placeholder="Price" required></div>
                    <button type="submit" name="add_topping">Add</button>
                </form>
                <table>
                    <tbody>
                        <?php
                            // TODO 4: Read from 'toppings' table and generate rows dynamically
                            //should also contain the a form with input to update price and a delete button similar to pizzas
                            $sql = "SELECT name, price FROM toppings";
                            $dispToppingData = $conn->query($sql);

                            if($dispToppingData -> num_rows > 0) {
                                while($rows = $dispToppingData -> fetch_assoc()) {
                                    echo "".htmlspecialchars($rows["name"]). " - ". " ₱".htmlspecialchars($rows["price"]). "<br>";
                                }

                                echo "<br><strong>Edit Existing Topping Atributes</strong>
                                            <tr>
                                                <td>
                                                    <form method='post' style='display:flex; gap: 10px'>
                                                        <div style='flex: 2'><input type='text' name='nameTopping' placeholder='Existing Topping'></div>
                                                        <div style='flex: 2'><input type='number' name='newTopPrice' placeholder='New Topping Price'></div>
                                                        <button type='submit' name='update_topping' class='btn-update'>Update</button>
                                                    </form>
                                                </td>   
                                            </tr>
                                            
                                            <tr>
                                                <td>
                                                    <form method='post' style='display:flex; gap: 10px'>
                                                        <div style='flex: 2'><input type='text' name='sacTopping' placeholder='Existing Topping'></div>
                                                        <button type='submit' name='delete_topping' class='btn-delete'>Delete</button>
                                                    </form>
                                                </td>
                                            </tr>";
                            }
                            
                        ?>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card" style="max-width: 800px; margin: 0 auto 30px auto;">
            <h2>🛒 Place New Order</h2>
            <form method="post">
                <div class="form-stack">
                    <label><strong>Customer Name</strong></label>
                    <input type="text" name="customer" required>
                </div>

                <div class="grid-layout" style="gap: 20px; margin-bottom: 0;">
                    
                    <div class="form-stack">
                        <label><strong>Select Pizza</strong></label>
                        <div class="radio-group">
                            <?php 
                                // TODO 5: Fetch Pizzas from DB to generate radio buttons
                                $sql = "SELECT name FROM pizzas";
                                $pizzaData = $conn->query($sql);

                                if($pizzaData -> num_rows > 0) {
                                    while($rows = $pizzaData -> fetch_assoc()) {
                                        $pizzs = htmlspecialchars($rows['name']);

                                        echo "<label>
                                            <input type='radio' name='pizza' value ='$pizzs' required>
                                            $pizzs
                                            </label>";
                                    }
                                }
                            ?>
                        </div>
                    </div>

                    <div class="form-stack">
                        <label><strong>Select Toppings</strong></label>
                        <div class="checkbox-group">
                            <?php 
                                // TODO 6: Fetch Toppings from DB to generate checkboxes
                                $sql = "SELECT name FROM toppings";
                                $toppingData = $conn->query($sql);

                                
                                if($toppingData -> num_rows > 0) {
                                    while($rows = $toppingData -> fetch_assoc()) {
                                        $tops = htmlspecialchars($rows["name"]);
                                        echo "<label>
                                                <input type='checkbox' name='topping[]' value='$tops'>
                                                $tops
                                                </label>";
                                    }
                                }
                            ?>
                        </div>
                    </div>
                </div>

                <div class="form-stack" style="margin-top: 15px;">
                    <label><strong>Quantity</strong></label>
                    <input type="number" name="qty" min="1" value="1" required>
                </div>

                <button type="submit" name="create_order" class="btn-large">🚀 Submit Order</button>
            </form>
        </div>

        <div class="card full-width">
            <h2>📋 Live Kitchen Orders</h2>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th><th>Customer</th><th>Order Details</th><th>Total</th><th>Status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            // TODO 7: Read from 'orders' table and display live kitchen orders
                            // If status is Pending, show the Checkmark (✔) button. Otherwise, hide it.
                            $sql = "SELECT * FROM orders";
                            $dispOrder = $conn->query($sql);

                            if($dispOrder->num_rows > 0) {
                                while($rows = $dispOrder->fetch_assoc()) {

                                    $idCustomer = htmlspecialchars($rows['id']);
                                    $customer = htmlspecialchars($rows['customer']);
                                    $pizzaOrder = htmlspecialchars($rows['pizza']);
                                    $toppingOrder = htmlspecialchars($rows['toppings']);
                                    $quants = htmlspecialchars($rows['qty']);
                                    $total = htmlspecialchars($rows['total']);
                                    $stats = htmlspecialchars($rows['status']);



                                    echo "<tr>";
                                    echo    "<td>$idCustomer</td>
                                             <td>$customer</td>
                                             <td>$pizzaOrder | $toppingOrder X$quants</td>
                                             <td>$total</td>
                                             <td>$stats</td>
                                             
                                             <td>
                                                <form method='post'>
                                                    <input type='hidden' name='delete' value='$idCustomer'>
                                                    <button type='submit' name='delete_order' class='btn-delete'>Delete</button>
                                                </form>
                                             </td>";
                                    echo "<td>";
                                        if($stats === "Pending") {
                                            echo "<form method='post' style='Display: inline;'>
                                                    <input type='hidden' name='update_status' value='$idCustomer'>
                                                    <input type='checkbox' name='checkDone' title='order done' onchange='this.form.submit()'>
                                                  </form>";
                                        }
                                    echo "</td>";
                                    echo "</tr>";

                                }
                            }
                            else {
                                echo "<tr><td colspan='6' style='text-align:center;'>No orders yet!</td></tr>";
                                
                                $sql = "ALTER TABLE orders AUTO_INCREMENT = 1";
                                $conn->query($sql);
                            }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
</body>
</html>