import React ,{useState , useEffect} from 'react'
import { IoSend } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";



function debounce(func, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}


function Main({ updateRecipeData }) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [placeholderAnimation , setPlaceholderAnimation] = useState(true)

  useEffect(() => {
    async function fetchFirstData() {
      try {
        const response = await fetch(`https://indian-food-9wno.onrender.com/api/v1/search?name=biryani`);
        console.log("First API Called");
      } catch (error) {
        console.log(error);
      }
    }
    fetchFirstData(); // Call the async function immediately
  }, []);
  
    

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.length < 5) {
      setErrors({ name: 'Please enter at least 5 letters to continue..' });
      return;
    }
    try {
      setErrors({});
      setSuggestions([]);
      setLoading(true);
      const response = await fetch(`https://indian-food-9wno.onrender.com/api/v1/search?name=${inputValue}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const responseData = await response.json();
      updateRecipeData(responseData);
      setInputValue('')
      // console.log(responseData);
    // console.log(response);
    } catch (error) {
      console.error('Error fetching meal data:', error);
    }finally{
      setLoading(false); 
    }
  };
  // const debouncedFetchSuggestions = debounce(async (input) => {
  //   try {
  //     console.log('api called');
  //     const response = await fetch(`https://indian-food-9wno.onrender.com/api/v1/suggest?name=${input}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch data');
  //     }
  //     const responseData = await response.json();
  //     const dishNames = responseData.map((meal) => meal.recipename);
  //     setSuggestions(dishNames);
  //   } catch (error) {
  //     console.error('Error fetching meal data:', error);
  //   }
  // }, 500);
  
  
  // const handleInputChange = (event) => {
  //   const input = event.target.value;
  //   debouncedFetchSuggestions(input);
  //   if(input.length>0){
  //     setPlaceholderAnimation(false)
  //   }
  //   setInputValue(input);
  // };
  

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };


  const handleRandom = async ()=>{
    try{
      setRandomLoading(true)
      const response = await fetch('https://indian-food-9wno.onrender.com/api/v1/random');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const responseData = await response.json();
      updateRecipeData(responseData);
    }catch(e){
      console.error('Error fetching meal data:', e);
    }finally{
      setRandomLoading(false)
    }
  }
  useEffect(()=>{
const fetchSuggestions = setTimeout(async ()=>{
  if(inputValue != ''){
  try {
    setPlaceholderAnimation(false)
    const response = await fetch(`https://indian-food-9wno.onrender.com/api/v1/suggest?name=${inputValue}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const responseData = await response.json();
    const dishNames = responseData.map((meal) => meal.recipename);
    setSuggestions(dishNames);
  } catch (error) {
    console.error('Error fetching meal data:', error);
  }
}

},2000)
  } , [inputValue])

  const placeholders = ["Biryani", "Noodles", "Palakura", "Tandoori", "Dal Handi", "Mutton", "Paneer"];
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main" onClick={()=>{setSuggestions([]);}}>
      <div className="home-txt">
        {/* <h2>Dear <span className='amli'>Amliii<FaRegHeart /> </span> Every Flavor Celebrated With Love, Just for You!</h2> */}
        <h2>Discover Recipes Instantly by Entering Any Dish Name...</h2>
        <p>Tip : Search <i> 'Andhra'</i> to get Andhra's Famous Recipes.</p>
      </div>
      <form className='main-form' onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter dish name eg."
            className="glass-input"
            value={inputValue}
            onChange={(e)=>{setInputValue(e.target.value)}}
          />
          {placeholderAnimation && <span className="placeholder-animation">{placeholders[placeholderIndex]}</span>}
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.slice(0, 10).map((suggestion, index) => (
                <div key={index} className="suggestion" onClick={() => handleSuggestionClick(suggestion)
                
                }>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          <button type="submit" className="send-btn"> {loading ? <div className="loader"></div> :<IoSend />}</button>
        </div>
      </form>
      {errors.name && <p className='error-msg'>{errors.name}</p>}
        <div className="random-dish-container">
            <p>Or..</p>
            <h5>Randomly generate a recipe for a dish.</h5>
            <button onClick={handleRandom} className="button" style={{ '--clr': '#00ad54' }}>
      <span className="button-decor"></span>
      <div className="button-content">
        <div className="button__icon">
          <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" width="24">
            <circle opacity="0.5" cx="25" cy="25" r="23" fill="url(#icon-payments-cat_svg__paint0_linear_1141_21101)"></circle>
            <mask id="icon-payments-cat_svg__a" fill="#fff">
              <path fillRule="evenodd" clipRule="evenodd" d="M34.42 15.93c.382-1.145-.706-2.234-1.851-1.852l-18.568 6.189c-1.186.395-1.362 2-.29 2.644l5.12 3.072a1.464 1.464 0 001.733-.167l5.394-4.854a1.464 1.464 0 011.958 2.177l-5.154 4.638a1.464 1.464 0 00-.276 1.841l3.101 5.17c.644 1.072 2.25.896 2.645-.29L34.42 15.93z"></path>
            </mask>
            <path fillRule="evenodd" clipRule="evenodd" d="M34.42 15.93c.382-1.145-.706-2.234-1.851-1.852l-18.568 6.189c-1.186.395-1.362 2-.29 2.644l5.12 3.072a1.464 1.464 0 001.733-.167l5.394-4.854a1.464 1.464 0 011.958 2.177l-5.154 4.638a1.464 1.464 0 00-.276 1.841l3.101 5.17c.644 1.072 2.25.896 2.645-.29L34.42 15.93z" fill="#fff"></path>
            <path d="M25.958 20.962l-1.47-1.632 1.47 1.632zm2.067.109l-1.632 1.469 1.632-1.469zm-.109 2.068l-1.469-1.633 1.47 1.633zm-5.154 4.638l-1.469-1.632 1.469 1.632zm-.276 1.841l-1.883 1.13 1.883-1.13zM34.42 15.93l-2.084-.695 2.084.695zm-19.725 6.42l18.568-6.189-1.39-4.167-18.567 6.19 1.389 4.166zm5.265 1.75l-5.12-3.072-2.26 3.766 5.12 3.072 2.26-3.766zm2.072 3.348l5.394-4.854-2.938-3.264-5.394 4.854 2.938 3.264zm5.394-4.854a.732.732 0 01-1.034-.054l3.265-2.938a3.66 3.66 0 00-5.17-.272l2.939 3.265zm-1.034-.054a.732.732 0 01.054-1.034l2.938 3.265a3.66 3.66 0 00.273-5.169l-3.265 2.938zm.054-1.034l-5.154 4.639 2.938 3.264 5.154-4.638-2.938-3.265zm1.023 12.152l-3.101-5.17-3.766 2.26 3.101 5.17 3.766-2.26zm4.867-18.423l-6.189 18.568 4.167 1.389 6.19-18.568-4.168-1.389zm-8.633 20.682c1.61 2.682 5.622 2.241 6.611-.725l-4.167-1.39a.732.732 0 011.322-.144l-3.766 2.26zm-6.003-8.05a3.66 3.66 0 004.332-.419l-2.938-3.264a.732.732 0 01.866-.084l-2.26 3.766zm3.592-1.722a3.66 3.66 0 00-.69 4.603l3.766-2.26c.18.301.122.687-.138.921l-2.938-3.264zm11.97-9.984a.732.732 0 01-.925-.926l4.166 1.389c.954-2.861-1.768-5.583-4.63-4.63l1.39 4.167zm-19.956 2.022c-2.967.99-3.407 5.003-.726 6.611l2.26-3.766a.732.732 0 01-.145 1.322l-1.39-4.167z" fill="#fff" mask="url(#icon-payments-cat_svg__a)"></path>
            <defs>
              <linearGradient id="icon-payments-cat_svg__paint0_linear_1141_21101" x1="25" y1="2" x2="25" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff" stopOpacity="0.71"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="button__text"> {randomLoading ? <div className="random-loader loader"></div> :' Generate Recipe'} </span>
      </div>
    </button>
        </div>
    </main>
  )
}

export default Main