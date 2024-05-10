@echo off

REM 下载 tts 模型
call ./download-tts-dependency-win.bat

REM 下载 asr 模型
call download-asr-dependency-win.bat

REM 任务完成，退出
exit /b