import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar/Navbar'
import RealmsMenu from './RealmsMenu/RealmsMenu'
import { getVisitedRealms } from '@/utils/supabase/getVisitedRealms'

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
        <div className='min-h-screen bg-white-plum'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-8 py-8'>
                <h1 className='font-bold text-4xl text-dark-plum mb-2'>Your Spaces</h1>
                <p className='text-dolphin-gray mb-8'>Manage and join your virtual collaboration spaces</p>
                <RealmsMenu realms={realms} errorMessage={errorMessage}/>
            </div>
        </div>
    )
}