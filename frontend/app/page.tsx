'use client'
import AnimatedCharacter from './play/SkinMenu/AnimatedCharacter'
import { createClient } from '@/utils/supabase/client'

export default function Index() {
  const signInWithGoogle = async () => {
    const supabase = createClient()
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : '/auth/callback'

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    })
  }

  return (
    <div className='w-full min-h-screen gradient p-6 md:p-12 flex items-center justify-center'>
      <div className='max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center'>
        {/* Left side - Content */}
        <div className='flex flex-col space-y-8 text-white'>
          <div className='space-y-4'>
            <h1 className='font-bold text-5xl md:text-6xl leading-tight'>
              Welcome to the <span className='text-[#E1CFFF]'>Rently</span> Digital Office
            </h1>
            <p className='text-xl md:text-2xl text-[#E1CFFF] leading-relaxed'>
              Our dedicated virtual workspace for the Rently team
            </p>
            <p className='text-lg text-white/90 leading-relaxed max-w-xl'>
              Hang out with your teammates, collaborate on projects, and work together in our immersive
              digital office. A space built exclusively for Rently employees to connect, create, and thrive.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 items-start'>
            <button
              onClick={signInWithGoogle}
              className='px-8 py-4 bg-white text-[#301064] rounded-lg font-semibold text-lg hover:bg-[#E1CFFF] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3'
            >
              <img src='/google-logo.png' alt="Google logo" className='h-6' />
              Sign in with Google
            </button>
          </div>

          <div className='flex flex-wrap gap-6 text-sm text-white/70 pt-4'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-[#11BB8D] rounded-full'></div>
              <span>Secure & Private</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-[#11BB8D] rounded-full'></div>
              <span>Easy to Use</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-[#11BB8D] rounded-full'></div>
              <span>Made in Singapore</span>
            </div>
          </div>
        </div>

        {/* Right side - Character */}
        <div className='flex items-center justify-center'>
          <div className='relative'>
            <div className='absolute inset-0 bg-[#E1CFFF]/20 rounded-full blur-3xl'></div>
            <AnimatedCharacter
              src='/sprites/characters/Character_009.png'
              className='w-48 h-48 md:w-64 md:h-64 relative z-10'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
