import type { ReactNode } from 'react'
import { Component } from 'react'

type Props = { children: ReactNode }
type State = { error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = {}

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-[60vh] p-7 flex items-center justify-center">
        <div
          className="w-full max-w-lg rounded-2xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
        >
          <h2 className="text-[16px] font-bold mb-2" style={{ color: 'var(--text-1)' }}>
            Something went wrong
          </h2>
          <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: 'var(--text-3)' }}>
            {this.state.error.message || 'Unexpected error.'}
          </p>
          <button
            className="px-3 py-2 rounded-lg text-[12.5px] font-semibold"
            style={{ background: 'var(--accent)', color: '#07070a' }}
            onClick={() => location.reload()}
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}
