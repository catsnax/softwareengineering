import React, { useState, useEffect} from 'react';
import Sidebar from '../sidebar';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
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
    width: '600px',
    height: '800px',
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

const SalesOrdering1 = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editedSalesId, setEditedSalesId] = useState('');
  const [editedCustomerName, setEditedCustomerName] = useState('');

  const [data, setData] = useState([]);
  const [date, setDate] = useState([]);
  const [totalAmount, setTotal] = useState([]);
  const [status, setStatus] = useState([]);
  const [oldStatus, setOldStatus] = useState([]);
  const [orderItem, setOrderItem] = useState([]);
  const [visibility, setVisibility] = useState([]);

  const [productPrice, setProductPrice] = useState([]);

  const [id, setID] = useState([]);

  const[selectedIndex, setSelectedIndex] = useState(0);


  const [itemClass, setItemClass] = useState([]);
  const [itemPrice, setItemPrice] = useState([]);
  const [itemQuantity, setItemQuantity] = useState([]);
  const [itemTotal, setItemTotal] = useState([]);

  const [orderReceipt, setOrderReceipt] = useState("")

  const [lastName, setLastName] = useState([]);
  const [firstName, setFirstName] = useState([]);
  const [user, setUser] = useState(0);

  const [selectedFilter, setSelectedFiler] = useState("")

  const[employeeLast, setEmployeeLast] = useState([]);
  const [employeeFirst, setEmployeeFirst] = useState([]);
  const [statusDates, setStatusDates] = useState([]);
  const [statusChange, setStatusChange] = useState([]);


  const openModal = (index) => {
        handleHistory(index);
        const url = 'http://localhost:4000/details';
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:index})
        })
        .then(response => response.json())
        .then((data) => {
          setOrderReceipt(data[0].order_receipt)
          setItemClass(data.map((row) => row.class));
          setItemQuantity(data.map((row) => row.quantity))
          setItemPrice(data.map((row) => row.total_price))
          setProductPrice(data.map((row) =>  row.item_price))
          setModalOpen(true);})
        .catch(error => console.error(error))
      }  

    const handleHistory = (index) => {
      const url = 'http://localhost:4000/statusdetails';
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:index})
        })
        .then(response => response.json())
        .then((data) => {
          setEmployeeLast(data.map((row) => row.last_name));
          setEmployeeFirst(data.map((row) => row.first_name));
          setStatusChange(data.map((row) => row.new_order_status));
          setStatusDates(data.map((row) => row.status_date));
          })
        .catch(error => console.error(error))
    }
  
