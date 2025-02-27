'use client'

import { createNewChat, currentChatProps, setUserId } from '@/redux/slices/chat.slice'
import { AppDispatch, RootState } from '@/redux/store'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'


function AuthHandler() {

  const { data: session, status } = useSession()

  const { currentChat } :{currentChat:currentChatProps | null} = useSelector((state : RootState) => state.chat)
  const dispatch: AppDispatch = useDispatch()

  const handleCreateChat = async () => {
    if ((session && (!currentChat || currentChat.messages?.length == 0))) {
      await dispatch(createNewChat({ userId: session?.user.userId as string }))

    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      handleCreateChat()
      dispatch(setUserId(session.user.userId?.toString()))
    }
  }, [status])

  return null

}

export default AuthHandler
