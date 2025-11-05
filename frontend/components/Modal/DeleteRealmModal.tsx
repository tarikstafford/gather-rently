'use client'
import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'
import revalidate from '@/utils/revalidate'
import BasicInput from '../BasicInput'
import { removeExtraSpaces, formatForComparison } from '@/utils/removeExtraSpaces'

type DeleteRealmModalProps = {
    
}

const DeleteRealmModal:React.FC<DeleteRealmModalProps> = () => {
    
    const { modal, realmToDelete } = useModal()
    const [loading, setLoading] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')

    const onClickDelete = async () => {
        const supabase = createClient()
        setLoading(true)

        const { error } = await supabase.from('realms').delete().eq('id', realmToDelete.id) 

        if (error) {
            setLoading(false)
            toast.error(error.message)
        }

        if (!error) {
            revalidate('/app')
            window.location.reload()
        }
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = removeExtraSpaces(e.target.value)
        setInput(value)
    }

    function getDisabled() {
        return input.trim() !== realmToDelete.name.trim()
    }

    useEffect(() => {
        setInput('')
    }, [modal])

    return (
        <Modal open={modal === 'Delete Realm'} closeOnOutsideClick>
            <div className='p-8 flex flex-col items-center gap-6 w-full max-w-[420px]'>
                <h1 className='text-2xl font-bold text-white text-center'>Delete Space</h1>
                <p className='text-center text-plum-stain'>Are you sure you want to delete <span className='text-red-alert font-semibold select-none'>{realmToDelete.name}</span>? This action cannot be undone!</p>
                <div className='w-full'>
                    <p className='text-sm text-plum-stain mb-2'>Type <span className='text-red-alert font-semibold select-none'>{realmToDelete.name}</span> to confirm</p>
                    <BasicInput className='w-full bg-dark-plum border-dark-plum text-white placeholder:text-plum-stain' onChange={onChange} value={input}/>
                </div>
                <button className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${loading ? 'pointer-events-none opacity-50' : ''} ${getDisabled() ? 'opacity-50 pointer-events-none' : ''} bg-red-alert hover:bg-red-600 shadow-sm hover:shadow-md`} disabled={getDisabled()} onClick={onClickDelete}>
                    Delete Space
                </button>
            </div>
        </Modal>
    )
}

export default DeleteRealmModal