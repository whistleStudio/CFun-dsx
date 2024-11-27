""" 
人脸采集
"""
from time import sleep
from machine import AIVision
from machine import OLED
from machine import Key

aiVision = AIVision() # I2C - 视觉识别
oled= OLED()
keyab = Key()

sleep(3)
aiVision.openAdvancedDetection("faceRecognition")
oled.clear()
oled.displayChinese(1,1,"forward",str("请正视摄像头"))
oled.enableDisplay()
while not keyab.readB() :
  pass
while not (not (keyab.readB())) :
  pass
aiVision.deleteFaceID(1)
aiVision.inputFaceID(1)
oled.clear()
oled.displayChinese(1,1,"forward",str("人员1，录入成功"))
oled.enableDisplay()
