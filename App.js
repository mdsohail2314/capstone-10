import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Footer from './components/Footer';
import UserDashboard from './pages/User/UserDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PrivateRoutes from '../../frontend/src/PrivateRoutes';
 import Profile from '../src/pages/User/Profile';
import UserCart from './pages/User/UserCart';
import Checkout from './pages/User/Checkout';
import Events from './pages/User/Events';
import Rooms from './pages/User/Rooms';
import Flights from './pages/User/Flights';
function App() {
  return(
    <Router>
      <MainApp />
    </Router>
  )
};
function MainApp() {
  const location=useLocation();
  const isAuthorizationPages=location.pathname=== '/login' || location.pathname==='/register';

  return (
    <> {/* Make sure Router wraps the entire app */}
      <Routes>
        <Route path="/user-dashboard" element={
          <PrivateRoutes><Navbar></Navbar>
            <UserDashboard />
          </PrivateRoutes>
        } />


        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/events' element={<Events />}></Route>
        <Route path='/rooms' element={<Rooms />}></Route>
        <Route path='/flights' element={<Flights />}></Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/cart' element={<UserCart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      {!isAuthorizationPages && <Footer />}
    </>
  );
}

export default App;
