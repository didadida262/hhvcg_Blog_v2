# 扫描超过 25 MB 的文件
Write-Host "扫描超过 25 MB 的文件..." -ForegroundColor Yellow
Write-Host ""

$largeFiles = Get-ChildItem -Path . -Recurse -File -Exclude node_modules,public,.deploy_git | 
    Where-Object { $_.Length -gt 25MB } | 
    Select-Object FullName, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB, 2)}}, @{Name="Size(Bytes)";Expression={$_.Length}}

if ($largeFiles) {
    Write-Host "发现以下文件超过 25 MB：" -ForegroundColor Red
    Write-Host ""
    $largeFiles | Format-Table -AutoSize
    
    Write-Host ""
    Write-Host "总计: $($largeFiles.Count) 个文件" -ForegroundColor Yellow
    Write-Host "总大小: $([math]::Round(($largeFiles | Measure-Object -Property 'Size(Bytes)' -Sum).Sum / 1MB, 2)) MB" -ForegroundColor Yellow
} else {
    Write-Host "No files larger than 25 MB found" -ForegroundColor Green
}

