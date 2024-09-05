import React, { useState, useEffect } from 'react';
import home_img from '../assets/driving_school.jpg';
import { FiEdit } from "react-icons/fi";
import { SiGitconnected } from "react-icons/si";
import { AiOutlineInteraction } from "react-icons/ai";
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const texts = [
  "India's Leading Driving School Platform",
  "Master the Road with Professional Instructors",
  "Trusted by Thousands of Learners Nationwide",
  "Comprehensive Courses for All Skill Levels",
  "Your Journey to Safe Driving Starts Here"
];

const Home = () => {
  const [currentText, setCurrentText] = useState(texts[0]);
  const [fade, setFade] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentText(prev => {
          const nextIndex = (texts.indexOf(prev) + 1) % texts.length;
          return texts[nextIndex];
        });
        setFade(false);
      }, 500); // Matches the duration of the fade-out
    }, 5000); // Change text every 5 seconds

    return () => clearInterval(interval);
  }, []);


  const steps = [
    { step: 1, icon: <FiEdit size={80} color='white' />, title: "Sign Up", desc: "Register for free & update your profile" },
    { step: 2, icon: <SiGitconnected size={80} color='white' />, title: "Find", desc: "Find your Desered courses near Driving School" },
    { step: 3, icon: <AiOutlineInteraction size={80} color='white' />, title: "Learn", desc: "Learn to drive with expert instructors & enjoy additional services" }

  ]
  return (<>
    <div className="relative h-screen w-full">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src={home_img}
          alt="Background"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h2 className={`text-center px-3 text-5xl lg:text-5xl font-bold text-white transition-opacity duration-500 ease-in-out ${fade ? 'opacity-0' : 'opacity-100'}`}>
          {currentText}
        </h2>
      </div>

      <div className=" absolute bottom-0 w-full bg-black bg-opacity-25 py-8 flex justify-center">
        <button onClick={handleShow}
          className="transition-colors duration-500 ease-in-out rounded px-20 py-1 border border-primary bg-primary-dark text-white"
        >
          LET'S BEGIN
        </button>
      </div>

    </div>
    <div className='bg-gray-100 py-10'>
      <h1 className='text-center lg:text-3xl text-1xl text-orange-800'>Find Driving School Courses Near You</h1>
      <div className="pt-5  flex flex-col md:flex-row items-center justify-between space-y-10 md:space-y-0">
        {
          steps.map(step => (
            <div key={step.step} className='md:w-1/3'>
              <div className="relative flex flex-col items-center">
                <div className="bg-primary-dark  w-40 h-40 rounded-full flex  items-center justify-center"> {step.icon} </div>
                <div className="absolute bottom-[-0.5rem] w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-primary-dark font-bold">{step.step}</span>
                </div>
              </div>
              <h2 className='text-center  text-primary-dark pt-3 text-2xl'>  {step.title}</h2>
              <p className='text-center px-4  text-gray-600 '>{step.desc}</p>
            </div>
          ))
        }
      </div>
    </div>

    {/* Register Modal */}
    <Modal
        fullscreen="md-down"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <h2 className="text-primary-dark text-3xl">SIGNIN</h2>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
            <FloatingLabel
              controlId="floatingInput"
              label="Name"
              className="mb-3"
            >
              <Form.Control className='focus:ring-0 no-focus-border' type="text"  placeholder="name@example.com"  />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control className='focus:ring-0 no-focus-border' type="email" placeholder="name@example.com" />
            </FloatingLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control className='focus:ring-0 no-focus-border' type="password" placeholder="Password" />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control className='focus:ring-0 no-focus-border' type="password" placeholder="Password" />
            </FloatingLabel>
            </div>
            <button className='text-white w-full mt-3 px-3 py-2 bg-primary-light rounded-md transition duration-300 ease-in-out hover:bg-primary-dark hover:shadow-lg transform hover:scale-105'>
              SIGIN
            </button>
          </form>
        </Modal.Body>
      </Modal>
  </>
  );
};

export default Home;
