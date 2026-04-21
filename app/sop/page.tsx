'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import TourGuide, { type TourStep } from '@/components/layout/TourGuide'
import Step1Forecast from '@/components/sop/Step1Forecast'
import Step2Collaboration from '@/components/sop/Step2Collaboration'
import Step4Inventory from '@/components/sop/Step4Inventory'
import Step4Production from '@/components/sop/Step4Production'
import Step5Distribution from '@/components/sop/Step5Distribution'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Pronóstico estadístico',     role: 'Planeador Demanda',     shortLabel: 'Pronóstico'   },
  { id: 2, label: 'Colaboración comercial',      role: 'Equipo Comercial',      shortLabel: 'Colaboración' },
  { id: 3, label: 'Planeación de Inventarios',   role: 'Supply Chain',          shortLabel: 'Inventarios'  },
  { id: 4, label: 'Planeación de Producción',    role: 'Operaciones Planta',    shortLabel: 'Producción'   },
  { id: 5, label: 'Planeación de Distribución',  role: 'Logística',             shortLabel: 'Distribución' },
]

function SOPContent() {
  const searchParams = useSearchParams()
  const initialStep = parseInt(searchParams.get('step') ?? '1')
  const [currentStep, setCurrentStep]     = useState(Math.min(Math.max(initialStep, 1), 5))
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const SOP_TOUR: TourStep[] = [
    { target: '[data-tour="sop-stepper"]',     title: 'Ciclo S&OP en 5 pasos',    desc: 'El proceso mensual completo en una sola pantalla. El stepper muestra en qué paso estás. Puedes regresar a cualquier paso ya completado.',          position: 'bottom' },
    { target: '[data-tour="sop-step-header"]', title: 'Rol responsable del paso', desc: 'Cada paso indica qué rol ejecuta la acción: Planeador de Demanda, Equipo Comercial, Supply Chain, Operaciones de Planta o Logística. Facilita la coordinación entre equipos.',           position: 'bottom' },
    { target: '[data-tour="sop-content"]',     title: 'Contenido del paso actual', desc: 'Aquí se muestra la información y herramientas del paso en curso: pronóstico, ajustes comerciales, inventarios por nodo, programa de producción y plan de reposición.',    position: 'top'    },
    { target: '[data-tour="sop-nav"]',         title: 'Navegar entre pasos',       desc: 'Usa "Confirmar y continuar" para avanzar. El flujo es secuencial pero puedes regresar con "Paso anterior" en cualquier momento sin perder cambios.', position: 'top'    },
  ]

  const handleNext = () => {
    setCompletedSteps(prev => [...new Set([...prev, currentStep])])
    setCurrentStep(s => Math.min(s + 1, 5))
  }
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 1))
  const goToStep   = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step - 1)) setCurrentStep(step)
  }

  return (
    <div className="px-8 py-7 max-w-screen-xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Ciclo S&OP Mensual</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Período: Abril 2026 · Semana 2 de 4</p>
      </div>

      {/* Stepper */}
      <div data-tour="sop-stepper" className="ec-card px-6 py-4 mb-6 animate-fade-in-up">
        <div className="flex items-center gap-0 overflow-x-auto">
          {STEPS.map((step, idx) => {
            const isCompleted  = completedSteps.includes(step.id)
            const isCurrent    = currentStep === step.id
            const isAccessible = step.id <= currentStep || completedSteps.includes(step.id - 1)

            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => goToStep(step.id)}
                  disabled={!isAccessible}
                  className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all"
                  style={{
                    background: isCurrent ? 'rgba(36,45,81,0.08)' : 'transparent',
                    cursor: isAccessible ? 'pointer' : 'not-allowed',
                    opacity: isAccessible ? 1 : 0.4,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                    style={{
                      background: isCompleted ? '#1A7A6E' : isCurrent ? '#242d51' : 'var(--bg-tertiary)',
                      color: isCompleted || isCurrent ? 'white' : 'var(--text-tertiary)',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={15} /> : step.id}
                  </div>
                  <div className="text-center hidden sm:block">
                    <div
                      className="text-xs font-semibold"
                      style={{ color: isCurrent ? '#242d51' : isCompleted ? '#1A7A6E' : 'var(--text-tertiary)' }}
                    >
                      {step.shortLabel}
                    </div>
                    <div className="text-xs hidden md:block" style={{ color: 'var(--text-tertiary)' }}>
                      {step.role}
                    </div>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <ArrowRight
                    size={13}
                    className="flex-shrink-0 mx-1"
                    style={{ color: idx < currentStep - 1 ? '#1A7A6E' : 'var(--border-primary)' }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="ec-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        {/* Step header */}
        <div
          data-tour="sop-step-header"
          className="flex items-center gap-3 mb-6 pb-5"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg flex-shrink-0"
            style={{ background: 'var(--brand-navy)' }}
          >
            {currentStep}
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {STEPS[currentStep - 1].label}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Rol: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{STEPS[currentStep - 1].role}</span>
            </p>
          </div>
          <div className="ml-auto">
            <span
              className="text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{ background: 'rgba(43,76,126,0.08)', color: 'var(--brand-navy)' }}
            >
              Abr 2026
            </span>
          </div>
        </div>

        <div data-tour="sop-content">
        {currentStep === 1 && <Step1Forecast />}
        {currentStep === 2 && <Step2Collaboration />}
        {currentStep === 3 && <Step4Inventory />}
        {currentStep === 4 && <Step4Production />}
        {currentStep === 5 && <Step5Distribution />}
        </div>

        {/* Navigation */}
        <div
          data-tour="sop-nav"
          className="flex items-center justify-between mt-8 pt-5"
          style={{ borderTop: '1px solid var(--border-primary)' }}
        >
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
          >
            ← Paso anterior
          </button>
          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 flex items-center gap-2"
              style={{ background: 'var(--brand-navy)' }}
            >
              Confirmar y continuar <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => setCompletedSteps([1,2,3,4,5])}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 flex items-center gap-2"
              style={{ background: '#1A7A6E' }}
            >
              <CheckCircle2 size={14} /> Aprobar plan Abr 2026
            </button>
          )}
        </div>
      </div>
      <TourGuide
        steps={SOP_TOUR}
        storageKey="pinsa-tour-sop"
        welcomeTitle="Ciclo S&OP Mensual"
        welcomeDesc="Flujo guiado de 5 pasos: Pronóstico → Colaboración Comercial → Inventarios → Producción → Distribución."
      />
    </div>
  )
}

export default function SOPPage() {
  return <Suspense><SOPContent /></Suspense>
}
