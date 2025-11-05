'use client'
import React, { useState } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import BasicButton from '../BasicButton'
import BasicInput from '../BasicInput'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import revalidate from '@/utils/revalidate'
import { removeExtraSpaces } from '@/utils/removeExtraSpaces'
import defaultMap from '@/utils/defaultmap.json'
import { generateRandomMap, generateRentlyOffice } from '@/utils/mapGenerator'

const CreateRealmModal:React.FC = () => {

    const { modal, setModal } = useModal()
    const [realmName, setRealmName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [mapType, setMapType] = useState<'starter' | 'random' | 'rently' | 'blank'>('starter')

    const router = useRouter()

    async function createRealm() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return
        }

        const uid = user.id

        setLoading(true)

        const realmData: any = {
            owner_id: uid,
            name: realmName,
        }

        if (mapType === 'starter') {
            realmData.map_data = defaultMap
        } else if (mapType === 'random') {
            realmData.map_data = generateRandomMap()
        } else if (mapType === 'rently') {
            realmData.map_data = generateRentlyOffice()
        }
        // blank map will have no map_data

        const { data, error } = await supabase.from('realms').insert(realmData).select()

        if (error) {
            toast.error(error?.message)
        } 

        if (data) {
            setRealmName('')
            revalidate('/app')
            setModal('None')
            toast.success('Your space has been created!')
            router.push(`/editor/${data[0].id}`)
        }

        setLoading(false)
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = removeExtraSpaces(e.target.value)
        setRealmName(value)
    }

    return (
        <Modal open={modal === 'Create Realm'} closeOnOutsideClick>
            <div className='flex flex-col items-center p-8 w-full max-w-[500px] gap-6'>
                <h1 className='text-3xl font-bold text-white'>Create a Space</h1>
                <BasicInput label={'Space Name'} className='w-full bg-dark-plum border-dark-plum text-white placeholder:text-plum-stain' value={realmName} onChange={onChange} maxLength={32}/>

                <div className='w-full flex flex-col gap-3'>
                    <label className='text-white font-semibold'>Choose Map Type</label>

                    <div className='flex items-center gap-3'>
                        <input
                            type="radio"
                            id="starter"
                            name="mapType"
                            checked={mapType === 'starter'}
                            onChange={() => setMapType('starter')}
                            className='w-4 h-4 accent-sweet-mint'
                        />
                        <label htmlFor="starter" className='text-plum-stain'>Starter Map - Pre-designed office layout</label>
                    </div>

                    <div className='flex items-center gap-3'>
                        <input
                            type="radio"
                            id="rently"
                            name="mapType"
                            checked={mapType === 'rently'}
                            onChange={() => setMapType('rently')}
                            className='w-4 h-4 accent-sweet-mint'
                        />
                        <label htmlFor="rently" className='text-plum-stain'>Rently Office - Random modern office with branded furniture</label>
                    </div>

                    <div className='flex items-center gap-3'>
                        <input
                            type="radio"
                            id="random"
                            name="mapType"
                            checked={mapType === 'random'}
                            onChange={() => setMapType('random')}
                            className='w-4 h-4 accent-sweet-mint'
                        />
                        <label htmlFor="random" className='text-plum-stain'>Random Map - Procedurally generated layout</label>
                    </div>

                    <div className='flex items-center gap-3'>
                        <input
                            type="radio"
                            id="blank"
                            name="mapType"
                            checked={mapType === 'blank'}
                            onChange={() => setMapType('blank')}
                            className='w-4 h-4 accent-sweet-mint'
                        />
                        <label htmlFor="blank" className='text-plum-stain'>Blank Canvas - Start from scratch</label>
                    </div>
                </div>

                <BasicButton disabled={realmName.length <= 0 || loading} onClick={createRealm} className='text-lg w-full'>
                    {loading ? 'Creating...' : 'Create Space'}
                </BasicButton>
            </div>
        </Modal>
    )
}

export default CreateRealmModal