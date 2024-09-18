import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, editUser, isUpdated, loginAuthError, loginAuthStatus, loginAuthUser } from '../slices/authSlice';
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mt-5 font-bold mb-6 text-blue-800">Profile Settings</h1>
      
      <form onSubmit={handleSubmit} className="bg-white border shadow-md rounded-lg p-6 max-w-lg mx-auto space-y-6">
        
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full border border-gray-300  shadow-lg"
          />
          {isEditing.avatar ? (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                onChange={handleAvatarChange}
              />
              <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500">
                Update Avatar
              </button>
            </div>
          ) : (
            <Edit
              className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-500"
              onClick={() => setIsEditing({ ...isEditing, avatar: true })}
            />
          )}
        </div>

        {/* Name Section */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Name</label>
          {isEditing.name ? (
            <div className="flex items-center space-x-4">
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleInputChange}
                className="p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500">
                Update
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-800">{user?.name}</p>
              <Edit
                className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-500"
                onClick={() => setIsEditing({ ...isEditing, name: true })}
              />
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">Email</label>
          {isEditing.email ? (
            <div className="flex items-center space-x-4">
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                className="p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500">
                Update
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-800">{user?.email}</p>
              <Edit
                className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-500"
                onClick={() => setIsEditing({ ...isEditing, email: true })}
              />
            </div>
          )}
        </div>

        {/* Success and Error Messages */}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {status === 'loading' && <p className="text-blue-500">Updating...</p>}
        {IsUpdated && <div className="text-green-600 text-sm">Profile Updated Successfully</div>}
      </form>
    </div>
  );
};

export default Profile;
