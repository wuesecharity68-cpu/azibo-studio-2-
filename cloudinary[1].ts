const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

const CLOUDINARY_UPLOAD_PRESET = 'azibo-unsigned'

interface CloudinaryUploadResponse {
  secure_url?: string
  resource_type?: string
  public_id?: string
  error?: {
    message?: string
  }
}

export async function uploadToCloudinary(
  file: File
): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      'Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'
    )
  }

  if (!(file instanceof File)) {
    throw new Error('Invalid file was provided')
  }

  if (file.size <= 0) {
    throw new Error('The selected file is empty')
  }

  const formData = new FormData()

  formData.append('file', file)
  formData.append(
    'upload_preset',
    CLOUDINARY_UPLOAD_PRESET
  )

  const uploadUrl =
    `https://api.cloudinary.com/v1_1/` +
    `${CLOUDINARY_CLOUD_NAME}/auto/upload`

  let response: Response

  try {
    response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })
  } catch (error) {
    console.error(
      '[AZIBO] Cloudinary network error:',
      error
    )

    throw new Error(
      'Unable to connect to Cloudinary.'
    )
  }

  const data: CloudinaryUploadResponse =
    await response.json().catch(() => ({}))

  if (!response.ok) {
    console.error(
      '[AZIBO] Cloudinary upload failed:',
      data
    )

    throw new Error(
      data.error?.message ??
        'Cloudinary upload failed.'
    )
  }

  if (!data.secure_url) {
    throw new Error(
      'Cloudinary did not return a secure URL.'
    )
  }

  return data.secure_url
}