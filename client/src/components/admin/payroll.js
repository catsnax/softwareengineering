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
      width: '700px',
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

const Payroll = () => {

//modal functions
const [isModalOpen, setIsModalOpen] = useState(false);
const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setNames([]);
    setCondition(false);
    setHoursDifference([]);
  };

const [anotherModal, setAnotherModal] = useState(false);
const openAnotherModal = (payroll_id, today) => {
  setAnotherModal(true);
  const url = 'http://localhost:4000/payrolldetails'
  
    fetch(url, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({payrollID: payroll_id})
  })
  .then(response => response.json())
  .then((data)=> {
    setEmployeeLastName(data.map((row) => row.last_name));
    setEmployeeFirstName(data.map((row) => row.first_name));
    setHourlyRate((data.map((row) => row.hourly_date)));
    setHoursWorked(data.map((row)=> row.hours_worked))
    setEmpTimeIn(data.map((row) => row.time_in));
    setEmpTimeOut(data.map((row) => row.time_out));
    setTotalEmpPayment(data.map((row) => row.employee_pay))
    setCurrentDate(new Date(payrollDate[today]));
  })
  .catch(error => console.error(error))
  }


const closeAnotherModal = () => {
  setAnotherModal(false);
}


//for first modal select options
const [lastName, setLastName] = useState([]);
const [firstName, setFirstName] = useState([]);
const [employeeID, setEmployeeID] = useState([]);
//regulating selected employee & associated salary
const [selectedEmployee, setSelectedEmployee] = useState([])
const [selectedPay, setSelectedPay] = useState([]);
const [checkerEmployee, setCheckerEmployee] = useState([]);

//data coming from first modal file
const [hoursDifference, setHoursDifference] = useState([]);
const [names, setNames] = useState([]);
const [payRates, setPayRates] = useState([]);
const [condition, setCondition] = useState(false);
const[timeIn, setTimeIn] = useState([]);
const[timeOut, setTimeOut] = useState([]);
const [totalPay, setTotalPay] = useState([]);
const [payrollDate, setPayrollDate] = useState([]);

//other data
const [adminLast, setAdminLast]  = useState([]);
const [adminFirst, setAdminFirst]  = useState([]);
const [payrollID, setPayrollID] = useState([]);

//data for payslip details
const [employeeLastName, setEmployeeLastName] = useState([]);
const [employeeFirstName, setEmployeeFirstName] = useState([]);
const [hourlyRate, setHourlyRate] = useState([]);
const [hoursWorked, setHoursWorked] = useState([]);
const [totalEmpPayment, setTotalEmpPayment] = useState([]);
const [empTimeIn, setEmpTimeIn] = useState([]);
const [empTimeOut, setEmpTimeOut] = useState([]);
const [currentDate, setCurrentDate] = useState([]);


const receiveVariable = (variable1, variable2) => {
  setNames(variable1.map((row) => row.Name))
  setTimeIn(variable1.map((row) => row['Clock In']));
  setTimeOut(variable1.map((row) => row['Clock Out']));
  setHoursDifference(variable2);
  setCondition(true);

  setSelectedEmployee(variable2.map((row) => 0))
  
  let dummyArray = []

  for(let i = 0; i < variable2.length; i++){
      dummyArray[i] = variable2[i] * selectedPay[i];
      setTotalPay(dummyArray)
  }
}

const handleInputChange = (index, newValue) => {
  const updatedValues = [...selectedEmployee];
  const newUpdated = [...selectedPay]
  const payUpdated = [...totalPay]
  let checkerValues = [...checkerEmployee]

  checkerValues[index] = newValue
  updatedValues[index] = employeeID[newValue]
  newUpdated[index] = payRates[newValue]
  payUpdated[index] = payRates[newValue] * hoursDifference[index]

  console.log(updatedValues);

  setCheckerEmployee(checkerValues);
  setSelectedEmployee(updatedValues);
  setSelectedPay(newUpdated);
  setTotalPay(payUpdated);
  };


useEffect(() => {
    fetch('http://localhost:4000/employeepayroll')
    .then(res => {return res.json()})
    .then(data => {
      data.reverse();
      setLastName(data.map((row) => row.last_name));
      setFirstName(data.map((row) => row.first_name))
      setEmployeeID(data.map((row) => row.employee_id))
      
      setPayRates(data.map((row) => row.active_salary));
      setSelectedPay(data.map((row) => row.active_salary));
}
)}, [])

useEffect(() => {
  fetch('http://localhost:4000/payroll')
  .then(res => {return res.json()})
  .then(data => {
    data.reverse();
    setPayrollDate(data.map((row) => row.report_date));
    setAdminLast(data.map((row) => row.last_name));
    setAdminFirst(data.map((row) => row.first_name));
    setPayrollID(data.map((row) => row.payroll_id))

}
)}, [])


