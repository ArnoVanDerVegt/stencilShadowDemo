class PineTreeTexture extends Texture {
    createTexture(): void {
        let canvas  = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width      = 128;
        canvas.height     = 128;
        context.fillStyle = 'green';
        context.fillRect(0, 0, 64, 64);
        context.fillStyle = 'Brown';
        context.fillRect(64, 64, 64, 64);
        this._canvas = canvas;
        this.createGlTexture(canvas);
    }
}
