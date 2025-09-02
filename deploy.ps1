# Script de despliegue para Fly.io
# PowerShell script para Windows

Write-Host "🚀 Iniciando proceso de despliegue..." -ForegroundColor Green

# Verificar que fly CLI esté instalado
Write-Host "📋 Verificando Fly CLI..." -ForegroundColor Yellow
try {
    $flyVersion = fly version
    Write-Host "✅ Fly CLI encontrado: $flyVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Fly CLI no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "   Instala Fly CLI desde: https://fly.io/docs/hands-on/install-flyctl/" -ForegroundColor Yellow
    exit 1
}

# Verificar archivos necesarios
Write-Host "📋 Verificando archivos necesarios..." -ForegroundColor Yellow
$requiredFiles = @("fly.toml", "Dockerfile", "package.json", ".env.production")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    } else {
        Write-Host "✅ $file encontrado" -ForegroundColor Green
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ Archivos faltantes:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    exit 1
}

# Verificar dependencias npm
Write-Host "📋 Verificando dependencias npm..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules no encontrado, instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Verificar que el build funcione localmente
Write-Host "📋 Probando build local..." -ForegroundColor Yellow
try {
    npm run build
    if (Test-Path "dist") {
        Write-Host "✅ Build local exitoso" -ForegroundColor Green
    } else {
        Write-Host "❌ Build local falló - carpeta dist no creada" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error en build local: $_" -ForegroundColor Red
    exit 1
}

# Limpiar build anterior
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "🧹 Build anterior limpiado" -ForegroundColor Yellow
}

# Mostrar información del proyecto
Write-Host "📊 Información del proyecto:" -ForegroundColor Cyan
Write-Host "   App: $(Get-Content fly.toml | Select-String 'app = ' | ForEach-Object { $_.ToString().Split('=')[1].Trim(' "') })" -ForegroundColor White
Write-Host "   Región: $(Get-Content fly.toml | Select-String 'primary_region = ' | ForEach-Object { $_.ToString().Split('=')[1].Trim(' "') })" -ForegroundColor White

# Preguntar confirmación
$confirmation = Read-Host "¿Proceder con el despliegue? (y/N)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "❌ Despliegue cancelado por el usuario" -ForegroundColor Yellow
    exit 0
}

# Ejecutar despliegue
Write-Host "🚀 Iniciando despliegue a Fly.io..." -ForegroundColor Green
Write-Host "   Esto puede tomar varios minutos..." -ForegroundColor Yellow

try {
    fly deploy --verbose
    Write-Host "✅ ¡Despliegue exitoso!" -ForegroundColor Green
    
    # Mostrar URL de la aplicación
    $appName = Get-Content fly.toml | Select-String 'app = ' | ForEach-Object { $_.ToString().Split('=')[1].Trim(' "') }
    Write-Host "🌐 Tu aplicación está disponible en: https://$appName.fly.dev" -ForegroundColor Cyan
    
    # Verificar estado de la aplicación
    Write-Host "📊 Verificando estado de la aplicación..." -ForegroundColor Yellow
    fly status
    
} catch {
    Write-Host "❌ Error durante el despliegue:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host "🔧 Comandos de debugging útiles:" -ForegroundColor Yellow
    Write-Host "   - fly logs" -ForegroundColor White
    Write-Host "   - fly status" -ForegroundColor White
    Write-Host "   - fly doctor" -ForegroundColor White
    
    exit 1
}

Write-Host "🎉 ¡Proceso completado!" -ForegroundColor Green
