"""  
温湿度检测, 分行屏显
"""

from machine import OLED, DHT11
from time import sleep

oled= OLED()
dht = DHT11(1) # P1-DHT11温湿度传感器

while True:
  oled.clear()
  # 单个字符16x16像素点
  oled.displayChinese(1, 1, "forward", "湿度:" + str(dht.readHum()))
  oled.displayChinese(1, 17, "forward", "温度:" + str(dht.readTem()))
  oled.enableDisplay()
  sleep(0.2)