import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/landingPage";
import SignIn from './components/Sign-In/SignIn';
import SignUp from './components/Sign-Up/SignUp';
import Personalize from './components/Sign-Up/Personalize/Personalize';
import HomePage from './components/HomePage/HomePage';
import UserPage from './components/UserPage/UserPage';
import PageNotFound from './components/PageNotFound/PageNotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/personalize" element={<Personalize />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/userpage/:id" element={<UserPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
