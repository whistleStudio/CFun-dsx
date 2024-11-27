""" 
物联网操作需先在iot.cfunworld.com完成注册
步骤说明可参考登陆后平台首页或https://dict.cfunworld.com/tutorial/cfdsx/04_plant/扩展创新.html
"""
 
from machine import MQTT
from time import sleep
mqtt = MQTT()
mqtt.connectWiFi("wifiname", "password1") # 修改wifi名称及密码
while not mqtt.checkWiFi() :
  pass
mqtt.setMqtt("username", "1", "password2") # 修改用户名、设备ID及连接密钥
mqtt.connectTCP("iot.cfunworld.com", "1883") 
while not mqtt.checkMqtt() :
  pass
mqtt.subscribe("1", "CmsgW")
sleep(1)
while True:
  if mqtt.readData("1", "CmsgW"):
    print(mqtt.mqtt_string)
  mqtt.publishStr("Cmsg", "hello cfunworld")
  sleep(2)