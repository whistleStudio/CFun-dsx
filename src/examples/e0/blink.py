""" 
板载灯闪烁: 亮1秒, 灭1秒, 循环往复
"""

from machine import Pin
from time import sleep

pin15 = Pin(15, "out")

while True:
  pin15.digitalWrite(1)   
  sleep(1)
  pin15.digitalWrite(0)   
  sleep(1)
