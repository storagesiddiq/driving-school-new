import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Banner, getDefaultAvatar, getDefaultBanner, updateDefaultAvatar, updateDefaultBanner } from '../../slices/adminSlice';
import { Toast, ToastContainer } from 'react-bootstrap';

const DefaultImage = () => {

  const dispatch = useDispatch()
  const avatarImg = useSelector(Avatar)
  const bannerImg = useSelector(Banner)

  const [showToast, setShowToast] = useState({ show: false, message: '', variant: '' });

  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(avatarImg);
  const [banner, setBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(bannerImg);
  // Handle Avatar Change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  useEffect(()=>{
    dispatch(getDefaultAvatar())
    dispatch(getDefaultBanner())
  },[])

  // Handle Banner Change
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setPreviewBanner(URL.createObjectURL(file));
    }
  };

  // Handle Avatar Submit
  const handleAvatarSubmit = async () => {
    if (avatar) {
      const formData = new FormData();
      formData.append('defaultAvatar', avatar);
      try {
        await dispatch(updateDefaultAvatar(formData)).unwrap();
        setShowToast({ show: true, message: 'Avatar updated successfully!', variant: 'success' });
      } catch (error) {
        setShowToast({ show: true, message: 'Failed to update avatar.', variant: 'danger' });
      }
    }
  };

  // Handle Banner Submit
  const handleBannerSubmit = async () => {
    if (banner) {
      const formData = new FormData();
      formData.append('defaultBanner', banner);
      try {
        await dispatch(updateDefaultBanner(formData)).unwrap();
        setShowToast({ show: true, message: 'Banner updated successfully!', variant: 'success' });
      } catch (error) {
        setShowToast({ show: true, message: 'Failed to update banner.', variant: 'danger' });
      }
    }
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Set Default Avatar & Banner</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Avatar Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Default Avatar</h2>
          <div className="relative w-25 h-25 mx-auto mb-4">
            {previewAvatar ? (
              <img
                src={previewAvatar}
                alt="Avatar Preview"
                className="w-full h-full object-cover rounded-full border-2 border-gray-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center border-2 border-gray-300 rounded-full">
                <span className="text-gray-400">No Avatar</span>
              </div>
            )}
          </div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Avatar</label>
          <input
            type="file"
            onChange={handleAvatarChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />

          <div className="flex justify-center mt-4">
            <button
              onClick={handleAvatarSubmit}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Avatar
            </button>
          </div>
        </div>

        {/* Banner Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Default Banner</h2>
          <div className="relative w-full h-32 mx-auto mb-4">
            {previewBanner ? (
              <img
                src={previewBanner}
                alt="Banner Preview"
                className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center border-2 border-gray-300 rounded-lg">
                <span className="text-gray-400">No Banner</span>
              </div>
            )}
          </div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Banner</label>
          <input
            type="file"
            onChange={handleBannerChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />

          <div className="flex justify-center mt-4">
            <button
              onClick={handleBannerSubmit}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Banner
            </button>
          </div>
        </div>
      </div>
    
      <ToastContainer className="p-3" position="top-end">
        {showToast.show && (
          <Toast onClose={() => setShowToast({ ...showToast, show: false })} bg={showToast.variant} delay={3000} autohide>
            <Toast.Body style={{color:'white'}}>{showToast.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>

    </div>
  );
};

export default DefaultImage;
