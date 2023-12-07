const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/Users/aaronjustinmacias/Documents/Programming/softwareengineering/client/src/components/customer/images/'); // Set your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });    

app.post('/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file here
    const fileName = req.file.filename;
    const filePath = req.file.path;
    // Save the file path to your MySQL database
    res.json({ filePath: filePath });

    orderQuery = `SELECT MAX(order_id) FROM orders`
    connection.query(orderQuery, (err, results) => {
        imageQuery = `UPDATE orders SET order_receipt = "./images/${fileName}" WHERE order_id = ${results[0][`MAX(order_id)`]}`
        connection.execute(imageQuery);
    })


});

app.use(cors());
app.use(express.json());

const port = 4000;
app.listen(port);

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Aaronisreal4',
    database: 'softeng'
  });

connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });




app.get('/customer', (req, res) => {
    query = `SELECT * FROM customers`
    connection.query(query, (err, results) => {
        res.send(results);
    })
})

app.post('/customer', (req, res) => {
    profileQuery = `SELECT * FROM customers WHERE customer_id = ${req.body.userID}`
    orderQuery = `SELECT * FROM orders WHERE customer_id = ${req.body.userID}`;
    connection.query(profileQuery, (err, result1) => {
        connection.query(orderQuery, (err, result2) => {
            res.json({profile: result1, orders: result2})
        })
    })
})

app.get('/employee', (req, res) => {
    let query = `SELECT * FROM employees`
    connection.query(query, (err, results) => {
        res.send(results);
    })
})

app.post('/employee', (req, res) => {
    employee = req.body;
    let salaryQuery = `INSERT INTO salary(salary_rate, effectivity_date)`;
    let insertQuery = `INSERT INTO employees(last_name, first_name, department, position, address, active_salary, req_time_in, req_time_out) VALUES (?,?,?,?,?,?,?,?)`;;
    values = [employee.newLastName, employee.newFirstName, employee.newDepartment, employee.newPosition, employee.newAddress, employee.newSalary, employee.newTimeIn, employee.newTimeOut];
    connection.execute(insertQuery, values);

})

app.post('/employeeprofile', (req, res) => {
    let query = `SELECT * FROM employees WHERE employee_id = ${req.body.userID}`;
    connection.query(query, (err, results) => {
        res.send(results);
    })
})

app.post('/employeepayslip', (req, res) => {
    let query = `SELECT payslip.employee_pay, payslip.hours_worked, payslip.time_in, payslip.time_out, payroll.report_date FROM payslip INNER JOIN payroll ON payslip.payroll_id = payroll.payroll_id WHERE payslip.employee_id = ${req.body.userID}`;
    connection.query(query, (err, results) => {
        res.send(results);
    })
})

app.get('/products', (req, res) => {
    let query = `SELECT * FROM products`;
    connection.query(query, (err, results) => {
        if(err){
            console.log("Error");
            return;
        }
        res.json(results);

    })
})

app.post('/products', (req, res) => {
    updatedPrices = req.body.prices;

    const query = `SELECT product_id, price from products`
    connection.query(query, (err, results) => {
        for(let i = 0; i < req.body.prices.length; i++){
            if(updatedPrices[i] != results[i].price){
                let updateQuery = `UPDATE products SET price = ${updatedPrices[i]} WHERE product_id = ${results[i].product_id}`;
                connection.execute(updateQuery);
            }
        }
    })


})

app.delete('/products', (req, res) => {
    deleteQuery = `UPDATE products SET visibility = 0 WHERE product_id = ${req.body.id}`
    connection.execute(deleteQuery);
})

app.post('/addProduct', (req, res) => { //needs checking of class name whether it already exists or not
    insertQuery = `INSERT INTO products(class, price, total_quantity, measurement_type) VALUES (?, ?, ?, ?)`
    values = [req.body.newName, req.body.newPrice, 0, req.body.newMeasurement]
    console.log(req.body);
    connection.execute(insertQuery, values);

})

app.get('/sales' , (req, res) => {
    const query = 'SELECT * from products'
    connection.query(query, (err,results) => {
        if(err){
            console.log("Error");
            return;
        }

        const product = results.map((row) => row)
        res.json([{product}]);   
          
    })
})

