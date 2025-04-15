export interface CropperResult {
  canvas: HTMLCanvasElement
  coordinates: {
    left: number
    top: number
    width: number
    height: number
  }
  rotation: number
  flip: {
    horizontal: boolean
    vertical: boolean
  }
}

export interface CropperRef {
  getResult: () => CropperResult
  setCoordinates: (coordinates: { left: number; top: number }) => void
  setRotation: (rotation: number) => void
  setFlip: (flip: { horizontal: boolean; vertical: boolean }) => void
}
