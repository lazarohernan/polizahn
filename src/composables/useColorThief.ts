import ColorThief from 'colorthief'

interface RGB {
  r: number
  g: number
  b: number
}

interface ColorResult {
  dominantColor: RGB
  palette: RGB[]
}

export function useColorThief() {
  const rgbToHex = (rgb: RGB): string => {
    const toHex = (n: number): string => {
      const hex = Math.min(255, Math.max(0, n)).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
  }

  const extractColors = async (imageUrl: string): Promise<ColorResult> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = imageUrl
      
      img.onload = () => {
        try {
          const colorThief = new ColorThief()
          const [r, g, b] = colorThief.getColor(img)
          const palette = colorThief.getPalette(img, 3).map(([r, g, b]) => ({ r, g, b }))
          
          resolve({
            dominantColor: { r, g, b },
            palette
          })
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = (error) => reject(error)
    })
  }

  const createGradient = (color: RGB): string => {
    const hex = rgbToHex(color)
    // Crear un gradiente suave usando el color dominante
    return `linear-gradient(135deg, 
      ${hex},
      ${hex}DD,
      ${hex}AA
    )`
  }

  const getDefaultGradient = (): string => {
    // Gradiente por defecto usando #598392
    return `linear-gradient(135deg, 
      #598392,
      #598392DD,
      #598392AA
    )`
  }

  const getAvatarBackground = (): string => {
    // Color para avatares #124559
    return '#124559'
  }

  return {
    extractColors,
    createGradient,
    getDefaultGradient,
    getAvatarBackground
  }
}
