class PineTreeTexture extends Texture {
    createTexture(): void {
        let canvas  = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width      = 128;
        canvas.height     = 128;
        let gradient = context.createRadialGradient(32, 32, 16, 32, 32, 32);
        gradient.addColorStop(0.0, '#006400');
        gradient.addColorStop(0.5, '#008000');
        gradient.addColorStop(1.0, '#7FFF00');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        context.fillStyle = 'Brown';
        context.fillRect(64, 64, 64, 64);
        this._canvas = canvas;
        this.createGlTexture(canvas);
    }
}
