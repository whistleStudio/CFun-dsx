""" 
板载蜂鸣器发声: 板载按键按下时，发声
"""

from machine import Key, Buzzer

keyB, buz = Key(), Buzzer()

while True:
  if keyB.readB():
    buz.close()
  else:
    buz.tone("C8")

