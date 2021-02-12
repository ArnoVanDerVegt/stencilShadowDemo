class WaterTexture extends Texture {
    createTexture() {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        context.fillStyle = '#000088';
        context.fillRect(0, 0, 128, 128);
        context.fillStyle = '#0000AA';
        context.fillRect(0, 0, 32, 32);
        context.fillRect(96, 0, 32, 32);
        context.fillRect(96, 96, 32, 32);
        context.fillRect(0, 96, 32, 32);
        context.fillRect(32, 32, 64, 64);
        this._canvas = canvas;
        this.createGlTexture(canvas);
    }
}
