<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'proveedor',
        'numero_factura',
        'fecha',
        'subtotal',
        'impuestos',
        'total',
        'moneda',
        'categoria',
        'confianza',
        'ruta_archivo',
        'texto_ocr',
    ];

    protected $casts = [
        'fecha' => 'date',
        'subtotal' => 'decimal:2',
        'impuestos' => 'decimal:2',
        'total' => 'decimal:2',
        'confianza' => 'array',
    ];
}
