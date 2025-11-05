/**
 * 音频文件上传 API
 * 将录音文件上传到阿里云 OSS 并返回公网可访问的 URL
 */

import { supabase } from '@/utils/supabase'

/**
 * 上传音频文件到 Supabase Storage 并获取公网 URL
 */
export async function uploadAudioToStorage(blob: Blob): Promise<string> {
  const fileName = `recordings/recording_${Date.now()}_${Math.random().toString(36).slice(2)}.webm`
  
  const { data, error } = await supabase.storage
    .from('audio-files')
    .upload(fileName, blob, {
      contentType: 'audio/webm',
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error(`上传音频文件失败：${error.message}`)
  }

  // 获取公网可访问的 URL
  const { data: urlData } = supabase.storage
    .from('audio-files')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

/**
 * 删除临时音频文件
 */
export async function deleteAudioFile(fileUrl: string): Promise<void> {
  try {
    // 从 URL 中提取文件路径
    const url = new URL(fileUrl)
    const pathMatch = url.pathname.match(/\/audio-files\/(.+)$/)
    if (!pathMatch) {
      console.warn('无法从 URL 中提取文件路径:', fileUrl)
      return
    }
    
    const filePath = pathMatch[1]
    
    const { error } = await supabase.storage
      .from('audio-files')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
    }
  } catch (e) {
    console.error('删除文件失败:', e)
  }
}
