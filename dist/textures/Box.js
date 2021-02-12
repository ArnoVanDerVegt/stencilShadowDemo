class Box extends Texture {
    createTexture() {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        const drawRect = (x, y, width, height) => {
            context.globalAlpha = 0.8;
            context.lineWidth = 4;
            context.strokeStyle = '#FFFFFF';
            context.beginPath();
            context.moveTo(x, y + height);
            context.lineTo(x, y);
            context.lineTo(x + width, y);
            context.stroke();
            context.strokeStyle = '#000000';
            context.beginPath();
            context.moveTo(x + width, y);
            context.lineTo(x + width, y + height);
            context.lineTo(x, y + height);
            context.stroke();
            context.globalAlpha = 1;
        };
        canvas.width = 128;
        canvas.height = 128;
        context.fillStyle = '#808080';
        context.fillRect(0, 0, 128, 128);
        drawRect(0, 0, 128, 128);
        drawRect(16, 16, 96, 96);
        this._canvas = canvas;
        this.createGlTexture(canvas);
    }
}
