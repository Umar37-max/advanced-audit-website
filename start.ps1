$projectPath = $PSScriptRoot
Set-Location $projectPath
Write-Host "Starting BEST Audit Services..."
& npm.cmd install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& npm.cmd run dev
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
