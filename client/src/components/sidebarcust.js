import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../images/shebalogo_nobg.png';
import { Icon } from '@iconify/react';

function CustomerSidebar() {

    const handleLogout = ( (parameter) =>{
        let tester = window.confirm("Are you sure you want to logout?")
        
        if(tester == true){
            window.location.replace('/');
    }}
    )
    const activeLinkStyle = {
      backgroundColor: '#3BC4AF',
    };
    
    return (
      <div className='flex-col bg-[#303535] items-center flex w-[250px] h-[100%] fixed rounded'>
        <div className='pt-1 w-10/12'>
          <img
            src={logo}
            alt="Shegels Logo"
            className="object-fill h-full w-full px-8 pt-10"
          />
        </div>
        <div className="rounded-full border-2 bg-white h-40 w-40 min-h-40 mb-8 mt-10 border-white"></div>
        <div className="text-xl font-bold text-white">Aaron Macias</div>
        <div className="text-lg text-white">Marketing Head</div>
        <div className="mt-[20px]  rounded-lg w-11/12 bg-white h-[2px]"></div>
  
        <div className='w-full mt-10'>
          <NavLink to="/customersalestransaction" activeClassName="active-link">
            <button className="delay-30 w-10/12 hover:bg-[#3BC4AF] h-[70px] text-white rounded-sm">
              <div className='flex flex-row place-items-center pl-11'><Icon icon="mdi:shopping-outline" className='h-[40px] w-[35px] mr-4' /><b>Order</b></div>
            </button>
          </NavLink>
        </div>
  
        <div className='w-full'>
          <NavLink to="/customer" activeClassName="active-link">
            <button className="delay-30 w-10/12 hover:bg-[#3BC4AF] h-[70px] text-white rounded-sm">
              <div className='flex flex-row place-items-center pl-11'><Icon icon="material-symbols-light:inventory"  className='h-[40px] w-[35px] mr-4' /><b>Transactions</b></div>
            </button>
          </NavLink>
        </div>

        <div className='w-full'>
          <button onClick = {handleLogout} className="mt-40 delay-30 w-10/12 hover:bg-[#3BC4AF] h-[60px] text-white rounded-sm">
            <div className='flex flex-row place-items-center pl-11'><b>Log Out</b></div>
          </button>
      </div>

      </div>
    );
  }
  

export default CustomerSidebar;