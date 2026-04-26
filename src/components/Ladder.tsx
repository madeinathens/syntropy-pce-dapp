interface LadderProps {
  step: number
  totalSteps: number
  isDead: boolean
}

export function Ladder({ step, totalSteps, isDead }: LadderProps) {
  const rungs = Array.from({ length: totalSteps }, (_, i) => i + 1)

  let statusText = ''
  if (isDead) statusText = 'Cell is DEAD — awaiting buyback'
  else if (step >= totalSteps) statusText = 'Ladder COMPLETED'
  else if (step === 0) statusText = 'Awaiting first mitosis'
  else statusText = `Step ${step}/${totalSteps} in progress`

  return (
    <>
      <div className="ladder">
        {rungs.map((i) => {
          let cls = 'rung'
          if (i <= step) cls += ' done'
          if (i === step + 1 && step < totalSteps && !isDead) cls += ' current'
          return <div key={i} className={cls} title={`Step ${i.toString().padStart(2, '0')}`} />
        })}
      </div>
      <div className="ladder-meta">
        <span>Step 01</span>
        <span>{statusText}</span>
        <span>Step {totalSteps} — Apoptosis</span>
      </div>
    </>
  )
}
