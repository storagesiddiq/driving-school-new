import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearStatus, logoutUser } from '../../slices/authSlice';
import { MdDashboard } from "react-icons/md";
import { LuSchool } from "react-icons/lu";
import { CiImageOn } from "react-icons/ci";

const Sidebar = () => {

    const location = useLocation();
    const isDash = location.pathname === '/admin/dashboard'
    const isSchool = location.pathname === '/admin/schools'
    const isImage = location.pathname === '/admin/default-images'

    return (
        <div style={{height:'100vh'}} className=" bg-gray-800 text-white w-full lg:w-full h-full">
            <nav>
                <ul className="space-y-2 pt-20">
                    <li>
                        <Link to="/admin/dashboard" className={`${isDash && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                             <MdDashboard  className="mr-2"/> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/schools" className={`${isSchool && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                            <LuSchool className="mr-2" /> Driving Schools
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/default-images" className={`${isImage && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                            <CiImageOn className="mr-2" /> Default Images
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
