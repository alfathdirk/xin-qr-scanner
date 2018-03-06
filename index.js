import { define, Component } from '@xinix/xin';
import jsQR from 'jsqr';

class XinQrScanner extends Component {
  get template () {
      return String(`
        <canvas id="canvas" hidden></canvas>
      `);
    }

  get props () {
    return Object.assign({}, super.props, {
      autostart: {
        type: Boolean,
        value: false,
        notify: true,
      },

      value: {
        type: String,
        notify: true,
      },
    });
  }

  created () {
    super.created();
    this.video = document.createElement('video');
  }

  stop () {
    this.video.srcObject.getTracks().forEach(track => track.stop());
    this.$.canvas.hidden = true;
  }

  start () {
    let self = this;
    let video = this.video;
    let canvasElement = this.$.canvas;
    let canvas = canvasElement.getContext('2d');

    function drawLine (begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (stream) {
      video.srcObject = stream;
      video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
      video.play();
      window.requestAnimationFrame(tick);
    });

    function tick () {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;

        // let scale = window.innerWidth / video.videoWidth;
        // canvasElement.width = window.innerWidth;
        // canvasElement.height = scale * video.videoHeight;

        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        let code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
          if (code.data) {
            self.set('value',code.data);
            self.fire('change', code.data);
          }
        }
      }

      window.requestAnimationFrame(tick);
    }
  }

  attached() {
    super.attached();

    if (this.autostart) {
      this.start();
    }
  }
}

define('xin-qr-scanner', XinQrScanner);
