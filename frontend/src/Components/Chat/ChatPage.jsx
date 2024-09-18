import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChat, selectChat, selectChats, selectError, selectStatus } from '../../slices/chatSlice'
import { loginAuthUser } from '../../slices/authSlice'
import MobileHome from '../../skeletons/MobileHome'
import { getSenderName, getSenderAvatar } from '../../utils/getSender'
import {  setMobileSingleChat, setSelectedChat } from '../../slices/selectedChatSlice'
import ChatBox from './ChatBox'
import _ from 'lodash';
import SideDrawer from './SideDrawer'

const ChatPage = () => {
    const chatError = useSelector(selectError)
    const chatStatus = useSelector(selectStatus)
    const Chats = useSelector(selectChats)
    const dispatch = useDispatch()
    const user = useSelector(loginAuthUser)

    const selectedChat = useSelector((state) => state.selectedChat.selectedChat);
    const mobileSingleChat = useSelector((state) => state.selectedChat.mobileSingleChat);

    useEffect(() => {
        dispatch(fetchChat())
    }, [dispatch])


    const hanldeClick = (result) => {
        dispatch(setSelectedChat(result))
        dispatch(setMobileSingleChat(true))
    }

useEffect(() => {
    console.log('Selected chat updated:', selectedChat);
}, [selectedChat]);


    const listUsers = () => {
        return (
            <div style={{ overflowX: 'auto', height: 'calc(100vh - 150px)' }}>
                {chatError && <p>{chatError}</p> }
                {Chats.length > 0 && Chats.map((result, index) => (
                    <div
                        key={index}
                        onClick={() => hanldeClick(result)}
                        className={`${JSON.stringify(selectedChat) === JSON.stringify(result) ? 'bg-primary text-white' : 'bg-gray-100 text-black'} h-15 cursor-pointer flex items-center space-x-4 p-2 rounded-lg hover:bg-primary hover:text-white mb-3 transition-colors duration-200 ease-in-out`}
                    >
                        <img
                            src={getSenderAvatar(user, result.users)}
                            width={30}
                            height={30}
                            alt={`${getSenderName(user, result.users)}'s avatar`}
                            className="rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold">{getSenderName(user, result.users)}</span>
                            <span style={{fontSize:'12px'}} className="text-gray-700">{result?.latestMessage?.content || <p>&nbsp; </p> }</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex px-5 lg:flex-row lg:gap-3 w-full mt-20 lg:mt-20 " style={{ height: '83vh' }}>
           
            <div className={`${!mobileSingleChat ? '' : 'hidden'}  lg:block rounded-md  w-full lg:w-1/2 border border-primary`}>
                <div className='p-3 text-2xl text-gray-800'>MY CHATS</div>
               
                <div className='mt-2 mx-3 ' style={{ overflowX: 'auto', height: '100%' }}>
                    {chatStatus === "loading" ? (
                        Array.from({ length: 5 }, (_, index) => (
                            <MobileHome key={index} />
                        ))
                    ) : (
                        listUsers()
                    )}
                </div>
            </div>

            <div className={`${mobileSingleChat ? '' : 'hidden'}  rounded-md  lg:block border border-gray-700 w-full  lg:border-l-2 border-gray-300`}>
                <ChatBox />
            </div>
        </div>
    )
}

export default ChatPage