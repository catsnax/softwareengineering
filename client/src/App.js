import { BrowserRouter } from 'react-router-dom';
import {Link, Route, Routes} from "react-router-dom";
import './App.css';
import Products from './components/admin/products'
import SalesOrdering from './components/sales-order'
import SalesOrdering1 from './components/customer/salesordering'
import Inventory from './components/admin/inventory';
import Sacks from './components/sacks'
import RegisterCustomer from './components/regcus';
import Orders from './components/orders'
import RegisterEmployee from './components/regemp';
import Repack from './components/repack';
import LoginCustomer from './components/logincus';
import CustomerList from './components/admin/customerlist';
import AdminSalesTransaction from './components/admin/adminsalestransaction'
import SacksInventory from './components/SacksInventory';
import SalesTransaction from './components/customer/salestransaction'
import Customer from './components/customer/customer';
import VerifyCustomer from './components/admin/verifycustomer'
import ImageUploader from './components/admin/imageupload';
import CustomerProfile from './components/customer/customerprofile'
import EmployeeList from './components/admin/employeelist';
import SalesReport from './components/salesreport';
import Payroll from './components/admin/payroll'

import { MyContextProvider } from './components/MyContext';

import React, {useState, useEffect} from 'react';


<script src="https://cdn.tailwindcss.com"></script>
function App() {

  /*
  useEffect(() => {
    fetch('http://localhost:4000')
    .then(res => {return res.json()})
    .then(data => {
      newProduct(data)

    })  
  }, []);*/



  const handleSubmit = (event) =>{
    let tester = window.confirm("Try to press")
    //create confirmation modal of sales order
   
  }

 

  
  

  return (
    <div className="App">


<MyContextProvider>
  <BrowserRouter>
  
    <Routes>
    
      <Route path = "/products" element = {<Products></Products>}></Route>
      <Route path = "/sales" element = {<SalesOrdering></SalesOrdering>}></Route>
      <Route path = "/inventory" element = {<Inventory></Inventory>}></Route>
      <Route path = "/sacks" element = {<Sacks></Sacks>}></Route>
      <Route path = "/orders" element = {<Orders></Orders>}></Route>
      <Route path = "/registercust" element = {<RegisterCustomer></RegisterCustomer>}></Route>
      <Route path = "/registeremp" element = {<RegisterEmployee></RegisterEmployee>}></Route>
      <Route path = "/repack" element = {<Repack></Repack>}></Route>
      <Route path='' element={<LoginCustomer></LoginCustomer>}></Route>
      <Route path='/regcus' element={<RegisterCustomer></RegisterCustomer>}></Route>
      <Route path='/regemp' element={<RegisterEmployee></RegisterEmployee>}></Route>
      <Route path='/customerlist' element={<CustomerList></CustomerList>}></Route>
      <Route path='/salesordering' element={<SalesOrdering1></SalesOrdering1>}></Route>
      <Route path='/customersalestransaction' element={<SalesTransaction></SalesTransaction>}></Route>
      <Route path='/adminsalestransaction' element={<AdminSalesTransaction></AdminSalesTransaction>}></Route>
      <Route path='/sacksinventory' element={<SacksInventory></SacksInventory>}></Route>
      <Route path = '/customer' element = {<Customer></Customer>}></Route>
      <Route path = '/verifycustomers' element = {<VerifyCustomer></VerifyCustomer>}></Route>
      <Route path = '/image' element = {<ImageUploader></ImageUploader>}></Route>
      <Route path = '/customerprofile' element = {<CustomerProfile></CustomerProfile>}></Route>
      <Route path = '/employeelist' element = {<EmployeeList></EmployeeList>}></Route>
      <Route path = '/salesreport' element = {<SalesReport></SalesReport>}></Route>
      <Route path = '/payroll' element = {<Payroll></Payroll>}></Route>

    </Routes>
    
    </BrowserRouter>
    </MyContextProvider>
    </div> 

  
  );
  
}

export default App;
