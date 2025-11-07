import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Video, Users, Chalkboard, MapTrifold, Pencil, PaintBrush, ShareNetwork, Key, Monitor } from '@phosphor-icons/react/dist/ssr'

export default function GuidePage() {
    return (
        <div className='gradient min-h-screen'>
            <div className='max-w-5xl mx-auto px-6 py-12'>
                {/* Header */}
                <div className='mb-12'>
                    <Link href='/app' className='inline-flex items-center gap-2 text-sweet-mint hover:text-white transition-colors mb-6'>
                        <ArrowLeft className='w-5 h-5' />
                        Back to Dashboard
                    </Link>
                    <h1 className='text-5xl font-bold text-white mb-4'>Rently Digital Office Guide</h1>
                    <p className='text-xl text-white/80'>Learn how to use all the features in your virtual workspace</p>
                </div>

                {/* Table of Contents */}
                <div className='bg-dark-plum border-2 border-plum rounded-xl p-6 mb-8'>
                    <h2 className='text-2xl font-bold text-white mb-4'>Quick Navigation</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <a href='#getting-started' className='text-sweet-mint hover:text-white transition-colors'>→ Getting Started</a>
                        <a href='#video-chat' className='text-sweet-mint hover:text-white transition-colors'>→ Video Chat & Audio</a>
                        <a href='#screen-sharing' className='text-sweet-mint hover:text-white transition-colors'>→ Screen Sharing</a>
                        <a href='#whiteboards' className='text-sweet-mint hover:text-white transition-colors'>→ Collaborative Whiteboards</a>
                        <a href='#private-areas' className='text-sweet-mint hover:text-white transition-colors'>→ Private Meeting Areas</a>
                        <a href='#map-editor' className='text-sweet-mint hover:text-white transition-colors'>→ Map Editor</a>
                        <a href='#sharing' className='text-sweet-mint hover:text-white transition-colors'>→ Sharing Spaces</a>
                        <a href='#controls' className='text-sweet-mint hover:text-white transition-colors'>→ Controls & Navigation</a>
                    </div>
                </div>

                {/* Getting Started */}
                <Section id='getting-started' icon={<MapTrifold className='w-8 h-8' />} title='Getting Started'>
                    <p className='text-white/90 mb-4'>
                        Welcome to Rently Digital Office! This is your team's virtual workspace where you can collaborate naturally through proximity-based video chat.
                    </p>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>Creating Your First Space</h4>
                        <ol className='list-decimal list-inside text-white/90 space-y-2 ml-2'>
                            <li>Click "Create Space" from your dashboard</li>
                            <li>Choose a template: Blank, Random (AI-generated), or Rently Office</li>
                            <li>Give your space a name</li>
                            <li>Start customizing in the editor or jump right in!</li>
                        </ol>
                    </div>
                    <div className='bg-plum rounded-lg p-4'>
                        <h4 className='font-semibold text-white mb-2'>Basic Movement</h4>
                        <ul className='list-disc list-inside text-white/90 space-y-2 ml-2'>
                            <li><strong>Mouse</strong>: Click anywhere to walk there</li>
                            <li><strong>Keyboard</strong>: Use WASD or Arrow keys to move</li>
                            <li><strong>Zoom</strong>: Scroll mouse wheel to zoom in/out</li>
                        </ul>
                    </div>
                </Section>

                {/* Video Chat */}
                <Section id='video-chat' icon={<Video className='w-8 h-8' />} title='Video Chat & Audio'>
                    <p className='text-white/90 mb-4'>
                        Rently uses proximity-based video chat - the closer you are to someone, the louder they are!
                    </p>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>How It Works</h4>
                        <ul className='list-disc list-inside text-white/90 space-y-2 ml-2'>
                            <li>Walk close to teammates to see and hear them</li>
                            <li>Move away to lower their volume or disconnect</li>
                            <li>Video feeds appear automatically when in range</li>
                            <li>Up to 30 people can be in a space at once</li>
                        </ul>
                    </div>
                    <div className='bg-plum rounded-lg p-4'>
                        <h4 className='font-semibold text-white mb-2'>Controls</h4>
                        <p className='text-white/90 mb-2'>Use the buttons at the bottom of your screen:</p>
                        <ul className='list-disc list-inside text-white/90 space-y-2 ml-2'>
                            <li><strong>Camera button</strong>: Toggle your video on/off</li>
                            <li><strong>Microphone button</strong>: Mute/unmute yourself</li>
                            <li><strong>Monitor button</strong>: Start/stop screen sharing</li>
                        </ul>
                    </div>
                </Section>

                {/* Screen Sharing */}
                <Section id='screen-sharing' icon={<Monitor className='w-8 h-8' />} title='Screen Sharing'>
                    <p className='text-white/90 mb-4'>
                        Share your screen with everyone in proximity to present slides, demos, or collaborate on documents.
                    </p>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>How to Share</h4>
                        <ol className='list-decimal list-inside text-white/90 space-y-2 ml-2'>
                            <li>Click the monitor icon in the bottom control bar</li>
                            <li>Choose which window or screen to share</li>
                            <li>Your camera feed is replaced with your screen</li>
                            <li>Click the monitor icon again to stop sharing</li>
                        </ol>
                    </div>
                    <div className='bg-dark-plum/50 border border-sweet-mint rounded-lg p-4'>
                        <p className='text-sweet-mint text-sm'>
                            <strong>Tip:</strong> Screen sharing works best when you're close to the people you want to present to!
                        </p>
                    </div>
                </Section>

                {/* Whiteboards */}
                <Section id='whiteboards' icon={<Chalkboard className='w-8 h-8' />} title='Collaborative Whiteboards'>
                    <p className='text-white/90 mb-4'>
                        Add whiteboards to your space for real-time collaborative drawing and brainstorming.
                    </p>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>Adding a Whiteboard</h4>
                        <ol className='list-decimal list-inside text-white/90 space-y-2 ml-2'>
                            <li>Open your space in the Map Editor</li>
                            <li>Click the "Special" tab in the left toolbar</li>
                            <li>Select "Whiteboard" (blue chalkboard icon)</li>
                            <li>Click on the map to place it</li>
                            <li>Save your changes</li>
                        </ol>
                    </div>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>Using a Whiteboard</h4>
                        <ol className='list-decimal list-inside text-white/90 space-y-2 ml-2'>
                            <li>Walk up to a whiteboard tile in play mode</li>
                            <li>Click on it to open the whiteboard</li>
                            <li>Draw, add shapes, text, and sticky notes</li>
                            <li>All changes save automatically</li>
                            <li>Multiple people can collaborate in real-time!</li>
                        </ol>
                    </div>
                    <div className='bg-dark-plum/50 border border-sweet-mint rounded-lg p-4'>
                        <p className='text-sweet-mint text-sm'>
                            <strong>Tip:</strong> Each whiteboard tile has its own canvas, so you can have multiple whiteboards in one space for different topics!
                        </p>
                    </div>
                </Section>

                {/* Private Areas */}
                <Section id='private-areas' icon={<Key className='w-8 h-8' />} title='Private Meeting Areas'>
                    <p className='text-white/90 mb-4'>
                        Create private zones where only people inside can see and hear each other.
                    </p>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>Creating Private Areas</h4>
                        <ol className='list-decimal list-inside text-white/90 space-y-2 ml-2'>
                            <li>Open your space in the Map Editor</li>
                            <li>Click the "Special" tab</li>
                            <li>Select "Private Area"</li>
                            <li>Click and drag to draw the private zone</li>
                            <li>The area will darken to show it's private</li>
                        </ol>
                    </div>
                    <div className='bg-plum rounded-lg p-4'>
                        <h4 className='font-semibold text-white mb-2'>How They Work</h4>
                        <ul className='list-disc list-inside text-white/90 space-y-2 ml-2'>
                            <li>Only people inside the area can see/hear each other</li>
                            <li>Perfect for breakout rooms or sensitive discussions</li>
                            <li>The area fades when you enter to show you're in private mode</li>
                            <li>Walk out to return to the main space</li>
                        </ul>
                    </div>
                </Section>

                {/* Map Editor */}
                <Section id='map-editor' icon={<Pencil className='w-8 h-8' />} title='Map Editor'>
                    <p className='text-white/90 mb-4'>
                        Customize your space with the built-in map editor. Add floors, walls, furniture, and more!
                    </p>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>Editor Tools</h4>
                        <ul className='list-disc list-inside text-white/90 space-y-2 ml-2'>
                            <li><strong>Brush</strong>: Paint individual tiles</li>
                            <li><strong>Fill</strong>: Fill large areas quickly</li>
                            <li><strong>Eraser</strong>: Remove tiles (choose layer to erase)</li>
                            <li><strong>Special</strong>: Add teleports, whiteboards, private areas, spawn points</li>
                        </ul>
                    </div>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>Sprite Palettes</h4>
                        <p className='text-white/90 mb-2'>Choose from multiple sprite sets:</p>
                        <ul className='list-disc list-inside text-white/90 space-y-2 ml-2'>
                            <li><strong>Ground</strong>: Basic grass, dirt, sand tiles</li>
                            <li><strong>City</strong>: Urban tiles and objects</li>
                            <li><strong>Village</strong>: Medieval/rustic furniture</li>
                            <li><strong>Gather Sets</strong>: Architecture, floors, terrains, walls (15,000+ tiles!)</li>
                            <li><strong>Kenney Sets</strong>: City, buildings, landscape</li>
                        </ul>
                    </div>
                    <div className='bg-dark-plum/50 border border-sweet-mint rounded-lg p-4'>
                        <p className='text-sweet-mint text-sm'>
                            <strong>Tip:</strong> Use the tile mode dropdown to switch between single tile placement and multi-tile (2x2, 3x3, 4x4, 5x5) for faster building!
                        </p>
                    </div>
                </Section>

                {/* Sharing */}
                <Section id='sharing' icon={<ShareNetwork className='w-8 h-8' />} title='Sharing Your Space'>
                    <p className='text-white/90 mb-4'>
                        Invite your team to join your space with shareable links.
                    </p>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>From Dashboard</h4>
                        <ol className='list-decimal list-inside text-white/90 space-y-2 ml-2'>
                            <li>Find your space on the dashboard</li>
                            <li>Click the link icon on the space card</li>
                            <li>Share the copied invite link with teammates</li>
                        </ol>
                    </div>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>From Manage Page</h4>
                        <ol className='list-decimal list-inside text-white/90 space-y-2 ml-2'>
                            <li>Click the menu (•••) on your space</li>
                            <li>Select "Manage"</li>
                            <li>Go to "Sharing Options" tab</li>
                            <li>Copy the invite link or generate a new one</li>
                            <li>Toggle "Private Mode" to lock the space to only you</li>
                        </ol>
                    </div>
                    <div className='bg-dark-plum/50 border border-sweet-mint rounded-lg p-4'>
                        <p className='text-sweet-mint text-sm'>
                            <strong>Note:</strong> When someone clicks your invite link, they'll see the space name and can join automatically after signing in!
                        </p>
                    </div>
                </Section>

                {/* Controls */}
                <Section id='controls' icon={<Users className='w-8 h-8' />} title='Controls & Navigation'>
                    <div className='bg-plum rounded-lg p-4 mb-4'>
                        <h4 className='font-semibold text-white mb-2'>Keyboard Shortcuts</h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-white/90'>
                            <div>
                                <p className='font-semibold text-sweet-mint mb-1'>Movement</p>
                                <ul className='list-disc list-inside space-y-1 ml-2'>
                                    <li>WASD or Arrow Keys</li>
                                    <li>Click to walk</li>
                                </ul>
                            </div>
                            <div>
                                <p className='font-semibold text-sweet-mint mb-1'>View</p>
                                <ul className='list-disc list-inside space-y-1 ml-2'>
                                    <li>Mouse wheel: Zoom in/out</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='bg-plum rounded-lg p-4'>
                        <h4 className='font-semibold text-white mb-2'>Other Features</h4>
                        <ul className='list-disc list-inside text-white/90 space-y-2 ml-2'>
                            <li><strong>Change Character</strong>: Click your avatar icon to choose a new skin</li>
                            <li><strong>Chat</strong>: Type messages that appear above your character (300 chars max)</li>
                            <li><strong>Teleports</strong>: Walk onto teleport tiles to jump to another location</li>
                            <li><strong>Multiple Rooms</strong>: Large spaces can have multiple rooms to organize areas</li>
                        </ul>
                    </div>
                </Section>

                {/* Need Help */}
                <div className='bg-dark-plum border-2 border-plum rounded-xl p-8 mt-12 text-center'>
                    <h2 className='text-3xl font-bold text-white mb-4'>Need More Help?</h2>
                    <p className='text-white/80 mb-6'>
                        If you have questions or run into issues, reach out to the Rently team!
                    </p>
                    <Link href='/app' className='inline-block bg-sweet-mint text-dark-plum font-semibold px-8 py-3 rounded-lg hover:bg-white transition-colors'>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}

function Section({ id, icon, title, children }: { id: string, icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <section id={id} className='mb-12 scroll-mt-24'>
            <div className='flex items-center gap-3 mb-6'>
                <div className='bg-sweet-mint text-dark-plum p-3 rounded-lg'>
                    {icon}
                </div>
                <h2 className='text-3xl font-bold text-white'>{title}</h2>
            </div>
            <div className='space-y-4'>
                {children}
            </div>
        </section>
    )
}
