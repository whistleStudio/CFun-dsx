""" 
旋钮控制风扇：转动旋钮，变频调速
"""

from machine import ADC, PWM

sw, fan = ADC(1), PWM(2)

while True:
  fan.out(int(sw.read()/1023*100), 10000)