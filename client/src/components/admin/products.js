import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Sidebar from '../sidebar';

const modalStyles = {
  modalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    background: 'white',
    border: '1px solid #ccc',
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

function Products() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editedBatchId, setEditedBatchId] = useState('');
  const [editedClassType, setEditedClassType] = useState('');
  const [quantity, setQuantity] = useState([]);
  const [measurementType, setMeasurementType] = useState('');
  const [price, setPrice] = useState([]);

  const [inputValues, setInputValues] = useState([]);
  const [newInputValues, setNewInputValues] = useState([]);

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newMeasurement, setNewMeasurement] = useState('');


  const [product, setProduct] = useState([]);
  const [type, setType] = useState([]);
  const [measure, setMeasure] = useState([])
  const [id, setID] = useState([]);
  const [visibility, setVisibility] = useState([]);

  const [selectedValue, setSelectedValue] = useState('');

  const [inputChecker, setInputChecker] = useState(false);

  const handleInputChange = (index, newValue) => {
    const updatedValues = [...newInputValues];
    updatedValues[index] = newValue;
    setNewInputValues(updatedValues);
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  let checker= false;
  let zeroChecker = false;


    useEffect(() => {
        fetch('http://localhost:4000/products')
        .then(res => {return res.json()})
        .then(data => {
            setProduct(data)
            setType(data.map((row) => row.class));
            setPrice(data.map((row) => row.price));
            setQuantity(data.map((row) => row.total_quantity));
            setMeasure(data.map((row) => row.measurement_type))
            setID(data.map((row) => row.product_id));
            setVisibility(data.map((row)=> row.visibility))

            setNewInputValues(data.map((row) => row.price));
            
            console.log(data);

            const newArray = [...data.map((row) => row.price)];
            
            setInputValues(newArray);
            
        })
    }, [])

  const openModal = (batchId, classType, quantity, measurementType, price) => {
    setEditedBatchId(batchId);
    setEditedClassType(classType);
    setQuantity(quantity);
    setMeasurementType(measurementType);
    setPrice(price);
    setModalOpen(true);
  };
  const openCreateModal = () => {
    setNewPrice('');
    setNewMeasurement('');
    setNewPrice('');
    setCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };
  const handleCreate = (event) => {
    let tester = window.confirm("Try to press")
        //create confirmation modal of sales order
        if(tester == true){
          event.preventDefault();
          console.log("submitted");
          const url = 'http://localhost:4000/addProduct';
          fetch(url, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({newName: newName, newPrice: newPrice, newMeasurement:selectedValue})
          })
          .then(response => response.json())
          .catch(error => console.error(error))
          }
    setTimeout(() => {
      closeCreateModal();
    }, 2000);
  };

  const handleDelete = (index) => {
      let tester = window.confirm("Are you sure you want to delete this product?")
        //create confirmation modal of sales order
        if(tester == true){
          console.log("submitted");
          const url = 'http://localhost:4000/products';
          fetch(url, {
              method: 'DELETE',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({id: id[index]})
          })
          .then(response => response.json())
          .catch(error => console.error(error))
          }
  }

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEdit = (index) => {
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  const handleEditPrice = () => {
    (inputChecker == true) ? setInputChecker(false): setInputChecker(true)
    console.log(inputChecker);
  }
 
  const handleSubmit = (event) => {
    let tester = window.confirm("Confirm Save?")
    //create confirmation modal of sales order
    if(tester == true){
    console.log("submitted");
    const url = 'http://localhost:4000/changeprice';
    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPrices:newInputValues, id:id})
    })
    .then(response => response.json())
    .catch(error => console.error(error))
  }
  }
  
  

  return (
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
        <div className="font-bold text-2xl mt-5">Products Page</div>
        <div className="flex flex-col w-10/12 mt-5">
          <div className="flex flex-row justify-end">
            <Link to="/Sacksinventory">
              <button className="h-[30px] w-[200px] mr-1 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]">
                Sacks Page
              </button>
            </Link>
            <Link to="/repack">
              <button className="h-[30px] w-[200px] mr-6 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]">
                Repack Page
              </button>
            </Link>
            <button className="h-[30px] w-[130px] bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" onClick={openCreateModal}>
              + Add Product
            </button>
            <button className="h-[30px] w-[130px] bg-[#D9D9D9] rounded-tr-sm ml-2 rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3]" onClick= {handleEditPrice} >
              Edit Price
            </button>
          </div>
        </div>
        <div className="flex flex-col w-10/12 shadow-lg mt-2">
          <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
            
            <div className="flex-1">Class Type</div>
            <div className="flex-1">Quantity</div>
            <div className="flex-1">Measurement Type</div>
            <div className="flex-1">Price</div>
            <div className="flex-[0.5]"></div>
          </div>

          <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[500px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>

            {visibility.map((value, index) => {
            {if(value == 1){
              return(
              <div key={index} className="flex flex-row w-full mt-5">
              
            
              <div className="flex-1">{type[index]}</div>
              <div className="flex-1">{quantity[index]}</div>
              <div className="flex-1">{measure[index]}</div>
              {(inputChecker == true) ?  <div class = "flex mr-[40px]"><input value= {newInputValues[index]} onChange={(e) => handleInputChange(index, e.target.value)} class = "h-8 rounded-md text-center bg-[#3BC4AF] w-32 mr-1"></input> <span>/{measure[index]}</span></div>  : <span className="flex-1">{price[index]}/{measure[index]}</span>}
              <div className="">
                <button onClick = {() => handleDelete(index)} className="mr-28  mt-1 bg-[#F3F3F3] text-black hover:bg-[#3BC4AF] hover:text-white">
                  <Icon icon="material-symbols:delete-outline" className='h-6 w-6'/> </button>
              </div>
            </div>
            )}}            
          } 
        )}
        </div>
        {(inputChecker == true) ? <button onClick = {handleSubmit} className = "bottom-0 w-full text-xl p-4 delay-30 w-10/12 bg-[#3BC4AF] h-[60px] text-white rounded-sm"> Save Changes</button> : <span></span>}

      </div>
    </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={modalStyles.modalContainer}>
          <div style={modalStyles.modal}>
            <div style={modalStyles.modalContent}>
              <div className="text-center text-xl font-bold mb-9">Edit Product</div>
              <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
            
                  <h2 className="flex-1 flex ml-10">
                    <b>Product Name: </b>
                    <div className="flex-1">
                      <input
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                        className="ml-[140px] rounded-lg bg-teal-500 h-6 w-[105px]"
                      />
                    </div>
                  </h2>
                  <h2 className="flex-1 flex ml-10">
                    <b>Measurement Type: </b>
                    <div className="flex-1">
                      <input
                        value={measurementType}
                        onChange={(event) => setMeasurementType(event.target.value)}
                        className="ml-[60px] rounded-lg bg-teal-500 h-6 w-[105px]"
                      />

                    </div>
                  </h2>
                  <h2 className="flex-1 flex ml-10">
                    <b>Price: </b>
                    <div className="flex-1">
                      <input
                        value={newPrice}
                        onChange={(event) => setNewPrice(event.target.value)}
                        className="ml-[165px] rounded-lg bg-teal-500 h-6 w-[105px]"
                      />
                    </div>
                  </h2>
                {/* Add more input fields for editing */}
                <div className='flex flex-col items-center gap-6'>
                  <button
                    onClick={handleEdit}
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

{isCreateModalOpen && (
          <div style={modalStyles.modalContainer}>
            <div style={modalStyles.modal}>
              <div style={modalStyles.modalContent}>
                <div className="text-center text-xl font-bold mb-9">Create Product</div>
                <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
                  <h2 className="flex-1 flex ml-10">
                    <b>Product Name </b>
                    <div className="flex-1">
                      <input
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                        className="ml-[140px] rounded-lg bg-teal-500 h-6 w-[105px]"
                      />
                    </div>
                  </h2>
                  <h2 className="flex-1 flex ml-10">
                    <b>Measurement Type: </b>
                    <div className="">
                    <input class="rounded-md bg-[#CCDA7D] ml-10 mr-1" type='radio' value = "kg" name='typeofmeasure' id='kg' checked={selectedValue === 'kg'}
          onChange={handleRadioChange}></input>
                                    <label for='kg'>kg</label> 
                                    </div>
                                    <div class="bg-teal-500 rounded-md w-12 ml-2 mr-10">
                                    <input class="rounded-md bg-[#CCDA7D] mr-1" type='radio' value = "box" name='typeofmeasure' id='box' checked={selectedValue === 'box'} onChange={handleRadioChange} ></input>
                                    <label for='box'>box</label>
                    </div> 
                  </h2>
                  <h2 className="flex-1 flex ml-10">
                    <b>Price: </b>
                    <div className="flex-1">
                      <input
                        value={newPrice}
                        onChange={(event) => setNewPrice(event.target.value)}
                        className="ml-[165px] rounded-lg bg-teal-500 h-6 w-[105px]"
                      />
                    </div>
                  </h2>
                  <div className="flex flex-col items-center gap-6">
                    <button
                      onClick={handleCreate}
                      className="delay-150 bg-[#D9D9D9] w-[75px] rounded-tr-sm rounded-br-sm border-[1.5px] border-black hover:bg-[#F3F3F3] place-content-end"
                    >
                      Create
                    </button>
                    <button
                      onClick={closeCreateModal}
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
  );
}

export default Products;