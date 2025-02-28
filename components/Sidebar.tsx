'use client';

import { createNewChat, setCurrentChat, setHoveredSidebarChat } from '@/redux/slices/chat.slice';
import { AppDispatch, RootState } from '@/redux/store';
import { useInfiniteQuery } from '@tanstack/react-query';
import {  Ellipsis, SidebarClose, SidebarOpen, SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { queryClient } from './AuthProvider';

const fetchChats = async ({ pageParam = 1, userId, limit }: { pageParam: number, userId: string, limit: number }) => {

    const response = await fetch(`http://localhost:3000/api/chat?userId=${userId}&page=${pageParam}&limit=${limit}`);

    if (response.ok) {
        const data = await response.json();

        return data;
    } else {
        throw new Error('Error in Fetching chats');
    }
};

const fetchChat = async (chatId: string) => {
    const response = await fetch(`http://localhost:3000/api/chat/fetch_chat?chatId=${chatId}`)
    const data = await response.json()
    return data
}

function Sidebar() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const { currentChat, userId, editingChatTitle, hoveredSidebarChat } = useSelector((state: RootState) => state.chat);

    const dispatch: AppDispatch = useDispatch();

    const handleCreateNewChat = () => {
        if (currentChat && currentChat?.messages && currentChat?.messages?.length > 0 && userId) {
            dispatch(createNewChat({ userId }));
        }
    };

    const handleChatFetch = async (chatId: string) => {
        if (chatId) {
            const data = await fetchChat(chatId)
            if (data.error) {
                return
            }
            const { chat } = data
            if (chat) {
                dispatch(setCurrentChat(chat))
            }
        }
    }

    const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['chats', userId],
        queryFn: ({ pageParam }) => fetchChats({ pageParam, userId: userId as string, limit: 15 }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.hasMore ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1
    });


    const chats = data?.pages.flatMap(page => page.chats) || [];


    useEffect(() => {
        if (currentChat?.title && userId) {
            queryClient.invalidateQueries({ queryKey: ['chats', userId] });
        }
    }, [currentChat?.title, userId]);



    return (
        <div className={`${isSidebarOpen ? 'w-[16rem]' : 'w-[5rem]'} h-full transition-all duration-500 ease-in-out bg-secondary`}>
            {isSidebarOpen ? (
                <div className="w-full h-full flex flex-col items-center">
                    <div className="flex gap-x-8 justify-between mt-5 w-full px-5">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                            <SidebarClose size={28} />
                        </button>
                        <button onClick={handleCreateNewChat}>
                            <SquarePen size={28} />
                        </button>
                    </div>

                    {isLoading ? (
                        <p>Loading chats...</p>
                    ) : (
                        <div id="scrollableDiv" className="older-chats flex flex-col gap-y-20 items-center text-lesswhite overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600 h-[80vh] my-10 pb-10 w-full ">
                            <InfiniteScroll
                                dataLength={chats?.length || 0}
                                next={fetchNextPage}
                                hasMore={!!hasNextPage}
                                loader={<p>Loading more...</p>}
                                scrollableTarget="scrollableDiv"
                                className='flex flex-col gap-y-2'
                            >
                                {chats?.map(chat => (
                                    <div
                                        
                                        onMouseEnter={() => dispatch(setHoveredSidebarChat(chat._id))}
                                        onMouseLeave={() =>dispatch(setHoveredSidebarChat(null))}
                                        key={chat?._id}
                                        className="text-md flex flex-nowrap justify-between items-center hover:bg-primary bg-secondary rounded-lg cursor-pointer px-2  mx-4 relative ">

                                        <input
                                            onClick={() => handleChatFetch(chat?._id)}
                                            readOnly={!editingChatTitle}
                                            type="text"
                                            value={chat?.title}
                                            className="outline-none  border-none bg-transparent  py-2  cursor-pointer mr-5 pl-2"
                                        />
                                        <div className="absolute right-5   w-5 h-4 bg-gradient-to-l from-secondary/15 via-secondary/70 to-transparent pointer-events-none"></div>
                                        {hoveredSidebarChat == chat._id && (<div className='absolute right-2'>  
                                            <Ellipsis size={18} className=' h-full' />

                                        </div>)}

                                    </div>
                                ))}
                            </InfiniteScroll>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center">
                    <div className="flex flex-col gap-y-8 items-center mt-5">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                            <SidebarOpen size={28} />
                        </button>
                        <button onClick={handleCreateNewChat}>
                            <SquarePen size={28} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
