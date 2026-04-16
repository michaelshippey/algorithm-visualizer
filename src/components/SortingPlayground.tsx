import { useEffect, useMemo, useRef, useState } from 'react'

type AlgorithmId = 'bubble' | 'insertion'

type Step = {
  array: number[]
  activeIndices: number[]
  description: string
}

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
}

function clone(arr: number[]) {
  return [...arr]
}

function bubbleSortSteps(input: number[]): Step[] {
  const arr = clone(input)
  const steps: Step[] = [
    {
      array: clone(arr),
      activeIndices: [],
      description: 'Initial array',
    },
  ]

  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: clone(arr),
        activeIndices: [j, j + 1],
        description: `Compare index ${j} and ${j + 1}`,
      })
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        steps.push({
          array: clone(arr),
          activeIndices: [j, j + 1],
          description: `Swap ${arr[j + 1]} and ${arr[j]}`,
        })
      }
    }
  }

  steps.push({
    array: clone(arr),
    activeIndices: [],
    description: 'Array sorted (bubble sort)',
  })

  return steps
}

function insertionSortSteps(input: number[]): Step[] {
  const arr = clone(input)
  const steps: Step[] = [
    {
      array: clone(arr),
      activeIndices: [],
      description: 'Initial array',
    },
  ]

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]
    let j = i - 1

    steps.push({
      array: clone(arr),
      activeIndices: [i],
      description: `Take ${key} as the next element to insert`,
    })

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j]
      steps.push({
        array: clone(arr),
        activeIndices: [j, j + 1],
        description: `Shift ${arr[j]} to the right`,
      })
      j--
    }
    arr[j + 1] = key
    steps.push({
      array: clone(arr),
      activeIndices: [j + 1],
      description: `Insert ${key} at its position`,
    })
  }

  steps.push({
    array: clone(arr),
    activeIndices: [],
    description: 'Array sorted (insertion sort)',
  })

  return steps
}

const ALGORITHMS: { id: AlgorithmId; label: string; buildSteps: (arr: number[]) => Step[] }[] =
  [
    { id: 'bubble', label: 'Bubble sort', buildSteps: bubbleSortSteps },
    { id: 'insertion', label: 'Insertion sort', buildSteps: insertionSortSteps },
  ]

export function SortingPlayground() {
  const [algorithm, setAlgorithm] = useState<AlgorithmId>('bubble')
  const [size, setSize] = useState(15)
  const [speed, setSpeed] = useState(450)
  const [baseArray, setBaseArray] = useState<number[]>(() => generateArray(15))
  const [steps, setSteps] = useState<Step[]>(() =>
    ALGORITHMS[0]!.buildSteps(generateArray(15)),
  )
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const current = useMemo(() => steps[index] ?? steps[steps.length - 1]!, [steps, index])

  useEffect(() => {
    const algo = ALGORITHMS.find((a) => a.id === algorithm)!
    const newSteps = algo.buildSteps(baseArray)
    setSteps(newSteps)
    setIndex(0)
  }, [algorithm, baseArray])

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
    }
    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => {
        if (prev >= steps.length - 1) {
          return prev
        }
        return prev + 1
      })
    }, speed) as unknown as number

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, speed, steps.length])

  const handleReset = () => {
    const arr = generateArray(size)
    setBaseArray(arr)
    setIsPlaying(false)
  }

  const handleStep = (direction: 1 | -1) => {
    setIsPlaying(false)
    setIndex((prev) => {
      const next = prev + direction
      if (next < 0) return 0
      if (next >= steps.length) return steps.length - 1
      return next
    })
  }

  return (
    <section className="av-panel">
      <header className="av-panel-header">
        <div>
          <h2 className="av-panel-title">Sorting playground</h2>
          <p className="av-panel-subtitle">
            Watch how different algorithms transform the same input step by step.
          </p>
        </div>
        <div className="av-badge-row">
          <span className="av-pill">Array length: {current.array.length}</span>
          <span className="av-pill">Step {index + 1} / {steps.length}</span>
        </div>
      </header>

      <div className="av-layout">
        <div className="av-controls">
          <label className="av-field">
            <span>Algorithm</span>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as AlgorithmId)}
            >
              {ALGORITHMS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>

          <label className="av-field">
            <span>Array size: {size}</span>
            <input
              type="range"
              min={5}
              max={40}
              value={size}
              onChange={(e) => {
                const next = Number(e.target.value)
                setSize(next)
                setBaseArray(generateArray(next))
                setIsPlaying(false)
              }}
            />
          </label>

          <label className="av-field">
            <span>Speed: {speed}ms</span>
            <input
              type="range"
              min={100}
              max={1000}
              step={50}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </label>

          <div className="av-button-row">
            <button
              className="av-button av-button-primary"
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              className="av-button"
              type="button"
              onClick={() => handleStep(-1)}
            >
              Step back
            </button>
            <button
              className="av-button"
              type="button"
              onClick={() => handleStep(1)}
            >
              Step forward
            </button>
            <button className="av-button" type="button" onClick={handleReset}>
              New array
            </button>
          </div>
        </div>

        <div className="av-visualizer">
          <div className="av-bars">
            {current.array.map((value, i) => {
              const isActive = current.activeIndices.includes(i)
              const height = (value / 100) * 100
              return (
                <div
                  key={`${value}-${i}`}
                  className={isActive ? 'av-bar av-bar-active' : 'av-bar'}
                  style={{ height: `${height}%` }}
                />
              )
            })}
          </div>
          <p className="av-step-description">{current.description}</p>
        </div>
      </div>
    </section>
  )
}

