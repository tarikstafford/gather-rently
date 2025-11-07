import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar/Navbar'
import RealmsMenu from './RealmsMenu/RealmsMenu'
import { getVisitedRealms } from '@/utils/supabase/getVisitedRealms'
import Link from 'next/link'
import { BookOpen } from '@phosphor-icons/react/dist/ssr'

export default async function App() {

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const { data: { session } } = await supabase.auth.getSession()

    if (!user || !session) {
        return redirect('/signin')
    }

    const realms: any = []
    const { data: ownedRealms, error } = await supabase.from('realms').select('id, name, share_id').eq('owner_id', user.id)
    if (ownedRealms) {
        realms.push(...ownedRealms)
    }
    if (session) {
        let { data: visitedRealms, error: visitedRealmsError } = await getVisitedRealms(session.access_token)
        if (visitedRealms) {
            visitedRealms = visitedRealms.map((realm) => ({ ...realm, shared: true }))
            realms.push(...visitedRealms)
        }
    }
    const errorMessage = error?.message || ''

    return (
        <div className='min-h-screen gradient'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-8 py-8'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                    <div>
                        <h1 className='font-bold text-4xl text-white mb-2'>Your Spaces</h1>
                        <p className='text-plum-stain'>Manage and join your virtual collaboration spaces</p>
                    </div>
                    <Link
                        href='/guide'
                        className='inline-flex items-center gap-2 bg-sweet-mint text-dark-plum font-semibold px-6 py-3 rounded-lg hover:bg-white transition-colors'
                    >
                        <BookOpen className='w-5 h-5' />
                        How to Use
                    </Link>
                </div>
                <RealmsMenu realms={realms} errorMessage={errorMessage}/>
            </div>
        </div>
    )
}