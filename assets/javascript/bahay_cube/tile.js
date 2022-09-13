class Tile {
    constructor(id) {
        this.tile_id = id;
        this.tile_status = "empty";
        this.plant = {}
    }

    setTileStatus(status){
        this.tile_status = status;
    }

    setPlant(obj){
        this.plant = obj;
    }
}