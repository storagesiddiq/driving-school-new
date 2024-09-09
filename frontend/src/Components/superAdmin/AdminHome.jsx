import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminHome = () => {

    return (
        <div>
            <div className="flex flex-col lg:flex-row">
                <div className="hidden lg:block lg:w-1/5">
                    <Sidebar />
                </div>
                <div className="lg:mt-20 mt-16 w-full lg:w-4/5" style={{height:'80vh',overflowX:'auto'}}>
                    <div className="px-3">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
