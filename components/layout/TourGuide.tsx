'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface TourStep {
  target: string
  title: string
  desc: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const SPOT_PAD  = 10
const TIP_GAP   = 16
const TIP_W     = 300

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
  const [arrowDir,    setArrowDir]    = useState<'top'|'bottom'|'left'|'right'>('top')
  const tooltipRef = useRef<HTMLDivElement>(null)

  /* ── show welcome on first visit ── */
  useEffect(() => {
    const seen = localStorage.getItem(storageKey)
    if (!seen) {
      const t = setTimeout(() => setShowWelcome(true), 800)
      return () => clearTimeout(t)
    }
  }, [storageKey])

  /* ── sidebar "Ver tour" button fires this event ── */
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

  /* ── measure element and position spotlight ── */
  const measureStep = useCallback((idx: number) => {
    const s = steps[idx]
    if (!s) return
    const el = document.querySelector(s.target) as HTMLElement | null
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    setTimeout(() => {
      setSpotRect(el.getBoundingClientRect())
      setArrowDir(
        s.position === 'bottom' ? 'top'
          : s.position === 'top'    ? 'bottom'
          : s.position === 'right'  ? 'left'
          : 'right'
      )
    }, 350)
  }, [steps])

  useEffect(() => { if (active) measureStep(stepIdx) }, [active, stepIdx, measureStep])

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

  /* ── tooltip position ── */
  const tipStyle = (): { top: number; left: number } => {
    if (!spotRect || typeof window === 'undefined') return { top: 100, left: 100 }
    const s  = steps[stepIdx]
    const th = tooltipRef.current?.offsetHeight ?? 170
    const vw = window.innerWidth
    const vh = window.innerHeight
    const { top: rt, right: rr, bottom: rb, left: rl, width: rw, height: rh } = spotRect
    let top = 0, left = 0

    switch (s.position) {
      case 'bottom':
        top  = rb + SPOT_PAD + TIP_GAP
        left = Math.max(16, Math.min(rl, vw - TIP_W - 16))
        break
      case 'top':
        top  = rt - SPOT_PAD - TIP_GAP - th
        left = Math.max(16, Math.min(rl, vw - TIP_W - 16))
        break
      case 'right':
        top  = Math.max(16, Math.min(rt + rh / 2 - th / 2, vh - th - 16))
        left = Math.min(rr + SPOT_PAD + TIP_GAP, vw - TIP_W - 16)
        break
      case 'left':
        top  = Math.max(16, Math.min(rt + rh / 2 - th / 2, vh - th - 16))
        left = Math.max(16, rl - SPOT_PAD - TIP_GAP - TIP_W)
        break
    }
    return { top, left }
  }

  const tp = active && spotRect ? tipStyle() : { top: 0, left: 0 }

  return (
    <>
      {/* ══ Welcome modal ══ */}
      {showWelcome && (
        <div className="tour-welcome">
          <div className="tour-welcome-backdrop" onClick={endTour} />
          <div className="tour-welcome-card">
            <div className="tour-welcome-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
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
            style={{ top: tp.top, left: tp.left, width: TIP_W }}
          >
            <div className={`tour-arrow tour-arrow-${arrowDir}`} />
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
