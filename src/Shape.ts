interface IShape extends IObjct {
    _shadow: IGlShadowBuilder;
    getShadow(): IGlShadowBuilder;
    setShadow(shadow: IGlShadowBuilder): void;
    createObject(sizeX: number, sizeY: number, sizeZ: number): void;
    render(): void;
}

interface IShapeOpts extends IObjctOpts {
    sizeX: number;
    sizeY: number;
    sizeZ: number;
}

class Shape extends Objct implements IShape {
    _shadow: IGlShadowBuilder;

    getShadow(): IGlShadowBuilder {
        return this._shadow;
    }

    setShadow(shadow: IGlShadowBuilder): void {
        this._shadow = shadow;
    }

    createObject(sizeX: number, sizeY: number, sizeZ: number): void {
    }
}