app.post('/sales', (req, res) => {
    let orderQuery = `INSERT INTO orders(order_date, total_amount, order_status, customer_id) VALUES (?, ?, ?, ?)`;
    let orderValues = [new Date(), req.body.totalPrice, "Pending Approval", req.body.customer];
    connection.execute(orderQuery, orderValues);

    let query = 'SELECT MAX(order_id) FROM orders;'
    connection.query(query, (err,results) => {
        if(err){
            console.log("Error");
            return;
        }
        for(let i = 0; i < req.body.products.length; i++){
            currentProduct = req.body.products[i];
            let query = 'INSERT INTO order_item (order_id, product_id, quantity, item_price, total_price) values (?, ?, ?, ?, ?)' //lacks order_id, total_price, stockout_repack_id
            if(req.body.quantity[i]!= 0){
                let values = [results[0]['MAX(order_id)'], currentProduct.product_id, req.body.quantity[i], currentProduct.price, parseFloat(req.body.quantity[i])* currentProduct.price];
                connection.execute(query, values); 
            

            let productQuery = `UPDATE products SET total_quantity = total_quantity - ${req.body.quantity[i]} WHERE product_id = ${currentProduct.product_id} `;
            connection.execute(productQuery); 
            
            //while (req.body.quantity[i] > 0){ //decreasing from repack inventory
            let newQuery = `SELECT repack_inventory_id, stock_quantity FROM repack_inventory WHERE product_id = ${currentProduct.product_id}`
            connection.query(newQuery, (err, result) => {
                console.log(result);
                for(let j = 0; req.body.quantity[i] > 0; j++){
                    if (result[j].stock_quantity > req.body.quantity[i]){
                        let updateQuery = `UPDATE repack_inventory SET stock_quantity = stock_quantity - ${req.body.quantity[i]} WHERE repack_inventory_id = ${result[j].repack_inventory_id}`
                        connection.execute(updateQuery);
                        console.log("update query is " + updateQuery);
                        req.body.quantity[i] = 0; 
                    }
                    else{
                        req.body.quantity[i] -= result[j].stock_quantity;
                        let deleteQuery = `DELETE FROM repack_inventory WHERE repack_inventory_id = ${result[j].repack_inventory_id}`
                        console.log("delete query " + deleteQuery)
                        connection.execute(deleteQuery);
                    }
                }
            })
            }
        //}
          
        let stockoutQuery = `INSERT INTO stockout_repack (stockout_repack_date, stockout_type) VALUES (?, ?)` //needs repack_inventory_id
        stockoutValues = [new Date, 'Sales Order'];
        connection.execute(stockoutQuery, stockoutValues);
    }
    })

    
})

app.post('/changestatus', (req, res) => {
    for(let i = 0; i < req.body.id.length; i++){
        if(req.body.oldStatus[i] != req.body.newStatus[i]){
            let insertQuery = `INSERT INTO status_log(order_id, user_id, previous_order_status, new_order_status, status_date) VALUES (?,?,?,?,?)`
            let values = [req.body.id[i], req.body.adminID, req.body.oldStatus[i], req.body.newStatus[i], new Date()];
            connection.execute(insertQuery, values); //create id something

            if(req.body.newStatus[i] == "Rejected"){
                let returnQuery = `SELECT * FROM order_item WHERE order_id = ${req.body.id[i]}`
                connection.query(returnQuery, (err, results) => {
                    for(let j = 0; j < results.length; j++){
                        productQuery = `UPDATE products SET total_quantity = total_quantity + ${results[j].quantity} WHERE product_id = ${results[j].product_id}`;
                        connection.execute(productQuery);
                    }
                })
            }

        }
        
    }

    for(let i = 0; i < req.body.id.length; i++){
        let updateQuery = `UPDATE orders SET order_status = '${req.body.newStatus[i]}' WHERE order_id = ${req.body.id[i]}`
        connection.execute(updateQuery);
    }

    
})

app.get('/inventory', (req,res) => {
    const query = 'SELECT * from products'
    connection.query(query, (err,results) => {
        if(err){
            console.log("Error");
            return;
        }

        const product = results.map((row) => row)
        res.json([{product}]);   
          
    })
    
})

