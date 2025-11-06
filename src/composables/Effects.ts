import { Platform, QVueGlobals } from 'quasar'
import { DBTESTE } from 'src/composables/constants'

export default class Effects {
  /**
   * Efeito de fade-in para um elemento HTML.
   * @param el Elemento a ser animado.
   * @param duration Duração da animação em milissegundos (padrão: 500ms).
   */
  static fadeIn(el: HTMLElement | null, duration: number = 500): void {
    if (!el) return

    el.style.visibility = 'visible'
    el.style.opacity = '0'

    let last = performance.now()
    function tick(now: number) {
      el!.style.opacity = Math.min(
        1,
        parseFloat(el!.style.opacity) + (now - last) / duration,
      ).toString()
      last = now
      if (parseFloat(el!.style.opacity) < 1) {
        requestAnimationFrame(tick)
      }
    }
    requestAnimationFrame(tick)
  }

  /**
   * Efeito de fade-out para um elemento HTML.
   * @param el Elemento a ser animado.
   * @param duration Duração da animação em milissegundos (padrão: 500ms).
   */
  static fadeOut(el: HTMLElement | null, duration: number = 500): void {
    if (!el) return

    el.style.opacity = '1'

    let last = performance.now()
    function tick(now: number) {
      el!.style.opacity = Math.max(
        0,
        parseFloat(el!.style.opacity) - (now - last) / duration,
      ).toString()
      last = now
      if (parseFloat(el!.style.opacity) > 0) {
        requestAnimationFrame(tick)
      } else {
        el!.style.visibility = 'hidden'
      }
    }
    requestAnimationFrame(tick)
  }
}
