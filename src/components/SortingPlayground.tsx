import { useEffect, useMemo, useRef, useState } from 'react'

type AlgorithmId =
  | 'bubble'
  | 'insertion'
  | 'selection'
  | 'merge'
  | 'quick'
  | 'heap'

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

function selectionSortSteps(input: number[]): Step[] {
  const arr = clone(input)
  const steps: Step[] = [
    { array: clone(arr), activeIndices: [], description: 'Initial array' },
  ]

  for (let i = 0; i < arr.length; i++) {
    let minIndex = i
    steps.push({
      array: clone(arr),
      activeIndices: [i],
      description: `Select index ${i} as current minimum`,
    })

    for (let j = i + 1; j < arr.length; j++) {
      steps.push({
        array: clone(arr),
        activeIndices: [minIndex, j],
        description: `Compare current min (index ${minIndex}) with index ${j}`,
      })
      if (arr[j] < arr[minIndex]) {
        minIndex = j
        steps.push({
          array: clone(arr),
          activeIndices: [minIndex],
          description: `New minimum found at index ${minIndex}`,
        })
      }
    }

    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
      steps.push({
        array: clone(arr),
        activeIndices: [i, minIndex],
        description: `Swap index ${i} with min index ${minIndex}`,
      })
    }
  }

  steps.push({
    array: clone(arr),
    activeIndices: [],
    description: 'Array sorted (selection sort)',
  })

  return steps
}

function mergeSortSteps(input: number[]): Step[] {
  const arr = clone(input)
  const aux = clone(arr)
  const steps: Step[] = [
    { array: clone(arr), activeIndices: [], description: 'Initial array' },
  ]

  const record = (activeIndices: number[], description: string) => {
    steps.push({ array: clone(arr), activeIndices, description })
  }

  const merge = (lo: number, mid: number, hi: number) => {
    for (let k = lo; k <= hi; k++) aux[k] = arr[k]!

    let i = lo
    let j = mid + 1
    for (let k = lo; k <= hi; k++) {
      if (i > mid) {
        arr[k] = aux[j]!
        record([k, j], `Write remaining right value into index ${k}`)
        j++
      } else if (j > hi) {
        arr[k] = aux[i]!
        record([k, i], `Write remaining left value into index ${k}`)
        i++
      } else {
        record([i, j], `Compare left index ${i} and right index ${j}`)
        if (aux[j]! < aux[i]!) {
          arr[k] = aux[j]!
          record([k, j], `Write right value into index ${k}`)
          j++
        } else {
          arr[k] = aux[i]!
          record([k, i], `Write left value into index ${k}`)
          i++
        }
      }
    }
  }

  const sort = (lo: number, hi: number) => {
    if (hi <= lo) return
    const mid = Math.floor((lo + hi) / 2)
    sort(lo, mid)
    sort(mid + 1, hi)
    record([lo, mid, hi], `Merge ranges [${lo}, ${mid}] and [${mid + 1}, ${hi}]`)
    merge(lo, mid, hi)
  }

  sort(0, arr.length - 1)

  steps.push({
    array: clone(arr),
    activeIndices: [],
    description: 'Array sorted (merge sort)',
  })

  return steps
}

function quickSortSteps(input: number[]): Step[] {
  const arr = clone(input)
  const steps: Step[] = [
    { array: clone(arr), activeIndices: [], description: 'Initial array' },
  ]

  const record = (activeIndices: number[], description: string) => {
    steps.push({ array: clone(arr), activeIndices, description })
  }

  const partition = (lo: number, hi: number) => {
    const pivot = arr[hi]!
    record([hi], `Choose pivot ${pivot} at index ${hi}`)
    let i = lo
    for (let j = lo; j < hi; j++) {
      record([j, hi], `Compare index ${j} with pivot`)
      if (arr[j]! < pivot) {
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
          record([i, j, hi], `Swap index ${i} and ${j} (move smaller left)`)
        }
        i++
      }
    }
    ;[arr[i], arr[hi]] = [arr[hi]!, arr[i]!]
    record([i, hi], `Place pivot at index ${i}`)
    return i
  }

  const sort = (lo: number, hi: number) => {
    if (lo >= hi) return
    record([lo, hi], `Partition range [${lo}, ${hi}]`)
    const p = partition(lo, hi)
    sort(lo, p - 1)
    sort(p + 1, hi)
  }

  sort(0, arr.length - 1)

  steps.push({
    array: clone(arr),
    activeIndices: [],
    description: 'Array sorted (quick sort)',
  })

  return steps
}

function heapSortSteps(input: number[]): Step[] {
  const arr = clone(input)
  const steps: Step[] = [
    { array: clone(arr), activeIndices: [], description: 'Initial array' },
  ]

  const record = (activeIndices: number[], description: string) => {
    steps.push({ array: clone(arr), activeIndices, description })
  }

  const heapify = (heapSize: number, root: number) => {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2

    if (left < heapSize) {
      record([largest, left], `Compare root ${largest} with left child ${left}`)
      if (arr[left]! > arr[largest]!) largest = left
    }
    if (right < heapSize) {
      record([largest, right], `Compare current max ${largest} with right child ${right}`)
      if (arr[right]! > arr[largest]!) largest = right
    }

    if (largest !== root) {
      ;[arr[root], arr[largest]] = [arr[largest]!, arr[root]!]
      record([root, largest], `Swap to restore heap property`)
      heapify(heapSize, largest)
    }
  }

  // Build max heap
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    record([i], `Heapify subtree rooted at index ${i}`)
    heapify(arr.length, i)
  }

  // Extract elements from heap
  for (let end = arr.length - 1; end > 0; end--) {
    ;[arr[0], arr[end]] = [arr[end]!, arr[0]!]
    record([0, end], `Move max to index ${end}`)
    heapify(end, 0)
  }

  steps.push({
    array: clone(arr),
    activeIndices: [],
    description: 'Array sorted (heap sort)',
  })

  return steps
}

const ALGORITHMS: { id: AlgorithmId; label: string; buildSteps: (arr: number[]) => Step[] }[] =
  [
    { id: 'bubble', label: 'Bubble sort', buildSteps: bubbleSortSteps },
    { id: 'insertion', label: 'Insertion sort', buildSteps: insertionSortSteps },
    { id: 'selection', label: 'Selection sort', buildSteps: selectionSortSteps },
    { id: 'merge', label: 'Merge sort', buildSteps: mergeSortSteps },
    { id: 'quick', label: 'Quick sort', buildSteps: quickSortSteps },
    { id: 'heap', label: 'Heap sort', buildSteps: heapSortSteps },
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

