"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    // Prevent flash of unstyled content
    const script = document.createElement("script")
    script.innerHTML = `
      (function() {
        function getThemePreference() {
          if (typeof localStorage !== 'undefined' && localStorage.getItem('anamas-theme')) {
            return localStorage.getItem('anamas-theme');
          }
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        const isDark = getThemePreference() === 'dark';
        document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
      })();
    `
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
