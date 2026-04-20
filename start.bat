@echo off
chcp 65001 >nul
title MysticEast AI - 启动器
color 0B

echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║              MysticEast AI  东方秘境 启动器                    ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM 获取脚本所在目录
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
node --version
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo  📦 首次运行，正在安装依赖（可能需要 1-3 分钟）...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo  ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo.
    echo  ✅ 依赖安装完成
) else (
    echo  ✅ 依赖已安装
)

echo.
echo  🚀 正在启动开发服务器...
echo     访问地址：http://localhost:3000
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo     按 Ctrl+C 停止服务器
@echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM 启动开发服务器并自动打开浏览器
start http://localhost:3000
call npm run dev

pause
