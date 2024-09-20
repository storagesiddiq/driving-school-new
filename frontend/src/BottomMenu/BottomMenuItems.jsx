import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const BottomMenuItems = ({  link, icon: Icon, iconActive: IconActive, title, cart, isAdmin }) => {
  const { pathname } = useLocation();
  const isActive = pathname === link;


  return (
    <Link
      to={link}
      style={{ textDecoration: 'none' }}
      className={`flex ${isAdmin ? 'mr-4' : ''} flex-col items-center`}
    >
      {isActive ? <IconActive fontSize="1.5rem" color="#4A1164" /> : <Icon fontSize="1.5rem" />}
      <span style={{ fontSize: '10px', color: '#4c4F53', fontFamily: 'poppins' }}>{title}</span>
    </Link>
  );
};

export default React.memo(BottomMenuItems);
