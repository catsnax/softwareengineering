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

const [editButton, setEditButton] = useState(false);

const [newLastName, setNewLastName] = useState("");
const [newFirstName, setNewFirstName] = useState("");
const [newContact, setNewContact] = useState("")
const [newDepartment, setNewDepartment] = useState("");
const [newPosition, setNewPosition] = useState("");
const [newAddress, setNewAddress] = useState("")
const [newSalary, setNewSalary] = useState("");
const [newTimeIn, setNewTimeIn] = useState("");
const [newTimeOut, setNewTimeOut] = useState("");

const handleInputLast = (event) =>{
  setNewLastName(event.target.value);
}
const handleInputFirst = (event) =>{
  setNewFirstName(event.target.value);
}
const handleDepartment = (event) => {
  setNewDepartment(event.target.value)
}
const handlePositionChange = (e) => {
  setNewPosition(e.target.value);
};
const handleAddressChange = (e) => {
  setNewAddress(e.target.value);
};
const handleSalaryChange = (e) => {
  setNewSalary(e.target.value);
};
const handleTimeInChange = (e) => {
  setNewTimeIn(e.target.value);
};
const handleTimeOutChange = (e) => {
  setNewTimeOut(e.target.value);
};


const handleEdit = (() => {
    if(editButton == false){
      setEditButton(true)
    }
    else{
      setEditButton(false);
    }
})


const [id, setID] = useState(localStorage.getItem("EmployeeID"));
const [profile, setProfile] = useState("");

const updateAttribute = (newValue, attribute) => {
  setProfile(prevObject => ({
    ...prevObject,   // Spread the previous state
    attribute : newValue,   // Update the specific attribute
  }));
};


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
            setNewContact(data[0].contact_number);
            setNewDepartment(data[0].department)
            setNewPosition(data[0].position)
            setNewSalary(data[0].active_salary)
            setNewTimeIn(data[0].req_time_in);
            setNewTimeOut(data[0].req_time_out)
            
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

const handleDetails = (() => {
  let tester = window.confirm("Try to press")
        //create confirmation modal of sales order
        if(tester == true){
  const url = 'http://localhost:4000/editemployee';
    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({id:id, newContact: newContact, newDepartment:newDepartment, newPosition: newPosition, newSalary: newSalary, newTimeIn: newTimeIn, newTimeOut: newTimeOut})
    })
    .then(response => response.json())
    .catch(error => console.error(error))
}}) 
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

        <button className="h-[30px] w-[150px] ml-[1030px] mr-2 bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" onClick = {handleEdit}>
            Edit Details
            </button>
        <div className="bg-[#D9D9D9] h-[160px] w-10/12 border-[1.5px] border-black mt-[10px] font-bold shadow-md rounded-sm">
          <div className="flex">
            <div className="rounded-full border-2 bg-white h-[100px] w-[100px] ml-8 mt-5 border-white "></div>

            {(editButton == true) ? <span className = "flex">
              <div className="flex-col ml-[20px]  mt-[23px] w-[150px] text-left whitespace-nowrap">
              <div className = "mb-2"><span>Phone No: </span><input onChange = {(event) => setNewContact(event.target.value)} class = "rounded-md text-center bg-[#3BC4AF] w-32" value = {newContact}></input></div>
              <div className = "mb-2"><span>Department :  </span><input onChange = {(event) => setNewDepartment(event.target.value)} class = "rounded-md text-center bg-[#3BC4AF] w-32" value = {newDepartment}></input></div>
              <div className = "mb-2"><span>Position: </span>  <input  onChange = {(event) => setNewPosition(event.target.value)} class = "rounded-md text-center bg-[#3BC4AF] w-32" value = {newPosition}></input></div>
              <div><span>Hourly Rate: ₱</span> <input onChange = {(event) => setNewSalary(event.target.value)} class = "rounded-md text-center bg-[#3BC4AF] w-32" value = {newSalary}></input><span> /hour</span></div>
                
            </div>
          
            <div className="flex-col ml-[170px] w-[150px] mt-[23px] text-left whitespace-nowrap">
              <div className = "mb-2"><span>Required Time In : </span><input onChange = {(event) => setNewTimeIn(event.target.value)} class = "rounded-md text-center bg-[#3BC4AF] w-32"  value = {newTimeIn}></input></div>
              <div><span>Required Time Out:  </span><input  onChange = {(event) => setNewTimeOut(event.target.value)} class = "rounded-md text-center bg-[#3BC4AF] w-32"   value = {newTimeOut}></input></div> 
              <div><button className="h-[30px] w-[150px] mt-8 mr-2 bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" onClick = {handleDetails} >Save Changes</button></div>


            </div>



            </span> : <span className = "flex">
            
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
            </span>}
            
           
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