useEffect(() => {
  // Replace 'http://localhost:3001' with the URL of your Node.js server
  fetch('http://localhost:4000/orders')
    .then((response) => response.json())
    .then((data) => {
      data.reverse();
      setData(data)
      setDate(data.map((row) => row.order_date));
      setTotal(data.map((row) => row.total_amount))
      setStatus(data.map((row) => row.order_status))
      setID(data.map((row)=> row.order_id)); 
      setLastName(data.map((row) => row.last_name));
      setFirstName(data.map((row) => row.first_name))
      setOldStatus(data.map((row) =>  row.order_status));
      setUser(localStorage.getItem("adminID"))
    })
    }, []);

  const handleStatus = (() => {
    let tester = window.confirm("Confirm Save?")
    //create confirmation modal of sales order
    if(tester == true){
    
    const url = 'http://localhost:4000/changestatus';
    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({newStatus: status, id: id, oldStatus: oldStatus, adminID: user })
    })
    .then(response => response.json())
    .catch(error => console.error(error))
    }
  })

  const handleFilter = (() => {
    const url = 'http://localhost:4000/filter';
    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({selectedFilter:selectedFilter, adminID: user})
      })
    .then(response => response.json())
    .then((data) => {
      data.reverse();
      setData(data)
      setDate(data.map((row) => row.order_date));
      setTotal(data.map((row) => row.total_amount))
      setStatus(data.map((row) => row.order_status))
      setID(data.map((row)=> row.order_id)); 
      setLastName(data.map((row) => row.last_name));
      setFirstName(data.map((row) => row.first_name))
      setOldStatus(data.map((row) =>  row.order_status));
      setUser(localStorage.getItem("adminID"))
    })
    .catch(error => console.error(error))
 
    }
  )
  

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleEdit = () => {
    // Handle the logic for editing here
    console.log('Editing sales:', editedSalesId, editedCustomerName);
    // Close the modal after a delay (e.g., 2 seconds)
    setTimeout(() => {
      closeModal();
    }, 2000); // 2000 milliseconds (2 seconds)
  };

  const handleFilterChange = (newValue) => {
    setSelectedFiler(newValue);
    console.log(newValue);
  }

  const handleInputChange = (index, newValue) => {
    const updatedValues = [...status];
    updatedValues[index] = newValue
    setStatus(updatedValues);
    };



  

  return (
    <div className=" w-screen min-h-screen flex">
      <Sidebar></Sidebar>
      <div className=' w-screen min-h-screen flex flex-col ml-[375px] items-start'>
        <div className='flex flex-row mt-[100px]'>
          <input
            className=" bg-[#D9D9D9] h-[30px] w-[225px] rounded-tl-sm rounded-bl-sm min-w-[50px] border-[1.5px] border-black placeholder:text-black"
            placeholder=" Search"
          />
          <button className='h-[30px] w-[40px] border-l-0 bg-[#D9D9D9] rounded-tr-sm rounded-br-sm border-[1.5px] border-black justify-center items-center px-2 hover:bg-[#F3F3F3]'>
            <Icon icon="carbon:search" className='h-5 w-5' />
          </button>
        </div>
        <div className='font-bold text-2xl mt-5'>Sales Ordering</div>
        <div className='flex flex-col mb-[-10px] w-10/12'>
          <div className='flex justify-end'>
          <select value = {selectedFilter} onChange ={(event) => {handleFilterChange(event.target.value)} }className = "w-40 ml-4">
            <option value="Rejected">Rejected</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button className = "mr-2 bg-[#3BC4AF] text-white p-2" onClick = {handleFilter}> Filter Results </button>
          <Link to="/salesreport">
              <button className='h-[30px] w-[150px] bg-[#D9D9D9] h-10 mr-2 rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]'>
              + Sales Report
              </button>
            </Link>
            <Link to="/adminsalestransaction">
              <button className='h-[30px] w-[170px] bg-[#D9D9D9] h-10 rounded-sm border-[1.5px] border-black hover:bg-[#F3F3F3]'>
                + Create Transaction
              </button>
            </Link>
            
            
          </div>
        </div>
        <div className='flex flex-col w-10/12 shadow-lg'>
          <div className='flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm mt-5 h-16 justify-center items-center font-bold border-black shadow-md '>
            <div className='flex-[0.15]'></div>
            
            <div className='flex-1'>Customer Name</div>
            <div className='flex-1'>Order Date</div>
            <div className='flex-1'>Order Cost</div>
            <div className='flex-1'>Order Status</div>
          </div>
          <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[550px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto relative'>
            {date.map((value, index) => {
            return(
            <div className='flex flex-row w-full mt-5 '>
            <div className=''>
              <button
                className='ml-4 mt-1 bg-[#F3F3F3] text-black  hover:bg-[#3BC4AF] hover:text-white'
                onClick={() => { ; openModal(id[index]) }}
              >
                <Icon icon="bxs:edit" className='h-6 w-6' />
              </button>
            </div>
             
            <div className='flex-1'>{lastName[index]}, {firstName[index]}</div>
            <div className='flex-1'>{new Date(date[index]).toLocaleDateString('en-US', options)}</div>
            <div className='flex-1'>P{totalAmount[index]}</div>
            <div className='flex-1'> 
            

            {(status[index] == "Rejected") ? <div> Rejected</div> : 
            <span> {(status[index] == "Delivered") ? (<div>Delivered</div>) : 
            <select value = {status[index]} onChange={(e) => handleInputChange(index, e.target.value)}> 
            <option value = "Rejected"> Rejected </option>
            {(status[index] == "Pending Approval") ? (<option value="Pending Approval">Pending Approval</option>) : <span></span>}
            {(status[index] == "Approved" || status[index] == "Unpaid" || status[index] == "Pending Approval") ? (<option value="Unpaid">Approved (Unpaid)</option> ) : <span></span>}
            {(status[index] == "Approved" || status[index] == "Unpaid" || status[index] == "Pending Approval") ? (<option value="Approved">Approved (Paid)</option> ) : <span></span>}
            <option value="Shipped">Shipped</option> 
            <option value="Delivered">Delivered</option> 
          </select>
           }</span>}
            
            </div>
          </div>) 
            })}


<button onClick = {handleStatus} className = "bottom-0 w-full text-xl p-4 delay-30 w-10/12 bg-[#3BC4AF] h-[60px] text-white rounded-sm"> Save Changes</button>

            
            {/* Add similar rows for other sales entries */}
          </div>
          
        </div>
      </div>


      {isModalOpen && (
        <div style={modalStyles.modalContainer} className = "overflow-auto">
          <div style={modalStyles.modal} className = "overflow-auto">
            <div style={modalStyles.modalContent} className = "overflow-auto">
              <h2 className="text-center text-xl font-bold mb-9">ORDER DETAILS</h2>
              <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
                {/* Add input fields for editing */}

            <div className="flex flex-row bg-[#D9D9D9] w-[550px] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
              <div className="flex-1 ml-4">Class</div>
              <div className="flex-1">Product Price</div>
              <div className="flex-1">Quantity Order</div>
              <div className="flex-1">Total Price</div>
          </div>
                {itemClass.map((value, index) => {
                  return(
                  <div className='flex ml-[28px] flex-row w-full mt-2'>
                  <div className='flex-1'>{itemClass[index]}</div>
                  <div className='flex-1'>P{productPrice[index]}</div>
                  <div className='flex-1'>{itemQuantity[index]}</div>
                  <div className='flex-1'>P{itemPrice[index]}</div>
                  
                  </div>
                )})}
                <div>-----------------------------------------------------------------------------</div>

                <h2 className="text-center text-xl font-bold mb-2">ORDER STATUS HISTORY </h2>

                

                <div className="flex flex-row bg-[#D9D9D9] w-[550px] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
                    <div className="flex-1 ml-14">Status</div>
                    <div className="flex-1">Date</div>
                    <div className="flex-1">Changed By</div>
                </div>

                {statusDates.map((value, index) => {
                  return(
                  <div className='flex ml-[28px] flex-row w-full gap- mt-2'>
                    <div className='flex-1'>{statusChange[index]}</div>
                    <div className='flex-1'>{new Date(statusDates[index]).toLocaleDateString('en-US', options)}</div>
                    <div className='flex-1'>{employeeLast[index]}, {employeeFirst[index]}</div>
                  </div>
                )})}

                <div>-----------------------------------------------------------------------------</div>
              <h2 className="text-center text-xl font-bold mb-2">PROOF OF PAYMENT </h2>
                {(orderReceipt != null) ? 
                (<div className = "self-center mt-[-20px]" ><img  width = "350" height = "100" src = {require(`${orderReceipt}`)} alt = "myimage1"></img></div>): <div className  = "text-center"><span className = "text-center"> No Receipt Found</span> <ImageUploadForm></ImageUploadForm>  </div>}

                
                
                {/* Add more input fields for editing */}
                <div className='flex flex-col items-center gap-6 mt-[20px]'>
                  
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
  );
                  };

export default SalesOrdering1;