'use client'

import { add_new_message, addMessage, setServerMessage } from "@/redux/slices/chat.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { generateId } from "@/utils/generateId";

import React, { useCallback, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";

function SimulatedStreaming({ text="", chunkSize = 5, speed = 100 }) {
    const [displayText, setDisplayText] = useState("");
    const [hasDispatched, setHasDispatched] = useState(false);
    
    const dispatch:AppDispatch = useDispatch();

    const { currentChat, userId } = useSelector((state: RootState) => state.chat)

    const addServerMessage = useCallback( async ()=>{
        
        const server_new_msg = {
            userId: userId as string,
            chatId: currentChat?._id as string,
            text,
            sender: 'server'
        }
        await dispatch(add_new_message(server_new_msg))
    },[text,dispatch,currentChat,userId])


    useEffect(() => {
        let index = 0;
        setHasDispatched(false); // Reset on new text

        const intervalId = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.slice(0, index + chunkSize));
                index += chunkSize;
            } else {
                if (!hasDispatched) { 
                    dispatch(setServerMessage(null))
                    setHasDispatched(true);
                    dispatch(addMessage({ _id: generateId(), text, sender: "server" }));
                    if(userId){
                        addServerMessage()
                    }    
                }
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId); 
    }, [text, chunkSize, speed]);

    return (
        <div className="prose prose-invert prose-lg max-w-none text-lesswhite">
            <Markdown>{displayText}</Markdown>
        </div>
    );
}

export default SimulatedStreaming;
