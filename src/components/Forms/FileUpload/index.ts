export { default as FileUpload } from './FileUpload.vue'

/** A file added to the FileUpload model, tracked through upload. */
export interface UploadFile {
  id: string
  file: File
  /** 0–100 upload progress. Undefined = not tracked / completes instantly. */
  progress?: number
  /** Validation or upload failure message, shown under this file's row. */
  error?: string
}
