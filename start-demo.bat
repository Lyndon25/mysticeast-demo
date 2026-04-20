@echo off
chcp 65001 >nul
title MysticEast AI - 演示模式
color 0E

echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║           MysticEast AI  演示模式启动器                        ║
echo ║          （无需安装依赖，适合直接演示）                         ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo  ❌ 错误：未检测到 Node.js
    echo.
    echo     请先安装 Node.js（建议 v18+）
    echo     下载地址：https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo  ✅ Node.js 已安装
echo.

REM 检查 out 目录是否需要重新构建
if not exist "out\index.html" (
    echo  📦 正在构建静态文件...
    call npm run build
    if errorlevel 1 (
        echo.
        echo  ❌ 构建失败
        pause
        exit /b 1
    )
    echo  ✅ 构建完成
    goto FIX_PATHS
)

REM 检查源码是否比构建产物新（需要重新构建）
for %%F in (app components hooks lib types package.json next.config.mjs tailwind.config.ts) do (
    if "%%~tF" gtr "out\index.html" (
        echo  📦 检测到源码更新，正在重新构建...
        call npm run build
        if errorlevel 1 (
            echo.
            echo  ❌ 构建失败
            pause
            exit /b 1
        )
        echo  ✅ 重新构建完成
        goto FIX_PATHS
    )
)

echo  ✅ 构建文件已是最新

:FIX_PATHS
echo  🔧 正在修复静态文件路径...

REM 修复子目录 HTML 中的资源路径（./_next/ → ../_next/）
powershell -Command "Get-ChildItem -Path out\quiz, out\report -Recurse -Filter '*.html' -ErrorAction SilentlyContinue | ForEach-Object { $content = Get-Content $_.FullName -Raw; $content = $content -replace 'href=\"\./_next/', 'href=\"../_next/'; $content = $content -replace 'src=\"\./_next/', 'src=\"../_next/'; Set-Content $_.FullName $content -NoNewline }" >nul 2>&1

REM 修复根目录 HTML 中的 favicon 路径
powershell -Command "Get-ChildItem -Path out -Filter '*.html' | ForEach-Object { $content = Get-Content $_.FullName -Raw; $content = $content -replace 'href=\"/favicon.ico\"', 'href=\"./favicon.ico\"'; Set-Content $_.FullName $content -NoNewline }" >nul 2>&1

echo  ✅ 路径修复完成
echo.

:START_SERVER
echo  🚀 正在启动演示服务器...
echo     访问地址：http://localhost:3000
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo     按 Ctrl+C 停止服务器
@echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM 使用 npx serve 启动静态文件服务器
start http://localhost:3000
npx serve out --listen 3000

pause
