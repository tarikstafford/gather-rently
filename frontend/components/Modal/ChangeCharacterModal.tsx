'use client'
import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'
import { skins } from '@/utils/pixi/Player/skins'
import AnimatedCharacter from '@/app/play/SkinMenu/AnimatedCharacter'
import BasicButton from '../BasicButton'

const ChangeCharacterModal: React.FC = () => {
    const { modal, setModal } = useModal()
    const [selectedSkin, setSelectedSkin] = useState<string>('001')
    const [currentSkin, setCurrentSkin] = useState<string>('001')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (modal === 'Change Character') {
            loadCurrentSkin()
        }
    }, [modal])

    async function loadCurrentSkin() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('skin')
                .eq('id', user.id)
                .single()

            if (profile?.skin) {
                // Extract skin number from path like "/sprites/characters/Character_009.png"
                const skinNumber = profile.skin.match(/Character_(\d+)/)?.[1] || '001'
                setCurrentSkin(skinNumber)
                setSelectedSkin(skinNumber)
            }
        }
    }

    async function handleSave() {
        setLoading(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            toast.error('User not found')
            setLoading(false)
            return
        }

        const skinPath = `/sprites/characters/Character_${selectedSkin}.png`

        const { error } = await supabase
            .from('profiles')
            .update({ skin: skinPath })
            .eq('id', user.id)

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Character updated!')
            setModal('None')
            // Refresh the page to show the new character
            window.location.reload()
        }

        setLoading(false)
    }

    return (
        <Modal open={modal === 'Change Character'} closeOnOutsideClick>
            <div className='flex flex-col items-center p-8 w-full max-w-[500px] gap-6'>
                <h1 className='text-3xl font-bold text-white'>Choose Your Character</h1>

                <div className='flex items-center justify-center gap-4'>
                    <button
                        onClick={() => {
                            const currentIndex = skins.indexOf(selectedSkin)
                            const newIndex = currentIndex > 0 ? currentIndex - 1 : skins.length - 1
                            setSelectedSkin(skins[newIndex])
                        }}
                        className='text-3xl text-white hover:text-sweet-mint transition-colors'
                    >
                        ←
                    </button>

                    <div className='flex flex-col items-center gap-3'>
                        <AnimatedCharacter
                            src={`/sprites/characters/Character_${selectedSkin}.png`}
                            className='w-32 h-32'
                        />
                        <p className='text-plum-stain text-sm'>
                            {skins.indexOf(selectedSkin) + 1} / {skins.length}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            const currentIndex = skins.indexOf(selectedSkin)
                            const newIndex = currentIndex < skins.length - 1 ? currentIndex + 1 : 0
                            setSelectedSkin(skins[newIndex])
                        }}
                        className='text-3xl text-white hover:text-sweet-mint transition-colors'
                    >
                        →
                    </button>
                </div>

                <BasicButton
                    disabled={loading || selectedSkin === currentSkin}
                    onClick={handleSave}
                    className='text-lg w-full'
                >
                    {loading ? 'Saving...' : 'Save Character'}
                </BasicButton>
            </div>
        </Modal>
    )
}

export default ChangeCharacterModal
