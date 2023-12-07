import React, {useState, useEffect}  from 'react';
import Sidebar from '../sidebar';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ExcelReader from '../excelreader';

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

const EmployeeList = () => {

//modal functions
const [isModalOpen, setIsModalOpen] = useState(false);
const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

const [anotherModal, setAnotherModal] = useState(false);
const openAnotherModal = () => {
  setAnotherModal(true);
};
const closeAnotherModal = () => {
  setAnotherModal(false);
};

//create new employee variables
const [newLastName, setNewLastName] = useState("");
const [newFirstName, setNewFirstName] = useState("");
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


//displaying employee variables
const [lastName, setLastName] = useState([]);
const [firstName, setFirstName] = useState([]);
const [department, setDepartment] = useState([]);
const [position, setPosition] = useState([]);
const [employeeID, setEmployeeID] = useState([]);
const [adminEmployee, setAdminEmployee] = useState([]);

const [userName, setUserName] = useState();
const [password, setPassword] = useState();
const [selectedEmployee, setSelectedEmployee] = useState();

const [hoursDifference, setHoursDifference] = useState([]);

const receiveVariable = (variable1, variable2) => {
  console.log(variable1);
  console.log(variable2);
}

const handleRedirect = (index) => {
  localStorage.setItem('EmployeeID', employeeID[index]);
}

useEffect(() => {
    fetch('http://localhost:4000/employee')
    .then(res => {return res.json()})
    .then(data => {
      setLastName(data.map((row) => row.last_name));
      setFirstName(data.map((row) => row.first_name));
      setDepartment(data.map((row) => row.department))
      setPosition(data.map((row) => row.position));
      setEmployeeID(data.map((row) => row.employee_id))
      setSelectedEmployee(data[0].employee_id)
      setAdminEmployee(data.map((row) => row.user_id))
})} , [])


const handleCreate = (event) => {
    let tester = window.confirm("Try to press")
        //create confirmation modal of sales order
        if(tester == true){
          event.preventDefault();
          console.log("submitted");
          const url = 'http://localhost:4000/employee';
          fetch(url, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({newLastName:newLastName, newFirstName:newFirstName, newAddress:newAddress, newDepartment:newDepartment, newPosition:newPosition, newSalary:newSalary, newTimeIn:newTimeIn, newTimeOut:newTimeOut})
          })
          .then(response => response.json())
          .catch(error => console.error(error))
          }
    setTimeout(() => {
    }, 2000);
  };

  const handleInputChange = (newValue) => {
      setSelectedEmployee(newValue)
      console.log(newValue);
  }

  const handleAdmin = (() => {
    const url = 'http://localhost:4000/registeradmin';
    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: userName, password: password, selectedEmployee:selectedEmployee})
    })
    .then(response => response.json())
    .catch(error => console.error(error))
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
        <div className="font-bold text-2xl mt-5">Employee List</div>
        <div className="flex flex-col w-10/12 mt-5">
          <div className="flex justify-end">
          <Link to="/payroll">
            <button className="h-[30px] w-[130px] mr-1 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]">
             Payroll
            </button>
          </Link>
          <button className="h-[30px] w-[150px] mr-2 bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" onClick = {openAnotherModal}>
            Register Admin
            </button>
            <button className="h-[30px] w-[150px] mr-2 bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" onClick = {openModal}>
            Register Employee
            </button>
            
          </div>
        </div>
        <div className="flex flex-col w-10/12 shadow-lg mt-5">
          <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
            <div className="flex-[0.2]"></div>
            <div className="flex-1">Name</div>
            <div className="flex-1">Department</div>
            <div className="flex-1">Position</div>
          </div>

          <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[500px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>
          

          {lastName.map((value, index) => {
            return(
            <div className="flex flex-row w-full mt-5">
                <div className="">
                <Link to="/employeeprofile">
                <button onClick = { () => handleRedirect(index)} className=" rounded-sm ml-4 mt-1 bg-[#F3F3F3] text-black hover:bg-[#3BC4AF] hover:text-white">
                <Icon icon="ph:play" className='h-6 w-6'/>
                </button>
                </Link>
                </div>
              <div className="flex-1">{lastName[index]}, {firstName[index]}</div>
              <div className="flex-1">{department[index]}</div>
              <div className="flex-1">{position[index]}</div>
            </div>

            )

            
          })}
          </div>
          {/* Additional employee entries can be added as needed */}
        </div>
         {/* Modal */}
         {isModalOpen && (
                    <div style={modalStyles.modalContainer}>
                      <div style={modalStyles.modal}>
                        <div style={modalStyles.modalContent}>
                          <div className="text-center text-xl font-bold mb-9">Register Employee</div>
                          <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
                        
                              <div className="flex gap-4">
                              <h2 className="">Last Name </h2>
                                <input value = {newLastName} onChange = {(event) => handleInputLast(event)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>

                              <div className="flex gap-4">
                              <h2 className="">First Name </h2>
                                <input value = {newFirstName} onChange = {(event) => handleInputFirst(event)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Address</h2>
                                <input value = {newAddress} onChange = {(event) => handleAddressChange(event)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Department </h2>
                                <input value = {newDepartment} onChange = {(event) => handleDepartment(event)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Position </h2>
                                <input value = {newPosition} onChange = {(event) => handlePositionChange(event)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Rate per hour </h2>
                                <input value = {newSalary} onChange = {(event) => handleSalaryChange(event)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Working Schedule Time In </h2>
                                <input type= "time" value = {newTimeIn} onChange = {(event) => handleTimeInChange(event)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Working Schedule Time Out </h2>
                                <input type = "time" value = {newTimeOut} onChange = {(event) => handleTimeOutChange(event)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>
                           
                            
                            <div className='flex flex-col items-center gap-6 mt-[0px]'>
                              <button onClick = {handleCreate}> Submit </button>
                              <button onClick={closeModal} className="delay-150 bg-[#D9D9D9] w-[75px] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3] place-content-end">Close </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

{anotherModal && (
                    <div style={modalStyles.modalContainer}>
                      <div style={modalStyles.modal}>
                        <div style={modalStyles.modalContent}>
                          <div className="text-center text-xl font-bold mb-9">Register Employee</div>
                          <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
                        
                              <div className="flex gap-4">
                              <h2 className="">Username </h2>
                                <input value = {userName} onChange = {(event) => setUserName(event.target.value)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Password</h2>
                                <input value = {password} onChange = {(event) => setPassword(event.target.value)} className="rounded-lg bg-teal-500 h-6 w-[160px]"/>
                              </div>

                              <div className = "flex gap-4"> 
                                <h2> Select Employee</h2>
                              <select value = {selectedEmployee} onChange = {(event) => {handleInputChange(event.target.value)}}>
                                {employeeID.map((value, index) => {
                                  return( 
                                    (adminEmployee[index] == null) ? <option value={employeeID[index]}> {lastName[index]}, {firstName[index]}</option> : <div></div>)
                                
                                  })}

                              
                              </select>
                              </div>
                             
                           
                            
                            <div className='flex flex-col items-center gap-6 mt-[0px]'>
                              <button onClick = {handleAdmin}> Submit </button>
                              <button onClick={closeAnotherModal} className="delay-150 bg-[#D9D9D9] w-[75px] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3] place-content-end">Close </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
      </div>
    </div>
  );
};

export default EmployeeList;