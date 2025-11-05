'use client'
import React from 'react'
import Image from 'next/image'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useModal } from '@/app/hooks/useModal'
import BasicButton from '../BasicButton'

type NavbarChildProps = {
    name: string,
    avatar_url: string
}

export const NavbarChild:React.FC<NavbarChildProps> = ({ name, avatar_url }) => {

    const { setModal } = useModal()

    return (
        <div className='h-20'>
            <div className='w-full fixed bg-white border-b border-gray-50 shadow-sm flex flex-row items-center px-6 py-4 justify-end sm:justify-between z-10'>
                <BasicButton onClick={() => setModal('Create Realm')} className='hidden sm:flex flex-row items-center gap-2'>
                    Create Space
                    <PlusCircleIcon className='h-5 w-5'/>
                </BasicButton>
                <div className='flex flex-row items-center gap-3 hover:bg-plum-stain animate-colors rounded-full cursor-pointer py-2 px-3 select-none' onClick={() => setModal('Account Dropdown')}>
                    <p className='text-dark-plum font-medium'>{name}</p>
                    <Image alt='avatar' src={avatar_url} width={40} height={40} className='aspect-square rounded-full border-2 border-plum' />
                </div>
            </div>
        </div>
    )
}