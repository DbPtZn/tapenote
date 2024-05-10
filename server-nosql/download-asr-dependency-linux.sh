#!/bin/bash
# 定义变量
download_filename="sherpa-onnx-paraformer-zh-2023-09-14.tar.bz2"
download_source="https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models"
download_url="$download_source/$download_filename"
download_dir="./sherpa/"

# 创建目录
if [ ! -d "$download_dir" ]; then
  mkdir "$download_dir"
else
  echo "目录 $download_dir 已存在。"
fi

# 下载语音识别模型
wget -P "$download_dir" "$download_url"

# 解压文件
unzip_success=0

# 如果前面没有成功解压，则尝试使用 bzip2
if command -v bzip2 &> /dev/null; then
    echo "bzip2 已安装，正在使用 bzip2 解压文件..."
    tar -xvf "./$download_dir/$download_filename" -C "$download_dir"
    unzip_success=1
fi

# 如果前面成功解压，则后续不再执行
if [ $unzip_success -eq 1 ]; then
    exit 0
fi

# 检查系统中是否安装了 7-Zip
if command -v 7z &> /dev/null; then
    echo "7-Zip 已安装，正在使用 7-Zip 解压文件..."
    7z x "./$download_dir/$download_filename" -so | 7z x -aoa -si -ttar -o"$download_dir"
    unzip_success=1
fi

# 如果前面成功解压，则后续不再执行
if [ $unzip_success -eq 1 ]; then
    exit 0
fi

# 如果系统中没有安装 7-Zip 或 bzip2，则提示用户手动解压文件
echo "模型文件已下载成功，但7-Zip 和 bzip2 都未安装，自动解压文件失败，请手动解压文件。"
exit 1