app.post('/inventory', (req, res) => {
    let reqValues = req.body;
    let sackQuantity = req.body.sacks
    

    let repackQuery = `INSERT INTO stockin_repack(stockin_date, total_quantity) VALUES (?, ?)`
    repackValues = [new Date(), req.body.sum]
    connection.execute(repackQuery, repackValues); //creates new value for repack_stockin_id

    let idQuery = `SELECT MAX(stockin_repack_id) FROM stockin_repack`
    connection.query(idQuery, (err, maxResults) => {
        for(let i = 0; i < reqValues.inputValues.length; i++){
            if(reqValues.inputValues[i] != 0){
            let query = `INSERT INTO repack_inventory(product_id, stock_in_date, stock_quantity, product_price, measurement_type, stockin_repack_id, expiration_date) VALUES(?, ?, ?, ?, ?, ?, ?)`
            const today = new Date();
            today.setDate(today.getDate() + 14);

            values = [reqValues.products[i].product_id, new Date(), parseFloat(reqValues.inputValues[i]), reqValues.products[i].price, reqValues.products[i].measurement_type, maxResults[0]['MAX(stockin_repack_id)'], today]
            connection.execute(query, values);
                

            let productQuery = `UPDATE products SET total_quantity = total_quantity + ${parseFloat(reqValues.inputValues[i])} WHERE product_id = ${reqValues.products[i].product_id}`
            connection.execute(productQuery);
        }
        }

        let minIDQuery = `SELECT sack_inventory_id, sack_quantity FROM sack_inventory`
        connection.query(minIDQuery, (err, results) => {
        for(let i = 0; sackQuantity != 0; i++){
                if((results[0].sack_quantity) < sackQuantity && results.length == 1){
                    res.send("lacking sacks");
                    console.log("breaking");
                    break;
                }

            let outSackQuery = `INSERT INTO stockout_sack(stockout_sack_quantity, stockout_date, stockinn_repack_id) VALUES(?, ?, ?)`
            let values = [sackQuantity, new Date(),maxResults[0]['MAX(stockin_repack_id)']];
            connection.execute(outSackQuery, values);
            
            
            if((results[i].sack_quantity) > sackQuantity){
                    let sackQuery = `UPDATE sack_inventory SET sack_quantity = sack_quantity - ${parseFloat(sackQuantity)} WHERE sack_inventory_id = ${results[i].sack_inventory_id}`
                    connection.execute(sackQuery)
                    console.log("updated");
                    sackQuantity = 0;
                }
            else{
                    sackQuantity -= results[0][`sack_quantity`] 
                    let sackQuery = `DELETE FROM sack_inventory WHERE sack_inventory_id = ${results[0][`sack_inventory_id`]}`
                    connection.execute(sackQuery);
                }
                

            
    }
    })
    })
    
    
})

app.post('/sacks', (req, res) => {
    let insertStockQuery = 'INSERT INTO stockin_sack(stockin_sack_date, sack_quantity) VALUES (?, ?)';
    console.log(req.body)
    values = [req.body.date, req.body.sacks];
    connection.execute(insertStockQuery, values);
    connection.query(`SELECT MAX(stockin_sack_id) FROM stockin_sack;`, (err, result) =>{
        if(err){
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }
        let insertSackQuery = 'INSERT INTO sack_inventory(sack_quantity, stockin_sack_id) VALUES (?, ?)'
        newValues = [req.body.sacks, result[0]['MAX(stockin_sack_id)']];
        connection.execute(insertSackQuery, newValues);
    })
})

app.get('/sacks', (req, res) => {
    console.log("get request made");
    query = `SELECT sack_inventory.sack_quantity, sack_inventory.stockin_sack_id, stockin_sack_date FROM sack_inventory INNER JOIN stockin_sack ON stockin_sack.stockin_sack_id = sack_inventory.stockin_sack_id`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log(results);
        res.json(results);
    })
})

app.get('/orders', (req, res) =>{
    query = 'SELECT order_id, order_date, total_amount, order_status, orders.customer_id, last_name, first_name FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id';
    itemQuery = `SELECT * FROM order_item`
    connection.query(query, (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        console.log(results);
        res.json(results);
        
      });
})

app.post('/filter', (req, res) => {
    console.log(req.body);
    query = `SELECT order_id, order_date, total_amount, order_status, orders.customer_id, last_name, first_name FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id WHERE orders.order_status = '${req.body.selectedFilter}'`;
    connection.query(query, (err, results) => {
        res.send(results);
        console.log(results);
    })
})

app.get('/repack', (req, res) => {
    repackQuery = `SELECT * FROM repack_inventory`;
    
    let stockin = [];
    
    connection.query(repackQuery, (err, results) =>{
        
        for(let i = 0 ; i < results.length; i++){
            
            if(stockin.includes(results[i].stockin_repack_id) == false){
                stockin.push(results[i].stockin_repack_id);
            }
        }
        let stockArray = [];
        let repackArray = [];
        let response = [];
        const promises = [];

        for (let j = 0; j < stockin.length; j++) {
            const stockinQuery = `SELECT * FROM stockin_repack WHERE stockin_repack_id = ${stockin[j]}`;
            const repackSubQuery = `SELECT * FROM repack_inventory WHERE stockin_repack_id = ${stockin[j]}`
        
            const promise = new Promise((resolve, reject) => {
                connection.query(stockinQuery, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        stockArray.push(results[0]);
                        resolve();
                    }
                });
            });

            const promise2 = new Promise((resolve, reject) => {
                connection.query(repackSubQuery, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        repackArray.push(results);
                        resolve();
                    }
                });
            });
        
            promises.push(promise);
            promises.push(promise2);
        }

        Promise.all(promises)
            .then(() => {
                response[0] = stockArray;
                response[1] = repackArray;
                console.log(repackArray);
                res.json(response);
            })
            .catch((error) => {
                console.error(error);
            });
    })
})

