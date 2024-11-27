from machine import Pin, ADC

pin15 = Pin(15, "out")
adc1 = ADC(1) # P1外接光线检测传感器

while True:
  light = adc1.read()
  if light < 500:
    pin15.digitalWrite(1)
  else:
    pin15.digitalWrite(0)