import { useListaFacturas } from '../src/hooks/useListaFacturas'
import '../src/styles/ListaFacturas.css'

const CAMPOS = [
  { key: 'proveedor', label: 'Proveedor', type: 'text' },
  { key: 'numero_factura', label: 'N° Factura', type: 'text' },
  { key: 'fecha', label: 'Fecha', type: 'date' },
  { key: 'subtotal', label: 'Subtotal', type: 'number', step: '0.01' },
  { key: 'impuestos', label: 'Impuestos', type: 'number', step: '0.01' },
  { key: 'total', label: 'Total', type: 'number', step: '0.01' },
  { key: 'moneda', label: 'Moneda', type: 'text' },
  { key: 'categoria', label: 'Categoría', type: 'text' },
]

function ListaFacturas({ onNavigate }) {
  const {
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
  } = useListaFacturas()

  return (
    <div className="lista-contenedor">
      <header className="lista-header">
        <h2>📋 Lista de Facturas</h2>
        <div className="lista-botones-header">
          <button className="btn-primario" onClick={iniciarNueva}>
            ➕ Nueva factura
          </button>
          <button className="btn-secundario" onClick={() => onNavigate('subir')}>
            📤 Subir documento
          </button>
          <button className="btn-secundario" onClick={() => onNavigate('revision')}>
            👁 Revisión humana
          </button>
        </div>
      </header>

      {error && <div className="mensaje-error">{error}</div>}

      {(creandoNueva || editando) && (
        <div className="lista-formulario">
          <h3>
            {creandoNueva
              ? 'Nueva factura'
              : `Editando: ${editando.proveedor || editando.numero_factura || '#' + editando.id}`}
          </h3>
          <div className="lista-grid-campos">
            {CAMPOS.map((campo) => (
              <div key={campo.key} className="lista-campo">
                <label>{campo.label}</label>
                <input
                  type={campo.type}
                  name={campo.key}
                  step={campo.step}
                  value={formulario[campo.key] ?? ''}
                  onChange={manejarCambio}
                />
              </div>
            ))}
          </div>
          <div className="lista-botones-form">
            <button className="btn-primario" onClick={guardar}>
              💾 Guardar
            </button>
            <button className="btn-peligro" onClick={cancelarEdicion}>
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {cargando ? (
        <p className="lista-cargando">Cargando…</p>
      ) : facturas.length === 0 ? (
        <p className="lista-vacio">No hay facturas todavía.</p>
      ) : (
        <div className="lista-tabla-wrapper">
          <table className="lista-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>N° Factura</th>
                <th>Fecha</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Moneda</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.proveedor || '—'}</td>
                  <td>{f.numero_factura || '—'}</td>
                  <td>{f.fecha ? f.fecha.slice(0, 10) : '—'}</td>
                  <td>{f.subtotal ?? '—'}</td>
                  <td>{f.impuestos ?? '—'}</td>
                  <td><strong>{f.total ?? '—'}</strong></td>
                  <td>{f.moneda || '—'}</td>
                  <td>{f.categoria || '—'}</td>
                  <td>
                    <div className="lista-acciones">
                      <button className="btn-editar" onClick={() => iniciarEdicion(f)}>
                        ✏️
                      </button>
                      <button className="btn-peligro" onClick={() => eliminar(f.id)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ListaFacturas