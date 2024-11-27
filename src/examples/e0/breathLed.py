""" 
呼吸灯: 板载灯渐强渐弱 
"""

from machine import PWM
from time import sleep

pin15 = PWM(15)
v = 0
step = 5
while True:
  if v > 100 or v < 0:
    step *= -1
  v += 5*step
  pin15.out(v, 10000)
  sleep(0.1)