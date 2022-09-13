class Plant {
    constructor(crop) {
        this.crop = crop;
        this.harvest_time;
        this.value;
    }

    setHarvestTime(new_harvest_time){
        this.harvest_time = new_harvest_time;
    }

    setValue(new_value){
        this.value = new_value;
    }
}
