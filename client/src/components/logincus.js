import React, { useState, useContext } from 'react';
import backgroundpom from '../images/bglogopom.jpg';
import logo from '../images/logoshebar.png';
import { Link } from 'react-router-dom';
import {
  BrowserRouter, Route, Routes, useNavigate,
} from 'react-router-dom';
import { MyContext } from './MyContext';


function LoginCustomer() {
  const {sharedData, setSharedData}= useContext(MyContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = (event) =>{
    console.log(sharedData);
    let tester = window.confirm("Try to press")
    //create confirmation modal of sales order
    if(tester == true){
      event.preventDefault();
      const url = 'http://localhost:4000/logincus';
      fetch(url, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({username: username, password: password})
      })
      .then(response => response.json())
      .then((data) => {{
        console.log(data);
        if(data.userType == 'customer'){
          localStorage.setItem("customerID", data.userID)
          console.log("customer")
          window.location.replace('/customersalestransaction');
        }
        else if(data.userType == 'admin'){
          localStorage.setItem("adminID", data.userID)
          console.log("admin")
          window.location.replace('/adminsalestransaction');
        }
      }})
      .catch(error => console.error(error))
      }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${backgroundpom})` }}>
      <div className="absolute inset-0 bg-lime-600 opacity-10 z-10"></div>
      <div> {sharedData}</div>
      <div className="mt-20 flex h-[200px] w-screen items-center justify-center bg-lime-800 z-30 shadow-2xl">
        <div className="h-[200px] w-[200px] border-white border rounded-full overflow-hidden">
          <img
            src={logo}
            alt="Shegels Logo"
            className="object-cover h-full w-full pl-2 pt-1"
          />
        </div>
        <div className="p-11 text-6xl text-white">She-gels Sweet <br />Pummelo Trading</div>
      </div>

      

      <div className='bg-green w-28 h-7 z-50'></div>

      <div className="m-16 mt-16 h-96 w-[750px] rounded-lg bg-white  font-bold text-black opacity-90 shadow-lg z-40">
      
        <div className="mt-8 text-5xl pb-9">Login</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 px-11">
            <label htmlFor="username" className="block text-gray-800 font-semibold">Email/Username</label>
            <input
              type="username"
              id="username"
              className="w-full p-2 border border-black rounded"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 px-11">
            <label htmlFor="password" className="block text-gray-800 font-semibold">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-black rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-emerald-500 w-36 text-white py-2 px-4 rounded font-semibold hover:bg-emerald-600">
            Log in
          </button>
          
          
        </form> 
        <Link to="/regcus">
        <button
            type="Sign-up"
            className=" py-2 px-4 rounded font-semibold underline">
            Sign-up
        </button>
        </Link>
        </div>
        
    </div>
  );
}

export default LoginCustomer;