const FONT = '128px Bangers';

class CharacterScanner {
    constructor(opts) {
        this._canvas  = document.getElementById('scan');
        this._context = this._canvas.getContext('2d');
    }

    render(ch) {
        this._ch = ch;
        let canvas  = this._canvas;
        let context = this._context;
        let width   = canvas.width;
        let height  = canvas.height;
        context.clearRect(0, 0, width, height);
        context.textBaseline = 'top';
        context.textAlign    = 'left';
        context.font         = FONT;
        context.fillStyle    = '#FFFFFF';
        context.strokeStyle  = '#000000';
        context.lineWidth    = 4;
        context.strokeText(ch, 32, 32);
        context.fillText(ch, 32, 32);
        return this;
    }

    scan() {
        let canvas    = this._canvas;
        let context   = this._context;
        let width     = canvas.width;
        let height    = canvas.height;
        let imageData = context.getImageData(0, 0, width, height);
        let data      = imageData.data;
        let x         = 0;
        let y         = 0;
        let minX      = -1;
        let maxX      = -1;
        let minY      = -1;
        let maxY      = -1;
        x = 0;
        while ((x < width) && (minX === -1)) {
            for (y = 0; y < height; y++) {
                let a = data[y * width * 4 + x * 4 + 3];
                if (a !== 0) {
                    minX = x;
                    break;
                }
            }
            x++;
        }
        x = width - 1;
        while ((x > 0) && (maxX === -1)) {
            for (y = 0; y < height; y++) {
                let a = data[y * width * 4 + x * 4 + 3];
                if (a !== 0) {
                    maxX = x;
                    break;
                }
            }
            x--;
        }
        y = 0;
        while ((y < height) && (minY === -1)) {
            for (x = 0; x < width; x++) {
                let a = data[y * width * 4 + x * 4 + 3];
                if (a !== 0) {
                    minY = y;
                    break;
                }
            }
            y++;
        }
        y = height - 1;
        while ((y > 0) && (maxY === -1)) {
            for (x = 0; x < width; x++) {
                let a = data[y * width * 4 + x * 4 + 3];
                if (a !== 0) {
                    maxY = y;
                    break;
                }
            }
            y--;
        }
        return {
            ch: this._ch,
            minX:    minX - 32,
            minY:    minY,
            maxX:    maxX - 32,
            maxY:    maxY,
            width:   maxX - minX,
            height:  maxY - minY,
            kerning: {}
        };
    }
}

class FontScanner {
    constructor(opts) {
        this._onFinished = opts.onFinished;
        this._start      = 0;
    }

    scan() {
        this._ch               = 33;
        this._chars            = {};
        this._characterScanner = new CharacterScanner({});
        this.onScan();
    }

    onScan() {
        let ch = this._ch;
        if (ch < 127) {
            this.info('Scanning: "' + String.fromCharCode(ch) + '"');
            this._chars[ch] = this._characterScanner.render(String.fromCharCode(ch)).scan();
            if (this._start < 200) {
                this._start++;
            } else {
                this._ch++;
            }
            setTimeout(this.onScan.bind(this), 1);
        } else {
            this._ch = 33;
            this.onScanKerning();
        }
    }

    onScanKerning() {
        let ch    = this._ch;
        let chars = this._chars;
        if (ch < 127) {
            this.info('Scanning kerning: "' + String.fromCharCode(ch) + '"');
            for (let ch2 = 33; ch2 < 127; ch2++) {
                let kerning = this._characterScanner.render(String.fromCharCode(ch) + String.fromCharCode(ch2)).scan();
                chars[ch].kerning[ch2] = kerning.width - chars[ch].width - chars[ch2].width;
            }
            this._ch++;
            setTimeout(this.onScanKerning.bind(this), 1);
        } else {
            this.onScanned();
        }
    }

    onScanned() {
        let chars = this._chars;
        let minX  = 256;
        let minY  = 128;
        let maxY  = 0;
        for (let i in chars) {
            minX = Math.min(minX, chars[i].minX);
            minY = Math.min(minY, chars[i].minY);
            maxY = Math.max(maxY, chars[i].maxY);
        }
        this._onFinished({
            minX:  minX,
            minY:  minY,
            maxY:  maxY,
            chars: chars
        });
    }

    info(s) {
        document.getElementById('info').innerHTML = s;
    }
}

class FontRenderer {
    constructor(opts) {
        this._canvas  = document.getElementById('output');
        this._context = this._canvas.getContext('2d');
        this._chars   = opts.chars;
        this._minX    = opts.minX;
        this._minY    = opts.minY;
        this._maxY    = opts.maxY;
        this._height  = this._maxY - this._minY;
    }

    render() {
        let context = this._context;
        let chars   = this._chars;
        let x       = 2;
        let y       = 32;
        let output  = {};
        let minY    = this._minY;
        context.textAlign    = 'left';
        context.textBaseline = 'top';
        for (let ch = 33; ch < 127; ch++) {
            let info = chars[ch];
            context.font         = FONT;
            context.fillStyle    = '#FFFFFF';
            context.strokeStyle  = '#000000';
            context.lineWidth    = 4;
            context.fillText(String.fromCharCode(ch), x - info.minX, y - minY + (32 - this._minY));
            context.strokeText(String.fromCharCode(ch), x - info.minX, y - minY + (32 - this._minY));
            // context.strokeStyle = '#FF0000';
            // context.lineWidth   = 2;
            // context.strokeRect(x, y - minY, info.width, this._height);
            output[ch] = {
                x:       x,
                y:       y - minY,
                width:   info.width,
                height:  this._height,
                kerning: info.kerning
            };
            x += info.width + 3;
            if ((ch + 1 < 127) && (x + chars[ch + 1].width + 3 >= 1024)) {
                x = 2;
                y += this._height + 3;
            }
        }
        let s     = 'const charInfo = {\n';
        for (let i in output) {
            s += '        ' + i + ': ' + JSON.stringify(output[i]) + ',\n';
        }
        s = s.substr(0, s.length - 1) + '\n    };\n';
        document.getElementById('code').value = s;
        document.getElementById('outputImg').src = this._canvas.toDataURL('image/png');
    }
}

window.addEventListener(
    'DOMContentLoaded',
    () => {
        new FontScanner({
            onFinished: (info) => {
                new FontRenderer(info).render();
            }
        }).scan();
    }
);
