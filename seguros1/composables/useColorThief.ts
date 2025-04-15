import ColorThief from 'colorthief'

interface ColorResult {
  dominantColor: string
  palette: string[]
}

export function useColorThief() {
  const extractColors = async (imageUrl: string): Promise<ColorResult> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = imageUrl
      
      img.onload = () => {
        try {
          const colorThief = new ColorThief()
          const dominantColor = colorThief.getColor(img)
          const palette = colorThief.getPalette(img, 5)
          
          resolve({
            dominantColor: `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
            palette: palette.map(color => `rgb(${color[0]}, ${color[1]}, ${color[2]})`)
          })
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = (error) => reject(error)
    })
  }

  const createGradient = (colors: string[]): string => {
    return `linear-gradient(135deg, ${colors.join(', ')})`
  }

  const createOverlay = (color: string): string => {
    return `linear-gradient(to bottom, ${color}80, ${color}40)`
  }

  return {
    extractColors,
    createGradient,
    createOverlay
  }
}
