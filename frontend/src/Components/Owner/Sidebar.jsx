import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearStatus } from '../../slices/authSlice';
import { LuSchool } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { RiGraduationCapFill } from "react-icons/ri";
import { FaCar } from "react-icons/fa";

const Sidebar = () => {
    const location = useLocation();
    const isDash = location.pathname === '/owner/dashboard'
    const isRegUsers = location.pathname === '/owner/registered-users'
    const isInst = location.pathname === '/owner/instructors'
    const isCourse = location.pathname === '/owner/courses'
    const isServ = location.pathname === '/owner/services'
    const isVeh = location.pathname === '/owner/vehicles'
    const isProfile = location.pathname === '/owner/profile'


    return (
        <div style={{height:'100vh'}} className=" bg-gray-800 text-white w-full lg:w-full h-full">
            <nav>
                <ul className="space-y-2 pt-20">
                    <li>
                        <Link to="/owner/dashboard" className={`${isDash && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                             <LuSchool  className="mr-2"/> My School
                        </Link>
                    </li>
                    <li>
                        <Link to="/owner/registered-users" className={`${isRegUsers && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                             <FaRegUserCircle  className="mr-2"/> Registered Users
                        </Link>
                    </li>
                 
                    <li>
                        <Link to="/owner/instructors" className={`${isInst && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                             <FaRegUserCircle  className="mr-2"/> Instructors
                        </Link>
                    </li>
                    <li>
                        <Link to="/owner/courses" className={`${isCourse && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                             <RiGraduationCapFill  className="mr-2"/> Courses
                        </Link>
                    </li>
                    <li>
                        <Link to="/owner/services" className={`${isServ && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                             <MdOutlineMiscellaneousServices  className="mr-2"/> Services
                        </Link>
                    </li>
                    <li>
                        <Link to="/owner/vehicles" className={`${isVeh && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                             <FaCar  className="mr-2"/> Vehicles
                        </Link>
                    </li>
                    <li>
                        <Link to="/owner/profile" className={`${isProfile && 'bg-gray-700'} flex items-center p-2 hover:bg-gray-700 rounded`}>
                             <FaRegUserCircle  className="mr-2"/> Profile
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
