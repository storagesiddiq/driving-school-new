import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginModel from './LoginModel';
import { clearStatus, loginAuthUser, loginIsAuthenticated, logoutUser } from '../slices/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SideDrawer from './Chat/SideDrawer';

const Navbar = () => {
  const dispatch = useDispatch();
  // const width = useContext(FindWidthContext)
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const isAuth = useSelector(loginIsAuthenticated)
  const user = useSelector(loginAuthUser)

  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setScrollY(currentScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Determine background color
  const isScrolled = scrollY > 40;
  const isScrollingUp = scrollDirection === 'up';
  const bgColor = isScrolled ? 'bg-gray-100 shadow-down' : 'bg-transparent';
  const textColor = isScrolled ? 'text-primary border-primary' : 'text-white';
  const navPosition = isScrollingUp ? 'translate-y-0' : '-translate-y-full';

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearStatus());
    navigate('/')
  }

  const location = useLocation();

  const isChatPage = location.pathname === '/instructor/chat'

  return (
    <>
      {/*  */}
      <header className={`${isAuth ? 'bg-gray-100 shadow-down' : bgColor} ${isAuth ? 'translate-y-0' : navPosition} text-gray-800 w-full z-20 transition-transform duration-300  fixed top-0 left-0 w-full`}>
        <nav className="container mx-auto lg:px-20 lg:py-5 px-5 py-2 flex items-center justify-between">
          <div className="text-xl font-bold">
            <a href="/">
              LOGO
              {/*  <img src={LOGO} alt="Logo" width='150px' height="150px" /> */}
            </a>
          </div>


          <div className="hidden lg:flex space-x-4">
            {/* Check user is authenticated or not if authenticated then show their details if not then show LOGIN button */}
            {isAuth && user.role === "instructor" ?
              <div className='flex items-center gap-6'>
                <div className='flex gap-3 items-center'> <Link to="/instructor/home">Home</Link>
                  <Link to="/instructor/profile">Profile</Link>
                  <Link to="/instructor/sessions">Sessions</Link>
                  <Link to="/instructor/attendance">Attendance</Link>
                  <Link to="/instructor/report">Report</Link>
                  <Link to="/instructor/chat">Chat</Link>
                  {isChatPage && (
                    <div className="lg:flex lg:w-full md:flex-grow md:w-full  justify-end">
                      <SideDrawer />
                    </div>
                  )}
                  <button onClick={handleLogout} className='font-semibold bg-red-500 p-1 rounded-md text-white' >Logout</button>
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  width="40px"
                  height="40px"
                  className="rounded-full border border-gray-300"
                />
              </div>
              :
              isAuth ?
                <>
                  <button onClick={handleLogout} className='font-semibold bg-red-500 p-1 rounded-md text-white' >Logout</button>

                  <img
                    src={user.avatar}
                    alt={user.name}
                    width="40px"
                    height="40px"
                    className="rounded-full border border-gray-300"
                  /> </> :
                <button onClick={handleShow}
                  className={`transition-colors ${isAuth ? 'bg-primary-dark' : ''} duration-500 ease-in-out rounded px-3 py-1 border ${textColor} hover:text-white hover:bg-primary-dark`}
                >
                  LOGIN
                </button>}

          </div>

          <div className='lg:hidden'>
            {isAuth ?
              <div className='flex gap-1 items-center'>  {isChatPage && <div className="lg:hidden"><SideDrawer /> </div>}
                <img
                  src={user.avatar}
                  alt={user.name}
                  width="40px"
                  height="40px"
                  className="rounded-full border border-gray-300"
                />  </div>
              :
              <button onClick={handleShow}
                className={` px-3 py-2 transition-colors duration-500 ease-in-out rounded px-3 py-1 border ${textColor} hover:text-white hover:bg-primary-dark`}>
                LOGIN
              </button>}
          </div>
        </nav>

      </header>


      {/* LOGIN model */}
      <LoginModel show={show} handleClose={handleClose} />
    </>
  );
};

export default Navbar;
