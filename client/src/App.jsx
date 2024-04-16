import { useState , useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import Main from "./components/Main";
import Recipe from "./components/Recipe";
import Footer from "./components/Footer";

function App() {
  const [recipeData, setRecipeData] = useState(null);
  const recipeRef = useRef(null); 

  // Function to update recipe data
  const updateRecipeData = (data) => {
    setRecipeData(data);
    setTimeout(() => {
      recipeRef.current.scrollIntoView({ behavior: 'smooth' });
      
    }, 500);
  };

  return (
    <>
      <Header updateRecipeData={updateRecipeData}/>
      <Main updateRecipeData={updateRecipeData} />
      <div ref={recipeRef}>
        <Recipe recipeData={recipeData} />
      </div>
      <Footer />
    </>
  );
}

export default App;
