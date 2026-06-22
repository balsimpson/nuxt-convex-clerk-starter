import { useConvexMutation } from 'convex-vue'
import type { Editor } from '@tiptap/vue-3'
import { api } from '~~/convex/_generated/api'
import type { Id } from '~~/convex/_generated/dataModel'

type EditorSelection = {
  from: number
  to: number
}

export function useEditorImageUpload() {
  const { mutate: generateUploadUrl } = useConvexMutation(api.uploads.generateUploadUrl)
  const { mutate: saveImage } = useConvexMutation(api.uploads.saveImage)

  async function uploadEditorImage(file: File) {
    const uploadUrl = await generateUploadUrl({})
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: file.type ? { 'Content-Type': file.type } : undefined,
      body: file
    })

    if (!response.ok) {
      throw new Error('Convex rejected the image upload.')
    }

    const { storageId } = await response.json() as { storageId?: Id<'_storage'> }

    if (!storageId) {
      throw new Error('Convex did not return a storage ID for the uploaded image.')
    }

    const { url } = await saveImage({
      storageId,
      filename: file.name || undefined,
      contentType: file.type || undefined,
      size: file.size || undefined
    })

    if (!url) {
      throw new Error('Convex did not return a public image URL.')
    }

    return url
  }

  async function insertEditorImage(editor: Editor, selection: EditorSelection, file: File) {
    if (editor.isDestroyed) {
      throw new Error('The image insertion point is no longer available.')
    }

    const src = await uploadEditorImage(file)

    if (editor.isDestroyed) {
      throw new Error('The editor was closed before the image finished uploading.')
    }

    const maxPosition = editor.state.doc.content.size
    const from = Math.min(selection.from, maxPosition)
    const to = Math.min(Math.max(selection.to, from), maxPosition)
    const inserted = editor
      .chain()
      .focus()
      .insertContentAt(
        { from, to },
        {
          type: 'image',
          attrs: {
            src,
            alt: file.name,
            title: file.name
          }
        }
      )
      .run()

    if (!inserted) {
      throw new Error('The image could not be inserted into the post.')
    }
  }

  return { insertEditorImage, uploadEditorImage }
}
