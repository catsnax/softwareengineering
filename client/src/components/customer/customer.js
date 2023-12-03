import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import CustomerSidebar from '../sidebarcust';
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
    height: '700px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    
  },
  modalContent: {
    textAlign: 'left',
  },
};


function Customer() {

  const [isModalOpen, setModalOpen] = useState(false);
  const [editedSalesId, setEditedSalesId] = useState('');
  const [editedCustomerName, setEditedCustomerName] = useState('');

  const [itemClass, setItemClass] = useState([]);
  const [itemPrice, setItemPrice] = useState([]);
  const [itemQuantity, setItemQuantity] = useState([]);
  const [itemMeasure, setItemMeasure] = useState([]);

  const [orderReceipt, setOrderReceipt] = useState("")

    const [id, setID] = useState(localStorage.getItem("customerID"));

    const [profile, setProfile] = useState("");
    const [date, setDate] = useState([]);
    const [totalAmount, setTotal] = useState([]);
    const [status, setStatus] = useState([]);
    const [orderID, setOrderID] = useState([]);

    useEffect(() => {
        const url = 'http://localhost:4000/customer';
          fetch(url, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({userID: id})
          })
          .then(response => response.json())
          .then((data) => {
            setProfile(data.profile[0]);
            data.orders.reverse();
            setTotal(data.orders.map((row) => row.total_amount))
            setStatus(data.orders.map((row) => row.order_status))
            setDate(data.orders.map((row) => row.order_date));
            setOrderID(data.orders.map((row) => row.order_id));
          })
          .catch(error => console.error(error))
          }, []
      
    )

    const openModal = (index) => {
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
        setOrderReceipt(data[0].order_receipt);
        setItemClass(data.map((row) => row.class));
        setItemQuantity(data.map((row) => row.quantity))
        setItemPrice(data.map((row) => row.total_price))
        setItemMeasure(data.map((row) => row.measurement_type))
        setModalOpen(true);
      })
      .catch(error => console.error(error))
      }  

    const closeModal = () => {
      setModalOpen(false);
    };


  return (
    <div className="w-screen min-h-screen flex">
      <CustomerSidebar />

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
        <div className="font-bold text-2xl mt-5">Customer</div>

        <div className="bg-[#D9D9D9] h-[150px] w-10/12 border-[1.5px] border-black mt-[20px] font-bold shadow-md rounded-sm">
          <div className="flex">

            <div className="flex-col ml-[5%] w-[150px] text-left mt-4 whitespace-nowrap">
            <div class="">{profile.last_name}, {profile.first_name}</div>
              
              <div class="">Fax: {profile.fax_number}</div>
              <div class=" ">Phone No: {profile.contact_number}</div>
            </div>
            <div className="flex-col ml-[120px] w-[150px] text-left mt-4 whitespace-nowrap">
              <div>Gender: Male</div>
              <div class="">Bill Address: {profile.bill_address}</div>
              <div class="">Ship Address: {profile.ship_address}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-10/12 shadow-lg mt-5">
          <div className="flex flex-row bg-[#D9D9D9] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
            <div className="flex-[0.1]"></div>
            <div className="flex-1">Date Ordered</div>
            <div className="flex-1">Quantity</div>
            <div className="flex-1">Total Cost</div>
            <div className = "flex-1">Status</div>
          </div>

          <div className='flex flex-col bg-white border-[1.5px] rounded-b-sm border-t-0 h-[450px] items-center border-black max-h-3/4 gap-[30px] overflow-y-auto'>
          {date.map((value, index) => {
            return(
                <div className="flex flex-row w-full mt-5">
              <div className="flex-[0.1]">
                <Link to="/customer"><button onClick = {() => openModal(orderID[index])}className="ml-4 mt-1 bg-[#F3F3F3] text-black hover:bg-[#3BC4AF] hover:text-white">
                  <Icon icon="bxs:edit" className="h-5 w-5" />
                </button></Link>
              </div>
              <div className="flex-1">{new Date(date[index]).toLocaleDateString('en-US')}</div>
              <div className="flex-1">50 boxes</div>
              <div className="flex-1">₱{totalAmount[index].toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
              <div className="flex-1">{status[index]}</div>
            </div>
            )
          })}
          </div>
        </div>

        {isModalOpen && (
        <div style={modalStyles.modalContainer} className = "overflow-auto">
          <div style={modalStyles.modal} className = "overflow-auto">
            <div style={modalStyles.modalContent} className = "overflow-auto">
              <div className="text-center text-xl font-bold mb-9">Order Details</div>
              <div className="flex flex-col gap-6" style={{ justifyContent: 'flex-end' }}>
                {/* Add input fields for editing */}

                <div className="flex flex-row bg-[#D9D9D9] w-[460px] border-[1.4px] rounded-t-sm h-16 justify-center items-center font-bold border-black shadow-md">
            <div className="flex"></div>

            
       
            <div className="flex-1 ml-2">Class</div>
            <div className="flex-1">Quantity Order</div>
            <div className="flex-1">Total Price</div>
          </div>
                {itemClass.map((value, index) => {
                  return(
                  <div className='flex ml-2 flex-row w-full mt-2'>
                  <div className='flex-1'>{itemClass[index]}</div>
                  <div className='flex-1'>{itemQuantity[index]} {itemMeasure[index]}</div>
                  <div className='flex-1'>P{itemPrice[index]}</div>
                  
                  </div>
                )})}

                <h2 className = "text-center">PROOF OF PAYMENT </h2>
                {(orderReceipt != null) ? 
                (<div className = "self-center mt-[-20px]" ><img  width = "350" height = "100" src = {require(`${orderReceipt}`)} alt = "myimage1"></img></div>): <span> No Receipt Found</span>}
                
                
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
    </div>
  );
}

export default Customer;