'use client'

import dynamic from 'next/dynamic';
import  { LottieRefCurrentProps } from 'lottie-react';
import React, { useEffect, useRef } from 'react'
import chatLoadingAnimation from '@/public/animations/chat-loading-animation.json'

const Lottie = dynamic(()=>import('lottie-react'),{ssr:false})

function ChatLoader() {
    const lottieRef = useRef<LottieRefCurrentProps | null>(null)

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(2); 
        }
    }, []);
  return (
      <Lottie lottieRef={lottieRef} animationData={chatLoadingAnimation} loop={true} className='brightness-200 w-6 h-6' />
  )
}

export default ChatLoader
