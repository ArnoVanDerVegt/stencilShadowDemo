class StarTexture extends Texture {
    createTexture(): void {
        let canvas  = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width      = 128;
        canvas.height     = 128;
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, 128, 128);
        context.strokeStyle = '#FF0000';
        for (let i = 0; i < 5; i++) {
            let angle1 = Math.PI / 2.5 * (i - 0.5);
            let angle2 = Math.PI / 2.5 * i;
            let angle3 = Math.PI / 2.5 * (i + 0.5);
            let x1 = 64 + Math.sin(angle1) * 32;
            let y1 = 64 + Math.cos(angle1) * 32;
            let x2 = 64 + Math.sin(angle2) * 64;
            let y2 = 64 + Math.cos(angle2) * 64;
            let x3 = 64 + Math.sin(angle3) * 32;
            let y3 = 64 + Math.cos(angle3) * 32;
            context.lineWidth = 10;
            context.lineCap   = 'round';
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.lineTo(x3, y3);
            context.stroke();
        }

        this._canvas = canvas;
        this.createGlTexture(canvas);
    }
}
