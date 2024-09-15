@echo off
REM 请先切换至 cmd 命令行执行该脚本

setlocal

REM 定义变量
set download_filename="sherpa-onnx-paraformer-zh-2023-09-14.tar.bz2"
set download_source="https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models"
set download_url="%download_source%/%download_filename%"
set download_dir="./sherpa/"

REM 创建目录
if not exist %download_dir% (
  mkdir %download_dir%
) else (
  echo 目录 %download_dir% 已存在。
)

REM 下载语音识别模型
wget -P %download_dir% %download_url%


REM 解压文件
set unzip_success=0
:: 如果前面没有成功解压，则尝试使用 bzip2
where bzip2 >nul 2>nul
if %errorlevel% equ 0 (
    echo "bzip2 已安装，正在使用 bzip2 解压文件..."
    tar -xvf "%download_dir%%download_filename%" -C %download_dir%
    set "unzip_success=1"
)
:: 如果前面成功解压，则后续不再执行
if %unzip_success% equ 1 exit /b

:: 检查系统中是否安装了 7-Zip
where 7z >nul 2>nul
if %errorlevel% equ 0 (
    echo "7-Zip 已安装，正在使用 7-Zip 解压文件..."
    7z x "%download_dir%%download_filename%" -so | 7z x -aoa -si -ttar -o%download_dir%
    set "unzip_success=1"
)
:: 如果前面成功解压，则后续不再执行
if %unzip_success% equ 1 exit /b

:: 如果系统中没有安装 7-Zip 或 bzip2，则提示用户手动解压文件
echo "asr 模型文件已下载成功，但7-Zip 和 bzip2 都未安装，自动解压文件失败，请手动解压文件。"
pause
exit /b

endlocal