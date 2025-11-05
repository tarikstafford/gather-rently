'use client'
import { createClient } from '@/utils/supabase/client'
import GoogleSignInButton from './GoogleSignInButton'

export default function Login() {

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
    <div className='flex flex-col items-center w-full pt-56'>
        <GoogleSignInButton onClick={signInWithGoogle}/>
    </div>
  );
}
