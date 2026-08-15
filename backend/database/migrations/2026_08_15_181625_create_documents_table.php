<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('proveedor')->nullable();
            $table->string('numero_factura')->nullable();
            $table->date('fecha')->nullable();
            $table->decimal('subtotal', 12, 2)->nullable();
            $table->decimal('impuestos', 12, 2)->nullable();
            $table->decimal('total', 12, 2)->nullable();
            $table->string('moneda')->nullable();
            $table->string('categoria')->nullable();
            $table->json('confianza')->nullable();
            $table->string('ruta_archivo')->nullable();
            $table->longText('texto_ocr')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
```
