import { useState } from 'react'
import './styles/App.css'
import ListaFacturas from './pages/ListaFacturas.jsx'
import SubirDocumento from './pages/SubirDocumento.jsx'
import RevisionHumana from './pages/RevisionHumana.jsx'

function App() {
  const [pantalla, setPantalla] = useState('lista')

  const navegar = (destino) => setPantalla(destino)

  return (
    <main className="app-main">
      {pantalla === 'lista' && <ListaFacturas onNavigate={navegar} />}
      {pantalla === 'subir' && <SubirDocumento onNavigate={navegar} />}
      {pantalla === 'revision' && <RevisionHumana onNavigate={navegar} />}
    </main>
  )
}

export default App
