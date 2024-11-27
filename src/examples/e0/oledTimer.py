""" 
屏显倒计时
"""

from machine import OLED
from time import sleep

oled = OLED()

while True:
  for i in range(10, 0, -1):
    oled.clear()
    oled.displayChinese(1, 1, "forward", "倒计时: "+str(i))
    oled.enableDisplay()
    sleep(1)