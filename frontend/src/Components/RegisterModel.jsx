import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError,  googleSignIn,  loginAuthError, loginAuthStatus, loginAuthUser, registerUser } from '../slices/authSlice';
import { FcGoogle } from 'react-icons/fc';

const RegisterModel = ({ show, handleClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [number, setNumber] = useState('')
    const [location, setLocation] = useState('')

    const error = useSelector(loginAuthError);
    const status = useSelector(loginAuthStatus);
    const user = useSelector(loginAuthUser);

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        number: '',
        location: '',
        apiError: ''
    });


    const validateForm = () => {
        const newErrors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            number: '',
            location: '',
            apiError: ''
        };

        if (!name) newErrors.name = 'Name is required';
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (!number) newErrors.number = 'Phone Number is required';
        if (!location) newErrors.location = 'Location is required';

        if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
        if (confirmPassword !== password) newErrors.apiError = 'Both password and confirm password should be match';

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            let FormDatas = {
                name, email, password, role: "learner", location, phoneNumber: number
            }
            dispatch(registerUser(FormDatas));
            navigate('/')
            handleClose()
            setName('')
            setEmail('')
            setPassword('')
            setLocation('')
            setNumber('')
        }
    };

    useEffect(() => {
        if (error) {
            setErrors(prevErrors => ({
                ...prevErrors,
                apiError: error || '',
            }));
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        const phoneRegex = /^[0-9]{10}$/; // Regular expression to match 10-digit number

        setNumber(value);

        // Validate the phone number length and format
        if (!phoneRegex.test(value)) {
            setErrors({ number: 'Please enter a valid 10-digit phone number.' });
        } else {
            setErrors({});
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = 'http://localhost:3001/api/auth/google';

      };

    return (
        <Modal
            fullscreen="md-down"
            show={show}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="custom-modal">
            <Modal.Header closeButton>
                <h2 className="text-primary-dark text-3xl">REGISTER</h2>
            </Modal.Header>
            <Modal.Body>

                <button onClick={handleGoogleSignIn}
                    className="flex items-center justify-center w-full px-4 py-2 mt-3 text-white bg-gray-100 border border-gray-300 rounded-md shadow-md hover:bg-gray-200 transition duration-300 ease-in-out"
                >
                    <FcGoogle className="mr-3 text-xl" /> {/* Google icon */}
                    <span className="text-gray-700 font-semibold">Sign in with Google</span>
                </button>

                <div className='text-center my-3'>(OR)</div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Name"

                        >
                            <Form.Control onChange={(e) => setName(e.target.value)} value={name} className='focus:ring-0 no-focus-border' type="text" placeholder="name@example.com" />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Email address"
                            className="mb-3"
                        >
                            <Form.Control onChange={(e) => setEmail(e.target.value)} value={email} className='focus:ring-0 no-focus-border' type="email" placeholder="name@example.com" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                        </FloatingLabel>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control onChange={(e) => setPassword(e.target.value)} value={password} className='focus:ring-0 no-focus-border' type="password" placeholder="Password" />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Confirm Password">
                            <Form.Control onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className='focus:ring-0 no-focus-border' type="password" placeholder="Password" />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}

                        </FloatingLabel>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FloatingLabel controlId="floatingInput" label="Phone Number" className="mt-3">
                            <Form.Control
                                onChange={handlePhoneNumberChange}
                                value={number}
                                className="focus:ring-0 no-focus-border"
                                type="text"
                                placeholder="Enter your phone number"
                                maxLength="10"
                            />
                            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Location"
                            className="my-3"
                        >
                            <Form.Control onChange={(e) => setLocation(e.target.value)} value={location} className='focus:ring-0 no-focus-border' type="text" placeholder="name@example.com" />
                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}

                        </FloatingLabel>
                    </div>
                    {errors.apiError && (
                        <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>
                    )}
                    <button disabled={status === "loading" ? true : false} className='text-white w-full mt-3 px-3 py-2 bg-primary-light rounded-md transition duration-300 ease-in-out hover:bg-primary-dark hover:shadow-lg transform'>
                        {status === 'loading' ? 'loading...' : 'Register'}
                    </button>
                </form>


            </Modal.Body>
        </Modal>
    )
}

export default RegisterModel