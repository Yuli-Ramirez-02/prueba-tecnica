import { useEffect, useState } from 'react'
import api from '../api'

export function useListaFacturas() {
  const [facturas, setFacturas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(null) // factura en edición
  const [formulario, setFormulario] = useState({}) // valores del formulario
  const [creandoNueva, setCreandoNueva] = useState(false)

  const cargarFacturas = async () => {
    setCargando(true)
    try {
      const res = await api.get('/documents')
      setFacturas(res.data)
      setError('')
    } catch (e) {
      setError('Error al cargar facturas: ' + (e.response?.data?.message || e.message))
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarFacturas()
  }, [])

  const iniciarEdicion = (factura) => {
    setEditando(factura)
    setFormulario({ ...factura })
    setCreandoNueva(false)
  }

  const iniciarNueva = () => {
    setCreandoNueva(true)
    setEditando(null)
    setFormulario({
      proveedor: '',
      numero_factura: '',
      fecha: '',
      subtotal: '',
      impuestos: '',
      total: '',
      moneda: '',
      categoria: '',
    })
  }

  const cancelarEdicion = () => {
    setEditando(null)
    setCreandoNueva(false)
    setFormulario({})
  }

  const manejarCambio = (e) => {
    const { name, value, type } = e.target
    setFormulario((prev) => ({
      ...prev,
      [name]: type === 'number' && value === '' ? null : value,
    }))
  }

  const guardar = async () => {
    try {
      if (creandoNueva) {
        await api.post('/documents', formulario)
      } else if (editando) {
        await api.put(`/documents/${editando.id}`, formulario)
      }
      cancelarEdicion()
      cargarFacturas()
    } catch (e) {
      setError('Error al guardar: ' + (e.response?.data?.message || e.message))
    }
  }

  const eliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta factura?')) return
    try {
      await api.delete(`/documents/${id}`)
      cargarFacturas()
    } catch (e) {
      setError('Error al eliminar: ' + (e.response?.data?.message || e.message))
    }
  }

  return {
    facturas,
    cargando,
    error,
    editando,
    formulario,
    creandoNueva,
    iniciarEdicion,
    iniciarNueva,
    cancelarEdicion,
    manejarCambio,
    guardar,
    eliminar,
  }
}