'use client'

import { setLanguage, toggleLanguageBar } from "@/redux/slices/chat.slice"
import { AppDispatch, RootState } from "@/redux/store"
import { ChevronDown } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

function LanguageBar() {
    
    const dispatch = useDispatch<AppDispatch>()
    const {language, languageBar} = useSelector((state : RootState)=>state.chat)

    const setLang = (lang: string) => {
        dispatch(setLanguage(lang))
        dispatch(toggleLanguageBar())
    }

    const languages = ['English','Hindi','Gujarati','Tagalog','Indonesian','Marathi','Kannada','Tamil','Telugu','Malayalam', 'Italian']

    return (
        <div className='relative '>

            <div onClick={() => dispatch(toggleLanguageBar())} className='text-lesswhite text-xl flex items-center justify-center gap-x-2 cursor-pointer hover:bg-chat w-36 h-12 rounded-lg'>
                <p>{language ? language : "Language"} </p> <ChevronDown />
            </div>

            {languageBar && <div className="absolute w-full h-fit bg-chat text-lesswhite flex flex-col items-center gap-y-1 rounded-lg py-2 px-2 mt-2 z-50">
                {
                    languages?.map( lang => <p key={lang} className='language-btn' onClick={() => setLang(lang)}>{lang}</p>)
                }
            </div>}
        </div>
    )
}

export default LanguageBar
