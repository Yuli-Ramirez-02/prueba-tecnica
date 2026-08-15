<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class DeepSeekService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.deepseek.com/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.deepseek.key');
    }

    public function extraerCampos(string $textoOcr): array
    {
        $prompt = $this->construirPrompt($textoOcr);

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(60)
                ->retry(2, 1000) // reintenta hasta 2 veces con 1s de espera
                ->post($this->baseUrl, [
                    'model' => 'deepseek-chat',
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => 0,
                    'response_format' => ['type' => 'json_object'],
                ]);
        } catch (Throwable $e) {
            // Errores de red, timeout, etc.
            Log::error('DeepSeekError: petición falló', [
                'exception' => $e->getMessage(),
                'trace_id' => uniqid('deepseek_', true),
            ]);
            return [];
        }

        if ($response->failed()) {
            Log::error('DeepSeekError: respuesta de error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'trace_id' => uniqid('deepseek_', true),
            ]);
            return [];
        }

        $contenido = $response->json('choices.0.message.content');

        if (!is_string($contenido) || trim($contenido) === '') {
            Log::warning('DeepSeekError: respuesta vacía o sin content', [
                'respuesta_completa' => $response->json(),
                'trace_id' => uniqid('deepseek_', true),
            ]);
            return [];
        }

        // Decodificar con manejo explícito de errores
        try {
            $datos = json_decode($contenido, true, 512, JSON_THROW_ON_ERROR);
        } catch (Throwable $e) {
            Log::error('DeepSeekError: el contenido no es JSON válido', [
                'contenido' => $contenido,
                'trace_id' => uniqid('deepseek_', true),
            ]);
            return [];
        }

        // Validar que sea un array y que tenga la estructura mínima esperada
        if (!is_array($datos)) {
            Log::warning('DeepSeekError: JSON válido pero no es un objeto', [
                'contenido' => $contenido,
            ]);
            return [];
        }

        return $datos;
    }

    protected function construirPrompt(string $textoOcr): string
    {
        return <<<PROMPT
Eres un asistente que extrae información de facturas y recibos.
A partir del siguiente texto obtenido por OCR, devuelve SOLO un JSON
(sin explicaciones, sin markdown) con esta estructura exacta:

{
  "proveedor": string|null,
  "numero_factura": string|null,
  "fecha": string|null (formato YYYY-MM-DD),
  "subtotal": number|null,
  "impuestos": number|null,
  "total": number|null,
  "moneda": string|null,
  "categoria": string (una de: Alimentación, Transporte, Tecnología, Servicios, Otros),
  "confianza": {
    "proveedor": "alta"|"baja",
    "fecha": "alta"|"baja",
    "total": "alta"|"baja"
  }
}

Si un campo no aparece claramente en el texto, ponlo en null y marca su confianza como "baja".

Texto OCR:
{$textoOcr}
PROMPT;
    }
}