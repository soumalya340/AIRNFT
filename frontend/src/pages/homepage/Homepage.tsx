import HomePage from "../../components/home/Home";
import "./homepage.css";
import Nav from "../../components/navbar/Navbar";

const Homepage = () => {
  return (
    <div className="homepage">
      <Nav />
      <HomePage />
    </div>
  );
};

export default Homepage;
