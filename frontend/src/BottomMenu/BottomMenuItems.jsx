import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearStatus, logoutUser } from '../slices/authSlice';

const BottomMenuItems = ({ button, link, icon: Icon, iconActive: IconActive, title, cart, isAdmin }) => {
  const { pathname } = useLocation();
  const isActive = pathname === link;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearStatus());
    navigate('/');
  };

  return button ? (
    <button
      onClick={handleLogout}
      className={`flex ${isAdmin ? 'mr-4' : ''} flex-col items-center`}
      style={{ textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
    >
      {isActive ? <IconActive fontSize="1.5rem" color="#F55F9E" /> : <Icon fontSize="1.5rem" />}
      <span style={{ fontSize: '8px', color: '#4c4F53', fontFamily: 'poppins' }}>{title}</span>
    </button>
  ) : (
    <Link
      to={link}
      style={{ textDecoration: 'none' }}
      className={`flex ${isAdmin ? 'mr-4' : ''} flex-col items-center`}
    >
      {isActive ? <IconActive fontSize="1.5rem" color="#F55F9E" /> : <Icon fontSize="1.5rem" />}
      <span style={{ fontSize: '10px', color: '#4c4F53', fontFamily: 'poppins' }}>{title}</span>
    </Link>
  );
};

export default React.memo(BottomMenuItems);
