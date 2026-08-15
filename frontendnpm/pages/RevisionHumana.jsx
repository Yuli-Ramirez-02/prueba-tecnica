import { useRevisionHumana } from '../src/hooks/useRevisionHumana'
import '../src/styles/RevisionHumana.css'

function RevisionHumana({ onNavigate }) {
  const {
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
  } = useRevisionHumana()

  return (
    <div className="rev-contenedor">
      <header className="rev-header">
        <h2>👁 Revisión humana</h2>
        <button className="btn-secundario" onClick={() => onNavigate('lista')}>
          ← Volver a la lista
        </button>
      </header>

      {error && <div className="mensaje-error">{error}</div>}
      {cambiosGuardados && <div className="mensaje-exito">{cambiosGuardados}</div>}

      {cargando ? (
        <p className="rev-cargando">Cargando documentos…</p>
      ) : (
        <div className="rev-layout">
          <aside className="rev-lateral">
            <h3>Documentos ({documentos.length})</h3>
            {documentos.length === 0 && <p className="rev-vacio">No hay documentos.</p>}
            {documentos.map((doc) => {
              const confianza = verificarConfianza(doc.confianza)
              return (
                <button
                  key={doc.id}
                  className={`rev-item ${seleccionado?.id === doc.id ? 'rev-item-activo' : ''}`}
                  onClick={() => abrirRevision(doc)}
                >
                  <div className="rev-item-header">
                    <strong>{doc.proveedor || 'Sin proveedor'}</strong>
                    <span
                      className={`rev-insignia ${
                        confianza === 'baja' ? 'rev-insignia-baja' : 'rev-insignia-alta'
                      }`}
                    >
                      {confianza}
                    </span>
                  </div>
                  <div className="rev-item-meta">
                    {doc.numero_factura || '—'} · {doc.total ? doc.moneda + ' ' + doc.total : '—'}
                  </div>
                </button>
              )
            })}
          </aside>

          <main className="rev-panel">
            {!seleccionado ? (
              <p className="rev-vacio">
                Selecciona un documento para revisar sus datos extraídos.
              </p>
            ) : (
              <>
                <h3>Revisando: {seleccionado.proveedor || `Documento #${seleccionado.id}`}</h3>

                <div className="rev-formulario">
                  <div className="rev-grid-campos">
                    <label className="rev-campo">
                      Proveedor
                      <input
                        type="text"
                        name="proveedor"
                        value={editando.proveedor ?? ''}
                        onChange={manejarCambio}
                      />
                    </label>
                    <label className="rev-campo">
                      N° Factura
                      <input
                        type="text"
                        name="numero_factura"
                        value={editando.numero_factura ?? ''}
                        onChange={manejarCambio}
                      />
                    </label>
                    <label className="rev-campo">
                      Fecha
                      <input
                        type="date"
                        name="fecha"
                        value={editando.fecha ? editando.fecha.slice(0, 10) : ''}
                        onChange={manejarCambio}
                      />
                    </label>
                    <label className="rev-campo">
                      Subtotal
                      <input
                        type="number"
                        step="0.01"
                        name="subtotal"
                        value={editando.subtotal ?? ''}
                        onChange={manejarCambio}
                      />
                    </label>
                    <label className="rev-campo">
                      Impuestos
                      <input
                        type="number"
                        step="0.01"
                        name="impuestos"
                        value={editando.impuestos ?? ''}
                        onChange={manejarCambio}
                      />
                    </label>
                    <label className="rev-campo">
                      Total
                      <input
                        type="number"
                        step="0.01"
                        name="total"
                        value={editando.total ?? ''}
                        onChange={manejarCambio}
                      />
                    </label>
                    <label className="rev-campo">
                      Moneda
                      <input
                        type="text"
                        name="moneda"
                        value={editando.moneda ?? ''}
                        onChange={manejarCambio}
                      />
                    </label>
                    <label className="rev-campo">
                      Categoría
                      <select
                        name="categoria"
                        value={editando.categoria ?? ''}
                        onChange={manejarCambio}
                      >
                        <option value="">— Seleccionar —</option>
                        <option value="Alimentación">Alimentación</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </label>
                  </div>

                  <div className="rev-botones">
                    <button className="btn-primario" onClick={guardarCambios}>
                      💾 Guardar cambios
                    </button>
                    <button className="btn-secundario" onClick={() => abrirRevision(seleccionado)}>
                      🔄 Descartar cambios
                    </button>
                  </div>

                  {seleccionado.texto_ocr && (
                    <details className="rev-detalles">
                      <summary>📄 Ver texto OCR original</summary>
                      <pre>{seleccionado.texto_ocr}</pre>
                    </details>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      )}
    </div>
  )
}

export default RevisionHumana