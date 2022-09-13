var tiles = [];
var tile_id;
var popover_content = '';
var total_earinings = 0;

$(document).ready(function () {
    displayTiles(16);

    $("body")
        .on("click", ".empty", showTilePopover)                                     /** This function will show popups */
        .on("click", ".tilled", showTilePopover)                                    /** This function will show popups */
        .on("click", ".harvest", showTilePopover)                                   /** This function will show popups */
        .on("click", ".has_plant", showTilePopover)                                 /** This function will show popups */
        .on("click", ".till_btn", setTilledState)                                   /** This function will set the tile in tilled state */
        .on("click", ".plant_btn", openCropToPlantModal)                            /** This function will open crop to plant modal */
        .on("dblclick", ".has_plant", setHarvestState)                              /** This function will set the tile in harvest state */
        // .on("click", ".plant_btn",openCropToPlantModal )
        .on("click", ".remove_btn", openRemoveModal)                                /** This function will open remove modal */
        .on("click", ".harvest_btn", harvestTile)                                   /** This function will harvest the plant and will add the crop value to total earnings */
        .on("click", ".remove_modal_remove_btn", removePlantState)                  /** This function will remove any state then set the tile to empty */
        .on("click", ".plant", selectCropToPlant)
        .on("click", hidePopover);                                                  /** This function will hide other popovers in page */
    
    $('[data-toggle="popover"]').popover({
        placement: 'bottom',
        html: true,
        content: popOverButton
    });
});

function selectCropToPlant(){
    let crop_plant_tile = $(this);
    
    //crop_plant_tile.css("background", "")
    
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

    console.log(tiles[tile_index])
}

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

    harvestTime(timer, tile_id);
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
    let harvested_value = $(".tile_text").text();

    total_earinings += parseInt(harvested_value.split("$")[1]);
    removePlantState();
    $('.total_earnings_value').text(total_earinings);
}

/** 
    * DOCU: This function will remove any state then set the tile to empty <br>
    * Triggered By: .on("click", ".remove_modal_remove_btn", removePlantState) <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function removePlantState(){
    let tile = $(`#${tile_id}`);
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
            '<button class="harvest_btn">Harvest</button> <button class="remove_btn">Remove</button>'
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
    $('.total_earnings_value').text(total_earinings);
}

/** 
    * DOCU: This function will set the tile to harvest state <br>
    * Last Updated Date: Sept. 9, 2022
    * @function
    * @author Alfie Osayan
*/
function harvestTime(time, tile) {
    let timer = setInterval(function() {
        time--;
        if($(`#${tile}`).hasClass("empty") === false) {
            $(`#${tile}`).find(".tile_text").text(`${time}s`);
        }
        if (time <= 0) {
            clearInterval(timer);
            if ($(`#${tile}`).hasClass("empty") === false) {
                $(`#${tile}`).removeClass("has_plant").addClass("harvest").find(".tile_text").text("$10");
            }
        }
    }, 1000);
}
