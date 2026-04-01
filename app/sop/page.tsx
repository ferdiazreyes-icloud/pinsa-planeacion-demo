'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Step1Forecast from '@/components/sop/Step1Forecast'
import Step2Collaboration from '@/components/sop/Step2Collaboration'
import Step3Quality from '@/components/sop/Step3Quality'
import Step4Inventory from '@/components/sop/Step4Inventory'
import Step5Finance from '@/components/sop/Step5Finance'
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Pronóstico estadístico', role: 'Planeador Demanda', shortLabel: 'Pronóstico' },
  { id: 2, label: 'Colaboración de ventas', role: 'Ejecutivo de Ventas', shortLabel: 'Colaboración' },
  { id: 3, label: 'Revisión de calidad', role: 'Planeador Demanda', shortLabel: 'Calidad' },
  { id: 4, label: 'Plan de inventarios', role: 'Planeador Inventarios', shortLabel: 'Inventarios' },
  { id: 5, label: 'Validación financiera', role: 'Finanzas', shortLabel: 'Finanzas' },
]

function SOPContent() {
  const searchParams = useSearchParams()
  const initialStep = parseInt(searchParams.get('step') ?? '1')
  const [currentStep, setCurrentStep] = useState(Math.min(Math.max(initialStep, 1), 5))
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleNext = () => {
    setCompletedSteps(prev => [...new Set([...prev, currentStep])])
    setCurrentStep(s => Math.min(s + 1, 5))
  }

  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 1))

  const goToStep = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step - 1)) setCurrentStep(step)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Ciclo S&OP Mensual</h1>
        <p className="text-slate-500 text-sm mt-1">Período: Marzo 2025 · Semana 2 de 4</p>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8">
        <div className="flex items-center gap-0 overflow-x-auto">
          {STEPS.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.id)
            const isCurrent = currentStep === step.id
            const isAccessible = step.id <= currentStep || completedSteps.includes(step.id - 1)

            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => goToStep(step.id)}
                  disabled={!isAccessible}
                  className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                    isCurrent ? 'bg-blue-50' : isCompleted ? 'hover:bg-slate-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={16} /> : step.id}
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold hidden sm:block ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {step.shortLabel}
                    </div>
                    <div className={`text-xs hidden md:block ${isCurrent ? 'text-blue-500' : 'text-slate-400'}`}>
                      {step.role}
                    </div>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <ArrowRight size={14} className={`flex-shrink-0 mx-1 ${idx < currentStep - 1 ? 'text-emerald-400' : 'text-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
            {currentStep}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{STEPS[currentStep - 1].label}</h2>
            <p className="text-sm text-slate-500">Rol: <span className="font-medium text-slate-700">{STEPS[currentStep - 1].role}</span></p>
          </div>
        </div>

        {currentStep === 1 && <Step1Forecast />}
        {currentStep === 2 && <Step2Collaboration />}
        {currentStep === 3 && <Step3Quality />}
        {currentStep === 4 && <Step4Inventory />}
        {currentStep === 5 && <Step5Finance />}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Paso anterior
          </button>
          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            >
              Confirmar y continuar <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={() => setCompletedSteps([1, 2, 3, 4, 5])}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <CheckCircle2 size={15} /> Aprobar plan Mar 2025
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SOPPage() {
  return (
    <Suspense>
      <SOPContent />
    </Suspense>
  )
}
