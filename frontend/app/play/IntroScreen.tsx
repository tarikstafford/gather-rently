'use client'
import React from 'react'
import BasicButton from '@/components/BasicButton'
import AnimatedCharacter from './SkinMenu/AnimatedCharacter'
import { useVideoChat } from '../hooks/useVideoChat'
import MicAndCameraButtons from '@/components/VideoChat/MicAndCameraButtons'

type IntroScreenProps = {
    realmName: string
    skin: string
    username: string
    setShowIntroScreen: (show: boolean) => void
}

const IntroScreen:React.FC<IntroScreenProps> = ({ realmName, skin, username, setShowIntroScreen }) => {

    const src = '/sprites/characters/Character_' + skin + '.png'

    return (
        <main className='gradient w-full h-screen flex flex-col items-center pt-28'>
            <h1 className='text-4xl font-semibold text-white'>Welcome to <span className='text-sweet-mint'>{realmName}</span></h1>
            <section className='flex flex-row mt-32 items-center gap-24'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='aspect-video w-[337px] h-[227px] bg-dark-plum rounded-xl border-2 border-plum overflow-hidden'>
                        <LocalVideo/>
                    </div>
                    <MicAndCameraButtons/>
                </div>
                <div className='flex flex-col items-center gap-4'>
                    <div className='flex flex-col items-center gap-2 bg-dark-plum border-2 border-plum rounded-xl p-6 min-w-[250px]'>
                        <AnimatedCharacter src={src} noAnimation/>
                        <p className='text-white font-semibold'>{username}</p>
                    </div>
                    <BasicButton className='py-0 px-32 w-[250px]' onClick={() => setShowIntroScreen(false)}>
                        Join
                    </BasicButton>
                </div>
            </section>
        </main>
    )
}

export default IntroScreen

function LocalVideo() {
    const { isCameraMuted, isMicMuted } = useVideoChat()

    return (
        <div className='w-full h-full bg-dark-plum grid place-items-center relative'>
            <div id='local-video' className='w-full h-full'>

            </div>
            <div className='absolute select-none text-sm text-white items-center flex flex-col gap-1'>
                {isMicMuted && isCameraMuted && <p>You are muted</p>}
                {isCameraMuted && <p>Your camera is off</p>}
            </div>
            {isMicMuted && !isCameraMuted && <p className='absolute bottom-2 right-3 select-none text-sm text-white bg-dark-plum bg-opacity-80 p-1 px-2 rounded-full'>
                You are muted
            </p>}
        </div>
    )
}