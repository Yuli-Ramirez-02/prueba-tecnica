<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Services\DeepSeekService;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * GET /api/documents - Lista todas las facturas
     */
    public function index()
    {
        return response()->json(Document::orderBy('id', 'desc')->get());
    }

    /**
     * GET /api/documents/{id} - Muestra una factura
     */
    public function show($id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        return response()->json($document);
    }

    /**
     * POST /api/documents - Crea una factura manualmente
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'proveedor' => 'nullable|string|max:255',
            'numero_factura' => 'nullable|string|max:255',
            'fecha' => 'nullable|date',
            'subtotal' => 'nullable|numeric',
            'impuestos' => 'nullable|numeric',
            'total' => 'nullable|numeric',
            'moneda' => 'nullable|string|max:10',
            'categoria' => 'nullable|string|max:50',
            'confianza' => 'nullable|array',
            'ruta_archivo' => 'nullable|string',
            'texto_ocr' => 'nullable|string',
        ]);

        $document = Document::create($validated);

        return response()->json($document, 201);
    }

    /**
     * POST /api/documents/procesar - Recibe texto OCR (o archivo), extrae campos con DeepSeek y guarda
     */
    public function procesar(Request $request, DeepSeekService $deepSeek)
    {
        $request->validate([
            'texto_ocr' => 'required_without:archivo|string',
            'archivo' => 'required_without:texto_ocr|file|max:10240', // máx 10MB
        ]);

        $ruta = null;
        $textoOcr = $request->input('texto_ocr', '');

        // Si viene un archivo, lo guardamos y usamos su nombre como referencia
        // (el OCR real iría aquí; por ahora usamos texto_ocr o nombre del archivo)
        if ($request->hasFile('archivo')) {
            $ruta = $request->file('archivo')->store('documentos', 'public');

            if (empty($textoOcr)) {
                $textoOcr = $request->file('archivo')->getClientOriginalName();
            }
        }

        if (empty($textoOcr)) {
            return response()->json(['message' => 'No hay texto OCR ni archivo válido'], 422);
        }

        // Extraer campos con DeepSeek
        $campos = $deepSeek->extraerCampos($textoOcr);

        if (empty($campos)) {
            return response()->json(['message' => 'No se pudo extraer campos del documento'], 422);
        }

        $document = Document::create([
            'proveedor' => $campos['proveedor'] ?? null,
            'numero_factura' => $campos['numero_factura'] ?? null,
            'fecha' => $campos['fecha'] ?? null,
            'subtotal' => $campos['subtotal'] ?? null,
            'impuestos' => $campos['impuestos'] ?? null,
            'total' => $campos['total'] ?? null,
            'moneda' => $campos['moneda'] ?? null,
            'categoria' => $campos['categoria'] ?? null,
            'confianza' => $campos['confianza'] ?? null,
            'ruta_archivo' => $ruta,
            'texto_ocr' => $textoOcr,
        ]);

        return response()->json($document, 201);
    }

    /**
     * PUT /api/documents/{id} - Actualiza una factura
     */
    public function update(Request $request, $id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'proveedor' => 'nullable|string|max:255',
            'numero_factura' => 'nullable|string|max:255',
            'fecha' => 'nullable|date',
            'subtotal' => 'nullable|numeric',
            'impuestos' => 'nullable|numeric',
            'total' => 'nullable|numeric',
            'moneda' => 'nullable|string|max:10',
            'categoria' => 'nullable|string|max:50',
            'confianza' => 'nullable|array',
            'ruta_archivo' => 'nullable|string',
            'texto_ocr' => 'nullable|string',
        ]);

        $document->update($validated);

        return response()->json($document);
    }

    /**
     * DELETE /api/documents/{id} - Elimina una factura
     */
    public function destroy($id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        $document->delete();

        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
