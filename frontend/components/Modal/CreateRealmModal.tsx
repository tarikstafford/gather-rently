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

const CreateRealmModal:React.FC = () => {
    
    const { modal, setModal } = useModal()
    const [realmName, setRealmName] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [useDefaultMap, setUseDefaultMap] = useState<boolean>(true)

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
        if (useDefaultMap) {
            realmData.map_data = defaultMap
        }

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
            <div className='flex flex-col items-center p-8 w-[420px] gap-6'>
                <h1 className='text-3xl font-bold text-white'>Create a Space</h1>
                <BasicInput label={'Space Name'} className='w-full bg-dark-plum border-dark-plum text-white placeholder:text-plum-stain' value={realmName} onChange={onChange} maxLength={32}/>
                <div className='flex items-center gap-3 w-full'>
                    <input
                        type="checkbox"
                        id="useDefaultMap"
                        checked={useDefaultMap}
                        onChange={(e) => setUseDefaultMap(e.target.checked)}
                        className='w-4 h-4 accent-sweet-mint'
                    />
                    <label htmlFor="useDefaultMap" className='text-plum-stain'>Use starter map</label>
                </div>
                <BasicButton disabled={realmName.length <= 0 || loading} onClick={createRealm} className='text-lg w-full'>
                    Create Space
                </BasicButton>
            </div>
        </Modal>
    )
}

export default CreateRealmModal