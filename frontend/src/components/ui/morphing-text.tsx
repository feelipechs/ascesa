'use client'
import { useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const morphTime = 1.5
const cooldownTime = 0.5

const useMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(0)
  const timeRef = useRef(new Date())
  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current]
      if (!current1 || !current2) return

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`

      const invertedFraction = 1 - fraction
      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`

      current1.textContent = texts[textIndexRef.current % texts.length]
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length]
    },
    [texts]
  )

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current
    cooldownRef.current = 0
    let fraction = morphRef.current / morphTime
    if (fraction > 1) {
      cooldownRef.current = cooldownTime
      fraction = 1
    }
    setStyles(fraction)
    if (fraction === 1) textIndexRef.current++
  }, [setStyles])

  const doCooldown = useCallback(() => {
    morphRef.current = 0
    const [current1, current2] = [text1Ref.current, text2Ref.current]
    if (current1 && current2) {
      current2.style.filter = 'none'
      current2.style.opacity = '100%'
      current1.style.filter = 'none'
      current1.style.opacity = '0%'
    }
  }, [])

  useEffect(() => {
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const newTime = new Date()
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000
      timeRef.current = newTime
      cooldownRef.current -= dt
      if (cooldownRef.current <= 0) doMorph()
      else doCooldown()
    }
    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [doMorph, doCooldown])

  return { text1Ref, text2Ref }
}

interface MorphingTextProps {
  texts: string[]
  className?: string
}

// SVG filter — renderizado uma vez, fora do fluxo
const SvgFilters = () => (
  <svg className="fixed h-0 w-0" aria-hidden>
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
)

export function MorphingText({ texts, className }: MorphingTextProps) {
  const { text1Ref, text2Ref } = useMorphingText(texts)

  return (
    <>
      {/*
        Wrapper inline-block: ocupa espaço como texto normal.
        - `relative` + altura explícita = dimensão estável independente do texto atual.
        - `[filter:url(#threshold)_blur(0.6px)]` aplica o efeito de morph.
        - Ajuste o `w-[...]` para caber o seu texto mais longo.
      */}
      <span
        className={cn(
          'relative inline-block align-middle',
          // largura mínima = palavra mais longa para não pular o layout
          'min-w-[4ch]',
          // o filter de threshold que dá o efeito de liquefação
          '[filter:url(#threshold)_blur(0.6px)]',
          className
        )}
      >
        {/* span1 e span2 são absolute dentro do wrapper inline,
            que tem display:inline-block, então não vaza pro layout */}
        <span ref={text1Ref} aria-hidden className="absolute inset-0 whitespace-nowrap" />
        <span
          ref={text2Ref}
          className="whitespace-nowrap"
          // text2 é o "âncora" do tamanho: fica no fluxo normal,
          // text1 fica absolute em cima. Assim o wrapper sempre
          // tem a altura/largura do texto visível.
        />
      </span>
      <SvgFilters />
    </>
  )
}
