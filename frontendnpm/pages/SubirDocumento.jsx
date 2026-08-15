import { useSubirDocumento } from '../src/hooks/useSubirDocumento'
import '../src/styles/SubirDocumento.css'

function SubirDocumento({ onNavigate }) {
  const {
    archivo,
    textoOcr,
    procesando,
    resultado,
    error,
    manejarArchivo,
    manejarTextoOcr,
    procesar,
    formula,
  } = useSubirDocumento()

  return (
    <div className="subir-contenedor">
      <header className="subir-header">
        <h2>📤 Subir documento</h2>
        <button className="btn-secundario" onClick={() => onNavigate('lista')}>
          ← Volver a la lista
        </button>
      </header>

      {error && <div className="mensaje-error">{error}</div>}

      <div className="subir-tarjeta">
        <h3>Paso 1: Selecciona el documento</h3>
        <input type="file" onChange={manejarArchivo} accept="image/*,.pdf" />
        {archivo && <p className="subir-archivo-info">📎 {archivo.name}</p>}
      </div>

      <div className="subir-tarjeta">
        <h3>Paso 2: Opcional — pega el texto OCR directamente</h3>
        <textarea
          value={textoOcr}
          onChange={manejarTextoOcr}
          placeholder="FARMACIA SAN JOSE&#10;Factura No. 00123&#10;Fecha: 12/08/2026&#10;Subtotal: 45000&#10;IVA: 8550&#10;TOTAL: 53550&#10;COP"
          rows={6}
        />
      </div>

      <button className="btn-primario" onClick={procesar} disabled={procesando}>
        {procesando ? '⏳ Procesando con IA…' : '🤖 Extraer campos con DeepSeek'}
      </button>

      {resultado && (
        <div className="subir-resultado">
          <h3>✅ Documento procesado (ID: {resultado.id})</h3>
          <div className="subir-grid-resultado">
            <p><strong>Proveedor:</strong> {resultado.proveedor || '—'}</p>
            <p><strong>N° Factura:</strong> {resultado.numero_factura || '—'}</p>
            <p><strong>Fecha:</strong> {resultado.fecha ? resultado.fecha.slice(0, 10) : '—'}</p>
            <p><strong>Subtotal:</strong> {formula(resultado.subtotal)}</p>
            <p><strong>Impuestos:</strong> {formula(resultado.impuestos)}</p>
            <p><strong>Total:</strong> {formula(resultado.total)}</p>
            <p><strong>Moneda:</strong> {resultado.moneda || '—'}</p>
            <p><strong>Categoría:</strong> {resultado.categoria || '—'}</p>
          </div>

          {resultado.confianza && Object.keys(resultado.confianza).length > 0 && (
            <div className="subir-confianza">
              <h4>Nivel de confianza:</h4>
              <ul>
                {Object.entries(resultado.confianza).map(([campo, nivel]) => (
                  <li key={campo}>
                    {campo}: <strong className={nivel === 'alta' ? 'confianza-alta' : 'confianza-baja'}>{nivel}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className="btn-primario" onClick={() => onNavigate('lista')}>
            Ver en la lista de facturas
          </button>
        </div>
      )}
    </div>
  )
}

export default SubirDocumento