import { onMounted, onUnmounted, ref } from 'vue'
import lottie, { AnimationItem } from 'lottie-web'

export interface LottieAnimationData {
  v: string
  fr: number
  ip: number
  op: number
  w: number
  h: number
  nm: string
  ddd: number
  assets: unknown[]
  layers: unknown[]
}

export function useLottie(
  animationData: LottieAnimationData,
  options: {
    loop?: boolean
    autoplay?: boolean
    speed?: number
  } = {}
) {
  const containerRef = ref<HTMLElement | null>(null)
  const animation = ref<AnimationItem | null>(null)

  const createAnimation = () => {
    if (!containerRef.value || !animationData) return

    // Destruir animación existente si hay una
    if (animation.value) {
      animation.value.destroy()
      animation.value = null
    }

    // Crear nueva animación
    animation.value = lottie.loadAnimation({
      container: containerRef.value,
      renderer: 'svg',
      loop: options.loop ?? true,
      autoplay: options.autoplay ?? true,
      animationData,
    })

    if (options.speed) {
      animation.value.setSpeed(options.speed)
    }

    // Asegurarse de que la animación esté en el primer frame si autoplay es false
    if (!options.autoplay) {
      animation.value.goToAndStop(0, true)
    }
  }

  onMounted(() => {
    createAnimation()
  })

  onUnmounted(() => {
    if (animation.value) {
      animation.value.destroy()
      animation.value = null
    }
  })

  return {
    containerRef,
    animation,
    createAnimation,
  }
}
