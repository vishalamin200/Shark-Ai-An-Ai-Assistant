import { addMessage, setServerMessage } from "@/redux/slices/chat.slice";
import { generateId } from "@/utils/generateId";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useDispatch } from "react-redux";

function SimulatedStreaming({ text = "Hey there!", chunkSize = 5, speed = 100 }) {
    const [displayText, setDisplayText] = useState("");
    const [hasDispatched, setHasDispatched] = useState(false);
    const dispatch = useDispatch();



    useEffect(() => {
        let index = 0;
        setHasDispatched(false); // Reset on new text

        const intervalId = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.slice(0, index + chunkSize));
                index += chunkSize;
            } else {
                if (!hasDispatched) { // ✅ Ensure dispatch happens only once
                    dispatch(setServerMessage(null))
                    setHasDispatched(true);
                    dispatch(addMessage({ id: generateId(), text, sender: "server" }));
                }
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId); // ✅ Cleanup
    }, [text, chunkSize, speed]);

    return (
        <div className="prose prose-invert prose-lg max-w-none text-lesswhite">
            <Markdown>{displayText}</Markdown>
        </div>
    );
}

export default SimulatedStreaming;
