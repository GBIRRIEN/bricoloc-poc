'use client'

import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

type Entrepot = { id: number; nom: string; ville: string; pays: string }
type StockItem = {
  id: number; nomOutil: string; categorie: string;
  quantiteDisponible: number; quantiteTotale: number;
  entrepotId: number; entrepotNom: string; entrepotVille: string
}

const CATEGORIES = ['Perçage', 'Découpe', 'Maçonnerie', 'Peinture', 'Jardinage', 'Échafaudage', 'Autre']

const badge = (dispo: number, total: number) => {
  const pct = total === 0 ? 0 : (dispo / total) * 100
  const color = pct > 50 ? '#2e7d32' : pct > 20 ? '#f57f17' : '#c62828'
  return (
    <span style={{
      background: color, color: 'white', borderRadius: '12px',
      padding: '2px 10px', fontSize: '0.8rem', fontWeight: 600
    }}>
      {dispo}/{total}
    </span>
  )
}

export default function Home() {
  const [items, setItems] = useState<StockItem[]>([])
  const [entrepots, setEntrepots] = useState<Entrepot[]>([])
  const [filterEntrepot, setFilterEntrepot] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<StockItem | null>(null)
  const [form, setForm] = useState({ nomOutil: '', categorie: 'Perçage', quantiteDisponible: 0, quantiteTotale: 0, entrepotId: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [s, e] = await Promise.all([
        fetch(`${API}/api/stock`).then(r => r.json()),
        fetch(`${API}/api/entrepots`).then(r => r.json()),
      ])
      setItems(s)
      setEntrepots(e)
      if (e.length > 0 && !form.entrepotId) setForm(f => ({ ...f, entrepotId: String(e[0].id) }))
    } catch {
      setError('Impossible de joindre le backend. Vérifiez que Docker est lancé.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const resetForm = () => {
    setForm({ nomOutil: '', categorie: 'Perçage', quantiteDisponible: 0, quantiteTotale: 0, entrepotId: String(entrepots[0]?.id || '') })
    setEditing(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = { ...form, entrepotId: Number(form.entrepotId), quantiteDisponible: Number(form.quantiteDisponible), quantiteTotale: Number(form.quantiteTotale) }
    if (editing) {
      await fetch(`${API}/api/stock/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      await fetch(`${API}/api/stock`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    await fetchAll()
    resetForm()
  }

  const handleEdit = (item: StockItem) => {
    setEditing(item)
    setForm({ nomOutil: item.nomOutil, categorie: item.categorie, quantiteDisponible: item.quantiteDisponible, quantiteTotale: item.quantiteTotale, entrepotId: String(item.entrepotId) })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet outil du stock ?')) return
    await fetch(`${API}/api/stock/${id}`, { method: 'DELETE' })
    await fetchAll()
  }

  const displayed = filterEntrepot === 'all' ? items : items.filter(i => String(i.entrepotId) === filterEntrepot)

  if (error) return <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px' }}>⚠️ {error}</div>
  if (loading) return <div>Chargement...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a237e' }}>Gestion des Stocks</h1>
          <p style={{ margin: '4px 0 0', color: '#666' }}>{items.length} outil(s) en stock sur {entrepots.length} entrepôt(s)</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={filterEntrepot} onChange={e => setFilterEntrepot(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.9rem' }}>
            <option value="all">Tous les entrepôts</option>
            {entrepots.map(e => <option key={e.id} value={String(e.id)}>{e.nom} ({e.ville})</option>)}
          </select>
          <button onClick={() => { setShowForm(true); setEditing(null) }}
            style={{ background: '#1a237e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            + Ajouter un outil
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '2px solid #1a237e' }}>
          <h2 style={{ marginTop: 0, color: '#1a237e' }}>{editing ? '✏️ Modifier' : '➕ Nouvel outil'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Nom de l\'outil', key: 'nomOutil', type: 'text' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>{label}</label>
                <input type={type} required value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Catégorie</label>
              <select value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Entrepôt</label>
              <select value={form.entrepotId} onChange={e => setForm(f => ({ ...f, entrepotId: e.target.value }))}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                {entrepots.map(e => <option key={e.id} value={String(e.id)}>{e.nom} ({e.ville})</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Qté disponible</label>
              <input type="number" min={0} required value={form.quantiteDisponible} onChange={e => setForm(f => ({ ...f, quantiteDisponible: Number(e.target.value) }))}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Qté totale</label>
              <input type="number" min={0} required value={form.quantiteTotale} onChange={e => setForm(f => ({ ...f, quantiteTotale: Number(e.target.value) }))}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={resetForm}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>
                Annuler
              </button>
              <button type="submit"
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1a237e', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                {editing ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e8eaf6' }}>
              {['Outil', 'Catégorie', 'Entrepôt', 'Disponibilité', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#1a237e', fontSize: '0.9rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Aucun outil dans ce stock. Ajoutez-en un !</td></tr>
            )}
            {displayed.map((item, i) => (
              <tr key={item.id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{item.nomOutil}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: '#e8eaf6', color: '#1a237e', padding: '2px 8px', borderRadius: '8px', fontSize: '0.85rem' }}>{item.categorie}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#555' }}>{item.entrepotNom}<br /><small style={{ color: '#999' }}>{item.entrepotVille}</small></td>
                <td style={{ padding: '12px 16px' }}>{badge(item.quantiteDisponible, item.quantiteTotale)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => handleEdit(item)}
                    style={{ background: '#e8eaf6', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', color: '#1a237e', fontWeight: 500 }}>
                    ✏️ Modifier
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    style={{ background: '#ffebee', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', color: '#c62828', fontWeight: 500 }}>
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}