# OpenLab Workshop 2022

## 導入手順

### Arduinoにプログラムを書き込む

`arduino/arduino.ino` をArduinoに書き込む

### p5.serialserverを起動する

```bash
git clone https://github.com/p5-serial/p5.serialserver.git
cd p5.serialserver
npm install
node startserver.js
```

### p5.jsのサンプルスケッチをブラウザから開く

ローカルサーバを立ち上げて、p5.jsのサンプルスケッチをブラウザから開く。
ローカルサーバはPythonに標準で備わっている、
[http.server](https://docs.python.org/ja/3/library/http.server.html) を使用する。

```bash
git clone https://github.com/enkatsu/openlab-workshop202302-sketches.git
cd openlab-workshop202302-sketches
python -m http.server 8000
```

[http://localhost:8000](http://localhost:8000)

#### スマートフォンから開く

p5.serialserverを起動しているマシンのIPアドレスを確認する。

```bash
ifconfig | grep 'inet '
```

ブラウザから http://${IP_ADDRESS}:8000 にアクセスする。

IPアドレスとポート番号を入力して、「update serial connection」をクリックする。
上記の手順で進めている場合は、IPアドレスは `localhost` ポート番号は `8081` のままで進めていい。
右のセレクトボックスからArduinoの接続先ポートを選択すると通信が開始される。

![screenshot.png](screenshot.png)


## メモ

### WebSocketについて

HTTPSのWebページではwsで通信できない。
この場合は、wssを使用する必要がある。
今回は、ローカルでHTTPサーバを立てるので問題ない。
