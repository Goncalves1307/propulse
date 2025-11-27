import LandingPage from "./pages/landing";
import "./index.css";
import { useState, useEffect } from "react";


function App(){
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

if (loading) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-light dark:bg-dark" role="status" aria-label="Loading">
            <div className="loader flex space-x-3 items-end">
                <div className="w-4 h-4 rounded-full bg-emerald-600 " style={{ animation: 'dot 0.6s infinite ease-in-out' }}></div>
                <div className="w-4 h-4 rounded-full bg-emerald-600 " style={{ animation: 'dot 0.6s infinite ease-in-out', animationDelay: '0.15s' }}></div>
                <div className="w-4 h-4 rounded-full bg-emerald-600 " style={{ animation: 'dot 0.6s infinite ease-in-out', animationDelay: '0.3s' }}></div>
            </div>
        </div>
    );
}
    return (
        <>
        <LandingPage />
        </>
    )
}

export default App;