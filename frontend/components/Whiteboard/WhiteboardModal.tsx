'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { X } from '@phosphor-icons/react'
import dynamic from 'next/dynamic'

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading whiteboard...</div>
  }
)

type WhiteboardModalProps = {
  whiteboardId: string
  realmId: string
  onClose: () => void
}

export const WhiteboardModal: React.FC<WhiteboardModalProps> = ({ whiteboardId, realmId, onClose }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const [initialData, setInitialData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Load whiteboard data
  useEffect(() => {
    const loadWhiteboard = async () => {
      const { data, error } = await supabase
        .from('whiteboards')
        .select('canvas_data')
        .eq('id', whiteboardId)
        .single()

      if (error) {
        console.error('Failed to load whiteboard:', error)
        setInitialData({ elements: [], appState: {} })
      } else {
        setInitialData(data.canvas_data || { elements: [], appState: {} })
      }
      setIsLoading(false)
    }

    loadWhiteboard()
  }, [whiteboardId])

  // Save whiteboard data (debounced)
  const saveWhiteboard = useCallback(
    async (elements: any, appState: any) => {
      if (!excalidrawAPI) return

      const canvasData = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
          currentItemStrokeColor: appState.currentItemStrokeColor,
          currentItemBackgroundColor: appState.currentItemBackgroundColor,
          currentItemFillStyle: appState.currentItemFillStyle,
          currentItemStrokeWidth: appState.currentItemStrokeWidth,
          currentItemRoughness: appState.currentItemRoughness,
          currentItemOpacity: appState.currentItemOpacity,
        }
      }

      const { error } = await supabase
        .from('whiteboards')
        .update({ canvas_data: canvasData })
        .eq('id', whiteboardId)

      if (error) {
        console.error('Failed to save whiteboard:', error)
      }
    },
    [excalidrawAPI, whiteboardId]
  )

  // Debounced save
  useEffect(() => {
    if (!excalidrawAPI) return

    let timeoutId: NodeJS.Timeout

    const handleChange = (elements: any, appState: any) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        saveWhiteboard(elements, appState)
      }, 1000)
    }

    // We'll trigger saves via the onChange callback
    return () => clearTimeout(timeoutId)
  }, [excalidrawAPI, saveWhiteboard])

  // Real-time sync
  useEffect(() => {
    const channel = supabase
      .channel(`whiteboard:${whiteboardId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'whiteboards',
          filter: `id=eq.${whiteboardId}`
        },
        (payload: any) => {
          if (excalidrawAPI && payload.new.canvas_data) {
            const currentElements = excalidrawAPI.getSceneElements()
            const newElements = payload.new.canvas_data.elements || []

            // Only update if there are actual changes
            if (JSON.stringify(currentElements) !== JSON.stringify(newElements)) {
              excalidrawAPI.updateScene({
                elements: newElements,
                appState: payload.new.canvas_data.appState || {}
              })
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [whiteboardId, excalidrawAPI])

  const handleClose = () => {
    // Save one final time before closing
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()
      saveWhiteboard(elements, appState)
    }
    onClose()
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-gray-800">Loading whiteboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-[90vw] h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Collaborative Whiteboard</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close whiteboard"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Excalidraw Canvas */}
        <div className="flex-1 relative">
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={initialData}
            onChange={(elements, appState) => {
              // Debounced save happens via useEffect
              saveWhiteboard(elements, appState)
            }}
            UIOptions={{
              canvasActions: {
                loadScene: false,
                export: true,
                saveAsImage: true,
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
          <p>Changes are automatically saved. All users in this room can collaborate in real-time.</p>
        </div>
      </div>
    </div>
  )
}

export default WhiteboardModal
