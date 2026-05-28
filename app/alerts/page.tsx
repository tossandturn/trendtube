'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AlertConfig {
  id: string
  type: 'trend_acceleration' | 'competition_drop' | 'breakout_prediction'
  name: string
  threshold: number
  isActive: boolean
  channels: ('email' | 'telegram' | 'discord')[]
}

const ALERT_TYPES = [
  { id: 'trend_acceleration', name: 'Trend Acceleration', desc: 'Alert when a trend\'s velocity increases by X%' },
  { id: 'competition_drop', name: 'Competition Drop', desc: 'Alert when creator activity in a niche decreases' },
  { id: 'breakout_prediction', name: 'Breakout Prediction', desc: 'Alert when AI predicts a trend will explode' },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertConfig[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAlert, setNewAlert] = useState<Partial<AlertConfig>>({
    type: 'trend_acceleration',
    threshold: 50,
    channels: ['email'],
  })

  useEffect(() => {
    const saved = localStorage.getItem('tubefission_alerts')
    if (saved) {
      setAlerts(JSON.parse(saved))
    }
  }, [])

  const saveAlerts = (updated: AlertConfig[]) => {
    setAlerts(updated)
    localStorage.setItem('tubefission_alerts', JSON.stringify(updated))
  }

  const addAlert = () => {
    if (!newAlert.name) return
    const alert: AlertConfig = {
      id: Date.now().toString(),
      type: newAlert.type as AlertConfig['type'],
      name: newAlert.name,
      threshold: newAlert.threshold || 50,
      isActive: true,
      channels: newAlert.channels || ['email'],
    }
    saveAlerts([...alerts, alert])
    setShowAddModal(false)
    setNewAlert({ type: 'trend_acceleration', threshold: 50, channels: ['email'] })
  }

  const toggleAlert = (id: string) => {
    const updated = alerts.map(a =>
      a.id === id ? { ...a, isActive: !a.isActive } : a
    )
    saveAlerts(updated)
  }

  const deleteAlert = (id: string) => {
    saveAlerts(alerts.filter(a => a.id !== id))
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trend Alerts</h1>
            <p className="text-gray-600">Get notified when opportunities emerge</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
          >
            + Add Alert
          </button>
        </div>

        {/* Connected Channels */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
          <h2 className="font-bold mb-4">Connected Channels</h2>
          <div className="flex gap-4">
            {[
              { id: 'email', name: 'Email', icon: '✉️', connected: true },
              { id: 'telegram', name: 'Telegram', icon: '💬', connected: false },
              { id: 'discord', name: 'Discord', icon: '🎮', connected: false },
            ].map((channel) => (
              <div key={channel.id} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                channel.connected ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'
              }`}>
                <span>{channel.icon}</span>
                <span className="font-medium">{channel.name}</span>
                <span className={`text-xs ${channel.connected ? 'text-green-600' : 'text-gray-500'}`}>
                  {channel.connected ? '✓ Connected' : 'Connect'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`w-12 h-6 rounded-full transition ${
                        alert.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        alert.isActive ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                    <div>
                      <h3 className="font-bold">{alert.name}</h3>
                      <p className="text-sm text-gray-500">
                        {ALERT_TYPES.find(t => t.id === alert.type)?.desc}
                        {' • '}
                        Threshold: {alert.threshold}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {alert.channels.map(ch => (
                        <span key={ch} className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {ch === 'email' ? '✉️' : ch === 'telegram' ? '💬' : '🎮'}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold mb-2">No alerts configured</h3>
            <p className="text-gray-600 mb-6">Set up alerts to get notified when trends accelerate or opportunities emerge</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
            >
              Create First Alert
            </button>
          </div>
        )}

        {/* Add Alert Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Alert</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Alert Name</label>
                  <input
                    type="text"
                    value={newAlert.name || ''}
                    onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                    placeholder="e.g., AI Trends"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Alert Type</label>
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as AlertConfig['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {ALERT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Threshold (%)</label>
                  <input
                    type="number"
                    value={newAlert.threshold}
                    onChange={(e) => setNewAlert({ ...newAlert, threshold: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notification Channels</label>
                  <div className="flex gap-2">
                    {['email', 'telegram', 'discord'].map((ch) => (
                      <button
                        key={ch}
                        onClick={() => {
                          const current = newAlert.channels || []
                          const updated = current.includes(ch as any)
                            ? current.filter(c => c !== ch)
                            : [...current, ch as any]
                          setNewAlert({ ...newAlert, channels: updated })
                        }}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          (newAlert.channels || []).includes(ch as any)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ch === 'email' ? '✉️ Email' : ch === 'telegram' ? '💬 Telegram' : '🎮 Discord'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={addAlert}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                >
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
