import { DotsThreeVertical, Link as LinkIcon, SignIn } from '@phosphor-icons/react'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useModal } from '@/app/hooks/useModal'
import Link from 'next/link'
import { toast } from 'react-toastify'

type DesktopRealmItemProps = {
    name: string,
    id: string,
    shareId: string,
    shared?: boolean,
    playerCount?: number
}

const DesktopRealmItem:React.FC<DesktopRealmItemProps> = ({ name, id, shareId, shared, playerCount }) => {
    
    const [showMenu, setShowMenu] = useState<boolean>(false)  
    const router = useRouter()
    const menuRef = useRef<HTMLDivElement>(null)
    const dotsRef = useRef<HTMLDivElement>(null)
    const { setRealmToDelete, setModal } = useModal()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && dotsRef.current && !dotsRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    function handleDotsClick() {
        setShowMenu(!showMenu)
    }

    function handleDelete() {
        setRealmToDelete({ name, id })
        setModal('Delete Realm')
    }

    function getLink() {
        if (shared) {
            return `/play/${id}?shareId=${shareId}`
        } else {
            return `/play/${id}`
        }
    }

    function copyShareLink() {
        const shareUrl = `${window.location.origin}/play/${id}?shareId=${shareId}`
        navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied!')
    }

    return (
        <div className='relative select-none'>
            <Link href={getLink()}>
                <div className='w-full aspect-video relative rounded-2xl border-4 border-transparent hover:border-plum-stain overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300'>
                    {/* Background pulse animation */}
                    <div className='animate-pulse bg-plum absolute inset-0' />

                    {/* Thumbnail image */}
                    <img
                        src='/thumbnail.png'
                        className='absolute z-10'
                        style={{imageRendering: 'pixelated'}}
                    />

                    {/* Hover effect and sign-in icon */}
                    <div className='absolute inset-0 grid place-items-center z-20 opacity-0 hover:opacity-100 transition-opacity duration-300'>
                        <div className='rounded-full bg-dark-plum bg-opacity-90 grid place-items-center absolute p-3'>
                            <SignIn className='w-8 h-8 text-white' />
                        </div>
                    </div>

                    {/* Player count indicator */}
                    {playerCount != null && (
                        <div className='pointer-events-none absolute top-2 left-2 rounded-full px-3 py-1.5 flex items-center gap-2 bg-dark-plum bg-opacity-90 max-w-max z-30'>
                            <div className='bg-sweet-mint w-3 h-3 rounded-full' />
                            <p className='text-sm font-medium text-white'>{playerCount}</p>
                        </div>
                    )}
                </div>
            </Link>
            <div className='mt-3 flex flex-row justify-between items-center'>
                <p className='text-base font-semibold text-white'>{name}</p>
                {!shared && (
                    <div className='flex flex-row gap-1'>
                        <LinkIcon className='h-8 w-8 cursor-pointer hover:bg-plum text-plum-stain rounded-md p-1.5 animate-colors' onClick={copyShareLink}/>
                    <div ref={dotsRef}>
                        <DotsThreeVertical weight='bold' className='h-8 w-8 cursor-pointer hover:bg-plum text-plum-stain rounded-md p-1.5 animate-colors' onClick={handleDotsClick}/>
                    </div>
                </div>)}
            </div>
            {showMenu && (
                <div className='absolute w-40 rounded-lg bg-plum shadow-xl right-0 flex flex-col z-10 border border-dark-plum overflow-hidden' ref={menuRef}>
                    <button className='py-3 px-4 w-full hover:bg-dark-plum text-white font-medium text-left transition-colors' onClick={() => router.push(`/editor/${id}`)}>
                        Edit Map
                    </button>
                    <button className='py-3 px-4 w-full hover:bg-dark-plum text-white font-medium text-left transition-colors' onClick={() => router.push(`/manage/${id}`)}>Manage</button>
                    <button className='py-3 px-4 w-full hover:bg-red-alert text-red-alert hover:text-white font-medium text-left transition-colors' onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    )
}

export default DesktopRealmItem