import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearStatus, logoutUser } from '../../slices/authSlice';
import { IoLogOut } from "react-icons/io5";
import { LuSchool } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";

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
                        <Link to="/owner/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
                             <LuSchool  className="mr-2"/> My School
                        </Link>
                    </li>
                    <li>
                        <Link to="/owner/profile" className="flex items-center p-2 hover:bg-gray-700 rounded">
                             <FaRegUserCircle  className="mr-2"/> Profile
                        </Link>
                    </li>
                    <li>
                        <Link to="/owner/instructors" className="flex items-center p-2 hover:bg-gray-700 rounded">
                             <FaRegUserCircle  className="mr-2"/> Instructors
                        </Link>
                    </li>
                    <li>
                        <Link to="/owner/courses" className="flex items-center p-2 hover:bg-gray-700 rounded">
                             <FaRegUserCircle  className="mr-2"/> Courses
                        </Link>
                    </li>
                    <li className='bg-red-500'>
                        <button onClick={handleLogout} className="flex w-full items-center  p-2 hover:bg-red-800 rounded">
                            <IoLogOut className="mr-2" /> LOGOUT
                        </button>
                    </li>

                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
