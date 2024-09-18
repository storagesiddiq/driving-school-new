import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { fetchMatchedUsers, getMatchedUsers, loginAuthStatus } from '../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import MobileHome from '../../skeletons/MobileHome'
import { accessChat, fetchChat, selectChat } from '../../slices/chatSlice';
import { setMobileSingleChat, setSelectedChat, toggleIsOpen } from '../../slices/selectedChatSlice';

const SideDrawer = () => {
    const [search, setSearch] = useState(null);
    const Chat = useSelector(selectChat)
    const isOpen =  useSelector((state) => state.selectedChat.isOpen);

    const dispatch = useDispatch()
    const allUsers = useSelector(getMatchedUsers);
    const Status = useSelector(loginAuthStatus)


    const handleAccessChat = (userId) => {
        dispatch(accessChat({ userId }))
            .then(() => {
                return dispatch(fetchChat());  // Fetch chats after accessing chat
            })
            .catch(error => {
                console.error("Error accessing chat:", error);
            });
    };
    
    // useEffect to handle updating selectedChat when Chat changes
    useEffect(() => {
        if (Chat) {
            dispatch(toggleIsOpen())
            dispatch(setMobileSingleChat(true));
            dispatch(setSelectedChat(Chat));
        }
    }, [Chat, dispatch]);  
    

    useEffect(() => {
        if(search || isOpen){
        dispatch(fetchMatchedUsers({ keyword: search }))
    }
    }, [dispatch,search,isOpen])

    console.log(allUsers);
    
    return (
        <>
            {/* Button to toggle the drawer */}
            <button
                className="bg-gray-100 mx-4 border bg-primary text-white flex items-center gap-2  px-2 py-2 rounded-circle z-50"
                onClick={()=>dispatch(toggleIsOpen())}>
                <FaSearch />
            </button>

            {/* Off-canvas drawer */}
            <div
                className={`shadow-down fixed top-0 left-0 h-full bg-gray-100 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }   lg:w-1/3 w-full`}
                style={{ height: '100vh' }}
            >
                <div className="p-4">
                    {/* Close button */}
                    <div className='flex items-center  justify-between'>
                        <h1 className='font-bold'>Search Users</h1>

                        <button
                            className=" mb-4 bg-gray-300 p-2 rounded-lg"
                            onClick={()=>dispatch(toggleIsOpen())}
                        >
                            <IoMdClose size={20} />
                        </button>
                    </div>
                    {/* Search input */}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 mb-4 bg-gray-200 border-black border  rounded-lg"
                    />
                    <div className='mt-2' style={{ overflowX: 'auto', height: 'calc(100vh - 150px)' }}>
                        {Status === "loading" ? (
                            Array.from({ length: 5 }, (_, index) => (
                                <MobileHome key={index} />
                            ))
                        ) : (
                            allUsers.length > 0 && allUsers.map((result, index) => (
                                <div key={index} onClick={() => handleAccessChat(result._id)} className="cursor-pointer flex items-center space-x-4 p-2  rounded-lg  hover:bg-gray-300 bg-gray-100 transition-colors duration-200 ease-in-out">
                                    <img
                                        src={result?.avatar}
                                        width={50}
                                        height={50}
                                        alt={`${result.name}'s avatar`}
                                        className="rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{result.name}</span>
                                        <span className="font-semibold">{result.email}</span>

                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </>
    );
};

export default SideDrawer;
