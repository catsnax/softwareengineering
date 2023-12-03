import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {Link, Route, Routes} from "react-router-dom";
import CustomerSidebar from '../sidebarcust';
import { Icon } from '@iconify/react';
import { MyContext } from '../MyContext';
import Customer from './customer';
import ImageUploadForm from '../ImageUploadForm';


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
    height: '500px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    textAlign: 'left',
  },
};

function SalesTransaction(){
  const {sharedData, setSharedData}= useContext(MyContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState('');

  const [product, setProduct] = useState([]);
      
  const [inputValues, setInputValues] = useState([]);
  const [Class, setClass] = useState([]);
  const [measure, setMeasure] = useState([]);
  const [productPrice, setProductPrice] = useState([]);
  const [remainingQuantity, setRemainingQuantity] = useState([]);
  const [visibility, setVisibility] = useState([]);

  const [weight, setWeight] = useState();
  const[totalPrice, setTotalPrice] = useState();
  let sum = 0
  let initialSum = 0;

  const[user, setUser] = useState('')

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    for(let i = 0; i < inputValues.length; i++){
      sum += productPrice[i] * inputValues[i]
      console.log(sum);
    }
    setTotalPrice(sum)
  })

  const handleInputChange = (index, newValue) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = newValue;
    setInputValues(updatedValues);
    for(let i = 0; i < productPrice.length; i++){
      sum += productPrice[i] * inputValues[i]
      console.log(sum)
    }
};


  const handleAddProduct = () => {
    // Handle the logic for adding product here

    // Close the modal after a delay (e.g., 2 seconds)
    setTimeout(() => {
      closeModal();
    }, 2000); // 2000 milliseconds (2 seconds)
  };

  useEffect(() => {
    setUser(localStorage.getItem("customerID"))
    fetch('http://localhost:4000/sales')
    .then(res => {return res.json()})
    .then(data => {
      console.log(data[0].product);
      setProduct(data[0].product)
      setClass(data[0].product.map((row) => row.class));
      setMeasure(data[0].product.map((row) => row.measurement_type)); //measurement types
      setRemainingQuantity(data[0].product.map((row) => row.total_quantity))
      //setInputValues(data[0].product.map((row) => row.class));  //proxy
      setVisibility(data[0].product.map((row)=> row.visibility));

      const newArray = [...data[0].product.map((row) => row.price)];
      for(let i = 0; i < newArray.length; i++){
        newArray[i] = 0
      }
      setInputValues(newArray);
      setProductPrice(data[0].product.map((row) => row.price));
      

    })  
  }, []);

  const resetArrayToZero = () => {
    // Create a new array with all elements set to 0
    const newArray = new Array(inputValues.length).fill('');
    // Update the state with the new array
    setInputValues(newArray);
  };

  

  const handleSubmit = (event) =>{
    let tester = window.confirm("Try to press")
    //create confirmation modal of sales order
    if(tester == true){
      event.preventDefault();
      for(let i = 0; i < inputValues.length; i++){
        initialSum = inputValues[i] * productPrice[i]
        sum += initialSum;
      }
      console.log(sum)
      console.log("submitted");
      const url = 'http://localhost:4000/sales';
      fetch(url, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({quantity:inputValues, products:product, totalPrice:sum, user:user})
      })
      .then(response => {response.json()})
      .catch(error => console.error(error))
      }
      openModal();
  }



    return (
        <div className=" w-screen min-h-screen flex">
        <CustomerSidebar></CustomerSidebar>
        <div className=' w-screen min-h-screen flex flex-col ml-[500px] mt-[125px] items-start'>
          
          <div className='font-bold text-2xl mt-2'>Sales Transaction</div>
          
          <div className='flex flex-col w-8/12 shadow-lg'>
            
            <div className='flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm mt-5 h-16 justify-center items-center font-bold border-black shadow-md '>
              <div className='flex-1'>Class Type</div>
              <div className='flex-1'>Available</div>
              <div className = 'flex-1'> Price </div>
              <div className='flex-1'>Quantity</div>
              

            </div>

            <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[500px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>
              {visibility.map((value, index) => {
                if(value == 1){
                  return(
                    <div className='flex flex-row w-full mt-5'>
                        
                          {//<input className="ml-[30px] rounded-lg bg-[#3BC4AF] h-6 w-[75px] placeholder-slate-900" placeholder='Search'></input>}
                    }
                        
                        <div className='flex-1'>{Class[index]}</div>
                        <div className='flex-1'>{remainingQuantity[index]}</div>
                        <div className='flex-1'> P{productPrice[index]}/{measure[index]}</div>
                        <div className='flex-1'><input
                          class = "rounded-md text-center bg-[#3BC4AF] w-32"
                          key={index}
                          type="text"
                          value={inputValues[index]}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                              /></div>
                        
                      
                      </div>
                    )
                }
                
              })}
             
              <div className='flex flex-row w-full '>
                <div className='flex-1'>
                </div>
                <div className='flex-1'></div>
                <div className='flex-1'>
                {/* Modal */}
                  {isModalOpen && (
                    <div style={modalStyles.modalContainer}>
                      <div style={modalStyles.modal}>
                        <div style={modalStyles.modalContent}>
                          <div className="flex flex-col gap-6 text-center" style={{ justifyContent: 'flex-end' }}>
                            <h1 className="text-2xl">
                              <b className="flex-1">You have successfully placed an order! </b>
                            </h1>

                            <h2 className = "text-left"> You can now pay for the order in the number using GCash using the number  </h2>


                            <h2 className = "mt-[-10px] text-left"> Mobile Number: 0919 352 1840</h2>

                            <h2> Upload the receipt below for our sales representatives to approve the order</h2>
                            <ImageUploadForm></ImageUploadForm>
                            
                            <div className='flex flex-col items-center gap-6 '>
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
  
            </div>

            <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md border-t-0 rounded-b-sm">
                <div className="flex-1 text-left ml-24">Total Price: {totalPrice}</div>
                <div className="flex-1 "><button onClick = {handleSubmit}  className='h-[30px] w-[150px] bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]'>
               Submit
                </button></div>
                
              </div>

          </div>
        </div>
      </div>


    )
};
export default SalesTransaction;