""" 
语音合成播报

编码参照 https://www.toolhelper.cn/EncodeDecode/EncodeDecode
"""

from machine import TTS
from time import sleep

tts = TTS() # I2C - 语音合成转接模块



tts.setMode(16,0,4)
tts.playTextH("BFAACABCC9CFBFCE",0) # "开始上课"的GBK 16进制编码
sleep(3)
tts.playTextH("CFC2BFCE",0) # "下课"的GBK 16进制编码
sleep(2)
tts.playBeepI(1,11)
sleep(1)
tts.playBeepI(2,29)
