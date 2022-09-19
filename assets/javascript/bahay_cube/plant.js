class Plant {
    constructor(crop) {
        this.crop = crop;
        this.harvest_time = 0;
        this.value;
        this.harvest_value = 0;
        this.crop_image;
    }

    setHarvestTime(new_harvest_time){
        this.harvest_time = new_harvest_time;
    }

    setValue(new_value){
        this.value = new_value;
    }

    setHarvestValue(new_harvest_value){
        this.harvest_value = new_harvest_value;
    }

    setCropImage(img_url){
        this.crop_image = img_url;
    }
}
