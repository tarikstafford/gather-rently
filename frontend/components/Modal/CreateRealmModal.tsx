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
import { generateMapWithAI } from '@/utils/aiMapBuilder'

const CreateRealmModal:React.FC = () => {

    const { modal, setModal } = useModal()
    const [realmName, setRealmName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [aiPrompt, setAiPrompt] = useState<string>('')

    const [mapType, setMapType] = useState<'starter' | 'random' | 'rently' | 'ai' | 'blank'>('starter')

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

        try {
            if (mapType === 'starter') {
                realmData.map_data = defaultMap
            } else if (mapType === 'random') {
                realmData.map_data = generateRandomMap()
            } else if (mapType === 'rently') {
                realmData.map_data = generateRentlyOffice()
            } else if (mapType === 'ai') {
                if (!aiPrompt.trim()) {
                    toast.error('Please enter a description for the AI to generate')
                    setLoading(false)
                    return
                }
                toast.info('AI is designing your space...')
                realmData.map_data = await generateMapWithAI({
                    prompt: aiPrompt,
                    palette: 'rently'
                })
            }
            // blank map will have no map_data

            const { data, error } = await supabase.from('realms').insert(realmData).select()

            if (error) {
                toast.error(error?.message)
            }

            if (data) {
                setRealmName('')
                setAiPrompt('')
                revalidate('/app')
                setModal('None')
                toast.success('Your space has been created!')
                router.push(`/editor/${data[0].id}`)
            }
        } catch (error) {
            console.error('Error creating realm:', error)
            toast.error('Failed to create space. Please try again.')
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
                            id="ai"
                            name="mapType"
                            checked={mapType === 'ai'}
                            onChange={() => setMapType('ai')}
                            className='w-4 h-4 accent-sweet-mint'
                        />
                        <label htmlFor="ai" className='text-plum-stain'>AI Generated - Describe your space and let AI build it</label>
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

                {mapType === 'ai' && (
                    <div className='w-full'>
                        <label className='text-white text-sm mb-2 block'>Describe your space:</label>
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="e.g., A modern tech startup office with 3 meeting rooms, an open workspace with 10 desks, a meditation room, a kitchen, and a music room for jam sessions"
                            className='w-full bg-dark-plum border border-dark-plum text-white placeholder:text-plum-stain rounded-lg p-3 min-h-[100px] resize-y'
                            maxLength={500}
                        />
                        <p className='text-xs text-plum-stain mt-1'>{aiPrompt.length}/500 characters</p>
                    </div>
                )}

                <BasicButton disabled={realmName.length <= 0 || loading} onClick={createRealm} className='text-lg w-full'>
                    {loading ? 'Creating...' : 'Create Space'}
                </BasicButton>
            </div>
        </Modal>
    )
}

export default CreateRealmModal