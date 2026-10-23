Add-Type -AssemblyName System.Drawing

$srcPath = "D:\desing system\public\logo.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y += 2) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        $pixel = $bmp.GetPixel($x, $y)
        # Check if pixel is not pure white/near white (e.g. brightness < 0.98 or any channel < 245)
        if ($pixel.A -gt 20 -and ($pixel.R -lt 245 -or $pixel.G -lt 245 -or $pixel.B -lt 245)) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Detected bounds: Left=$minX, Top=$minY, Right=$maxX, Bottom=$maxY"
$width = $maxX - $minX
$height = $maxY - $minY
Write-Host "Content size: ${width}x${height} in canvas $($bmp.Width)x$($bmp.Height)"

# Add a tiny padding margin (e.g. 10px)
$pad = 12
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($bmp.Width - $cropX, $width + ($pad * 2))
$cropH = [Math]::Min($bmp.Height - $cropY, $height + ($pad * 2))

$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$croppedBmp = $bmp.Clone($cropRect, $bmp.PixelFormat)

$outputPath = "D:\desing system\public\logo-tight.png"
$croppedBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Saved tightly cropped logo to $outputPath with size: ${cropW}x${cropH}"

$bmp.Dispose()
$croppedBmp.Dispose()
