import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVehicles, deleteVehicle, addVehicle, updateVehicle, allVehicles, IsDeleted, Status, Error, IsCreated, IsUpdated, clearDeleted, clearUpdated, clearCreated, clearError } from '../../slices/vehicleSlice';
import { Button, Modal, Form, ToastContainer, Toast } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const Vehicles = () => {
    const dispatch = useDispatch();
    const vehicles = useSelector(allVehicles);
    const isDeleted = useSelector(IsDeleted);
    const isCreated = useSelector(IsCreated);
    const isUpdated = useSelector(IsUpdated);
    const status = useSelector(Status);
    const error = useSelector(Error);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');
    const handleCloseAddModal = () => setShowAddModal(false);

    const [formData, setFormData] = useState({
        name: '',
        registrationNumber: '',
        type: '',
        lastServiceDate: '',
        nextServiceDate: '',
        certificates: [{ name: '' }]
    });

    useEffect(() => {
        dispatch(getAllVehicles());
    }, [dispatch, isDeleted, isCreated, isUpdated]);

    useEffect(() => {
        if (error) {
            setToastMessage(error);
            setToastVariant('danger');
            setShowToast(true);
            dispatch(clearError());
        }
        if (isCreated) {
            setToastMessage('Vehicle added successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearCreated());
            handleCloseAddModal();
        }
        if (isDeleted) {
            setToastMessage('Vehicle deleted successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearDeleted());
        }
        if (isUpdated) {
            setToastMessage('Vehicle updated successfully!');
            setToastVariant('success');
            setShowToast(true);
            handleCloseEditModal();
            dispatch(clearUpdated());

        }
    }, [error, isCreated, isUpdated, isDeleted, dispatch]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Certificates input handler
    const handleCertificateChange = (index, value) => {
        const updatedCertificates = [...formData.certificates];
        updatedCertificates[index].name = value;
        setFormData({
            ...formData,
            certificates: updatedCertificates
        });
    };

    // Add certificate field
    const addCertificateField = () => {
        if (formData.certificates.length < 5) {
            setFormData({
                ...formData,
                certificates: [...formData.certificates, { name: '' }]
            });
        }
    };

    const handleShowAddModal = () => {
        setFormData({
            name: '',
            registrationNumber: '',
            type: '',
            lastServiceDate: '',
            nextServiceDate: '',
            certificates: [{ name: '' }]
        });
        setShowAddModal(true);
    };

    const handleShowViewModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowViewModal(true);
    };
    const handleCloseViewModal = () => setShowViewModal(false);

    const handleShowEditModal = (vehicle) => {
        setFormData({ ...vehicle });
        setSelectedVehicle(vehicle);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedVehicle(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            dispatch(deleteVehicle(id));
        }
    };

    const handleAddVehicle = () => {
        dispatch(addVehicle(formData));
    };

    const handleUpdateVehicle = () => {
        dispatch(updateVehicle({ id: selectedVehicle._id, data: formData }));
    };

    console.log(vehicles)
    return (
        <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-bold mb-4">All Vehicles</h2>

            <Button className="mb-4" variant="primary" onClick={handleShowAddModal}>
                Add Vehicle
            </Button>

            {status === 'loading' &&  
          (  [1, 2, 3, 4, 5, 6].map((skeleton) => (
                        <div key={skeleton} className="animate-pulse flex flex-col bg-white p-6 rounded-lg shadow-md">
                            <div className="h-6 bg-gray-200 rounded-full mb-4 w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                        </div>
                    )))
                    }
            {error && <p className="text-red-500">{error}</p>}

           {status === 'succeeded' && vehicles.length > 0 &&
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Vehicle Name</th>
                        <th className="py-2 px-4 border">Registration Number</th>
                        <th className="py-2 px-4 border">Type</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles?.map(vehicle => (
                        <tr key={vehicle._id}>
                            <td className="py-2 px-4 border">{vehicle.name}</td>
                            <td className="py-2 px-4 border">{vehicle.registrationNumber}</td>
                            <td className="py-2 px-4 border">{vehicle.type}</td>
                            <td className="py-2 px-4 border flex gap-2">
                                <Button variant="info" onClick={() => handleShowViewModal(vehicle)}>
                                    <FaEye />
                                </Button>
                                <Button variant="warning" onClick={() => handleShowEditModal(vehicle)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(vehicle._id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}

            {/* Add Vehicle Modal */}
            <Modal centered show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formVehicleName">
                            <Form.Label>Vehicle Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter vehicle name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegistrationNumber">
                            <Form.Label>Registration Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                placeholder="Enter registration number"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formType">
                            <Form.Label>Vehicle Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="Enter vehicle type"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLastServiceDate">
                            <Form.Label>Last Service Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="lastServiceDate"
                                value={formData.lastServiceDate}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNextServiceDate">
                            <Form.Label>Next Service Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="nextServiceDate"
                                value={formData.nextServiceDate}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        {formData.certificates.map((cert, index) => (
                            <Form.Group key={index} className="mb-3">
                                <Form.Label>Certificate {index + 1}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Certificate Name"
                                    value={cert.name}
                                    onChange={(e) => handleCertificateChange(index, e.target.value)}
                                />
                            </Form.Group>
                        ))}

                        {formData.certificates.length < 5 && (
                            <Button type="button" onClick={addCertificateField}>
                                Add Certificate
                            </Button>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddVehicle}>
                        Add Vehicle
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit and View modals can be handled similarly with different buttons and actions */}

            {selectedVehicle && (
                <Modal centered show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Service</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formVehicleName">
                                <Form.Label>Vehicle Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter vehicle name"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formRegistrationNumber">
                                <Form.Label>Registration Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    placeholder="Enter registration number"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formType">
                                <Form.Label>Vehicle Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    placeholder="Enter vehicle type"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formLastServiceDate">
                                <Form.Label>Last Service Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="lastServiceDate"
                                    value={formData.lastServiceDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formNextServiceDate">
                                <Form.Label>Next Service Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="nextServiceDate"
                                    value={formData.nextServiceDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            {formData.certificates.map((cert, index) => (
                                <Form.Group key={index} className="mb-3">
                                    <Form.Label>Certificate {index + 1}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Certificate Name"
                                        value={cert.name}
                                        onChange={(e) => handleCertificateChange(index, e.target.value)}
                                    />
                                </Form.Group>
                            ))}

                            {formData.certificates.length < 5 && (
                                <Button type="button" onClick={addCertificateField}>
                                    Add Certificate
                                </Button>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleUpdateVehicle}>
                            Update Service
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {selectedVehicle && (
                <Modal centered show={showViewModal} onHide={handleCloseViewModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Service</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Vehicle Name:</strong> {selectedVehicle.name}</p>
                        <p><strong>Registration Number:</strong> {selectedVehicle.registrationNumber}</p>
                        <p><strong>Vehicle Type:</strong> {selectedVehicle.type}</p>
                        <p><strong>Last Service Date:</strong> {new Date(selectedVehicle.lastServiceDate).toLocaleDateString()}</p>
                        <p><strong>Next Service Date:</strong> {new Date(selectedVehicle.nextServiceDate).toLocaleDateString()}</p>
                        <p><strong>Certificates:</strong>
                            {selectedVehicle.certificates.length > 0
                                ? selectedVehicle.certificates.map(c => c.name).join(', ')
                                : "No certificates available"}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseViewModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}








            {/* <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} bg={toastVariant} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer> */}
        </div>
    );
};

export default Vehicles;
