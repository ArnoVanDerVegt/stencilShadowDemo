interface IShape extends IObjct {
    _shadow: IShadowBuilder;
    getShadow(): IShadowBuilder;
    setShadow(shadow: IShadowBuilder): void;
    createObject(sizeX: number, sizeY: number, sizeZ: number): void;
    render(): void;
}

interface IShapeOpts extends IObjctOpts {
    sizeX: number;
    sizeY: number;
    sizeZ: number;
}

class Shape extends Objct implements IShape {
    _shadow: IShadowBuilder;

    getShadow(): IShadowBuilder {
        return this._shadow;
    }

    setShadow(shadow: IShadowBuilder): void {
        this._shadow = shadow;
    }

    createObject(sizeX: number, sizeY: number, sizeZ: number): void {
    }
}
