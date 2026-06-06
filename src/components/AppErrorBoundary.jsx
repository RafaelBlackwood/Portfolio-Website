import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App render failed', error, errorInfo);
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08070b] px-4 text-stone-300">
        <div className="w-full max-w-lg rounded-xl border border-red-500/40 bg-black/70 p-6 shadow-[0_0_40px_rgba(239,68,68,0.18)]">
          <div className="text-xs uppercase tracking-[0.28em] text-red-300">Game crashed</div>
          <h1 className="mt-3 text-2xl font-bold text-stone-100">Something broke while rendering this screen.</h1>
          <p className="mt-3 text-sm text-stone-400">
            Refresh the page once. If this appears again, send the message below so it can be fixed directly.
          </p>
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg border border-stone-800 bg-stone-950 p-3 text-xs text-red-200">
            {error?.message || String(error)}
          </pre>
          <button
            type="button"
            onClick={() => window.location.assign('/Game')}
            className="mt-5 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-400"
          >
            Restart Game
          </button>
        </div>
      </div>
    );
  }
}
