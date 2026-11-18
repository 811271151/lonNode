param(
    [string]$CertificatePath = (Join-Path $env:USERPROFILE '.ssh\aws-rds-global-bundle.pem')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Both assemblies must be loaded explicitly in Windows PowerShell 5.1.
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$projectDir = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
$buildDir = Join-Path $projectDir 'apps\server\dist-lambda'
$entryPath = Join-Path $buildDir 'lambda.mjs'

if (-not (Test-Path -LiteralPath $entryPath -PathType Leaf)) {
    throw 'Missing dist-lambda/lambda.mjs. Build Lambda first.'
}
if (-not (Test-Path -LiteralPath $CertificatePath -PathType Leaf)) {
    throw 'RDS certificate file was not found.'
}

$releaseName = 'release-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [guid]::NewGuid().ToString('N').Substring(0, 8)
$releaseDir = Join-Path $projectDir ('artifacts\lambda\' + $releaseName)
$packageDir = Join-Path $releaseDir 'package'
$certDir = Join-Path $packageDir 'certs'
$zipPath = Join-Path $releaseDir 'ionnode-api.zip'

New-Item -ItemType Directory -Path $certDir -Force | Out-Null
Get-ChildItem -LiteralPath $buildDir -Filter '*.mjs' -File |
    Copy-Item -Destination $packageDir
Copy-Item -LiteralPath $CertificatePath -Destination (Join-Path $certDir 'aws-rds-global-bundle.pem')

$packageFiles = @(Get-ChildItem -LiteralPath $packageDir -Recurse -File)
$archive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($file in $packageFiles) {
        $entryName = $file.FullName.Substring($packageDir.Length + 1).Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $archive, $file.FullName, $entryName,
            [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }
}
finally {
    $archive.Dispose()
}

$checkArchive = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    $entryNames = @($checkArchive.Entries.FullName)
    if ($entryNames -notcontains 'lambda.mjs' -or
        $entryNames -notcontains 'certs/aws-rds-global-bundle.pem' -or
        $entryNames.Count -ne $packageFiles.Count) {
        throw 'ZIP verification failed: missing or unexpected entries.'
    }
    foreach ($file in $packageFiles) {
        $entryName = $file.FullName.Substring($packageDir.Length + 1).Replace('\', '/')
        $entry = $checkArchive.GetEntry($entryName)
        if ($null -eq $entry -or $entry.Length -ne $file.Length) {
            throw ('ZIP verification failed: ' + $entryName)
        }
    }
    $checkArchive.Entries | Select-Object FullName, Length | Format-Table -AutoSize
}
finally {
    $checkArchive.Dispose()
}

Write-Host 'LAMBDA_ZIP_OK'
Write-Host ('UPLOAD_ZIP: ' + $zipPath)
