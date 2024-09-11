import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, forgotPassword, loginAuthError, loginAuthStatus, loginAuthUser, loginIsAuthenticated, loginUser, Message } from '../slices/authSlice';
import Spinner from '../utils/Spinner';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

const LoginModel = ({ show, handleClose }) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('');
  const isAuthenticated = useSelector(loginIsAuthenticated);
  const user = useSelector(loginAuthUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const forgotPasswordMessage = useSelector(Message);

  const error = useSelector(loginAuthError);
  const status = useSelector(loginAuthStatus);
  const [show1, setShow1] = useState(false)

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    apiError: '',
    forgotPassword: '',
    forgotPasswordSuccess: ''
  });

  useEffect(() => {
    if (error || forgotPasswordMessage) {
      setErrors(prevErrors => ({
        ...prevErrors,
        apiError: error || '',
        forgotPasswordSuccess: forgotPasswordMessage || ''
      }));
      dispatch(clearError())
    }
  }, [error, forgotPasswordMessage]);

  useEffect(() => {
    if (isAuthenticated) {
      handleClose()
      setEmail('')
      setPassword('')
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = { email: '', password: '', forgotPassword: '' };

    if (!isForgotPassword) {
      if (!email) newErrors.email = 'Email is required';
      if (!password) newErrors.password = 'Password is required';
    } else {
      if (!forgotEmail) newErrors.forgotPassword = 'Email is required';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  };


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        dispatch(forgotPassword(forgotEmail));
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }
  };

  return (
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

        {isForgotPassword
          ?
          <form onSubmit={handleForgotPassword}>
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control onChange={(e) => setForgotEmail(e.target.value)} value={forgotEmail} required className='focus:ring-0 no-focus-border' type="email" placeholder="name@example.com" />
            </FloatingLabel>
            <div className='flex justify-end'>
              <button type='button' onClick={() => setIsForgotPassword(!isForgotPassword)} className='text-primary-dark text-xs'>Login?</button>
            </div>

            {errors.apiError && <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>}
            {errors.forgotPasswordSuccess && <p className="text-green-500 text-sm mt-1">{errors.forgotPasswordSuccess}</p>}

            <button disabled={status === "loading"} className='text-white w-full mt-3 px-3 py-2 bg-primary-light rounded-md transition duration-300 ease-in-out hover:bg-primary-dark hover:shadow-lg transform hover:scale-105'>
              {status === "loading" ? <Spinner /> : "SEND MAIL"}
            </button>
          </form>

          :

          <form onSubmit={handleSubmit}>
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control onChange={(e) => setEmail(e.target.value)} value={email} className='focus:ring-0 no-focus-border' type="email" placeholder="name@example.com" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </FloatingLabel>

            <div className="my-2 flex items-center border border-gray-300 rounded-md">
              <FloatingLabel controlId="floatingPassword" label="Password" className="flex-grow">
                <Form.Control type={show1 ? 'text' : 'password'}
                  onChange={(e) => setPassword(e.target.value)} value={password} className='focus:ring-0 no-focus-border' placeholder="Password" />
              </FloatingLabel>
              <button
                type="button"
                className="p-2 focus:outline-none"
                onClick={() => setShow1(!show1)}
              >
                {show1 ? (
                  <IoEyeOutline className="text-gray-500" fontSize="1.5rem" />
                ) : (
                  <IoEyeOffOutline className="text-gray-500" fontSize="1.5rem" />
                )}
              </button>
            </div>

            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            <div className='flex justify-end'>
              <button type='button' onClick={() => setIsForgotPassword(!isForgotPassword)} className='text-primary-dark mt-2 text-xs'>Forgot Password?</button>
            </div>
            {errors.apiError && (
              <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>
            )}
            <button disabled={status === "loading"} className='text-white w-full mt-3 px-3 py-2 bg-primary-dark rounded-md transition duration-300 ease-in-out hover:shadow-lg transform hover:scale-105'>
              {status === "loading" ? <Spinner /> : "LOGIN"}
            </button>
          </form>}
      </Modal.Body>
    </Modal>
  )
}

export default LoginModel