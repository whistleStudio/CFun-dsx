"""  
板载语音识别控制板载灯

内置语音指令对应编号参考：https://docs.qq.com/sheet/DUnF2d0JNSkpHT3FQ?tab=000001
"""

from machine import ASR
from machine import Pin

asr = ASR()
pin15 = Pin(15,"out")

asr.ledFlag(1)
while True:
  编号 = asr.read()
  if 编号 > 0:
    if 编号 == 2:
      pin15.digitalWrite(1)

    if 编号 == 3:
      pin15.digitalWrite(0)
