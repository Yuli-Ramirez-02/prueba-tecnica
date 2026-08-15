import { useState } from 'react'
import api from '../api'

export function useSubirDocumento() {
  const [archivo, setArchivo] = useState(null)
  const [textoOcr, setTextoOcr] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  const manejarArchivo = (e) => {
    setArchivo(e.target.files[0])
    setError('')
  }

  const manejarTextoOcr = (e) => {
    setTextoOcr(e.target.value)
    setError('')
  }

  const procesar = async () => {
    if (!archivo && !textoOcr.trim()) {
      setError('Sube un archivo o pega el texto del OCR.')
      return
    }

    setProcesando(true)
    setError('')
    setResultado(null)

    try {
      const formData = new FormData()

      if (archivo) {
        formData.append('archivo', archivo)
      }

      if (textoOcr.trim()) {
        formData.append('texto_ocr', textoOcr.trim())
      }

      const res = await api.post('/documents/procesar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setResultado(res.data)
    } catch (e) {
      setError('Error al procesar: ' + (e.response?.data?.message || e.message))
    } finally {
      setProcesando(false)
    }
  }

  const formula = (valor) =>
    valor !== null && valor !== undefined ? valor.toLocaleString('es-CO') : '—'

  return {
    archivo,
    textoOcr,
    procesando,
    resultado,
    error,
    manejarArchivo,
    manejarTextoOcr,
    procesar,
    formula,
  }
}