app.post('/details', (req, res) => {
    //console.log(req.body);
    let query = `SELECT order_item.order_id, orders.order_receipt, item_price, quantity, order_item.item_price, total_price, class, measurement_type FROM order_item INNER JOIN products ON order_item.product_id = products.product_id INNER JOIN orders ON orders.order_id = order_item.order_id WHERE order_item.order_id = ${req.body.id}`
    connection.query(query, (err, results) => {
        res.send(results);

        })
}) 

app.post('/statusdetails', (req, res) => {
    let query = `SELECT employees.last_name, employees.first_name, status_log.new_order_status, status_log.status_date, status_log.user_id FROM status_log INNER JOIN employees ON status_log.user_id = employees.user_id WHERE order_id = ${req.body.id}`
    connection.query(query, (err, results) => {
        console.log(results);
        res.send(results);
    })


})

app.post('/regcus', (req, res) => {
    const query = `INSERT INTO customers(last_name, first_name, contact_number, fax_number, ship_address, bill_address, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    const selectQuery = `SELECT * FROM customers WHERE username = '${req.body.username}'`;
    values = [req.body.lastName, req.body.firstName, req.body.phoneNumber, req.body.fax, req.body.shipAddress, req.body.billAddress, req.body.username, req.body.password];
    connection.query(selectQuery, (err, results) => {
        if (results.length == 0){
            connection.execute(query, values);
        }
    })
})

app.post('/logincus', (req, res) => {
    const customerQuery = `SELECT * FROM customers WHERE username = '${req.body.username}'`;
    const adminQuery = `SELECT * FROM admins WHERE username = '${req.body.username}'`;


    connection.query(adminQuery, (err, results) => {
        console.log(results);
        if(results.length != 0){
            if(results[0].password == req.body.password){
                res.json({userID: results[0].user_id, userType: "admin"});
            }
            else{
                console.log("password wrong");
            }
        }
        else{
            connection.query(customerQuery, (err, results) => {
                if(results.length != 0){
                    if(results[0].password == req.body.password){
                        res.json({userID: results[0].customer_id, userType: "customer"});
                    }
                    else{
                        console.log("password wrong");
                    }
                }
            })

        }
    })

    
})

app.post('/loginemp' ,(req, res) => {
    console.log(req.body);
    const query = `SELECT * FROM admins WHERE username = '${req.body.username}'`;
    
    connection.query(adminQuery, (err, results) => {
        console.log(results);
        if(results.length != 0){
            if(results[0].password == req.body.password){
                res.json({adminID: results[0].user_id});
            }
            else{
                console.log("password wrong");
            }
        }
    })

})

app.post('/verifycustomer', (req, res) => {
    updateQuery = `UPDATE customers SET verified = 1 WHERE customer_id = ${req.body.id}`
    connection.execute(updateQuery);


})

app.post('/repackdetails', (req, res) => {

    query = `SELECT repack_inventory.product_id, stock_quantity, repack_inventory.measurement_type, repack_inventory.expiration_date, class FROM repack_inventory INNER JOIN products ON repack_inventory.product_id = products.product_id WHERE stockin_repack_id = ${req.body.id}`;

    connection.query(query, (err, results) => {
        res.send(results);
    })


})

app.post('/salesreport', (req, res) => {
    console.log(req.body);
    if(req.body.changeOption == true) {
        dateQuery = `SELECT order_id, order_date, total_amount, order_status, orders.customer_id, last_name, first_name FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id WHERE (DATE(order_date) = '${req.body.date}') AND (order_status = 'Delivered' OR order_status = 'Shipped')`
        connection.query(dateQuery, (err, result) => {
        console.log(result);
        res.send(result);
        })
    }
    else if(req.body.changeOption == false){
        dateQuery = `SELECT order_id, order_date, total_amount, order_status, orders.customer_id, last_name, first_name FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id WHERE (DATE(order_date) BETWEEN  '${req.body.fromDate}' AND '${req.body.toDate}') AND (order_status = 'Delivered' OR order_status = 'Shipped')`
        connection.query(dateQuery, (err, result) => {
        console.log(result);
        res.send(result);
        })
    }
    
})

app.get('/salescustomer', (req, res) => {
    query = `SELECT * FROM customers`;
    connection.query(query, (err, results) => {
        res.send(results);
    })

})

app.post('/changeprice', (req, res) => {
    console.log(req.body);
    //creat price log table needed
    query = `SELECT * from products`
    connection.query(query, (err, results) => {
        for(let i = 0; i < results.length; i++){
            if(results[i].price != parseInt(req.body.newPrices[i])){
                updateQuery = `UPDATE products SET price = ${parseInt(req.body.newPrices[i])} WHERE product_id = ${results[i].product_id}`;
                connection.execute(updateQuery);
            }
        }
    })

})

app.get('/employeepayroll', (req, res) => {
    const query = `SELECT * FROM employees`;
    connection.query(query, (err, results) => {
        res.json(results);
    })

})

app.post('/payroll', (req, res) => {
    let body = req.body;
    console.log(body);
    let payrollQuery = `INSERT INTO payroll(user_id, report_date) VALUES (?, ?)`
    values = [req.body.adminID, new Date()];
    connection.execute(payrollQuery, values);
    

    let maxQuery = `SELECT MAX(payroll_id) FROM payroll`
    connection.query(maxQuery, (err, results) => {
        for(let i = 0; i < req.body.selectedEmployee.length; i++){
            insertQuery = `INSERT INTO payslip(hourly_rate, hours_worked, time_in, time_out, employee_pay, employee_id, payroll_id ) VALUES (${body.hourlyRates[i]} , ${body.hoursDifference[i]}, '${body.timeIn[i]}', '${body.timeOut[i]}', ${body.totalPay[i]}, ${body.selectedEmployee[i]}, ${results[0][`MAX(payroll_id)`]})`
            connection.execute(insertQuery);
        }
    })
})

app.get('/payroll', (req, res) => {
    let query = `SELECT payroll.report_date, payroll.payroll_id, employees.last_name, employees.first_name from payroll INNER JOIN employees ON payroll.user_id = employees.user_id`;
    connection.query(query, (err, results) => {
        res.send(results);

    })
})

app.post('/payrolldetails', (req, res) => {
    const query =  `SELECT payslip.hourly_rate, payslip.hours_worked, payslip.time_in, payslip.time_out, payslip.employee_pay, employees.last_name, employees.first_name FROM payslip INNER JOIN employees ON payslip.employee_id = employees.employee_id WHERE payslip.payroll_id  = ${req.body.payrollID}`
    connection.query(query, (err, results) => {
        res.send(results);
    })
})

app.post('/sidebaremp', (req, res) => {
    let query = `SELECT * FROM employees WHERE user_id = ${req.body.id}`
    connection.query(query, (err, results) => {
        res.send(results);
    })
})

app.post('/sidebarcus', (req, res) => {
    let query = `SELECT * FROM customers WHERE customer_id = ${req.body.id}`
    connection.query(query, (err, results) => {
        res.send(results);
    })
})

app.post('/registeradmin', (req, res) => {
    let insertQuery = `INSERT INTO admins(username, password, employee_id) VALUES('${req.body.username}', '${req.body.password}', ${req.body.selectedEmployee})`
    connection.execute(insertQuery);

    let query = `SELECT MAX(user_id) FROM admins`
    connection.query(query, (err, results) => {
        let employeeQuery = `UPDATE employees SET user_id = ${results[0][`MAX(user_id)`]} WHERE employee_id = ${req.body.selectedEmployee}`;
        connection.execute(employeeQuery);
    })

})

app.post('/editemployee', (req, res) => {
    let insertQuery = `UPDATE employees SET contact_number = '${req.body.newContact}', department = '${req.body.newDepartment}', position = '${req.body.newPosition}', active_salary = '${req.body.newSalary}', req_time_in = '${req.body.newTimeIn}', req_time_out = '${req.body.newTimeOut}'`
    connection.execute(insertQuery);
})

app.post('/editcustomer', (req, res) => {
    let insertQuery = `UPDATE customers SET contact_number = '${req.body.phone}', fax_number = '${req.body.fax}', bill_address = '${req.body.billAddress}', ship_address = '${req.body.shipAddress}' WHERE customer_id = ${req.body.id}`
    connection.execute(insertQuery);
})





