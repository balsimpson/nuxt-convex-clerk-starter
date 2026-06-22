import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

type UploadedImage = {
  src: string
  alt?: string
  title?: string
}

type ImagePasteOptions = {
  upload: (file: File) => Promise<UploadedImage>
  onError?: (error: unknown) => void
}

export function createImagePasteExtension(options: ImagePasteOptions) {
  return Extension.create({
    name: 'imagePasteUpload',
    addProseMirrorPlugins() {
      const editor = this.editor

      return [
        new Plugin({
          key: new PluginKey('imagePasteUpload'),
          props: {
            handlePaste: (_view, event) => {
              const files = Array.from(event.clipboardData?.items ?? [])
                .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
                .map(item => item.getAsFile())
                .filter((file): file is File => file !== null)

              if (!files.length) return false

              event.preventDefault()

              void Promise.all(files.map(options.upload))
                .then((images) => {
                  if (editor.isDestroyed) return

                  editor
                    .chain()
                    .focus()
                    .insertContent(images.map(image => ({
                      type: 'image',
                      attrs: image
                    })))
                    .run()
                })
                .catch(error => options.onError?.(error))

              return true
            }
          }
        })
      ]
    }
  })
}
