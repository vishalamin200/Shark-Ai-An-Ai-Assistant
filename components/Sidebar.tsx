'use client';

import { createNewChat } from '@/redux/slices/chat.slice';
import { AppDispatch, RootState } from '@/redux/store';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SidebarClose, SidebarOpen, SquarePen } from 'lucide-react';
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

function Sidebar() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { currentChat, userId } = useSelector((state: RootState) => state.chat);

    const dispatch: AppDispatch = useDispatch();

    const handleCreateNewChat = () => {
        if (currentChat && currentChat?.messages && currentChat?.messages?.length > 0 && userId) {
            dispatch(createNewChat({ userId }));
        }
    };

    const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['chats', userId],
        queryFn: ({ pageParam }) => fetchChats({ pageParam, userId: userId as string, limit: 15 }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage?.hasMore ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1
    });

    useEffect(() => {
        if (currentChat?.title && userId) {
            queryClient.invalidateQueries({ queryKey: ['chats', userId] });
        }
    }, [currentChat?.title, userId]);

    const chats = data?.pages.flatMap(page => page.chats) || [];

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
                            <div id="scrollableDiv" className="older-chats flex flex-col gap-y-20 items-center text-lesswhite overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600 h-[80vh] my-10 pb-10 w-full">
                            <InfiniteScroll
                                dataLength={chats.length || 0}
                                next={fetchNextPage}
                                hasMore={!!hasNextPage}
                                loader={<p>Loading more...</p>}
                                scrollableTarget="scrollableDiv"
                                className='flex flex-col gap-y-6'
                            >
                                {chats.map(chat => (
                                    <div key={chat?._id} className="text-md">
                                        <input type="text" defaultValue={chat?.title} className="outline-none border-none bg-secondary" />
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
