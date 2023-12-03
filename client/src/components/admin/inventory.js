import React, {useState, useEffect} from 'react';
import {Link, Route, Routes} from "react-router-dom";
import { Icon } from '@iconify/react';
import Sidebar from '../sidebar';

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

function Inventory(){

    const [Class, setClass] = useState([]);
    const [measure, setMeasure] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [product, setProduct] = useState([]);
    const [sacks, setSacks] = useState(0);
    const [visibility, setVisibility] = useState([]);

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = (event) => {
      event.preventDefault();
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };

    let sum = 0
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
        
        inputValues.forEach(num => {
            sum += parseFloat(num);
        })

          const url = 'http://localhost:4000/inventory';
          fetch(url, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({inputValues:inputValues, sacks: sacks, sum: sum, products: product})
          })
          .then(response => response.json())
          .catch(error => console.error(error))
          }
      }

      useEffect(() => {
        fetch('http://localhost:4000/inventory')
        .then(res => {return res.json()})
        .then(data => {
          setClass(data[0].product.map((row) => row.class)); //classes
          setMeasure(data[0].product.map((row) => row.measurement_type)); //measurement types
          setInputValues(data[0].product.map((row) => 0));  //proxy
          setProduct(data[0].product); //product values
          setVisibility(data[0].product.map((row)=> row.visibility));

        })  
      }, []);

      const handleInputChange = (index, newValue) => {
        const updatedValues = [...inputValues];
        updatedValues[index] = newValue;
        setInputValues(updatedValues);
      };

      const handleInputSacks = (event) =>{
        setSacks(event.target.value);
      }


      

    return(
        
    <div className="w-screen min-h-screen flex">
    <Sidebar />
    <div className="w-screen min-h-screen flex flex-col ml-[375px] items-start">
      <div className="flex flex-row mt-[100px]">
        <input
          className="bg-[#D9D9D9] h-[30px] w-[225px] rounded-tl-sm rounded-bl-sm min-w-[50px] border-[1.5px] border-black placeholder:text-black"
          placeholder=" Search"
        />
        <button className="h-[30px] w-[40px] border-l-0 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black justify-center items-center px-2 hover:bg-[#F3F3F3]">
          <Icon icon="carbon:search" className="h-5 w-5" />
        </button>
      </div>
      <div className="font-bold text-2xl mt-5">Add Repack Page</div>
      <div className="flex flex-col w-10/12 mt-5">
        <div className="flex flex-row justify-end">
          <Link to="/Sacksinventory">
            <button className="h-[30px] w-[200px] mr-1 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]">
              Sacks Page
            </button>
          </Link>
          <Link to="/products">
            <button className="h-[30px] w-[200px] mr-1 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]">
              Products Page
            </button>
          </Link>
          <Link to="/repack">
          <button className="h-[30px] w-[200px] bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]">
            Repack Page
          </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col w-10/12 shadow-lg mt-2">
        <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">

          <div className="flex-1">Class Type</div>
          <div className="flex-1">Measurement Type</div>
        
          <div className="flex-1"> Add Quantity</div>
        </div>
                {//<div class="mt-[20px] ml-[20px] w-[550px] rounded-lg bg-emerald-400 h-[1px]"></div>
}
        <form>
                
  <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[500px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>

{visibility.map((value, index) => {
if(value == 1){
  return(
    <div key={index} className="flex w-full justify-center items-center  mt-5">
      
     
      <div className="flex-1 ">{Class[index]}</div>
      <div className="flex-1">{measure[index]}</div>
    
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

<button className="h-[30px] w-[200px] bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" onClick={(event)=>openModal(event)}> + Register Sacks</button>
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
                                  value={sacks}
                                  onChange={(event) => setSacks(event.target.value)}
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
                              //onClick={closeModal}
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

                </form>
            </div>

  

        </div>
        
            
        </div>
    )
};
export default Inventory;