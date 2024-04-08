## 启动 server 请先下载模型

### linux 用户可以尝试使用：

```bash
download-dependency-linux.sh
```
脚本下载 asr 和 tts 模型!

### windows 用户使用 

```bash
download-dependency-win.bat
```
脚本下载 asr 和 tts 模型!

如果您无法使用脚本下载模型，也可以手动下载模型，并解压到 sherpa 目录下
```bash
https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models
https://github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models
```
模型的相关配置在 config 目录中,如果您下载的模型非作者指定的模型，请根据模型配置修改相关配置文件。

语音识别/语音合成服务依赖 新一代 kaldi, 文档官网：https://k2-fsa.github.io/sherpa/index.html


## License
[GPL-3.0 licensed](LICENSE).
