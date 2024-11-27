'''
按钮控制灯: 板载中键按一次, 红灯亮; 再按一次, 熄灭
'''

from machine import Key, Pin

keyB, pin15 = Key(), Pin(15, "out")
flag = -1

while 1:
  # 板载按键按下0，松开1
  if not keyB.readB(): 
    while not keyB.readB(): 
      pass
    flag *= -1

  if flag == 1:
    pin15.digitalWrite(1)
  else:
    pin15.digitalWrite(0)