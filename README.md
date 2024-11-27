# cfdsx插件 - 创趣开源大师兄编程板开发助手

## Ctrl+Shift+P 输入指令

| 指令            | 功能                                                         |
| --------------- | ------------------------------------------------------------ |
| 初始化cfdsx扩展 | 手动初始化；注意初始化不会更新machine库 |
| 更新machine库   | 强制更新安装machine库 |
| 串口选择(dsx)   | 连接/断开控制板 |
| 上传程序(dsx) | 连接状态下，上传脚本至控制板 |
| 文档说明(machine) | 打开在线接口文档 |

<br>
<br>

## 准备工作

**1）安装python3解释器或版本管理工具(如anaconda)**

python相关的系统环境配置就不赘述了，网上资料有很多

[官网地址] https://www.python.org/downloads/

[百度网盘python3.12.2]链接：https://pan.baidu.com/s/1hf7XskfIvzsR6qXwgv62vQ 提取码：qo2e 

<br>

**2)  安装vscode Python扩展并选择对应解释器**

<img src="https://whistlestudio-1300400818.cos.ap-nanjing.myqcloud.com/cfun/cfpyb-ext/readme/python%E6%8F%92%E4%BB%B6.png" alt="python插件" style="zoom: 80%;" />

<br>

**3）安装vscode Pylance扩展（安装Python扩展时会自动安装此项）**

开启类型检查功能，初次安装有时需要重启vscode才会生效

<img src="https://whistlestudio-1300400818.cos.ap-nanjing.myqcloud.com/cfun/cfpyb-ext/readme/pylance.gif"/>

<br>

**4）串口选择**

上传文件、上传项目、在线调试功能需先连接串口。

以智能控制器为例，打开设备并将其拨至离线下载档位；

使用数据线连接电脑后，在vscode中点击代码编辑区右上角串口选择图标选择相应串口

<img src="https://whistlestudio-1300400818.cos.ap-nanjing.myqcloud.com/cfun/cfdsx-ext/readme/%E4%B8%B2%E5%8F%A3%E8%BF%9E%E6%8E%A5dsx.gif">

## 功能概述

### ✔️ 代码智能补全与语法检查

基于创趣machine库的代码智能补全和语法检查，有助于开发者在编写代码的同时查看对应的API参数提示，借助Pylance等语法检查工具将收获更加严谨的编程体验。

<br>

### 📄 上传文件 - python程序上传

串口已连接状态下（单击右上角插头图标），支持`任意文件名.py`文件上传至主控并立即执行程序。

<img src="https://whistlestudio-1300400818.cos.ap-nanjing.myqcloud.com/cfun/cfdsx-ext/readme/%E7%A8%8B%E5%BA%8F%E4%B8%8A%E4%BC%A0dsx.gif">

<br>

### 🈷️ 示例代码

左侧边栏"月光宝盒"内置部分示例脚本

<br>
<br>

## 联系与支持

如有使用疑问或技术交流，欢迎联系👇

作者: Whistle Wang

微信号: WhistleStudio

<img src="https://whistlestudio-1300400818.cos.ap-nanjing.myqcloud.com/cfun/cfpyb-ext/readme/whistleicon.png" style="float: left" />