export type BackgroundConfig = {
  type: 'none' | 'blur' | 'image'
  url?: string
}

export const backgroundImageUrls = [
  'office',
  'space',
  'porch-691330_1280',
  'shibuyasky-4768679_1280', 
  'beach',
].map((imageName) => `${process.env.PUBLIC_URL}/backgrounds/${imageName}.jpg`)
