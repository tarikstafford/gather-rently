'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthRedirect() {
    const router = useRouter()

    useEffect(() => {
        // Check for pending invite in localStorage
        const pendingInviteStr = localStorage.getItem('pendingInvite')

        if (pendingInviteStr) {
            try {
                const pendingInvite = JSON.parse(pendingInviteStr)

                // Check if invite is less than 1 hour old
                const oneHour = 60 * 60 * 1000
                if (Date.now() - pendingInvite.timestamp < oneHour) {
                    // Clear the pending invite
                    localStorage.removeItem('pendingInvite')

                    // Redirect to the play page with shareId
                    router.push(`/play/${pendingInvite.realmId}?shareId=${pendingInvite.shareId}`)
                    return
                } else {
                    // Invite expired, clear it
                    localStorage.removeItem('pendingInvite')
                }
            } catch (e) {
                console.error('Error parsing pending invite:', e)
                localStorage.removeItem('pendingInvite')
            }
        }

        // No pending invite, redirect to app
        router.push('/app')
    }, [router])

    return (
        <div className='w-full h-screen grid place-items-center'>
            <div className='flex flex-col items-center gap-4'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sweet-mint'></div>
                <p className='text-white'>Redirecting...</p>
            </div>
        </div>
    )
}
