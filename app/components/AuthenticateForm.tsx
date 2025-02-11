'use client'

import { startAuthentication } from '@simplewebauthn/browser'
import { useState } from 'react'

export default function AuthenticateForm() {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const optionsRes = await fetch('/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      const options = await optionsRes.json()

      const asseResp = await startAuthentication(options)

      const verificationRes = await fetch('/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, assertion: asseResp }),
      })
      const verificationResult = await verificationRes.json()

      if (verificationResult.verified) {
        setMessage('Authentication successful!')
      } else {
        setMessage('Authentication failed.')
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <form onSubmit={handleAuthenticate} className="space-y-4">
      <div>
        <label htmlFor="auth-username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="auth-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
        />
      </div>
      <button 
        type="submit" 
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Authenticate
      </button>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}