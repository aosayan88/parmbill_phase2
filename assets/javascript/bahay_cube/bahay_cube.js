var tiles = [];
var tile_id;
var popover_content = '';
var total_earnings = 100;
var selected_plant = "potato";

$(document).ready(function () {
    displayTiles(16);

    $("body")
        .on("click", ".empty", showTilePopover)                                     /** This function will show popups */
        .on("click", ".tilled", showTilePopover)                                    /** This function will show popups */
        .on("click", ".harvest", showTilePopover)                                   /** This function will show popups */
        .on("click", ".has_plant", showTilePopover)                                 /** This function will show popups */
        .on("click", ".till_btn", setTilledState)                                   /** This function will set the tile in tilled state */
        .on("click", ".plant_btn", openCropToPlantModal)                            /** This function will open crop to plant modal */
        .on("click", "#crop_to_plant_btn",submitSelectedCrop)
        .on("click", ".remove_btn", openRemoveModal)                                /** This function will open remove modal */
        .on("click", "#harvest_btn", harvestTile)                                   /** This function will harvest the plant and will add the crop value to total earnings */
        .on("click", ".remove_modal_remove_btn", removePlantState)                  /** This function will remove any state then set the tile to empty */
        .on("click", hidePopover);                                                  /** This function will hide other popovers in page */
    
    $('[data-toggle="popover"]').popover({
        placement: 'bottom',
        html: true,
        content: popOverButton
    });
});

function submitSelectedCrop(){
    let tile_index = tile_id.split("id_")[1];
    selected_plant = $("input[name='crop_option']:checked").val();
    let plant = new Plant(selected_plant);
    let this_tile = tiles[tile_index];
    
    selectedCropsValues(plant);
    
    this_tile.setTileStatus('has_plant');
    this_tile.setPlant(plant);
    let crop_value = this_tile.plant["value"];

    if(total_earnings > crop_value) {
        total_earnings -= crop_value;
        $('.total_earnings_value').text(total_earnings);
    }
    else {
        alert("Not enough funds");
        return;
    }

    if(this_tile.tile_status === "has_plant"){
        let tile = $(`#${tile_id}`);
        let time = this_tile.plant['harvest_time'];
        tile.removeClass("tilled").addClass("has_plant").addClass(`${this_tile.plant['crop']}_planted`).find(".tile_text").text(`${time}s`);
        harvestTime(time, tile_id, this_tile);
    }

    $('#crops_modal').modal('hide');
}

/** 
    * DOCU: This function will show popups <br>
    * Triggered By: .on("click", ".empty", showPopover) <br>
    * Last Updated Date: Sept. 8, 2022
    * @function
    * @author Alfie Osayan
*/
function selectedCropsValues(plant){
    if(selected_plant === "potato") {
        plant.setHarvestTime(5);
        plant.setValue(10)
        plant.setHarvestValue(15);
    }
    if(selected_plant === "onion") {
        plant.setHarvestTime(8);
        plant.setValue(15)
        plant.setHarvestValue(25);
    }
    if(selected_plant === "carrot") {
        plant.setHarvestTime(10);
        plant.setValue(25)
        plant.setHarvestValue(75);
    }
    if(selected_plant === "corn") {
        plant.setHarvestTime(12);
        plant.setValue(35)
        plant.setHarvestValue(100);
    }
}

/** 
    * DOCU: This function will show popups <br>
    * Triggered By: .on("click", ".empty", showPopover) <br>
    * Last Updated Date: Sept. 8, 2022
    * @function
    * @author Alfie Osayan
*/
function showTilePopover(){
    tile_id = $(this).attr("id");
    let tile_class = $(this).attr("class");

    $(`.${tile_class}`).not(this).popover("hide");
}


/** 
    * DOCU: This function will set the tile in tilled state <br>
    * Triggered By: .on("click", ".empty", showPopover) <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function setTilledState(){
    let tile_index = tile_id.split("id_")[1];
    
    $(`#${tile_id}`).removeClass("empty").addClass("tilled");
    tiles[tile_index].setTileStatus("tilled");
}

/** 
    * DOCU: This function will open the select crop modal<br>
    * Triggered By: .on("click", ".empty", showPopover) <br>
    * Last Updated Date: Sept. 19, 2022
    * @function
    * @author Alfie Osayan
*/
function openCropToPlantModal(){
    $('#crops_modal').modal({
        backdrop: "static",
        keyboard: false
    });
}

