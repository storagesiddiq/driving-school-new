import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, editUser, isUpdated, loadUser, loginAuthError, loginAuthStatus, loginAuthUser } from '../slices/authSlice';
import { Button, Form, Spinner, Alert } from 'react-bootstrap'; 
import { Edit } from 'react-feather';

const Profile = () => {
    const dispatch = useDispatch();
    
    // Redux state
    const user = useSelector(loginAuthUser);
    const IsUpdated = useSelector(isUpdated);
    const loginError = useSelector(loginAuthError);
    const status = useSelector(loginAuthStatus);
    
    // Local state
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '/default-avatar.png');
    const [isEditing, setIsEditing] = useState({ name: false, email: false, avatar: false });
    const [updatedUser, setUpdatedUser] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [error, setError] = useState(null);

    // Load user on component mount
    useEffect(() => {
        if (loginError) {
            setError(loginError);
            dispatch(clearError());
        }
    }, [dispatch, loginError]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser({ ...updatedUser, [name]: value });
    };

    // Handle avatar change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle submit to update profile
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', updatedUser.name);
        formData.append('email', updatedUser.email);
        if (avatar) formData.append('avatar', avatar);
        dispatch(editUser(formData));
    };

    // Loading and error handling
    if (status === 'loading') {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (loginError) {
        return <Alert variant="danger">{loginError}</Alert>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Profile Settings</h1>
            <form onSubmit={handleSubmit}>
                {/* Avatar Section */}
                <div className="flex items-center space-x-4 mb-6">
                    <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-20 h-20 rounded-full border border-gray-200"
                    />
                    {isEditing.avatar ? (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control mb-2"
                                onChange={handleAvatarChange}
                            />
                            <Button type="submit" variant="primary">Update Avatar</Button>
                        </div>
                    ) : (
                        <Edit
                            className="w-6 h-6 text-gray-500 cursor-pointer"
                            onClick={() => setIsEditing({ ...isEditing, avatar: true })}
                        />
                    )}
                </div>

                {/* Name Section */}
                <div className="mb-6">
                    <label className="block font-semibold mb-1">Name</label>
                    {isEditing.name ? (
                        <div className="flex items-center space-x-4">
                            <Form.Control
                                type="text"
                                name="name"
                                value={updatedUser.name}
                                onChange={handleInputChange}
                                className="mb-2"
                            />
                            <Button type="submit" variant="primary">Update</Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <p className="text-gray-800">{user?.name}</p>
                            <Edit
                                className="w-6 h-6 text-gray-500 cursor-pointer"
                                onClick={() => setIsEditing({ ...isEditing, name: true })}
                            />
                        </div>
                    )}
                </div>

                {/* Email Section */}
                <div className="mb-6">
                    <label className="block font-semibold mb-1">Email</label>
                    {isEditing.email ? (
                        <div className="flex items-center space-x-4">
                            <Form.Control
                                type="email"
                                name="email"
                                value={updatedUser.email}
                                onChange={handleInputChange}
                                className="mb-2"
                            />
                            <Button type="submit" variant="primary">Update</Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <p className="text-gray-800">{user?.email}</p>
                            <Edit
                                className="w-6 h-6 text-gray-500 cursor-pointer"
                                onClick={() => setIsEditing({ ...isEditing, email: true })}
                            />
                        </div>
                    )}
                </div>

                {/* Success and Error Messages */}
                {error && <Alert variant="danger">{error}</Alert>}
                {status === 'loading' && <p className="text-blue-500">Updating...</p>}
                {IsUpdated && <Alert variant="success">Profile Updated Successfully</Alert>}
            </form>
        </div>
    );
};

export default Profile;
