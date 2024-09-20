import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from "react-icons/io";
import { getAllDetails, getSenderAvatar, getSenderName } from '../../utils/getSender';
import {  loginAuthUser } from '../../slices/authSlice';
import chatHome from '../../assets/chatHome.png';
import { allMessages, Message, Error, Messages, sendMessage, AllMesStatus, clearMessage } from '../../slices/messageSlice';
import ChatSkeleton from '../../skeletons/ChatSkeleton';
import { setMobileSingleChat, setNotification } from '../../slices/selectedChatSlice';
import { useNavigate } from 'react-router-dom';
const backend_url = import.meta.env.VITE_CHAT;
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../../utils/typingAnimation.json'
import { fetchChat } from '../../slices/chatSlice';
const ENDPOINT = backend_url
var socket, selectedChatCompare;

const ChatBox = () => {
    const selectedChat = useSelector((state) => state.selectedChat.selectedChat);
    const notification = useSelector((state) => state.selectedChat.notification);

    const user = useSelector(loginAuthUser);
    const dispatch = useDispatch();
    const status = useSelector(AllMesStatus);
    const error = useSelector(Error);
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const [messages, setMessages] = useState([]);
    // const sendedMessage = useSelector(Message);
    const [newMessage, setNewMessage] = useState('');
    const AllMessages = useSelector(Messages);

    const navigate = useNavigate()

    const handleBack = () => {
        dispatch(setMobileSingleChat(false))
    };

    //react - lottie
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    const handleMessage = async (e) => {
        e.preventDefault();
        if (socket && selectedChat?._id) {
            socket.emit('stop typing', selectedChat._id);
        }

        if (newMessage  && selectedChat?._id) {
            try {
                const response = await dispatch(sendMessage({ chatId: selectedChat?._id, content: newMessage })).unwrap();

                // response will contain the message sent from the server
                const newMessageFromResponse = response.message;

                setMessages(prevMessages => [...prevMessages, newMessageFromResponse]);
                setNewMessage('');
                if (socket && selectedChat?._id) {
                socket.emit('newMessage', newMessageFromResponse)
                }
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };


    const onChangeHandler = (e) => {
        setNewMessage(e.target.value)

        //Typing indicator login
        if (!socketConnected) return
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    // Socket.io connection
    useEffect(() => {
        if (user && user._id) {
            socket = io(ENDPOINT);
            socket.emit("setup", user);
            socket.on('connection', () => setSocketConnected(true));
            socket.on('typing', () => setIsTyping(true))
            socket.on('stop typing', () => setIsTyping(false))

            // Clean up the event listeners when the component unmounts
            return () => {
                socket.off('typing');
                socket.off('stop typing');
                socket.off('message received');
            };
        }
    }, []);

    

    useEffect(() => {
        if (socket) {
            const handleMessageReceived = (newMessageReceived) => {
                if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                    // Give notification
                    if (!notification.includes(newMessageReceived)) {
                        dispatch(setNotification([newMessageReceived, ...notification]));
                        dispatch(fetchChat());
                    }
                } else {
                    // Correctly update the messages state
                    setMessages(prevMessages => [...prevMessages, newMessageReceived]);
                }
            };
    
            socket.on('message received', handleMessageReceived);
    
            // Clean up the event listener when the component unmounts or when socket changes
            return () => {
                socket.off('message received', handleMessageReceived);
            };
        }
    }, [socket, selectedChatCompare, notification, dispatch]);
    
    // Fetch all messages for the selected chat
    // Set the messages once fetched
    useEffect(() => {
        if (selectedChat) {
            // Fetch all messages for the selected chat
            dispatch(allMessages({ chatId: selectedChat?._id }))
                .unwrap()
                .then((fetchedMessages) => {
                    // Set the messages once fetched
                    setMessages(fetchedMessages);
                    // Join the chat room after setting messages
                    if (socket) {
                        socket.emit('join chat', selectedChat._id);
                    } else {
                        console.error('Socket is not initialized');
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch messages:', error);
                });

            selectedChatCompare = selectedChat;
        }
    }, [dispatch, selectedChat]);


    const showUser = () => {
        const getUser = getAllDetails(user, selectedChat?.users)
        navigate(`/profile/${getUser._id}`)
    }

    const chatContainerRef = useRef(null);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    console.log(notification);
    
    return (
        <>
            {selectedChat ? (
                <div className='flex flex-col h-full bg-gray-100'>
                    <div onClick={showUser} className='bg-white border rounded-lg cursor-pointer border-b-gray items-center p-2 flex m-2'>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            handleBack();
                        }} className='items-center flex justify-center bg-gray-200 w-7 h-7 rounded-full lg:hidden'>
                            <IoMdArrowRoundBack size={20} />
                        </button>
                        <img width={40} height={40} className='ml-3 lg:ml-0 rounded-full' src={getSenderAvatar(user, selectedChat?.users)} alt="" />
                        <div className='flex flex-col pl-3'>
                            <h3>{getSenderName(user, selectedChat?.users)}</h3>
                        </div>
                    </div>

                    <div ref={chatContainerRef} className="sticky bottom-0 mb-4 lg:mb-0 pb-20 hide-scrollbar overflow-y-auto" style={{ height: '100vh' }}>
                        {status === "loading" && <ChatSkeleton />}
                        {error && <p className='text-red-500'>{error}</p>}

                        {status === "succeeded" && messages &&
                            messages.map(msg => (
                                <p className={`px-3 my-2 flex ${msg.sender?._id === user._id ? ' justify-end' : 'justify-start'}`} key={msg._id}>
                                    <span className={`${msg.sender?._id === user._id ? 'bg-primary-dark' : 'bg-primary-light'} text-white font-semibold px-3 py-1 rounded-lg`}>{msg?.content}</span>
                                </p>
                            ))}
                        {isTyping ? <div className='mb-10'>
                            <Lottie width={70} options={defaultOptions} style={{ marginBottom: 15, marginLeft: 0 }} />
                        </div> : ""}

                    </div>
                    <div className='w-full lg:px-3'>

                        <form onSubmit={handleMessage} className='px-7 lg:px-0 fixed bottom-14 left-0 w-full px-2 py-2 lg:sticky lg:bottom-0 lg:px-0 lg:py-4'>

                            <input
                                value={newMessage || ''}
                                onChange={onChangeHandler}
                                type="text"
                                placeholder='Message'
                                className='md:shadow-down border border-gray-300 px-4 py-3 w-full rounded-full outline-none focus:ring-0'
                            />
                        </form>
                    </div>
                </div>
            ) : (
                <div className='flex h-screen flex-col items-center justify-center'>
                    <img src={chatHome} width={250} height={250} alt="" />
                    <p className='text-2xl text-gray-700'>Start Chatting with your Partner</p>
                </div>
            )}
        </>
    );
};

export default ChatBox;
