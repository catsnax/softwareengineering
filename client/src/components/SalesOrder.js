import React, {useState, useEffect} from 'react';
import {Link, Route, Routes} from "react-router-dom";
import Sidebar from './sidebar';

function SalesOrdering1(){

    
    useEffect(() => {
        fetch('http://localhost:4000')
        .then(res => {return res.json()})
        .then(data => {
          newProduct(data)
    
        })  
      }, []);
    
      const [product, newProduct] = useState([]);
      const [classA, setClassA] = useState('');
      const [classB, setClassB] = useState('');
      const [classC, setClassC] = useState('');
    
      const [weight, setWeight] = useState();
      const [weightA, setWeightA] = useState(0);
      const [weightB, setWeightB] = useState(0);
      const [weightC, setWeightC] = useState(0);
    
      const[totalPrice, setPrice] = useState();
      const[priceA, setPriceA] = useState('');
      const[priceB, setPriceB] = useState('');
      const[priceC, setPriceC] = useState('');
    
    function emptyChecker(param){
      if (param != ""){
        return parseFloat(param)
      }
      else{
        return 0;
      }
    }
    
      function addAllA(newValue){
        setWeight(emptyChecker(newValue) + parseFloat(weightB) + parseFloat(weightC));
      }
      function addAllB(newValue){
        setWeight(parseFloat(weightA) + emptyChecker(newValue) + parseFloat(weightC));
      }
      function addAllC(newValue){
        setWeight(parseFloat(weightA) + parseFloat(weightB) + emptyChecker(newValue));
      }
    
      function addAllPriceA(params){
        setPrice(emptyChecker(params) + emptyChecker(priceB) + emptyChecker(priceC));
      }
      function addAllPriceB(params){
        setPrice(emptyChecker(priceA) + emptyChecker(params) + emptyChecker(priceC));
      }
      function addAllPriceC(params){
        setPrice(emptyChecker(priceA) + emptyChecker(priceB) + emptyChecker(params));
      }
    
      const handleInputChangeA = (event) =>{
        setWeightA(event.target.value);
        setClassA(event.target.value);
        addAllA(event.target.value);
    
        setPriceA(event.target.value * product[0].PRICE)
        addAllPriceA(event.target.value * product[0].PRICE);
        }
      const handleInputChangeB = (event) =>{
        setClassB(event.target.value);
        setWeightB(event.target.value)
        addAllB(event.target.value)
    
        setPriceB(event.target.value * product[1].PRICE)
        addAllPriceB(event.target.value * product[1].PRICE)
      }
      const handleInputChangeC = (event) =>{
        setClassC(event.target.value);
        setWeightC(event.target.value);
        addAllC(event.target.value);
    
        setPriceC(event.target.value * product[2].PRICE)
        addAllPriceC(event.target.value * product[2].PRICE)
        }
    
    
    
      const handleSubmit = (event) =>{
        let tester = window.confirm("Try to press")
        //create confirmation modal of sales order
        if(tester == true){
          event.preventDefault();
          console.log("submitted");
          const url = 'http://localhost:4000/sales';
          fetch(url, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              body: JSON.stringify({ AQuantity: classA, BQuantity: classB, CQuantity: classC, totalPrice: totalPrice, ATotalPrice: priceA, BTotalPrice: priceB, CTotalPrice: priceC, APrice: product[0].PRICE, BPrice:product[1].PRICE, CPrice: product[2].PRICE})
          })
          .then(response => response.json())
          .catch(error => console.error(error))
          }
      }

return(
<div className="SalesOrdering">

      <div class="bg-gray-500">
        <div class="flex">
            <Sidebar/>
            <div class="ml-[350px] bg-white m-[50px] h-[600px] w-[600px] rounded-lg mt-[25px]">
                <h1 class="text-center  p-3 mt-5 bg-white"><b>SALES ORDER <div class="mt-[20px] rounded-lg bg-emerald-400 h-[1px]"></div></b></h1>
                <h1 class="">Customer Name:
                    <div class=""><input class="text-black rounded-lg bg-teal-500 h-[20px] w-[550px]"></input></div>
                </h1>
            
                <div class="pl-5 rounded-lg bg-white m-5 h-[350px] p-6">
                     
                    <div class="m-1 text-left"> <b>Class Type:</b>
                    <form onSubmit = {handleSubmit}> </form>
                      <div class="grid grid-cols-3 grid-rows-3">
                        <p class="flex-auto m-2">Class A </p><div class="m-2 ml-[40px]">BOX</div><input value = {classA} onChange ={handleInputChangeA} class="rounded-lg bg-teal-500 h-6 m-2 w-[80px] ml-8"></input>
                        <p class="flex-auto m-2">Class B </p><div class="m-2 ml-[40px]">30/KG</div><input value = {classB} onChange ={handleInputChangeB} class="rounded-lg bg-teal-500 h-6 m-2 w-[80px] ml-8"></input>
                        <p class="flex-auto m-2">Class C </p><div class="m-2 ml-[40px]">40/KG</div><input value = {classC} onChange ={handleInputChangeC} class="rounded-lg bg-teal-500 h-6 m-2 w-[80px] ml-8"></input>
                        </div>
                     
                    </div>
                    <button class=" ml-[313px] rounded-full bg-emerald-500 text-center w-[30px] h-8 border-2 border-white pb-[2px] text-black">+</button>
                    <div class="grid grid-cols-2 mt-2 grid-rows-2 rounded-lg bg-emerald-400 h-[1px] gap-1 ">
                        <p class="mt-[40px] ml-[150px]"><b>Weight: </b></p><p class="mt-[40px] ml-[45px] ">{weight}</p>
                        <p class="mt-[60px] ml-[136px]"><b>Price: </b></p><p class="mt-[60px] ml-[60px]">{totalPrice}</p>
                    </div>
                </div>
                <button class="delay-150 bg-white border-emerald-500 ml-[10px] border-2 place-content-center p-1 h-9 w-[80px] mt-[20px] mb-5 rounded-lg">Submit</button>
                
              </div>
              
          </div>
        </div>

    </div>
  
) 
}

export default SalesOrdering1;