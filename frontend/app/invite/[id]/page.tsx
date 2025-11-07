import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import InviteClient from './InviteClient'

type InvitePageProps = {
    params: { id: string }
    searchParams: { shareId: string }
}

export default async function InvitePage({ params, searchParams }: InvitePageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // If user is already signed in, redirect to the play page
    if (user) {
        return redirect(`/play/${params.id}?shareId=${searchParams.shareId}`)
    }

    // Fetch realm data - RLS policy allows anonymous reads for invite purposes
    const { data: realm, error } = await supabase
        .from('realms')
        .select('name, share_id, only_owner')
        .eq('id', params.id)
        .eq('share_id', searchParams.shareId)
        .single()

    if (error || !realm) {
        // If no shareId or invalid invite, redirect to signin
        if (!searchParams.shareId) {
            return redirect('/signin')
        }

        // Show error page for invalid invite
        return (
            <div className='gradient w-full h-screen flex flex-col items-center justify-center p-4'>
                <div className='flex flex-col items-center gap-4'>
                    <h1 className='text-3xl font-bold text-white text-center'>
                        Invalid Invite Link
                    </h1>
                    <p className='text-white/80 text-center max-w-md'>
                        This invite link is invalid or has expired. Please request a new invite link from the space owner.
                    </p>
                </div>
            </div>
        )
    }

    if (realm.only_owner) {
        return (
            <div className='gradient w-full h-screen grid place-items-center p-4'>
                <div className='flex flex-col items-center'>
                    <h1 className='text-xl sm:text-3xl max-w-[450px] text-center text-white'>
                        This office space is private right now. Please check back later! 😶
                    </h1>
                </div>
            </div>
        )
    }

    return <InviteClient realmName={realm.name} realmId={params.id} shareId={searchParams.shareId} />
}
