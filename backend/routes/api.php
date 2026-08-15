use App\Services\DeepSeekService;

Route::get('/test-deepseek', function (DeepSeekService $service) {
    $textoEjemplo = "FARMACIA SAN JOSE\nFactura No. 00123\nFecha: 12/08/2026\nSubtotal: 45000\nIVA: 8550\nTOTAL: 53550\nCOP";

    return $service->extraerCampos($textoEjemplo);
});