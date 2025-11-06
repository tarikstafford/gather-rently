import React, { useState, useEffect } from 'react'
import { VideoCameraSlash, MicrophoneSlash, VideoCamera, Microphone, MonitorPlay, MonitorSlash } from '@phosphor-icons/react'
import { useVideoChat } from '@/app/hooks/useVideoChat'
import { videoChat } from '@/utils/video-chat/video-chat'
import signal from '@/utils/signal'

type MicAndCameraButtonsProps = {

}

const MicAndCameraButtons:React.FC<MicAndCameraButtonsProps> = () => {

    const { isCameraMuted, isMicMuted, toggleCamera, toggleMicrophone } = useVideoChat()
    const [isScreenSharing, setIsScreenSharing] = useState(false)

    useEffect(() => {
        const handleScreenShareStarted = () => setIsScreenSharing(true)
        const handleScreenShareStopped = () => setIsScreenSharing(false)

        signal.on('screen-share-started', handleScreenShareStarted)
        signal.on('screen-share-stopped', handleScreenShareStopped)

        return () => {
            signal.off('screen-share-started', handleScreenShareStarted)
            signal.off('screen-share-stopped', handleScreenShareStopped)
        }
    }, [])

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            await videoChat.stopScreenShare()
        } else {
            await videoChat.startScreenShare()
        }
    }

    const micClass = `w-6 h-6 ${!isMicMuted ? 'text-[#08D6A0]' : 'text-[#FF2F49]'}`
    const cameraClass = `w-6 h-6 ${!isCameraMuted ? 'text-[#08D6A0]' : 'text-[#FF2F49]'}`
    const screenClass = `w-6 h-6 ${isScreenSharing ? 'text-[#08D6A0]' : 'text-gray-400'}`

    return (
        <section className='flex flex-row gap-2'>
            <button
                className={`${!isMicMuted ? 'bg-[#2A4B54] hover:bg-[#3b6975]' : 'bg-[#682E44] hover:bg-[#7a3650]'}
                p-2 rounded-full animate-colors outline-none`}
                onClick={toggleMicrophone}
            >
                {isMicMuted ? <MicrophoneSlash className={micClass} /> : <Microphone className={micClass} />}
            </button>
            <button
                className={`${!isCameraMuted ? 'bg-[#2A4B54] hover:bg-[#3b6975]' : 'bg-[#682E44] hover:bg-[#7a3650]'}
                p-2 rounded-full animate-colors outline-none`}
                onClick={toggleCamera}
            >
                {isCameraMuted ? <VideoCameraSlash className={cameraClass} /> : <VideoCamera className={cameraClass} />}
            </button>
            <button
                className={`${isScreenSharing ? 'bg-[#2A4B54] hover:bg-[#3b6975]' : 'bg-[#1f1f1f] hover:bg-[#2f2f2f]'}
                p-2 rounded-full animate-colors outline-none`}
                onClick={toggleScreenShare}
                title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
            >
                {isScreenSharing ? <MonitorPlay className={screenClass} /> : <MonitorSlash className={screenClass} />}
            </button>
        </section>

    )
}

export default MicAndCameraButtons