/** 
    * DOCU: This function will set the tile in plant state <br>
    * Triggered By: .on("click", ".plant_btn", setPlantState) <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function setPlantState(){
    let tile_index = tile_id.split("id_")[1];
    $(`#${tile_id}`).removeClass("tilled").addClass("has_plant").find(".tile_text").text("10s");
    
    let timer = $(`#${tile_id}`).find(".tile_text").text().split("s")[0];

    //harvestTime(timer, tile_id);
    tiles[tile_index].setTileStatus("has_plant");
}

/** 
    * DOCU: This function will set the tile in harvest state <br>
    * Triggered By: .on("dblclick", ".has_plant", setHarvestState) <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function setHarvestState(){
    let tile_index = tile_id.split("id_")[1];
    let harvest_tile = $(`#${tile_id}`);

    harvest_tile.removeClass("has_plant").addClass("harvest").find(".tile_text").text("$10");
    tiles[tile_index].setTileStatus("ready_to_harvest");
}

/** 
    * DOCU: This function will hide other popovers in page <br>
    * Triggered By: .on("click", hidePopover)  <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function hidePopover(event){
    if ($(event.target).data('toggle') !== 'popover'
        && $(event.target).parents('.popover.in').length === 0) {
        $('[data-toggle="popover"]').popover('hide');
    }
}

/** 
    * DOCU: This function will harvest the plant and will add the crop value to total earnings <br>
    * Triggered By: .on("click", ".harvest_btn", harvestTile) <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function harvestTile(){
    let this_tile = tile_id.split("id_")[1];
    let harvested_value = tiles[this_tile].plant["harvest_value"];

    total_earnings += harvested_value;
    $('.total_earnings_value').text(total_earnings);
    removePlantState();
}

/** 
    * DOCU: This function will remove any state then set the tile to empty <br>
    * Triggered By: .on("click", ".remove_modal_remove_btn", removePlantState) <br>
    * Last Updated Date: Sept. 19, 2022
    * @function
    * @author Alfie Osayan
*/
function removePlantState(){
    let tile = $(`#${tile_id}`);
    let selected_tile = tile_id.split("id_")[1];
    tiles[selected_tile].setTileStatus("empty");
    tiles[selected_tile].setPlant({});
    tile.removeClass().addClass("empty").find(".tile_text").text("");
}

/** 
    * DOCU: This function will open remove modal <br>
    * Triggered By: .on("click", ".remove_btn", openRemoveModal) <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function openRemoveModal(){
    $('#remove_modal').modal({
        backdrop: "static",
        keyboard: false
    });
}

/** 
    * DOCU: This function set popovers button <br>
    * Triggered By: $('[data-toggle="popover"]').popover() <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function popOverButton(){
    if ($(this).hasClass("empty")) {
        return '<button class="till_btn">Till</button>';
    }
    else if ($(this).hasClass("tilled")) {
        return '<button class="plant_btn">Plant</button>';
    }
    else if ($(this).hasClass("harvest")) {
        return (
            '<button id="harvest_btn">Harvest</button> <button class="remove_btn">Remove</button>'
        );
    }
    else {
        return '<button class="remove_btn" data-toggle="modal">Remove</button>';
    }
}

/** 
    * DOCU: This function will display default tiles <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function displayTiles(number_of_tile){
    let tile_block = "";

    tile_block += "\n<div class='tile'>\n";
    for(let tile_index=0;tile_index < number_of_tile; tile_index++) {
        tiles.push(new Tile(tile_index));
        tile_block +=   `<button type="button" id="tile_id_${tile_index}" class="empty" data-toggle="popover"><span class="tile_text"></span></button>`;
    }
    tile_block += "\n</div>";

    $("#tiles_table").html(tile_block);
    $('.total_earnings_value').text(total_earnings);
}

/** 
    * DOCU: This function will set the tile to harvest state <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function harvestTime(time, tile, this_tile) {
    let timer = setTimeout(function tick(){
        time--;
        if(time <= 0) {
            clearTimeout(timer);
            if ($(`#${tile}`).hasClass("empty") === false) {
                $(`#${tile}`).removeClass("has_plant").addClass("harvest").find(".tile_text").text(`$${this_tile.plant["harvest_value"]}`);
            }
        }
        else {
            timer = setTimeout(tick, 1000);
            if($(`#${tile}`).hasClass("empty") === false) {
                $(`#${tile}`).find(".tile_text").text(`${time}s`);
            }
        }
    }, 1000);
}
