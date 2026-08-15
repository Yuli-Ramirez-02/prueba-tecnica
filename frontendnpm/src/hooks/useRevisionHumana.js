import { useEffect, useState } from 'react'
import api from '../api'

export function useRevisionHumana() {
  const [documentos, setDocumentos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [editando, setEditando] = useState(null)
  const [cambiosGuardados, setCambiosGuardados] = useState('')

  const cargarDocumentos = async () => {
    setCargando(true)
    try {
      const res = await api.get('/documents')
      setDocumentos(res.data)
      setError('')
    } catch (e) {
      setError('Error al cargar documentos: ' + (e.response?.data?.message || e.message))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDocumentos()
  }, [])

  const abrirRevision = (doc) => {
    setSeleccionado(doc)
    setEditando({ ...doc })
    setCambiosGuardados('')
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setEditando((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }))
  }

  const guardarCambios = async () => {
    try {
      const res = await api.put(`/documents/${editando.id}`, editando)

      setDocumentos((prev) =>
        prev.map((d) => (d.id === res.data.id ? res.data : d))
      )
      setSeleccionado(res.data)
      setCambiosGuardados('✅ Cambios guardados correctamente')
      setError('')
    } catch (e) {
      setError('Error al guardar: ' + (e.response?.data?.message || e.message))
    }
  }

  const verificarConfianza = (confianza) => {
    if (!confianza) return 'baja'

    const campos = Object.values(confianza)
    if (campos.length === 0) return 'baja'
    return campos.some((v) => v === 'alta') ? 'media' : 'baja'
  }

  return {
    documentos,
    cargando,
    error,
    seleccionado,
    editando,
    cambiosGuardados,
    abrirRevision,
    manejarCambio,
    guardarCambios,
    verificarConfianza,
  }
}