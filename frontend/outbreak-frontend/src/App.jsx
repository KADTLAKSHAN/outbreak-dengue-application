import "./App.css";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Nav from "./components/Nav";
import About from "./components/About";
import Alerts from "./components/Alerts";
import Articles from "./components/Articles";
import Analysis from "./components/Analysis";
import DengueDetails from "./components/DengueDetails";
import LoginRegisterModal from "./components/LoginRegisterModal";
import { useState } from "react";

function App() {
  // State to control the visibility of the login/register modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="bg-site bg-no-repeat bg-cover overflow-hidden">
      <Header isAuthOpen={isAuthOpen} setIsAuthOpen={setIsAuthOpen} />

      <Banner />

      {/* Conditionally render the Nav component */}
      {!isAuthOpen && <Nav />}
      <Alerts />
      <Analysis />
      <DengueDetails />
      <Articles />
      <About />

      <div className="h-[4000px]"></div>

      {/* Login/Register Modal */}
      <LoginRegisterModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default App;
