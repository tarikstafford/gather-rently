'use server'

import { createClient } from './client'
import { v4 as uuidv4 } from 'uuid'

export async function createWhiteboard(
  realmId: string,
  roomIndex: number,
  x: number,
  y: number
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('whiteboards')
    .insert({
      realm_id: realmId,
      room_index: roomIndex,
      x,
      y,
      canvas_data: {
        elements: [],
        appState: {}
      }
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create whiteboard:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getWhiteboardsForRoom(realmId: string, roomIndex: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('whiteboards')
    .select('*')
    .eq('realm_id', realmId)
    .eq('room_index', roomIndex)

  if (error) {
    console.error('Failed to fetch whiteboards:', error)
    return { data: [], error }
  }

  return { data: data || [], error: null }
}

export async function deleteWhiteboard(whiteboardId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('whiteboards')
    .delete()
    .eq('id', whiteboardId)

  if (error) {
    console.error('Failed to delete whiteboard:', error)
    return { error }
  }

  return { error: null }
}

export async function updateWhiteboardCanvas(whiteboardId: string, canvasData: any) {
  const supabase = createClient()

  const { error } = await supabase
    .from('whiteboards')
    .update({ canvas_data: canvasData })
    .eq('id', whiteboardId)

  if (error) {
    console.error('Failed to update whiteboard:', error)
    return { error }
  }

  return { error: null }
}
