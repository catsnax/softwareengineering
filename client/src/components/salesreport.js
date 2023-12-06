import React, {useState, useEffect}  from 'react';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

let options = {
    hour: '2-digit',
    minute: '2-digit'
  };

const modalStyles = {
    modalContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.6)', // Grey out the background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    modal: {
      background: 'white',
      border: '1px solid #ccc', // Add a border to the modal
      borderRadius: '5px',
      padding: '20px',
      width: '500px',
      height: '550px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
      textAlign: 'left',
    },
  };

const SalesReport = () => {

//create sales report variables
const [date, setDate] = useState();

const [fromDate, setFromDate] = useState();
const [toDate, setToDate] = useState();

const [orderDates, setOrderDates] = useState([]);
const [lastNames, setLastNames] = useState([]);
const [firstNames, setFirstNames] = useState([]);
const[orderCost, setOrderCost] = useState([]);
const [orderStatus, setOrderStatus] = useState([]);
const [totalCost, setTotalCost] = useState(0);

let sum = 0;

const [changeOption, setChangeOption] = useState(false);

const handleChange = () => {
  if (changeOption == true){
    setChangeOption(false)
  }
  else{
    setChangeOption(true);
  }
} 


const handleSearch = (event) => {
    let tester = window.confirm("Try to press")
        //create confirmation modal of sales order
        if(tester == true){
          event.preventDefault();
          console.log(date);
          const url = 'http://localhost:4000/salesreport';
          fetch(url, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({date: date, changeOption: changeOption, fromDate: fromDate, toDate: toDate })
          })
          .then(response => response.json())
          .then((data) => {
            if(data.length == 0){
                setLastNames([]);
                setFirstNames([]);
                setOrderDates([]);
                setOrderCost([]);
                setOrderStatus([]);
                setTotalCost(0);
            }
            else{
                setLastNames(data.map((row) =>  row.last_name));
                setFirstNames(data.map((row) => row.first_name));
                setOrderDates(data.map((row) => row.order_date));
                setOrderCost(data.map((row) => row.total_amount));
                setOrderStatus(data.map((row) => row.order_status));

                
            }
        })
          .catch(error => console.error(error))
          }
    setTimeout(() => {
    }, 2000);
  };

  useEffect(() => {
    orderCost.map((value, index) => {
        sum += value;
        setTotalCost(sum);
        console.log("hi");
    })
  })

  return (
    <div className="w-screen min-h-screen flex">
      <Sidebar />
      <div className="w-screen min-h-screen flex flex-col ml-[375px] items-start">
        <div className="flex flex-row mt-[100px]">
          <input
            className="bg-[#D9D9D9] h-[30px] w-[225px] rounded-tl-sm rounded-bl-sm min-w-[50px] border-[1.5px] border-black placeholder:text-black"
            placeholder=" Search"
          ></input>
          <button className="h-[30px] w-[40px] border-l-0 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black justify-center items-center px-2 hover:bg-[#F3F3F3]">
            <Icon icon="carbon:search" className="h-5 w-5" />
          </button>
        </div>
        <div className="font-bold text-2xl mt-5">Sales Report</div>
        <div className="flex flex-col w-10/12 mt-5">
          <div className="flex justify-end">
            <button onClick = {handleChange} className="h-[30px] w-[150px] mr-2 bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]"> Change Searching</button>
            {(changeOption == false) ? 
            <div className = "flex">
                <div className="h-[30px] mr-2 mt-1"> From</div>
                <input type = "date" onChange = {(event) => {setFromDate(event.target.value)}} className="h-[30px] mr-1 w-[100x] bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" />
                <div className="h-[30px] mr-2 mt-1"> To</div>
                <input type = "date" onChange = {(event) => {setToDate(event.target.value)}} className="h-[30px] mr-1 w-[140px] bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" />
            </div> : 
            <div className = "flex">
              <div className="h-[30px] mr-2 mt-1"> Select Date</div>
              <input type = "date" onChange = {(event) => {setDate(event.target.value)}} className="h-[30px] mr-1 w-[80x] bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" />
            </div>}
           <button onClick = {handleSearch} 
           className="h-[30px] w-[120px] bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]"> Search</button>
           
            
          </div>
        </div>
        <div className="flex flex-col w-10/12 shadow-lg mt-5">
          <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
            <div className="flex-[0.2]"></div>
            <div className="flex-1">Customer Name</div>
            <div className="flex-1">Order Date</div>
            <div className="flex-1">Order Cost</div>
          </div>

          <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[500px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>
          

          {lastNames.map((value, index) => {
            return(
            <div className="flex flex-row w-full mt-5 items-center justify-center">
                
              <div className="flex-1 ml-20">{lastNames[index]}, {firstNames[index]}</div>
              <div className="flex-1">{new Date(orderDates[index]).toLocaleDateString('en-US', options)}</div>
              <div className="flex-1">P{orderCost[index]}</div>
            </div>
            )
          })}
           <b> <div> Total Cost: P{totalCost}</div></b>
          </div>

        </div>
         {/* Modal */}
         
      </div>
    </div>
  );
};

export default SalesReport;