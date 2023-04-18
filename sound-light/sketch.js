let video;
let bgImage;
let diff;
let threshold = 255 / 10;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    bgImage = createImage(video.width, video.height);
    diff = createImage(video.width, video.height);

    initUi();
}

function draw() {
    video.loadPixels();
    bgImage.loadPixels();
    diff.loadPixels();
    const colAvgs = [];
    for (let x = 0; x < video.width; x++) {
        let colAvg = 0;
        for (let y = 0; y < video.height; y++) {
            const i = (x + y * video.width) * 4;
            const videoDarkness = (video.pixels[i] + video.pixels[i + 1] + video.pixels[i + 2]) / 3;
            const bgDarkness = (bgImage.pixels[i] + bgImage.pixels[i + 1] + bgImage.pixels[i + 2]) / 3;
            const brightnessDiff = abs(videoDarkness - bgDarkness);
            diff.pixels[i] = brightnessDiff;
            diff.pixels[i + 1] = brightnessDiff;
            diff.pixels[i + 2] = brightnessDiff;
            diff.pixels[i + 3] = 255;
            colAvg += brightnessDiff;
        }
        colAvg /= video.height;
        colAvgs.push(colAvg);
    }
    diff.updatePixels();

    image(diff, 0, 0);
    stroke(255, 0, 0);
    for (let x = 0; x < colAvgs.length; x++) {
        point(x, map(colAvgs[x], 0, 255, height, 0));
    }
    const maxIndex = colAvgs.indexOf(Math.max(...colAvgs));
    ellipse(maxIndex, map(colAvgs[maxIndex], 0, 255, height, 0), 10, 10);
    
    updateNeoPixels(colAvgs);
    drawThresholdLine();
}

function drawThresholdLine() {
    const y = map(threshold, 0, 255, 0, height);
    line(0, height - height / 10, width, height - height / 10);
}

function updateNeoPixels(colAvgs) {
    const maxValue = Math.max(...colAvgs);
    const maxIndex = colAvgs.indexOf(maxValue);
    const maxPixelIndex = parseInt(map(maxIndex, 0, colAvgs.length, 0, pixelNum));
    if (frameCount % 10 == 0) {
        // if (colAvgs[maxIndex] < threshold) {
        //     allPixelTurnOff();
        //     return;
        // }
        for (let i = 0; i < pixelNum; i++) {
            const last = i === pixelNum - 1;
            if (i === maxPixelIndex) {
                sendPixelData(i, maxValue, 0, 0, last ? 1 : 0);
            } else {
                sendPixelData(i, 0, 0, 0, last ? 1 : 0);
            }
        }
    }
}

function allPixelTurnOff() {
    for (let i = 0; i < pixelNum; i++) {
        const last = i === pixelNum - 1;
        sendPixelData(i, 0, 0, 0, last ? 1 : 0);
    }
}

function mousePressed() {
    for (let i = 0; i < video.pixels.length; i++) {
        bgImage.pixels[i] = video.pixels[i];
    }
    bgImage.updatePixels();
}

// function setup() {
//   const canvasSize = min([windowWidth - 15, windowHeight - 15, 600]);
//   createCanvas(canvasSize, canvasSize);
//   initUi();

//   capture = createCapture(VIDEO);
//   capture.elt.setAttribute('playsinline', '');
//   capture.hide();
// }

// function draw() {
//   const img = capture.get();
//   img.loadPixels();
  
//   // 画像の中心 50 x 50ピクセルを切り出す
//   const size = 50;
//   const croppedImage = img.get(
//     img.width / 2 - size / 2,
//     img.height / 2 - size / 2,
//     size, size
//   );
//   const aveColor = averageColor(croppedImage);
//   if (frameCount % 10 == 0) {
//     for (let i = 0; i < pixelNum; i++) {
//       const isLast = i === (pixelNum - 1);
//       sendPixelData(i, red(aveColor), green(aveColor), blue(aveColor), isLast ? 1 : 0);
//     }
//   }

//   const ratio = width / height;
//   const w = ratio > 0 ? width : img.width * ratio;
//   const h = ratio > 0 ? img.height * ratio: height;
//   image(img, 0, 0, w, h);
//   fill(aveColor);
//   rect(img.width / 2 - size / 2, img.height / 2 - size / 2, size, size);
//   image(croppedImage, 0, 0);
// }

// /**
//  * 画像の平均色を計算する
//  * @param {*} img 
//  * @returns 
//  */
// function averageColor(img) {
//   img.loadPixels();
//   let r = 0;
//   let g = 0;
//   let b = 0;
//   for (let y = 0; y < img.height; y++) {
//     for (let x = 0; x < img.width; x++) {
//       r += red(img.get(x, y));
//       g += green(img.get(x, y));
//       b += blue(img.get(x, y));
//     }
//   }
//   r /= img.width * img.height;
//   g /= img.width * img.height;
//   b /= img.width * img.height;
//   return color(r, g, b);
// }
