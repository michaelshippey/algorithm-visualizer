import { SortingPlayground } from './components/SortingPlayground'

export function App() {
  return (
    <div className="av-page">
      <header className="av-header">
        <div className="av-container av-header-inner">
          <div className="av-brand">
            <span className="av-dot" />
            <span className="av-brand-text">Algorithm Visualizer</span>
          </div>
          <span className="av-tagline">See algorithms come to life.</span>
        </div>
      </header>

      <main className="av-main">
        <div className="av-container">
          <section className="av-hero">
            <div>
              <p className="av-kicker">Interactive CS learning</p>
              <h1 className="av-title">Understand algorithms, one step at a time.</h1>
              <p className="av-subtitle">
                Choose an algorithm, tune the input, then watch each operation play out
                visually. Ideal for students, interview prep, and anyone who prefers
                intuition over walls of text.
              </p>
            </div>
          </section>

          <SortingPlayground />
        </div>
      </main>
    </div>
  )
}

