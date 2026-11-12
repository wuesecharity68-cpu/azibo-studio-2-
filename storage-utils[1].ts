// AZIBO STUDIO uses external video storage.
// Firebase Storage is not used.

export const formatBytes = (
  bytes: number
): string => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 Bytes'
  }

  if (bytes === 0) {
    return '0 Bytes'
  }

  const units = [
    'Bytes',
    'KB',
    'MB',
    'GB',
    'TB',
  ]

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )

  const size =
    bytes / Math.pow(1024, index)

  return `${Math.round(size * 100) / 100} ${units[index]}`
}

export const getVideoFileSize = async (
  _storagePath: string
): Promise<number | null> => {
  return null
}

export const getFormattedFileSize = async (
  _storagePath: string
): Promise<string> => {
  return ''
}