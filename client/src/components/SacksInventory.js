import React, { useState, useEffect} from 'react';
import {Link, Route, Routes} from "react-router-dom";
import Sidebar from './sidebar';
import { Icon } from '@iconify/react';

const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };


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
    height: '400px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    textAlign: 'left',
  },
};

const SacksInventory = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState('');

  const nowDate = new Date()

  const [newQuantity, setNewQuantity] = useState();
  const [newDate, setNewDate] = useState(`${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}`);

  const [sackQuantity, setSackQuantity] = useState([]);
  const [sackDate, setSackDate] = useState([]);

    const handleInputChangeSack = (event) =>{
        setNewQuantity(event.target.value);
    }

    const handleInputChangeDate = (event) =>{
        setNewDate(event.target.value);
    }


    useEffect(() => {
      fetch('http://localhost:4000/sacks')
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setSackQuantity(data.map((row) => row.sack_quantity));
          setSackDate(data.map((row) => row.stockin_sack_date));
        })
    }, []);


    const handleSubmit = (event) =>{

        let tester = window.confirm("Try to press")
        //create confirmation modal of sales order
        if(tester == true){
          event.preventDefault();
          console.log("submitted")
          const url = 'http://localhost:4000/sacks';
          fetch(url, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({sacks: newQuantity, date: newDate })
          })
          .then(response => response.json())
          .catch(error => console.error(error))
          }
      }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddInventory = () => {
    // Handle the logic for adding inventory here
    console.log('Adding inventory:', newProductName, newProductQuantity);
  
    // Close the modal after a delay (e.g., 2 seconds)
    setTimeout(() => {
      closeModal();
    }, 2000); // 2000 milliseconds (2 seconds)
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
            <div className="font-bold text-2xl mt-5">Sacks Inventory</div>
            <div className="flex flex-col w-10/12 mt-5">
                
              <div className="flex flex-row justify-end">
                <button className="h-[30px] w-[200px] bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" onClick={openModal}> 
                 + Add Sacks
                </button>
                  {isModalOpen && (
                    <div style={modalStyles.modalContainer}>
                      <div style={modalStyles.modal}>
                        <div style={modalStyles.modalContent}>
                          <div className="text-center text-xl font-bold mb-9">Add Sacks</div>
                          <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
                            <h2 className="flex-1 flex ml-10">
                            

                            </h2>
                            <h2 className="flex-1 flex ml-10">
                              <b>Number of Sacks </b>
                              <div className="flex-1">
                                <input
                                  value={newQuantity}
                                  onChange={(event) => setNewQuantity(event.target.value)}
                                  className="ml-[75px] rounded-lg bg-teal-500 h-6 w-[105px]"
                                />
                              </div>
                            </h2>
                            <div className='flex flex-col items-center gap-6'><button
                              onClick={handleSubmit}
                              className="delay-150 bg-[#D9D9D9] w-[75px] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3] place-content-end"
                            >
                              Submit
                            </button>
                            <button
                              onClick={closeModal}
                              className="delay-150 bg-[#D9D9D9] w-[75px] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3] place-content-end"
                            >
                              Close
                            </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
              </div>
            </div>
            <div className="flex flex-col w-10/12 shadow-lg mt-5">
              <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
                <div className="flex-[0.3]"></div>
                <div className="flex-1">Sack Date Input</div>
                <div className="flex-1">Sack Quantity</div>
              </div>
    
              <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[500px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>
              
              {sackQuantity.map((value, index) => {
                return(
                  <div className="flex flex-row w-full mt-5">
                    <div className="">
                    <Link to="/employee"><button className="ml-6 mt-1 bg-[#F3F3F3] text-black hover:bg-[#3BC4AF] hover:text-white">
                    <Icon icon="iconamoon:box-light" className='h-6 w-6'/>
                    </button></Link>

                    <button className="ml-6 mt-1 bg-[#F3F3F3] text-black hover:bg-[#3BC4AF] hover:text-white">
                        <Icon icon="material-symbols:delete-outline" className='h-6 w-6' />
                    </button>
                  </div>
                  <div className="flex-1">{new Date(sackDate[index]).toLocaleDateString('en-US')}</div>
                  <div className="flex-1">{sackQuantity[index]} sacks</div>
                </div>
                )
              })}
              
              
               
                
    
              </div>
              {/* Additional employee entries can be added as needed */}
            </div>
          </div>
        </div>
      );
    };

export default SacksInventory
