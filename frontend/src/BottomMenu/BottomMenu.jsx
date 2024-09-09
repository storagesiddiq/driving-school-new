import React from 'react'
import BottomMenuItems from './BottomMenuItems'
import { GoHomeFill } from "react-icons/go";
import './BottomMenu.css'
import { GoHome } from "react-icons/go";
import { useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { loginAuthUser, loginIsAuthenticated } from '../slices/authSlice';
import { RiSchoolLine, RiSchoolFill  } from "react-icons/ri";

const BottomMenu = () => {
    const LoginIsAuthenticated = useSelector(loginIsAuthenticated);
    const user = useSelector(loginAuthUser);

    return (
        <>
            {LoginIsAuthenticated &&

                <div className='lg:hidden'>
                    <div className='bottomMenu '>
                        <ul id='menu' className='p-0 px-2 m-0'>
                          {  (user?.role === "user") ?
                            <>
                                <BottomMenuItems link={'/'} icon={GoHome} iconActive={GoHomeFill} title="HOME" />
                                <BottomMenuItems link={'/profile-settings'} icon={FaRegUserCircle} iconActive={FaUserCircle} title="PROFILE" />
                            </>
                            : (user?.role === "admin") &&
                            <div className='w-full flex justify-between' style={{ overflow: 'auto', scrollbarWidth: 'none' }}>
                                <BottomMenuItems isAdmin={true} link={'/admin/dashboard'} icon={MdOutlineDashboard} iconActive={MdDashboard} title="DASHBOARD" />
                                <BottomMenuItems isAdmin={true} link={'/admin/schools'} icon={RiSchoolLine} iconActive={RiSchoolFill} title="SCHOOLS" />
                                <BottomMenuItems isAdmin={true} button={true} icon={IoIosLogOut} iconActive={IoLogOut} title="LOGOUT" />
                            </div>}
                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

export default BottomMenu