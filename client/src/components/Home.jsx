import React from 'react'
import "./Home.css"
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material';
const Home = () =>  {
  const navigate = useNavigate();

  const handleExploreMenu = () => {
    const token = localStorage.getItem("loginztoken");
    if (token) {
      navigate("/menu");
    } else {
      navigate("/login");
    }
  };
  return (
    <div>
        <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to FoodieBites!</h1>
        <p style={{ color: 'white',fontSize: '1.5 rem' }}>
          Delicious meals delivered fast. Reserve a table, explore the menu, and enjoy your dining experience.
        </p>
        {/* <a href="/menu" className="btn">Explore Menu</a> */}
       {/* <Link to="/menu" className="btn">Explore Menu</Link> */} 
       <Button onClick={handleExploreMenu}  variant="contained"
        color="warning"
        sx={{ mt: 3 }}>
        Explore Menu
      </Button>
      </header>

      <section className="features">
        <div className="feature-box">
          <h3>🍕 Online Ordering</h3>
          <p>Order food online and get it delivered to your door.</p>
        </div>
        <div className="feature-box">
          <h3>📅 Table Reservation</h3>
          <p>Book your favorite table in advance.</p>
        </div>
        <div className="feature-box">
          <h3>🚚 Fast Delivery</h3>
          <p>Hot and fresh food, delivered on time.</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 FoodieBite | Built with ❤️</p>
        <p>Contact: support@foodiebite.com</p>
      </footer>
    </div>
    </div>
  )
}

export default Home




