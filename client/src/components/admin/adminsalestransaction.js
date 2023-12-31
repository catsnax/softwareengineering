import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {Link, Route, Routes} from "react-router-dom";
import Sidebar from '../sidebar';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

let options = {
  hour: '2-digit',
  minute: '2-digit'
};



function AdminSalesTransaction(){
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState('');

  const [product, setProduct] = useState([]);
      
      const [inputValues, setInputValues] = useState([]);
      const [Class, setClass] = useState([]);
      const [measure, setMeasure] = useState([]);
      const [productPrice, setProductPrice] = useState([]);
      const [remainingQuantity, setRemainingQuantity] = useState([]);
      const [visibility, setVisibility] = useState([]);
    
      const [firstNames, setFirstNames]  = useState([]);
      const [lastNames, setLastNames] = useState([]);   
      const [id, setID] = useState([]);

      const [weight, setWeight] = useState();
      const[totalPrice, setTotalPrice] = useState();

      const[selectedCustomer, setSelectedCustomer] = useState();

      const[isReady, setIsReady] = useState(false);
      
      
      let sum = 0
      let initialSum = 0;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

 
  const handleAddProduct = () => {
    // Handle the logic for adding product here
    console.log('Adding product:', productName);

    // Close the modal after a delay (e.g., 2 seconds)
    setTimeout(() => {
      closeModal();
    }, 2000); // 2000 milliseconds (2 seconds)
  };

  useEffect(() => {
    for(let i = 0; i < inputValues.length; i++){
      sum += productPrice[i] * inputValues[i]

    }
    setTotalPrice(sum)
  })

  
    
  


  //get customer list
  useEffect(() => {
    fetch('http://localhost:4000/salescustomer')
    .then(res => {return res.json()})
    .then(data => {
        setLastNames(data.map((row) => row.last_name));
        setFirstNames(data.map((row) => row.first_name));
        setID(data.map((row) => row.customer_id));
        setSelectedCustomer(data[0].customer_id);
      })  
  }, []);


  useEffect(() => {
    fetch('http://localhost:4000/sales')
    .then(res => {return res.json()})
    .then(data => {
      console.log(data[0].product);
      
      let dummyQuantity = data[0].product.map((row) => row.total_quantity);
      let dummyClass = data[0].product.map((row) => row.class)
      let dummyMeasure = data[0].product.map((row) => row.measurement_type)
      let visibility = data[0].product.map((row) => row.visibility)

      for(let i = 0 ; i < dummyQuantity.length; i++){
        if(dummyQuantity[i] < 50 && visibility[i] == 1){
          toast.success( `Class ${dummyClass[i]} has less than 50 ${dummyMeasure[i]}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 10000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'text-sm p-2',
        })}
      }
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

      setIsReady(true);
    })  
  }, []);


  const handleInputChange = (index, newValue) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = newValue;
    setInputValues(updatedValues);
    for(let i = 0; i < productPrice.length; i++){
      sum += productPrice[i] * inputValues[i]
    }
  };

  const handleCustomer = (value) => {
      setSelectedCustomer(value)
  }


  let checker= false;
  let zeroChecker = false;

  const handleSubmit = (event) =>{
    console.log(selectedCustomer);
    for(let i = 0; i < inputValues.length; i++){
      if(inputValues[i] > 0){
        zeroChecker = true;
      }
      if(inputValues[i] > remainingQuantity[i]){
        alert("quantity exceeds product quantity overflow season 1")
        checker = true
      }
      else if(inputValues[i] < 0){
        alert("quantity is below negative")
        checker = true
      }
    }
    if(zeroChecker == false){
      alert("all values are zero")
    }

    if(checker == false && zeroChecker == false){
      event.preventDefault();
      console.log("submitted");
      const url = 'http://localhost:4000/sales';
      for(let i = 0; i < inputValues.length; i++){
        initialSum = inputValues[i] * productPrice[i]
        sum += initialSum;
      }
      fetch(url, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({quantity:inputValues, products:product, totalPrice:totalPrice, customer:selectedCustomer})
      })
      .then(response => response.json())
      .catch(error => console.error(error))
      }
    }
    
  



    return isReady ?(
        <div className=" w-screen min-h-screen flex">
        <Sidebar></Sidebar>
        <div className=' w-screen min-h-screen flex flex-col ml-[500px] mt-[125px] items-start'>
          <ToastContainer/>
          <div className='font-bold text-2xl mt-2'>Sales Transaction</div>
          
          
          <div className='flex flex-col w-8/12 shadow-lg'>

          
          <div className = "flex ml-[480px] w-[45px] justify-center">
            <div className="flex justify-start">
              <div className="w-[130px] pt-[3px]"> Pick Customer </div>
            </div>
            <select value = {selectedCustomer} onChange = {(event) => {handleCustomer(event.target.value)}}  className='h-[30px] mr-[720px] w-[200px] bg-[#D9D9D9] rounded-sm border-[1.5px] justify-start border-black hover:bg-[#F3F3F3]'>
              {firstNames.map((value, index) => {
                return(
                  <option value = {id[index]} className = "w-48"> {lastNames[index]}, {firstNames[index]} </option>
                )
              })}
            </select>
          </div>

            
            <div className='flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm mt-2 h-16 justify-center items-center font-bold border-black shadow-md '>
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
                        <div className='flex-1'> P{productPrice[index]}</div>
                        <div className='flex-1'><input
                          class = "rounded-md text-center bg-[#3BC4AF] w-32"
                          key={index}
                          type="text"
                          value={inputValues[index] }
                          onChange={(e) => handleInputChange(index, e.target.value)}  
                              />  {(inputValues[index] > remainingQuantity[index] || inputValues[index] < 0) ? <span className = "mr-[-20px]"> 🔴 </span>: <span></span>}</div>
                      
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
                          <div className="text-center text-xl font-bold mb-9">Add Product</div>
                          <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
                            <h2 className="flex-1 flex ml-10">
                              <b className="flex-1">Product Name: </b>
                              <div className="flex-1">
                                <input
                                  value={productName}
                                  onChange={(event) => setProductName(event.target.value)}
                                  className="rounded-lg bg-teal-500 h-6 w-[105px]"
                                />
                              </div>
                            </h2>
                            
                            <div className='flex flex-col items-center gap-6 mt-[120px]'>
                              <button
                                onClick={handleAddProduct}
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
  
            </div>

            <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md border-t-0 rounded-b-sm">
                <div className="flex-1 text-left">Total Price: {totalPrice}</div>
                <div className="flex-1 "><button onClick = {handleSubmit} className='h-[30px] w-[150px] bg-[#D9D9D9] rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]'>Submit</button></div>
                
              </div>

          </div>
        </div>
      </div>


    ) : <span></span>
};
export default AdminSalesTransaction;