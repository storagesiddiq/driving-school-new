import React from 'react';
import { FaProductHunt  } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearStatus, logoutUser } from '../../slices/authSlice';
import { MdDashboard } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { LuSchool } from "react-icons/lu";

const Sidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logoutUser());
        dispatch(clearStatus());
        navigate('/')
    };

    return (
        <div style={{height:'100vh'}} className=" bg-gray-800 text-white w-full lg:w-full h-full">
            <nav>
                <ul className="space-y-2 pt-20">
                    <li>
                        <Link to="/admin/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
                             <MdDashboard  className="mr-2"/> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/schools" className="flex items-center p-2 hover:bg-gray-700 rounded">
                            <LuSchool className="mr-2" /> Driving Schools
                        </Link>
                    </li>
                    <li className='bg-red-500'>
                        <button onClick={handleLogout} className="flex w-full items-center  p-2 hover:bg-red-800 rounded">
                            <FaProductHunt className="mr-2" /> LOGOUT
                        </button>
                    </li>

                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
