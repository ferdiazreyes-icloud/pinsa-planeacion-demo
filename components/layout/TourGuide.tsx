'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface TourStep {
  target: string
  title: string
  desc: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const SPOT_PAD = 10
const TIP_GAP  = 16
const TIP_W    = 300
const MARGIN   = 16   // min distance from any viewport edge

type Arrow = 'top' | 'bottom' | 'left' | 'right'
interface TipPos { top: number; left: number; arrow: Arrow }

function calcTipPos(
  rect: DOMRect,
  preferredPos: TourStep['position'],
  tipH: number,
): TipPos {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const { top: rt, right: rr, bottom: rb, left: rl, height: rh } = rect

  // Auto-flip if preferred direction has no room
  let pos = preferredPos
  if (pos === 'bottom' && rb + SPOT_PAD + TIP_GAP + tipH > vh - MARGIN) pos = 'top'
  if (pos === 'top'    && rt - SPOT_PAD - TIP_GAP - tipH < MARGIN)       pos = 'bottom'
  if (pos === 'right'  && rr + SPOT_PAD + TIP_GAP + TIP_W > vw - MARGIN) pos = 'left'
  if (pos === 'left'   && rl - SPOT_PAD - TIP_GAP - TIP_W < MARGIN)      pos = 'right'

  let top = 0, left = 0
  let arrow: Arrow = 'top'

  switch (pos) {
    case 'bottom':
      top   = rb + SPOT_PAD + TIP_GAP
      left  = Math.max(MARGIN, Math.min(rl, vw - TIP_W - MARGIN))
      arrow = 'top'
      break
    case 'top':
      top   = rt - SPOT_PAD - TIP_GAP - tipH
      left  = Math.max(MARGIN, Math.min(rl, vw - TIP_W - MARGIN))
      arrow = 'bottom'
      break
    case 'right':
      top   = rt + rh / 2 - tipH / 2
      left  = rr + SPOT_PAD + TIP_GAP
      arrow = 'left'
      break
    case 'left':
      top   = rt + rh / 2 - tipH / 2
      left  = rl - SPOT_PAD - TIP_GAP - TIP_W
      arrow = 'right'
      break
  }

  // Final clamp — never escape the viewport
  top  = Math.max(MARGIN, Math.min(top,  vh - tipH  - MARGIN))
  left = Math.max(MARGIN, Math.min(left, vw - TIP_W - MARGIN))

  return { top, left, arrow }
}

export default function TourGuide({
  steps,
  storageKey,
  welcomeTitle,
  welcomeDesc,
}: {
  steps: TourStep[]
  storageKey: string
  welcomeTitle: string
  welcomeDesc: string
}) {
  const [showWelcome, setShowWelcome] = useState(false)
  const [active,      setActive]      = useState(false)
  const [stepIdx,     setStepIdx]     = useState(0)
  const [spotRect,    setSpotRect]    = useState<DOMRect | null>(null)
  const [tipPos,      setTipPos]      = useState<TipPos>({ top: 0, left: 0, arrow: 'top' })
  const tooltipRef = useRef<HTMLDivElement>(null)

  /* ── first-visit welcome ── */
  useEffect(() => {
    const seen = localStorage.getItem(storageKey)
    if (!seen) {
      const t = setTimeout(() => setShowWelcome(true), 800)
      return () => clearTimeout(t)
    }
  }, [storageKey])

  /* ── sidebar "Ver tour guiado" event ── */
  useEffect(() => {
    const handler = () => {
      setShowWelcome(false)
      setStepIdx(0)
      setSpotRect(null)
      setActive(true)
    }
    window.addEventListener('pinsa-start-tour', handler)
    return () => window.removeEventListener('pinsa-start-tour', handler)
  }, [])

  /* ── scroll target into view, then measure ── */
  const measureStep = useCallback((idx: number) => {
    const s = steps[idx]
    if (!s) return
    const el = document.querySelector(s.target) as HTMLElement | null
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    setTimeout(() => {
      const rect = el.getBoundingClientRect()
      setSpotRect(rect)
      // First-pass position with estimate height; refined after tooltip renders (see useEffect below)
      const tipH = tooltipRef.current?.offsetHeight ?? 200
      setTipPos(calcTipPos(rect, s.position, tipH))
    }, 350)
  }, [steps])

  useEffect(() => { if (active) measureStep(stepIdx) }, [active, stepIdx, measureStep])

  /* ── second-pass: refine position after tooltip actually renders ── */
  useEffect(() => {
    if (!active || !spotRect) return
    const tipH = tooltipRef.current?.offsetHeight
    if (!tipH) return
    setTipPos(calcTipPos(spotRect, steps[stepIdx].position, tipH))
  }, [spotRect, active, stepIdx, steps])

  /* ── reposition on resize / scroll ── */
  useEffect(() => {
    if (!active) return
    const reposition = () => measureStep(stepIdx)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [active, stepIdx, measureStep])

  const endTour = useCallback(() => {
    setActive(false)
    setShowWelcome(false)
    setSpotRect(null)
    localStorage.setItem(storageKey, '1')
  }, [storageKey])

  const startTour = () => { setShowWelcome(false); setStepIdx(0); setSpotRect(null); setActive(true) }
  const goNext    = () => stepIdx < steps.length - 1 ? setStepIdx(i => i + 1) : endTour()
  const goPrev    = () => stepIdx > 0 && setStepIdx(i => i - 1)

  return (
    <>
      {/* ══ Welcome modal ══ */}
      {showWelcome && (
        <div className="tour-welcome">
          <div className="tour-welcome-backdrop" onClick={endTour} />
          <div className="tour-welcome-card">
            <div className="tour-welcome-icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/arena-icono-azul.png" alt="Arena Analytics" style={{ width: 40, height: 40, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
            <h2>{welcomeTitle}</h2>
            <p>{welcomeDesc}</p>
            <p className="tour-welcome-sub">¿Quieres un recorrido guiado por esta pantalla?</p>
            <div className="tour-welcome-actions">
              <button className="tour-btn tour-btn-skip" onClick={endTour}>No, gracias</button>
              <button className="tour-btn tour-btn-start" onClick={startTour}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 3.5l8 4.5-8 4.5V3.5z"/>
                </svg>
                Iniciar tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Tour overlay ══ */}
      {active && spotRect && (
        <div className="tour-overlay">
          <div className="tour-backdrop" onClick={endTour} />

          {/* Spotlight */}
          <div
            className="tour-spotlight"
            style={{
              top:    spotRect.top    - SPOT_PAD,
              left:   spotRect.left   - SPOT_PAD,
              width:  spotRect.width  + SPOT_PAD * 2,
              height: spotRect.height + SPOT_PAD * 2,
            }}
          />

          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className="tour-tooltip"
            style={{ top: tipPos.top, left: tipPos.left, width: TIP_W }}
          >
            <div className={`tour-arrow tour-arrow-${tipPos.arrow}`} />
            <div className="tour-badge">{stepIdx + 1} / {steps.length}</div>
            <h3 className="tour-title">{steps[stepIdx].title}</h3>
            <p className="tour-desc">{steps[stepIdx].desc}</p>
            <div className="tour-actions">
              <button className="tour-btn tour-btn-skip" onClick={endTour}>Saltar</button>
              <div className="tour-nav">
                <button className="tour-btn tour-btn-prev" onClick={goPrev} disabled={stepIdx === 0}>←</button>
                <button className="tour-btn tour-btn-next" onClick={goNext}>
                  {stepIdx === steps.length - 1 ? 'Finalizar ✓' : 'Siguiente →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
