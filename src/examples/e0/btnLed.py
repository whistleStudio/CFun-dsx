'''
按钮控制灯: 板载按键按下时，板载灯亮； 松开，灭
'''

from machine import Key, Pin

keyB, pin15 = Key(), Pin(15, "out")
while True:
  if keyB.readB():  # 监测板载按键B状态；板载按键松开时，返回0
    pin15.digitalWrite(0)
  else: 
    pin15.digitalWrite(1)