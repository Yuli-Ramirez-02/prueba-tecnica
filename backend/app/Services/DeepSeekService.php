<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class DeepSeekService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.deepseek.com/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.deepseek.key');
    }

    /**
     * Recibe el texto crudo del OCR y devuelve un array
     * con los campos estructurados (proveedor, fecha, total, etc.)
     */
    public function extraerCampos(string $textoOcr): array
    {
        $prompt = <<<PROMPT
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

        $response = Http::withToken($this->apiKey)
            ->timeout(30)
            ->post($this->baseUrl, [
                'model' => 'deepseek-chat',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0,
                'response_format' => ['type' => 'json_object'],
            ]);

        if ($response->failed()) {
            // No revientes la app si DeepSeek falla: registra el error y sigue
            \Log::error('DeepSeek API error', ['body' => $response->body()]);
            return [];
        }

        $contenido = $response->json('choices.0.message.content');

        return json_decode($contenido, true) ?? [];
    }
}