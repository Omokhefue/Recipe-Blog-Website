import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SubmitRecipe from "./pages/SubmitRecipe";
import DisplayRandom from "./pages/DisplayRandomRecipe";
import SingleCategory from "./pages/SingleCategory";
import Categories from "./pages/Categories";
import SingleRecipeDetails from "./pages/DisplayRecipe";
import Footer from "./components/Footer";
import SearchResultsPage from "./pages/SearchResultsPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Switch>
            <Route exact path="/">
              <Redirect to="/api/recipes" />
            </Route>
            <Route exact path="/api/recipes">
              <HomePage />
            </Route>
            <Route path="/api/recipes/submit-recipe">
              <SubmitRecipe />
            </Route>
            <Route path="/api/recipes/random-recipe">
              <DisplayRandom />
            </Route>
            <Route path="/api/recipes/categories/:category">
              <SingleCategory />
            </Route>
            <Route path="/api/recipes/categories">
              <Categories />
            </Route>
            <Route path="/api/recipes/submit-recipe">
              <SubmitRecipe />
            </Route>
            <Route path="/api/recipes/search">
              <SearchResultsPage />
            </Route>
            <Route path="/api/recipes/:id">
              <SingleRecipeDetails />
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
