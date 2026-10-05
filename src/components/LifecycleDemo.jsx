import React, { useState, useEffect } from 'react';

// ==========================================================================
// LifecycleDemo Component (Demonstrates Functional Component Lifecycle with useEffect)
// 1. Mounting: useEffect with empty dependency array []
// 2. Updating: useEffect with dependency array [count]
// 3. Unmounting / Cleanup: return function inside useEffect
// ==========================================================================

const ChildTracker = ({ count }) => {
  const [timer, setTimer] = useState(0);

  // 1. MOUNTING & UNMOUNTING
  useEffect(() => {
    console.log("Component Mounted");
    const intervalId = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      console.log("Component Unmounted");
      clearInterval(intervalId);
    };
  }, []);

  // 2. UPDATING
  useEffect(() => {
    if (count !== undefined && count > 0) {
      console.log("Component Updated");
    }
  }, [count]);

  return (
    <div className="alert alert-dark border-secondary mt-3 p-3 bg-dark text-white shadow-sm">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <span className="spinner-grow spinner-grow-sm text-success me-2" role="status"></span>
          <strong>Live Telemetry Stream Active</strong>
          <div className="small text-white-50 mt-1">
            Active session timer: <span className="badge bg-success">{timer}s</span> | Allocation: <span className="badge bg-accent text-dark">{count} units</span>
          </div>
        </div>
        <span className="badge bg-success text-white px-2 py-1">Online</span>
      </div>
    </div>
  );
};

const LifecycleDemo = () => {
  const [count, setCount] = useState(0);
  const [showChild, setShowChild] = useState(true);
  const [logs, setLogs] = useState([]);

  const addLog = (message, phase) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ id: Date.now() + Math.random(), time, message, phase }, ...prev.slice(0, 14)]);
  };

  // 1. MOUNTING & UNMOUNTING OF LIFECYCLEDEMO
  useEffect(() => {
    console.log("%c[LifecycleDemo] Parent Component Mounted.", "color: #0d6efd; font-weight: bold;");
    addLog("Parent Component Mounted into DOM", "Mount");

    return () => {
      console.log("%c[LifecycleDemo] Parent Component Unmounted.", "color: #dc3545; font-weight: bold;");
    };
  }, []);

  // 2. UPDATING PHASE (Runs whenever 'count' state changes)
  useEffect(() => {
    if (count > 0) {
      console.log(`%c[LifecycleDemo] Component Updated: count is now ${count}`, "color: #fd7e14; font-weight: bold;");
      addLog(`Component Updated: count changed to ${count}`, "Update");
    }
  }, [count]); // Dependency array with [count]

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <span className="badge bg-dark text-accent px-3 py-2 text-uppercase mb-2">Live Commerce Telemetry</span>
        <h2 className="section-title">Live Flash Drop & Inventory Pulse</h2>
        <p className="text-muted" style={{ maxWidth: '720px', margin: '0 auto' }}>
          Real-time inventory synchronization, instant cart reservation timer, and active session monitoring for high-demand apparel releases.
        </p>
      </div>

      <div className="row g-4">
        {/* Interactive Controls Card */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white fw-bold">
              <i className="bi bi-broadcast text-accent me-2"></i> Live Inventory Session Controls
            </div>
            <div className="card-body p-4">
              {/* Trigger 1: State Update */}
              <div className="mb-4 p-3 bg-light rounded border">
                <h6 className="fw-bold mb-1">1. Reserved Cart Allocation</h6>
                <p className="small text-muted mb-2">
                  Adjust your live reserved unit quota for high-demand flash drops.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn btn-accent btn-sm px-3"
                    onClick={() => setCount((c) => c + 1)}
                  >
                    <i className="bi bi-plus-circle me-1"></i> Add Reserved Unit ({count})
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setCount(0)}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Trigger 2: Mount / Unmount Toggle */}
              <div className="p-3 bg-light rounded border">
                <h6 className="fw-bold mb-1">2. Live Stream Listener</h6>
                <p className="small text-muted mb-2">
                  Connect or disconnect the live inventory telemetry stream and heartbeat listener.
                </p>
                <button
                  className={`btn btn-sm ${showChild ? 'btn-outline-danger' : 'btn-outline-success'}`}
                  onClick={() => {
                    const nextState = !showChild;
                    setShowChild(nextState);
                    addLog(
                      nextState ? "Live Inventory Stream Connected" : "Live Inventory Stream Disconnected (Cleanup Completed)",
                      nextState ? "Mount" : "Unmount"
                    );
                  }}
                >
                  <i className={`bi ${showChild ? 'bi-stop-circle' : 'bi-play-circle'} me-1`}></i>
                  {showChild ? 'Disconnect Live Stream' : 'Connect Live Stream'}
                </button>

                {showChild && <ChildTracker count={count} />}
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity Log Card */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-activity text-accent me-2"></i> Live Inventory Activity Stream
              </span>
              <span className="badge bg-secondary font-monospace small">Live Telemetry</span>
            </div>
            <div className="card-body p-3 overflow-auto" style={{ maxHeight: '380px' }}>
              {logs.length === 0 ? (
                <div className="text-muted text-center py-4">No activity recorded yet.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {logs.map((log) => (
                    <div key={log.id} className="list-group-item d-flex justify-content-between align-items-center px-2 py-2">
                      <div>
                        <span
                          className={`badge me-2 ${
                            log.phase === 'Mount'
                              ? 'bg-success'
                              : log.phase === 'Update'
                              ? 'bg-warning text-dark'
                              : 'bg-danger'
                          }`}
                        >
                          {log.phase}
                        </span>
                        <span className="small fw-semibold">{log.message}</span>
                      </div>
                      <small className="text-muted font-monospace">{log.time}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer bg-light small text-muted">
              <i className="bi bi-info-circle me-1"></i> Live heartbeat and stream connection logs recorded in browser console.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifecycleDemo;
