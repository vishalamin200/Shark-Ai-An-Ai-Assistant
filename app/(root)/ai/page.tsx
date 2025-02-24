'use client'
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";

function SimulatedStreaming({ text = "Hey there!", chunkSize = 5, speed = 100 }) {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let index = 0;

        const intervalId = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.slice(0, index + chunkSize)); // Update with full progress
                index += chunkSize;
            } else {
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
