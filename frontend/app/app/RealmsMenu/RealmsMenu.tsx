'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BasicButton from '@/components/BasicButton'
import DesktopRealmItem from './DesktopRealmItem'
import { useRouter } from 'next/navigation'
import { request } from '@/utils/backend/requests'
import { createClient } from '@/utils/supabase/client'
import revalidate from '@/utils/revalidate'

type Realm = {
    id: string,
    name: string,
    share_id: string
    shared?: boolean
}

type RealmsMenuProps = {
    realms: Realm[]
    errorMessage: string
}

const RealmsMenu:React.FC<RealmsMenuProps> = ({ realms, errorMessage }) => {

    const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null)
    const [playerCounts, setPlayerCounts] = useState<number[]>([])
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
        }
    }, [errorMessage])

    useEffect(() => {
        getPlayerCounts()
        revalidate('/play/[id]')
    }, [])

    function getLink() {
        if (selectedRealm?.share_id) {
            return `/play/${selectedRealm.id}?shareId=${selectedRealm.share_id}`
        } else {
            return `/play/${selectedRealm?.id}`
        }
    }

    async function getPlayerCounts() {
        // get session
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const { data: playerCountData, error: playerCountsError } = await request('/getPlayerCounts', { realmIds: realms.map((realm: any) => realm.id)}, session.access_token)
        if (playerCountData) {
            setPlayerCounts(playerCountData.playerCounts)
        }
    }

    return (
        <>
            {/* Mobile View */}
            <div className='flex flex-col items-center p-4 gap-2 sm:hidden'>
                {realms.length === 0 && <p className='text-center text-dolphin-gray'>You have no spaces you can join. Create one on desktop to get started!</p>}
                {realms.map((realm, index) => {

                    function selectRealm() {
                        setSelectedRealm(realm)
                    }

                    return (
                        <BasicButton key={realm.id} className={`w-full h-14 border-2 border-transparent flex flex-row items-center justify-between ${selectedRealm?.id === realm.id ? 'border-plum' : ''}`} onClick={selectRealm}>
                            <p className='text-white text-lg text-left font-semibold'>{realm.name}</p>
                            {playerCounts[index] !== undefined && <div className='rounded-full grid place-items-center w-9 h-9 font-bold bg-sweet-mint text-white text-sm'>
                                {playerCounts[index]}
                            </div>}
                        </BasicButton>
                    )
                })}
                <div className='fixed bottom-0 w-full bg-white-plum border-t border-gray-50 grid place-items-center p-4 shadow-lg'>
                     <BasicButton className='w-[90%] text-lg' disabled={selectedRealm === null} onClick={() => router.push(getLink())}>
                        Join Space
                    </BasicButton>
                </div>
            </div>

            {/* Desktop View */}
            <div className='flex-col items-center w-full hidden sm:flex'>
                {realms.length === 0 && <p className='text-center text-dolphin-gray text-lg'>You have no spaces you can join. Create a space to get started!</p>}
                <div className='hidden sm:grid grid-cols-2 md:grid-cols-3 gap-8 w-full'>
                    {realms.map((realm, index) => {
                        return (
                            <DesktopRealmItem key={realm.id} name={realm.name} id={realm.id} shareId={realm.share_id} shared={realm.shared} playerCount={playerCounts[index]}/>
                        )
                    })}
                </div>
            </div>
            
        </>
        
    )
}

export default RealmsMenu