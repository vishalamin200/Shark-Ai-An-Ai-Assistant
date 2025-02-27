'use client'
import { generateId } from '@/utils/generateId'

import LanguageBar from '@/components/LanguageBar'
import LoadingAnimation from '@/components/LoadingAnimation'
import LoginButton from '@/components/LoginButton'
import SimulatedStreaming from '@/components/SimulatedStreaming'
import sentMsgImage from '@/public/icons/arrow-up-solid.svg'
import attachmentIcon from '@/public/icons/attach-icon-white.png'
import deepseekLogo from '@/public/icons/shark_without_bg.webp'
import { add_new_message, addMessage, copyMessage, sendMessage, set_title, setHoveredMessage, setIsEditing, setLanguage, setPrompt, toggleScrollUp } from '@/redux/slices/chat.slice'
import { AppDispatch, RootState } from '@/redux/store'
import { Check, Copy, PenLine } from 'lucide-react'
import Image from "next/image"
import { FormEvent, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '@/components/Sidebar'


const Home = () => {

  const { prompt, language,  hoveredMessage, isEditing, copied, loading, serverMessage, scrollup, currentChat, userId } = useSelector((state: RootState) => state.chat)

  const dispatch = useDispatch<AppDispatch>()

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const editTextRef = useRef<HTMLTextAreaElement | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)


  const handleKeyDown = (e: React.KeyboardEvent | FormEvent) => {
    if ((e as React.KeyboardEvent).key === 'Enter') {
      if ((e as React.KeyboardEvent).shiftKey) {
        e.preventDefault()
        dispatch(setPrompt(prompt + '\n'))

      } else {
        e.preventDefault()
        handleSubmit(e as React.FormEvent<HTMLFormElement>)
      }
    }
  }
  useEffect(() => {
    const textarea = textareaRef.current

    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 180) + "px"
    }

    const editTextarea = editTextRef.current
    if (editTextarea) {
      editTextarea.style.height = "auto"
      editTextarea.style.height = Math.min(editTextarea.scrollHeight, 180) + "px"
    }

  }, [prompt, isEditing])


  useEffect(() => {
    const chatSection = chatRef.current

    if (chatSection) {

      chatSection.scrollTo({
        top: chatSection.scrollHeight,
        behavior: 'smooth'
      })
    } else {
      return
    }
  }, [scrollup])
  { console.log("userId =", userId) }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prompt?.trim() || loading) {
      return
    }

    const userMessage = {
      '_id': generateId(),
      'text': prompt?.trim(),
      "sender": 'user'
    }

    dispatch(toggleScrollUp())
    dispatch(addMessage(userMessage))

    if ((!currentChat?.messages || currentChat.messages?.length == 0) && currentChat?._id){
        dispatch(set_title({chatId:currentChat._id.toString(),text:prompt}))
    }

    const user_new_msg = {
      userId: userId as string,
      chatId: currentChat?._id as string,
      'text': prompt?.trim(),
      "sender": 'user'
    }

    try {
      const promptData = {
        prompt: prompt as string,
        language: language as string
      }

      await dispatch(sendMessage(promptData))
      if(userId){
        await dispatch(add_new_message(user_new_msg))
      }
      

    } catch (error) {
      console.log("Error in generating Response", (error as Error).message)
    }
  }
  return (
    <div className='flex  w-screen h-screen overflow-hidden'>

      <div className="sidebar h-full   z-50 bg-white">
          <Sidebar/>
      </div>

      <div className={`h-full relative right-side w-full flex flex-col  items-center justify-center bg-primary `}>


        <div className="header w-full flex items-center justify-between  absolute top-0  min-h-[8vh] z-50 bg-primary px-6">

          <LanguageBar />


          {(currentChat?.messages && currentChat?.messages?.length > 0) &&
            <input
              readOnly
              type="text"
              name="title"
              value={currentChat?.title}
              id="title"
              className="chat-title-input outline-none w-1/4 h-8 rounded-3xl  text-lg text-lesswhite bg-transparent hover:border hover:border-white text-center"
            />
          }
          <LoginButton />
        </div>
    
        <div ref={chatRef} className={`w-full ${(currentChat?.messages && currentChat?.messages?.length > 0) ? 'h-full' : ""} overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-400 overflow-x-hidden flex justify-center mt-[8vh]`}>
    
          {(!currentChat?.messages || currentChat?.messages?.length === 0) ? "" :
            <div className='w-7/12  h-fit  pb-[15rem]'>
             
              {currentChat?.messages?.map((msg) =>
                 
                <div key={msg?._id} className='w-full'>
                  {msg?.sender === 'user' ?
                     
                    <div
                      className='w-full flex justify-end mr-5 '
                      onMouseEnter={() => dispatch(setHoveredMessage(msg?._id))}
                      onMouseLeave={() => dispatch(setHoveredMessage(null))}
                    >
                     
                      {isEditing?.id === msg?._id ?
                        <div className='w-[90%] my-2'>
                          <div className="message-box bg-[#4f4f4f] w-full h-fit  rounded-3xl py-4 px-4">

                            <textarea
                              ref={editTextRef}
                              onChange={(e) => dispatch(setIsEditing({ id: msg?._id, text: e.target.value }))}
                              value={isEditing?.text as string}
                              rows={2}
                              name="edit-text"
                              id="edit-text"
                              className="w-full h-[68%] bg-transparent outline-none resize-none text-lesswhite scrollbar-track-transparent scrollbar-thin scrollbar-thumb-zinc-400"
                            />

                            <div className="sent-msg flex items-center justify-between ">

                              <select name="language" id="language" className="outline-none border border-white my-1 p-1 rounded-3xl bg-chat text-lesswhite text-center">
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                                <option value="gujarati">Gujarati</option>
                                <option value="telugu">Telugu</option>
                                <option value="tamil">Tamil</option>
                                <option value="malayalam">Malayalam</option>
                                <option value="filipino">Tagalog</option>
                                <option value="indonesian">Indonesian</option>
                              </select>


                              <div className="flex items-center gap-x-4">

                                <div onClick={() => dispatch(setIsEditing({ id: "", text: "" }))} className="w-20 h-8 rounded-xl flex items-center justify-center p-2 bg-[#2F2F2F] hover:bg-opacity-70 cursor-pointer">
                                  Cancel
                                </div>

                                <button className={`sent-msg cursor-pointer rounded-full h-8 w-8 p-2 flex items-center justify-center border border-white bg-white  ${isEditing?.text?.length == 0 ? 'opacity-50' : "hover:opacity-80"}`}>
                                  <Image src={sentMsgImage} alt="upside-arrow" height={24} className="" />
                                </button>
                              </div>

                            </div>
                          </div>
                        </div>

                        : <div className="py-3 px-4 my-2 h-fit max-w-[90%]  w-fit rounded-3xl bg-chat relative">
                          {msg?.text}
                          {
                            hoveredMessage === msg?._id ?
                              <div className="absolute -left-24 top-0 mt-2 flex gap-x-2 items-center ">

                                {copied === msg?._id ?
                                  <div className="h-9 w-9 rounded-xl justify-center items-center flex bg-[#5d5d77] bg-opacity-0 hover:bg-opacity-25 transition-opacity duration-500 ease-in-out">
                                    <Check
                                      size={20}
                                      color='#c4c7d1'
                                      className='cursor-pointer '

                                    />
                                  </div>

                                  :
                                  <div className="h-9 w-9 rounded-xl justify-center items-center flex bg-[#5d5d77] bg-opacity-0 hover:bg-opacity-25 transition-opacity duration-500 ease-in-out">
                                    <Copy
                                      onClick={() => dispatch(copyMessage({ id: msg?._id as string, text: msg?.text as string }))}
                                      size={20}
                                      color='#c4c7d1'
                                      className='cursor-pointer'
                                    />
                                  </div>

                                }
                                {

                                  isEditing.id !== msg?._id ? <div className="h-9 w-9 rounded-xl justify-center items-center flex bg-[#5d5d77] bg-opacity-0 hover:bg-opacity-25 transition-opacity duration-500 ease-in-out">
                                    <PenLine onClick={() => dispatch(setIsEditing({ id: msg?._id, text: msg?.text }))} size={20} color='#c4c7d1' className='cursor-pointer font-bold' />
                                  </div> : ""
                                }
                              </div> : ""
                          }

                        </div>
                      }
                    </div>

                    : <div className='w-full flex justify-start'>
                      <div className="py-4  my-2 h-fit max-w-full  w-fit rounded-3xl bg-transparent ">

                        <div className='flex item-center justify-start my-2 relative'>
                          <div className='w-8 h-8  border  rounded-full   flex justify-center items-center absolute top-0 left-0'>

                            <Image src={deepseekLogo} height={28} alt='logo' className=' fit-cover w-full h-full  ' />

                          </div>
                          <div className=" prose prose-invert prose-lg max-w-none text-lesswhite pl-12">
                            <Markdown>{msg?.text}</Markdown>
                          </div>
                        </div>
                      </div>

                    </div>
                  }
                </div>
              )}


              {(serverMessage || loading) && <div className='w-full flex justify-start'>
                <div className="py-4  my-2 h-fit max-w-full  w-fit rounded-3xl bg-transparent ">

                  <div className='flex item-center justify-start my-2 relative'>
                    <div className='w-8 h-8  border  rounded-full   flex justify-center items-center absolute top-0 left-0'>

                      <Image src={deepseekLogo} height={28} alt='logo' className=' fit-cover w-full h-full  ' />

                    </div>
                    <div className=" prose prose-invert prose-lg max-w-none text-lesswhite pl-12">
                      {loading ? <LoadingAnimation /> : <SimulatedStreaming text={serverMessage as string} chunkSize={8} speed={30} />

                      }
                    </div>
                  </div>
                </div>
              </div>}


            </div>
          }
        </div>


        <div className='w-full flex justify-center sticky bottom-0 z-40  bg-primary mr-[6px]'>
          <div className='w-7/12 '>
            <form onSubmit={handleSubmit} className="message-box bg-chat  w-full h-fit rounded-3xl py-4 px-4">

              <textarea
                ref={textareaRef}
                onChange={(e) => dispatch(setPrompt(e.target.value))}
                onKeyDown={handleKeyDown}
                value={prompt as string}
                name="prompt"
                rows={2}
                id="prompt"
                className="w-full  bg-transparent outline-none resize-none text-lesswhite scrollbar-track-transparent scrollbar-thin scrollbar-thumb-zinc-400"
                placeholder="type your message..."
              />

              <div className="sent-msg flex items-center justify-between mt-2">

                <select onChange={(e) => dispatch(setLanguage(e.target.value))} name="language" id="language" className="outline-none border border-white my-1 p-1 rounded-3xl bg-chat text-lesswhite text-center">
                  <option value="english" defaultValue={'english'}>English</option>
                  <option value="hindi">Hindi</option>
                  <option value="gujarati">Gujarati</option>
                  <option value="telugu">Telugu</option>
                  <option value="tamil">Tamil</option>
                  <option value="malayalam">Malayalam</option>
                  <option value="filipino">Tagalog</option>
                  <option value="indonesian">Indonesian</option>
                </select>


                <div className="flex items-center gap-x-4">
                  <Image src={attachmentIcon} width={28} className="white cursor-pointer hover:opacity-80" alt="attachment-icon" />

                  <button type='submit' className={`sent-msg cursor-pointer rounded-full h-8 w-8 p-2 flex items-center justify-center border  bg-white  ${(prompt?.length == 0 || loading) ? 'opacity-50' : "hover:opacity-80"}`}>
                    <Image src={sentMsgImage} alt="upside-arrow" height={24} className="" />
                  </button>
                </div>
              </div>
            </form>

            <div className='w-full z-20  text-center py-2'><p className='text-xs text-[#9d9d9f]'>Ai generated content</p></div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Home