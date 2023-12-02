import React, { useState, useEffect} from 'react';
import Sidebar from '../sidebar';
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
    height: '480px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    textAlign: 'left',
  },
};

const CustomerList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [lastName, setLastName] = useState([]);
  const [firstName, setFirstName] = useState([]);
  const [contactNumber, setContactNumber] = useState([])
  const [id, setID] = useState([]);

  const [newLastName, setNewLastName] = useState([]);
  const [newFirstName, setNewFirstName] = useState([]);
  const [gender, setGender] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [fax, setFax] = useState([]);
  const [billAddress, setBillAddress] = useState([]);
  const [shipAddress, setShipAddress] = useState([]);


  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  }

const handleInputLast = (event) =>{
    setNewLastName(event.target.value);
  }
const handleInputFirst = (event) =>{
    setNewFirstName(event.target.value);
  }
const handleInputGender = (event) =>{
  setGender(event.target.value);
}
const handleInputPhoneNumber = (event) =>{
  setPhoneNumber(event.target.value);
}
const handleInputFax = (event) =>{
  setFax(event.target.value);
}
const handleInputBillAddress = (event) =>{
  setBillAddress(event.target.value);
}
const handleInputShipAddress = (event) =>{
  setShipAddress(event.target.value);
}

  const[status, setStatus]= useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/customer')
    .then(res => {return res.json()})
    .then(data => {
        setID(data.map((row) =>  row.customer_id))
        setLastName(data.map((row) => row.last_name))
        setFirstName(data.map((row) => row.first_name));
        setContactNumber(data.map((row) => row.contact_number))
        setStatus(data.map((row) => row.verified != 0 ? 'VERIFIED' : 'UNVERIFIED'))
    })
}, [])

  const handleCreate = (() => {


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
        <div className="font-bold text-2xl mt-5">Customer List</div>
        <div className="flex flex-col w-10/12 mt-5">
          <div className="flex justify-end gap-2">
            <button onClick = {openModal} className="h-[30px] w-[150px] bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]"> Add Customer</button>
            <Link to="/verifycustomers"><button className="h-[30px] w-[150px] bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]">
              + Verify Customers
            </button></Link>
          </div>
        </div>
        <div className="flex flex-col w-10/12 shadow-lg mt-5">
          <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
            <div className="flex-1">Name</div>
            <div className="flex-1">Contact Number</div>
            <div className = "flex-1"> Status</div>

          </div>

          <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[500px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>
          
          {lastName.map((value, index) => {
            

              return(
                <div className="flex flex-row w-full mt-5">

                <Link to = "/customerprofile">
                <button
                className='ml-4 mt-1 bg-[#F3F3F3] text-black  hover:bg-[#3BC4AF] hover:text-white'
                onClick={() => { localStorage.setItem("customerID", id[index])}}
                >
                <Icon icon="bxs:edit" className='h-6 w-6' />
              </button>
              </Link>
              
            <div className="flex-1">{lastName[index]}, {firstName[index]}</div>
            <div className="flex-1">{contactNumber[index]}</div>
            <div className="flex-1"> <b>{status[index]}</b></div>
  
            </div>
              )   
            })}

          </div>
          {/* Additional employee entries can be added as needed */}
        </div>
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
                              <h2 className="">Phone Number </h2><input value = {phoneNumber} onChange = {handleInputPhoneNumber} class= " rounded-lg bg-teal-500 h-6 w-[160px]" type='text' placeholder='' ></input>

                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Fax Number </h2> <input value = {fax} onChange = {handleInputFax}class=" rounded-lg bg-teal-500 h-6 w-[160px]" type='text' placeholder='' ></input>

                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Bill Address </h2> <input value = {billAddress} onChange = {handleInputBillAddress}class=" rounded-lg bg-teal-500 h-6 w-[160px]" type='text' placeholder='' ></input>

                              </div>

                              <div className="flex gap-4">
                              <h2 className="">Shipping Address</h2> <input value = {shipAddress} onChange = {handleInputShipAddress} class=" rounded-lg bg-teal-500 h-6 w-[160px]" type='text' placeholder='' ></input>

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
    </div>
  );
};

export default CustomerList;