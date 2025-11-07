'use client'
import React, { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import GoogleSignInButton from '@/app/signin/GoogleSignInButton'

type InviteClientProps = {
    realmName: string
    realmId: string
    shareId: string
}

export default function InviteClient({ realmName, realmId, shareId }: InviteClientProps) {

    useEffect(() => {
        // Store the invite destination in localStorage so we can redirect after sign in
        const inviteData = {
            realmId,
            shareId,
            timestamp: Date.now()
        }
        localStorage.setItem('pendingInvite', JSON.stringify(inviteData))
    }, [realmId, shareId])

    const signInWithGoogle = async () => {
        const supabase = createClient()
        const redirectUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : '/auth/callback'

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
            }
        })
    }

    return (
        <div className='gradient w-full h-screen flex flex-col items-center justify-center p-4'>
            <div className='flex flex-col items-center gap-8 max-w-md'>
                <div className='flex flex-col items-center gap-4 text-center'>
                    <h1 className='text-4xl font-bold text-white'>
                        You've been invited!
                    </h1>
                    <div className='bg-dark-plum border-2 border-plum rounded-xl p-6 w-full'>
                        <p className='text-sweet-mint text-sm uppercase tracking-wide mb-2'>Join Space</p>
                        <h2 className='text-2xl font-semibold text-white mb-3'>{realmName}</h2>
                        <p className='text-white/80 text-sm'>
                            Sign in with Google to join your teammates in this virtual office space
                        </p>
                    </div>
                </div>
                <GoogleSignInButton onClick={signInWithGoogle} />
                <p className='text-white/60 text-sm text-center'>
                    By signing in, you'll automatically join the space
                </p>
            </div>
        </div>
    )
}
