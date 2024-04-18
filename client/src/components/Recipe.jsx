import React ,{useEffect , useState} from 'react'
import { BiWorld } from "react-icons/bi";
import { PiBowlFoodBold } from "react-icons/pi";
import { IoArrowForward ,IoFastFood} from "react-icons/io5";
import { BsClockFill } from "react-icons/bs";
import '../App.css'



function Recipe({ recipeData }) {


  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchImages() {
      if (!recipeData || recipeData.length === 0) return; // Return if recipeData is null or empty
      setLoading(true)
      const urls = await Promise.all(recipeData.map(recipe => getImage(recipe.url)));
      setImageUrls(urls);
      setLoading(false)
    }
    fetchImages();
  }, [recipeData]);
  async function getImage(imgUrl){
    try {
      const response = await fetch(`http://localhost:3000/api/v1/image?url=${encodeURIComponent(imgUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Image Url');
      }
      const responseData = await response.text();
      return responseData;
    } catch (error) {
      console.log("Error while retrieving image from external link" , error);
    }
}

  if (!recipeData) {
    return null; // If recipeData doesn't exist, return null to render nothing
  }
  if(recipeData.length<1){
      return (
          <>
          <div className="error-con">
          <h4 className='error-name'>No Data Found Instead Try Searching This..</h4>
          <ul className="search-list">
              <li className="search-item">Bread omelette</li>
              <li className="search-item">Christmas Pudding Trifle</li>
              <li className="search-item">Tandoori chicken</li>
              <li className="search-item">Chicken Handi</li>
              <li className="search-item">Dal fry</li>
          </ul>
          </div>
          </>
      )
  }

  return (
    
    <div className='recipe'>
    <h2 className='results-found'>{recipeData.length} Results Found</h2>
    <p className='recom'>(We recommend you to translate using <a href="https://translate.google.co.in/" target='_blank'>Google Translate</a> by copy and pasting instructions. )</p>
    {recipeData.map((recipe, index) => (
      <div className="recipe-top-middle-con" key={index}>
        <div className="recipe-top-container">
          <div className="recipe-top-img">
          {loading && (
        <div className="skeleton-loader">
          <div className="skeleton-image"></div>
        </div>
      )}
      <img
        src={!loading ? `https://www.archanaskitchen.com/${imageUrls[index]}` : ''} // Initially, do not load any image source
        alt={!loading ? recipe.recipename : 'Loading...'} // Use different alt text depending on loading state
        style={{ display: !loading ? 'block' : 'none' }} // Show the image once it's loaded
        onLoad={() => setLoading(false)} // Set loaded to true when the image has finished loading
      /> 
              

           
          </div>
          <div className="recipe-top-txt">
            <h4>{recipe.recipename}</h4>
            <p> <PiBowlFoodBold /> {recipe.course}</p>
            <p> <BiWorld /> {recipe.cuisine}</p>
            <p> <IoFastFood /> {recipe.diet}</p>
            <p> <BsClockFill /> {recipe.preptimeinmins} Minutes</p>
          </div>
        </div>
        <div className="recipe-middle-container">
          <div className="recipe-middle-heading">
            <h1>Ingredients & Measures</h1>
            <p>(Adjust according to your taste)</p>
          </div>
          <div className="recipe-middle-list">
            <ul className="ingredients-list">
              {recipe.translatedingredients.split(',').map((ingredient, idx) => (
                <li key={idx} className="ingredient">
                  {ingredient.trim()}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="instructions-container">
          <div className="instructions-heading">
            <h2>Instructions for Preparing the Dish</h2>
          </div>
          <div className="instructions-container">
            <ul className="instructions-list">
              {recipe.translatedinstructions.split('.').map((instruction, idx) => (
                <li key={idx} className="instruction">
                  <IoArrowForward /> 
                  {instruction.trim()}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="yt-inst-container">
          <div className="yt-ins-heading">
            <h4>If you're still unsure about the instructions, check out this blog</h4>
            <a href={recipe.url} target='_blank'>{recipe.recipename}</a>
          </div>
        </div>
      </div>
    ))}
  </div>

    
    
  );
  }
  
  export default Recipe;
