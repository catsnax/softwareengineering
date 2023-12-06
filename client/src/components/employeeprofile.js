import React, {useState, useEffect}  from 'react';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
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

  let options = {
    hour: '2-digit',
    minute: '2-digit'
  };
  

const EmployeeProfile = () => {

//modal functions
const [isModalOpen, setIsModalOpen] = useState(false);
const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

//create new employee variables
const [timeIn, setTimeIn] = useState([]);
const [timeOut, setTimeOut] = useState([]);
const [reportDate, setReportDate] = useState([]);
const [hoursWorked, setHoursWorked] = useState([]);
const [employeePay, setEmployeePay] = useState([]);


const [id, setID] = useState(localStorage.getItem("EmployeeID"));
const [profile, setProfile] = useState("");


useEffect(() => {
        const url = 'http://localhost:4000/employeeprofile';
          fetch(url, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({userID: id})
          })
          .then(response => response.json())
          .then((data) => {
            setProfile(data[0]);
            
          })
          .catch(error => console.error(error))
    }, [])

useEffect(() => {
    const url = 'http://localhost:4000/employeepayslip';
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({userID: id})
        })
        .then(response => response.json())
        .then((data) => {
            data.reverse();
            setTimeIn(data.map((row) => row.time_in))
            setTimeOut(data.map((row) => row.time_out))
            setReportDate(data.map((row) => row.report_date))
            setHoursWorked(data.map((row) => row.hours_worked));
            setEmployeePay(data.map((row) => row.employee_pay))
        
        })
        .catch(error => console.error(error))
}, [])

  return (
    <div className="w-screen min-h-screen flex">
      <Sidebar />

      <div className="w-screen min-h-screen flex flex-col ml-[375px] items-start">
        <div className="flex flex-row mt-[50px]">
          <input
            className="bg-[#D9D9D9] h-[30px] w-[225px] rounded-tl-sm rounded-bl-sm min-w-[50px] border-[1.5px] border-black placeholder:text-black"
            placeholder=" Search"
          ></input>
          <button className="h-[30px] w-[40px] border-l-0 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black justify-center items-center px-2 hover:bg-[#F3F3F3]">
            <Icon icon="carbon:search" className="h-5 w-5" />
          </button>
        </div>
        <div>
        </div>
        <div className="font-bold text-2xl mt-10">{profile.last_name}, {profile.first_name}</div>
        <div className = "text-ml"> Position: {profile.position}</div>

        <div className="bg-[#D9D9D9] h-[150px] w-10/12 border-[1.5px] border-black mt-[10px] font-bold shadow-md rounded-sm">
          <div className="flex">
            <div className="rounded-full border-2 bg-white h-[100px] w-[100px] ml-8 mt-5 border-white "></div>
            
            <div className="flex-col ml-[20px] mt-[23px] w-[150px] text-left whitespace-nowrap">
            <div class="">Name:  {profile.last_name}, {profile.first_name}</div>
              <div class=" ">Phone No: {profile.contact_number}</div>
              <div>Gender: Male</div>
            </div>
            <div className="flex-col ml-[120px] w-[150px] mt-[23px] text-left whitespace-nowrap">
                <div> Department : {profile.department}</div>
                <div> Position: {profile.position}</div>
                <div>Hourly Rate: ₱{profile.active_salary}/hour</div>
            </div>

            <div className="flex-col ml-[120px] w-[150px] mt-[23px] text-left whitespace-nowrap">
                <div> Required Time In : {profile.req_time_in}</div>
                <div> Required Time Out: {profile.req_time_out}</div>
                
            </div>


          </div>
        </div>

        <div className="flex flex-col w-10/12 shadow-lg mt-5">
          <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
            <div className="flex-[0.1]"></div>
            <div className="flex-1">Date</div>
            <div className="flex-1">Time In</div>
            <div className = "flex-1">Time Out</div>
            <div className = "flex-1">Number of Hours</div>
            <div className = "flex-1">Payment</div>
          </div>

          <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[450px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>
          {reportDate.map((value, index) => {
            return(
                <div className="flex flex-row w-full justify-center items-center mt-5">
              <div className="flex-1 ml-8">{new Date(reportDate[index]).toLocaleDateString('en-US', options)}</div>
              <div className="flex-1">{timeIn[index]}</div>
              <div className="flex-1">{timeOut[index]}</div>
              <div className="flex-1">{hoursWorked[index]} hours</div>
              <div className="flex-1">₱{employeePay[index]}</div>
            </div>
            )
          })}
          </div>
        </div>

        </div>
        </div>
  );
};

export default EmployeeProfile;