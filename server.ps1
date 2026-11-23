# PowerShell Lightweight HTTP Server for Vocational Training Center System
# خادم الويب المحلي الدائم مع دعم حفظ البيانات وتحديث ملف كلمات المرور
param(
    [int]$Port = 8080
)

$baseDir = $PSScriptRoot
$dataFile = Join-Path $baseDir "data\vtc_data.json"
$passwordFile = Join-Path $baseDir "password"

# التأكد من وجود مجلد البيانات
$dataDir = Join-Path $baseDir "data"
if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "  نظام إدارة مركز التدريب المهني - خادم حفظ البيانات الدائم" -ForegroundColor Yellow
    Write-Host "  Vocational Training Center Permanent Storage Server" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Cyan
    Write-Host "  الخادم يعمل الآن على الرابط: $prefix" -ForegroundColor White
    Write-Host "  قاعدة البيانات الدائمة: $dataFile" -ForegroundColor Gray
    Write-Host "  ملف كلمات المرور المنفصل: $passwordFile" -ForegroundColor Gray
    Write-Host "  اضغط Ctrl+C لإيقاف الخادم في أي وقت." -ForegroundColor DarkGray
    Write-Host "=================================================================" -ForegroundColor Cyan
    
    # فتح المتصفح تلقائياً
    Start-Process $prefix
}
catch {
    Write-Error "فشل بدء الخادم: $_"
    exit
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # ترويسات CORS
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $rawUrl = $request.Url.LocalPath

        # =====================================================================
        # مسارات واجهة برمجة التطبيقات (API Endpoints for Permanent Storage)
        # =====================================================================

        # 1. جلب البيانات الدائمة (GET /api/data)
        if ($rawUrl -eq "/api/data" -and $request.HttpMethod -eq "GET") {
            $response.ContentType = "application/json; charset=utf-8"
            if (Test-Path $dataFile) {
                $content = [System.IO.File]::ReadAllText($dataFile, [System.Text.Encoding]::UTF8)
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
            } else {
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("{}")
            }
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # 2. الحفظ الدائم للبيانات في ملف data/vtc_data.json (POST /api/save)
        if ($rawUrl -eq "/api/save" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Close()

            [System.IO.File]::WriteAllText($dataFile, $body, [System.Text.Encoding]::UTF8)
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] تم الحفظ الدائم لبيانات الأقسام والمتدربين على القرص بنجاح." -ForegroundColor Green

            $respBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"message":"Data saved permanently to disk"}')
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $respBytes.Length
            $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # 3. جلب ملف كلمات المرور (GET /api/passwords أو GET /password)
        if (($rawUrl -eq "/api/passwords" -or $rawUrl -eq "/password") -and $request.HttpMethod -eq "GET") {
            $response.ContentType = "application/json; charset=utf-8"
            if (Test-Path $passwordFile) {
                $content = [System.IO.File]::ReadAllText($passwordFile, [System.Text.Encoding]::UTF8)
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
            } else {
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("{}")
            }
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # 4. تحديث وحفظ ملف كلمات المرور (POST /api/passwords)
        if ($rawUrl -eq "/api/passwords" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Close()

            [System.IO.File]::WriteAllText($passwordFile, $body, [System.Text.Encoding]::UTF8)
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] تم تحديث ملف كلمات المرور (password) على القرص بنجاح." -ForegroundColor Yellow

            $respBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"message":"Passwords updated in password file"}')
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $respBytes.Length
            $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        # =====================================================================
        # خدمة الملفات الثابتة (Static Files Serving)
        # =====================================================================
        if ($rawUrl -eq "/" -or [string]::IsNullOrWhiteSpace($rawUrl)) {
            $rawUrl = "/index.html"
        }

        $localPath = Join-Path $baseDir ($rawUrl.TrimStart('/'))
        
        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            if ([System.IO.Path]::GetFileName($localPath) -eq "password") {
                $contentType = "application/json; charset=utf-8"
            }
            
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # continue loop
    }
}
