import React, { useContext, useEffect, useState } from 'react';
//import { useDispatch, useSelector } from 'react-redux';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const Navbar = () => {
  //  const user = useSelector(loginAuthUser);
  // const dispatch = useDispatch();
  // const width = useContext(FindWidthContext)
  // const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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



  return (
    <>
      {/* ${isAuth ? 'bg-gray-100 shadow-down' : bgColor} ${isAuth ? 'translate-y-0' : navPosition} */}
      <header className={`text-gray-800 w-full z-20 transition-transform duration-300   ${bgColor}  ${navPosition} fixed top-0 left-0 w-full`}>
        <nav className="container mx-auto lg:px-20 lg:py-5 px-5 py-2 flex items-center justify-between">
          <div className="text-xl font-bold">
            <a href="/">
              LOGO
              {/*  <img src={LOGO} alt="Logo" width='150px' height="150px" /> */}
            </a>
          </div>


          <div className="hidden lg:flex space-x-4">
            {/* Check user is authenticated or not if authenticated then show their details if not then show LOGIN button */}
            <button onClick={handleShow}
              className={`transition-colors duration-500 ease-in-out rounded px-3 py-1 border ${textColor} hover:text-white hover:bg-primary-dark`}
            >
              LOGIN
            </button>

          </div>
          <button onClick={handleShow}
            className={`lg:hidden px-3 py-2 transition-colors duration-500 ease-in-out rounded px-3 py-1 border ${textColor} hover:text-white hover:bg-primary-dark`}>
            LOGIN
          </button>

        </nav>

      </header>


      {/* LOGIN model */}
      <Modal
        fullscreen="md-down"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <h2 className="text-primary-dark text-3xl">LOGIN</h2>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control className='focus:ring-0 no-focus-border' type="email" placeholder="name@example.com" />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control className='focus:ring-0 no-focus-border' type="password" placeholder="Password" />
            </FloatingLabel>
            <button className='text-white w-full mt-3 px-3 py-2 bg-primary-light rounded-md transition duration-300 ease-in-out hover:bg-primary-dark hover:shadow-lg transform hover:scale-105'>
              LOGIN
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Navbar;
