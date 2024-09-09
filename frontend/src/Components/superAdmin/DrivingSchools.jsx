import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCreated, clearError, createSchool, Error, getSchools, IsCreated, Schools, Status } from '../../slices/adminSlice';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { MdOutlineSearch } from 'react-icons/md';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import Spinner from '../../utils/Spinner';

const DrivingSchools = () => {
  const dispatch = useDispatch();
  const status = useSelector(Status);
  const error = useSelector(Error);
  const schools = useSelector(Schools);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isCreated = useSelector(IsCreated)
  const [show, setShow] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    drivingSchoolName: '',
    location: ''
  });
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleClick = (id) => {
    navigate(`/admin/school/${id}`);
  };
  useEffect(() => {
    dispatch(getSchools());
  }, [dispatch, isCreated]);

  // Filter and sort the schools based on search term and sorting option
  const filteredSchools = schools
    .filter((school) =>
      school.drivingSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };
  const [errors, setErrors] = useState({
    apiError: '',
    name: '',
    email: '',
    phoneNumber: '',
    drivingSchoolName: '',
    location: ''
  });

  useEffect(() => {
    if (error) {
      setErrors(prevErrors => ({
        ...prevErrors,
        apiError: error || '',
      }));
      dispatch(clearError())
    }
  }, [error]);

  const validateForm = () => {
    const newErrors = {
      apiError: '',
      name: '',
      email: '',
      phoneNumber: '',
      drivingSchoolName: '',
      location: ''
    };

    if (!formValues.name) newErrors.name = 'Name is required';
    if (!formValues.email) newErrors.email = 'Email is required';
    if (!formValues.phoneNumber) newErrors.phoneNumber = 'phoneNumber is required';
    if (!formValues.drivingSchoolName) newErrors.drivingSchoolName = 'Driving SchoolName is required';
    if (!formValues.location) newErrors.location = 'Location  is required';
    setErrors(prev => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(createSchool(formValues))
      handleClose()
    }
  };

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isCreated) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false); 
      }, 3000);
      dispatch(clearCreated())
      return () => clearTimeout(timer); 
    }
  }, [isCreated]);


  return (
    <>
        {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out">
          <p>Created successfully!</p>
        </div>
      )}
      <div className="p-8 bg-gray-100 min-h-50">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-10">Driving Schools</h2>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center px-2 space-y-4 md:space-y-0 mb-4">
          {/* Search Input */}
          <div className="w-full md:max-w-md">
            <div className="relative">
              <input
                type="text"
                className="w-full px-8 py-2 pl-10 text-gray-700 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Search schools by name or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MdOutlineSearch className="absolute top-3 left-3 text-gray-500 text-xl" />
            </div>
          </div>

          {/* Add Button */}
          <Button
            className="bg-primary-dark px-4 py-2 text-white rounded-md md:ml-4 w-full md:w-auto"
            onClick={handleShow}>
            Add
          </Button>
        </div>


        {/* Error Handling */}
        {status === 'failed' && (
          <div className="text-red-500 text-center mb-6">Error: {error}</div>
        )}

        {/* Loading Skeleton */}
        {status === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <div key={skeleton} className="animate-pulse flex flex-col bg-white p-6 rounded-lg shadow-md">
                <div className="h-6 bg-gray-200 rounded-full mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* List of Schools */}
        {status === 'succeeded' && (
          <div className="grid grid-cols-1 gap-6">
            {filteredSchools.map((school) => (
              <div onClick={() => handleClick(school._id)} key={school.id} className="hover:cursor-pointer bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                {/* Driving School and Owner Details */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start w-full gap-3">
                  {/* Driving School Details */}
                  <div className="flex items-center gap-3">
                    <img
                      src={school?.avatar}
                      width="50px"
                      height="50px"
                      className="rounded-full border border-gray-300"
                      alt="School Avatar"
                    />
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                        {school.drivingSchoolName}
                      </h3>
                      <p className="text-sm text-gray-500">{school.location}</p>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden sm:block h-12 w-px bg-gray-400"></div> {/* Visible on larger screens */}

                  {/* Owner Details */}
                  <div className="hidden lg:flex items-center gap-3 mt-2 lg:mt-0 ">
                    <img
                      src={school.owner?.avatar}
                      width="50px"
                      height="50px"
                      className="rounded-full border border-gray-300"
                      alt="Owner Avatar"
                    />
                    <div>
                      <p className="text-sm sm:text-l font-semibold text-gray-700">
                        {school.owner?.name}
                      </p>
                      <p className="text-xs text-gray-500">{school.owner?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Edit and Delete Buttons */}
                <div className="flex space-x-4 mt-4 sm:mt-0">
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>

        )}
      </div>

      {/* Modal with Form */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Driving School</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="name" label="Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter Name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </FloatingLabel>

            <FloatingLabel controlId="email" label="Email" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter Email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </FloatingLabel>

            <FloatingLabel controlId="phoneNumber" label="Phone Number" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter Phone Number"
                name="phoneNumber"
                value={formValues.phoneNumber}
                onChange={handleChange}
                
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </FloatingLabel>

            <FloatingLabel controlId="drivingSchoolName" label="Driving School Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter Driving School Name"
                name="drivingSchoolName"
                value={formValues.drivingSchoolName}
                onChange={handleChange}
                
              />
                            {errors.drivingSchoolName && <p className="text-red-500 text-sm mt-1">{errors.drivingSchoolName}</p>}
            </FloatingLabel>

            <FloatingLabel controlId="location" label="Location" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter Location"
                name="location"
                value={formValues.location}
                onChange={handleChange}
                
              />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </FloatingLabel>
            {errors.apiError && (
              <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>
            )}
                 <button type='submit' disabled={status === "loading"} className='text-white w-full mt-3 px-3 py-2 bg-primary-dark rounded-md transition duration-300 ease-in-out hover:shadow-lg transform hover:scale-105'>
              {status === "loading" ? <Spinner /> : "SUBMIT"}
            </button>
          </Form>
        </Modal.Body>
      </Modal>



    </>


  );
};

export default DrivingSchools;
