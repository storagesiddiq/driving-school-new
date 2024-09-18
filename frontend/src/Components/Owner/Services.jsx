import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllServices, deleteService, addService, updateService, allServices, IsDeleted, Status, Error, IsCreated, IsUpdated, clearDeleted, clearUpdated, clearCreated, clearError } from '../../slices/serviceSlice'; // Adjust imports
import { Button, Modal, Form, ToastContainer, Toast } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'; // Import action icons

const Services = () => {
    const dispatch = useDispatch();
    const services = useSelector(allServices);
    const isDeleted = useSelector(IsDeleted);
    const isCreated = useSelector(IsCreated);
    const isUpdated = useSelector(IsUpdated);
    const status = useSelector(Status);
    const error = useSelector(Error);

    // State for handling modals and form data
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    const [formData, setFormData] = useState({
        serviceName: '',
        serviceType: '',
        vehicleType: '',
        description: '',
        price: '',
        certificatesIssued: ''
    });

    useEffect(() => {
        dispatch(getAllServices());
    }, [dispatch, isDeleted, isCreated,isUpdated,showToast]);

    useEffect(() => {
        if (error) {
            setToastMessage(error);
            setToastVariant('danger');
            setShowToast(true);
            dispatch(clearError());
        }
        if (isCreated) {
            setToastMessage('Service added successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearCreated());
            handleCloseAddModal();
        }
        if (isDeleted) {
            setToastMessage('Service deleted successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearDeleted());
        }
        if (isUpdated) {
            setToastMessage('Service updated successfully!');
            setToastVariant('success');
            setShowToast(true);
            handleCloseEditModal();
            dispatch(clearUpdated())
        }
    }, [error, isCreated, isUpdated, isDeleted, dispatch]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Modal control functions
    const handleShowAddModal = () => {
        setFormData({
            serviceName: '',
            serviceType: '',
            vehicleType: '',
            description: '',
            price: '',
            certificatesIssued: ''
        });
        setShowAddModal(true);
    };
    const handleCloseAddModal = () => setShowAddModal(false);

    const handleShowViewModal = (service) => {
        setSelectedService(service);
        setShowViewModal(true);
    };
    const handleCloseViewModal = () => setShowViewModal(false);

    const handleShowEditModal = (service) => {
        setFormData({ ...service });
        setSelectedService(service);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedService(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            dispatch(deleteService(id));
        }
    };

    const handleAddService = () => {
        dispatch(addService(formData));
    };

    const handleUpdateService = () => {
        dispatch(updateService({ id: selectedService._id, data: formData }));
    };

    return (
        <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-bold mb-4">All Services</h2>

            <Button className="mb-4" variant="primary" onClick={handleShowAddModal}>
                Add Service
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


        {services.length>0 && status === 'succeeded' &&
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Service Name</th>
                        <th className="py-2 px-4 border">Service Type</th>
                        <th className="py-2 px-4 border">Price</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {services?.map(service => (
                        <tr key={service._id}>
                            <td className="py-2 px-4 border">{service.serviceName}</td>
                            <td className="py-2 px-4 border">{service.serviceType}</td>
                            <td className="py-2 px-4 border">{service.price}</td>
                            <td className="py-2 px-4 border flex gap-2">
                                <Button variant="info" onClick={() => handleShowViewModal(service)}>
                                    <FaEye />
                                </Button>
                                <Button variant="warning" onClick={() => handleShowEditModal(service)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(service._id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}

            {/* Add Service Modal */}
            <Modal centered show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formServiceName">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="serviceName"
                                value={formData.serviceName}
                                onChange={handleChange}
                                placeholder="Enter service name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formServiceType">
                            <Form.Label>Service Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                placeholder="Enter service type"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formVehicleType">
                            <Form.Label>Vehicle Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                placeholder="Enter vehicle type"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter description"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formCertificatesIssued">
                            <Form.Label>Certificates Issued</Form.Label>
                            <Form.Control
                                type="text"
                                name="certificatesIssued"
                                value={formData.certificatesIssued}
                                onChange={handleChange}
                                placeholder="Enter certificates issued"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddService}>
                        Add Service
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Service Modal */}
            {selectedService && (
                <Modal centered show={showViewModal} onHide={handleCloseViewModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>View Service</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Service Name:</strong> {selectedService.serviceName}</p>
                        <p><strong>Service Type:</strong> {selectedService.serviceType}</p>
                        <p><strong>Vehicle Type:</strong> {selectedService.vehicleType}</p>
                        <p><strong>Description:</strong> {selectedService.description}</p>
                        <p><strong>Price:</strong> {selectedService.price}</p>
                        <p><strong>Certificates Issued:</strong> {selectedService.certificatesIssued}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseViewModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Edit Service Modal */}
            {selectedService && (
                <Modal centered show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Service</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="editServiceName">
                                <Form.Label>Service Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="serviceName"
                                    value={formData.serviceName}
                                    onChange={handleChange}
                                    placeholder="Enter service name"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editServiceType">
                                <Form.Label>Service Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    placeholder="Enter service type"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editVehicleType">
                                <Form.Label>Vehicle Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    placeholder="Enter vehicle type"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter description"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="editCertificatesIssued">
                                <Form.Label>Certificates Issued</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="certificatesIssued"
                                    value={formData.certificatesIssued}
                                    onChange={handleChange}
                                    placeholder="Enter certificates issued"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleUpdateService}>
                            Update Service
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} bg={toastVariant} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Services;
