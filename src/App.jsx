import { useState } from 'react'
import './App.css'
import { signInWithGoogle } from './firebase'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="google-icon">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.4-1.7 4.1-5.4 4.1-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.5 14.7 2.5 12 2.5 6.9 2.5 2.6 6.8 2.6 12s4.3 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.2-.2-1.7H12Z"
      />
      <path
        fill="#34A853"
        d="M3.5 7.4l3.7 2.7c1-1.9 2.9-3.3 4.8-3.3 1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.5 14.7 2.5 12 2.5c-3.7 0-6.8 2.2-8.5 5.4Z"
      />
      <path
        fill="#FBBC05"
        d="M3.5 16.6c1.7 3.2 4.8 5.4 8.5 5.4 2.7 0 4.8-.9 6.4-2.4l-2.9-2.4c-.8.6-1.9 1-3.5 1-3.7 0-5.2-2.7-5.4-4.1L3.5 16.6Z"
      />
      <path
        fill="#4285F4"
        d="M12 21.9c2.7 0 4.8-.9 6.4-2.4l-2.9-2.4c-.8.6-1.9 1-3.5 1-3.7 0-5.2-2.7-5.4-4.1L3.5 16.6c1.7 3.2 4.8 5.4 8.5 5.4Z"
      />
    </svg>
  )
}

function ExpenseLogo() {
  return (
    <svg viewBox="0 0 120 120" aria-label="Expense manager logo" className="expense-logo">
      <defs>
        <linearGradient id="expenseGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      <rect x="14" y="14" width="92" height="92" rx="28" fill="url(#expenseGradient)" />
      <path
        d="M38 72.5C38 58.2 49.2 47 63.5 47H72c11.6 0 21 9.4 21 21v4.5C93 83.1 84.1 92 73.5 92H52.5C43.2 92 36 84.8 36 75.5V72.5H38ZM58 52.5H64.5C71.4 52.5 77 58.1 77 65V66.5H58V52.5Z"
        fill="#ffffff"
        opacity="0.95"
      />
      <path d="M46 34H74" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
      <path d="M46 40L62 28L74 40" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M59 66H80" stroke="#a5b4fc" strokeWidth="6" strokeLinecap="round" />
      <path d="M59 74H74" stroke="#c4b5fd" strokeWidth="6" strokeLinecap="round" />
      <circle cx="42" cy="82" r="8" fill="#7dd3fc" opacity="0.9" />
      <path d="M42 77V87M37 82H47" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [typeOptions, setTypeOptions] = useState(['Credit', 'Debit'])
  const [sourceOptions, setSourceOptions] = useState(['PNB Bank', 'HDFC', 'SBI', 'Wallet', 'Other'])
  const [categoryOptions, setCategoryOptions] = useState(['Home', 'Travel', 'Education', 'Gym', 'Other'])
  const [rows, setRows] = useState([
    { date: '', amount: '', type: '', typeCustom: '', source: '', sourceCustom: '', category: '', categoryCustom: '', description: '' },
  ])

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle()
      console.log('User email:', result.user.email)
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  const updateRow = (index, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)),
    )
  }

  const updateChoice = (index, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row, rowIndex) => {
        if (rowIndex !== index) return row

        const nextRow = { ...row, [field]: value }

        if (value === 'Other') {
          nextRow[`${field}Custom`] = row[`${field}Custom`] || ''
        } else {
          nextRow[`${field}Custom`] = ''
        }

        return nextRow
      }),
    )
  }

  const addCustomOption = (field, value) => {
    const normalized = value.trim()
    if (!normalized) return

    if (field === 'type') {
      setTypeOptions((current) => (current.includes(normalized) ? current : [...current, normalized]))
      return
    }

    if (field === 'source') {
      setSourceOptions((current) => (current.includes(normalized) ? current : [...current, normalized]))
      return
    }

    setCategoryOptions((current) => (current.includes(normalized) ? current : [...current, normalized]))
  }

  const saveCustomChoice = (index, field, value) => {
    const normalized = value.trim()
    if (!normalized) return

    addCustomOption(field, normalized)

    setRows((currentRows) =>
      currentRows.map((row, rowIndex) => {
        if (rowIndex !== index) return row

        return {
          ...row,
          [field]: normalized,
          [`${field}Custom`]: normalized,
        }
      }),
    )
  }

  const addRow = () => {
    setRows((currentRows) => [
      ...currentRows,
      { date: '', amount: '', type: '', typeCustom: '', source: '', sourceCustom: '', category: '', categoryCustom: '', description: '' },
    ])
  }

  if (isLoggedIn) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <header className="dashboard-header">
            <nav className="header-left" aria-label="Main navigation">
              <button type="button" className="nav-link active">Home</button>
            </nav>

            <button type="button" className="logout-button" onClick={() => setIsLoggedIn(false)}>
              Log out
            </button>
          </header>

          <div className="sheet-toolbar">
            <button type="button" className="add-row-button" onClick={addRow}>
              + Add row
            </button>
          </div>

          <div className="sheet-table-wrapper">
            <table className="sheet-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Category</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <input
                        type="date"
                        value={row.date}
                        onChange={(event) => updateRow(rowIndex, 'date', event.target.value)}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={row.amount}
                        onChange={(event) => updateRow(rowIndex, 'amount', event.target.value)}
                      />
                    </td>

                    <td>
                      <div className="cell-field">
                        <select
                          value={row.type || ''}
                          onChange={(event) => updateChoice(rowIndex, 'type', event.target.value)}
                        >
                          <option value="">Select</option>
                          {typeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                        {row.type === 'Other' && (
                          <input
                            type="text"
                            className="inline-input"
                            value={row.typeCustom || ''}
                            placeholder="Type name"
                            onChange={(event) => updateRow(rowIndex, 'typeCustom', event.target.value)}
                            onBlur={(event) => {
                              saveCustomChoice(rowIndex, 'type', event.target.value)
                            }}
                          />
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="cell-field">
                        <select
                          value={row.source || ''}
                          onChange={(event) => updateChoice(rowIndex, 'source', event.target.value)}
                        >
                          <option value="">Select</option>
                          {sourceOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {row.source === 'Other' && (
                          <input
                            type="text"
                            className="inline-input"
                            value={row.sourceCustom || ''}
                            placeholder="Bank name"
                            onChange={(event) => updateRow(rowIndex, 'sourceCustom', event.target.value)}
                            onBlur={(event) => {
                              saveCustomChoice(rowIndex, 'source', event.target.value)
                            }}
                          />
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="cell-field">
                        <select
                          value={row.category || ''}
                          onChange={(event) => updateChoice(rowIndex, 'category', event.target.value)}
                        >
                          <option value="">Select</option>
                          {categoryOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {row.category === 'Other' && (
                          <input
                            type="text"
                            className="inline-input"
                            value={row.categoryCustom || ''}
                            placeholder="Category"
                            onChange={(event) => updateRow(rowIndex, 'categoryCustom', event.target.value)}
                            onBlur={(event) => {
                              saveCustomChoice(rowIndex, 'category', event.target.value)
                            }}
                          />
                        )}
                      </div>
                    </td>

                    <td>
                      <input
                        type="text"
                        placeholder="Description"
                        value={row.description}
                        onChange={(event) => updateRow(rowIndex, 'description', event.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="brand-wrap">
          <ExpenseLogo />
        </div>

        <h1>Welcome back</h1>
        <p>Sign in to your expense manager</p>

        <button type="button" className="google-button" onClick={handleGoogleLogin}>
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
      </div>
    </main>
  )
}

export default App
