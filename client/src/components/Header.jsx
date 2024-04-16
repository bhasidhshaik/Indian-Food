import React, { useState } from 'react'
import PersonalLogo from '../assets/logo.png'
import Biryani from '../assets/biryani.svg'
import FoodIcon from '../assets/food.svg'
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineRestaurantMenu } from "react-icons/md";

function Header({ updateRecipeData }) {
    const [navOpen , setNavOpen] = useState(false);
    const [bLoading  , setBLoading] = useState(false)
    const [vLoading  , setVLoading] = useState(false)
    const handleBiryani = async () => {

        try {
            setBLoading(true);
          const response = await fetch(`http://localhost:3000/biryani?srno=573,631,881,1793,3703,4959`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const responseData = await response.json();
          updateRecipeData(responseData);
        } catch (error) {
          console.error('Error fetching meal data:', error);
        }finally{
            setBLoading(false); 
        }
      };
      const handleVeg = async () => {

        try {
            setVLoading(true);
          const response = await fetch(`http://localhost:3000/veg?srno=273,715,1863,2563,1594,6060,3018`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const responseData = await response.json();
          updateRecipeData(responseData);
        } catch (error) {
          console.error('Error fetching meal data:', error);
        }finally{
            setVLoading(false); 
        }
      };
  return (
    <header>
        <div className="logo-container">
            <img className='logo' src={PersonalLogo} draggable="false" alt="Shaik Bhasidh" />
        </div>
        <ul className="nav-items">
            <li className="nav-item">
                <button onClick={handleBiryani}><img src={Biryani} draggable="false" alt="Biryani Logo" />{bLoading ? <div className="loader"></div> : <span>Famous Non-Veg Biryani 's</span>}</button>
            </li>
            <li className="nav-item">
                <button onClick={handleVeg}><img src={FoodIcon} draggable="false" alt="Food Logo"/> {vLoading ? <div className="loader"></div> :  <span>Famous Vegetarian Food</span>}</button>
            </li>
        </ul>
        <div className="hamburger-menu">
            <button className='navToggle' onClick={()=>{setNavOpen(!navOpen)}}> {navOpen ? <MdOutlineRestaurantMenu />: <CiMenuFries />}</button>
        </div>
        <div className={navOpen ? "mobile-nav-links open" : "mobile-nav-links"}>
        <ul className="mob-nav-items">
            <li className="mob-nav-item nav-item">
                <button onClick={handleBiryani}><img src={Biryani} draggable="false" alt="Biryani Logo" />{bLoading ? <div className="loader"></div> : <span>Famous Non-Veg Biryani 's</span>}</button>
            </li>
            <li className="mob-nav-item nav-item">
                <button onClick={handleVeg}><img src={FoodIcon} draggable="false" alt="Food Logo" />{vLoading ? <div className="loader"></div> :  <span>Famous Vegetarian Food</span>}</button>
            </li>
        </ul>
        </div>
    </header>
  )
}

export default Header