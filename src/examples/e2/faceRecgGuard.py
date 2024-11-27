""" 
检测到录入人脸后，开门3秒再关门
"""

from time import sleep
from machine import AIVision
from machine import Servo
from machine import OLED

aiVision = AIVision() # I2C - 视觉识别
servo14 = Servo(14) # P14 - 舵机
oled= OLED()

sleep(3)
aiVision.openAdvancedDetection("faceRecognition")
servo14.angle(20, 1)
oled.clear()
while True:
  oled.displayChinese(1, 1, "forward", "人脸识别检测中...")
  oled.enableDisplay()
  if (aiVision.getFaceRecognition()) > 0:
    if (aiVision.pickFaceRecognition(1, "ID")) == 1:
      oled.clear()
      oled.displayChinese(1, 1, "forward", "您好，请进")
      oled.enableDisplay()
      servo14.angle(100, 1) 
      sleep(3) 
      servo14.angle(20, 1)