const handleCreate = (event) => {
    let tester = window.confirm("Try to press")
        //create confirmation modal of sales order
        if(tester == true){
          event.preventDefault();
          console.log("submitted");
          const url = 'http://localhost:4000/payroll';
          fetch(url, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({selectedEmployee:selectedEmployee, hourlyRates:selectedPay, hoursDifference: hoursDifference, timeIn:timeIn, timeOut:timeOut, totalPay:totalPay, adminID: localStorage.getItem("adminID")})
          })
          .then(response => response.json())
          .catch(error => console.error(error))
          }
    setTimeout(() => {
    }, 2000);
  };

  

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
        <div className="font-bold text-2xl mt-5">Payroll</div>
        <div className="flex flex-col w-10/12 mt-5">
          <div className="flex justify-end">
          <Link to="/payroll">
            <button className="h-[30px] w-[120px] mr-1 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" onClick = {openModal}>
             Add Payslip
            </button>
          </Link>
            
          </div>
        </div>
        <div className="flex flex-col w-10/12 shadow-lg mt-5">
          <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
            <div className="flex-[0.2]"></div>
            <div className="flex-1">Date</div>
            <div className="flex-1">Admin</div>
          </div>

          <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[500px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>
          

          {payrollDate.map((value, index) => {
            return(
            <div className="flex flex-row w-full mt-5">
                <div className="">
                <button onClick = {() => openAnotherModal(payrollID[index], index)} className=" rounded-sm ml-4 mt-1 bg-[#F3F3F3] text-black hover:bg-[#3BC4AF] hover:text-white">
                <Icon icon="ph:play" className='h-6 w-6'/>
                </button>
                </div>
              <div className="flex-1 ml-10">{new Date(payrollDate[index]).toLocaleDateString('en-US', options)}</div>
              <div className="flex-1">{adminLast[index]}, {adminFirst[index]}</div>
              
            </div>

            )

            
          })}
          </div>
        </div>
         {/* Modal */}
         {isModalOpen && (
                    <div style={modalStyles.modalContainer}>
                      <div style={modalStyles.modal}>
                        <div style={modalStyles.modalContent}>
                          <div className="text-center text-xl font-bold mb-9">Add Payslip</div>
                          <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
                        
                              
                          <ExcelReader onDataLoaded = {receiveVariable}></ExcelReader>
                          {(condition == true) ? <div>
                          <table class=" min-w-full table-auto mt-[-20px]">
                              <thead>
                                <tr className = "text-center">
                                  <th>Name</th>
                                  <th>Hours Worked</th>
                                  <th>Employee </th>
                                  <th>Total Payment</th>
                                </tr>
                              </thead>
                              <tbody className = "text-center">
                                {hoursDifference.map((record, index) => (
                                  <tr key={index}>
                                    <td>{names[index]}</td>
                                    <td>{hoursDifference[index]} hours</td>
                                    <select value = {checkerEmployee[index]} onChange={(e) => handleInputChange(index, e.target.value)}>
                                    {lastName.map((value, index) => {
                                      return(
                                        <option value = {index}> {lastName[index]}, {firstName[index]}</option>
                                      )

                                    })}
                                    </select>
                                    <td>P{selectedPay[index] * hoursDifference[index]}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table> 
                            


                            <div className='flex justify-center items-center gap-2 mt-[40px]'>
                              <button onClick={closeModal} className="delay-150 bg-[#D9D9D9] w-[75px] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3] place-content-end">Close </button>
                              <button className="delay-150 bg-[#D9D9D9] w-[75px] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3] place-content-end" onClick = {handleCreate}> Submit </button>
                            </div>
                            </div> : <span> <button onClick={closeModal} className="delay-150 bg-[#D9D9D9] w-[75px] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3] place-content-end">Close </button></span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

          {anotherModal&& (
                    <div style={modalStyles.modalContainer}>
                      <div style={modalStyles.modal}>
                        <div style={modalStyles.modalContent}>
                          <div className="text-center text-xl font-bold mb-9">{currentDate.toLocaleString('en-US')}</div>
                          <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
                        
                          <table class=" min-w-full table-auto mt-[-20px]">
                              <thead>
                                <tr className = "text-center">
                                  <th>Name</th>
                                  <th> Time In</th>
                                  <th> Time Out</th>
                                  <th>Hours Worked</th>
                                  <th>Total Payment</th>
                                </tr>
                              </thead>
                              <tbody className = "text-center">
                                {employeeFirstName.map((value, index) =>  {
                                  return(
                                    <tr key={index}>
                                      <td>{employeeLastName[index]}, {employeeFirstName[index]}</td>
                                      <td>{empTimeIn[index]}</td>
                                      <td> {empTimeOut[index]}</td>
                                      <td> {hoursWorked[index]}</td>
                                      <td> {totalEmpPayment[index]}</td> 
                                    </tr>

                                  )

                                })}
                                  
                              </tbody>
                            </table> 
                            
                            <div className='flex justify-center items-center gap-2 mt-[40px]'>
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

export default Payroll;