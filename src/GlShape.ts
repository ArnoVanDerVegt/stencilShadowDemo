interface IGlShape extends IGlObject {
    _shadow: IGlShadowBuilder;
    getShadow(): IGlShadowBuilder;
    setShadow(shadow: IGlShadowBuilder): void;
    createObject(sizeX: number, sizeY: number, sizeZ: number): void;
    render(): void;
}

interface IGlShapeOpts extends IGlObjectOpts {
    sizeX: number;
    sizeY: number;
    sizeZ: number;
}

class GlShape extends GlObject implements IGlShape {
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
