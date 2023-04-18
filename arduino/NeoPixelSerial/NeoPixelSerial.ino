#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

#define PIN        6
#define NUMPIXELS 10
Adafruit_NeoPixel strip(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.show();
  strip.setBrightness(50);

  Serial.begin(9600);
}

void loop() {
  byte buf[5] = {0, 0, 0, 0, 0};
  // 「5byteのデータがくる」 or
  // 「タイムアウトする」 or
  // 「\nが来る」 まで buf に読み込む
  int len = Serial.readBytesUntil('\n', buf, 5);
  if (len != 5) {
    return;
  }

  int index = buf[0];
  int red = buf[1];
  int green = buf[2];
  int blue = buf[3];
  int command = buf[4];
  strip.setPixelColor(index, strip.Color(red, green, blue));
  if (command == 1) {
    strip.show();
  }
}
