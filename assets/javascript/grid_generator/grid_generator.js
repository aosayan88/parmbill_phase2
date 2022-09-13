var tiles = [
    [0,0,0,1],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,1]
];

$(document).ready(function () {
    $("body")
        .on("click", ".get_coordinates_btn", getCoordinates)
        .on("click", ".render_table_btn", renderTable);
    displayTiles();
 });

function getCoordinates(){
    let text_array = "[ \n";
    for(let tile_index = 0; tile_index < tiles.length; tile_index++) {
        if(tile_index !== tiles.length - 1) {
            text_array += `[${tiles[tile_index]}], \n`;
        }
        else {
            text_array += `[${tiles[tile_index]}]\n`;
        }
    }
    text_array += "]";
    $(".coordinates_textarea").val(text_array);
};

function renderTable(){
    let newTiles = $(".coordinates_textarea").val();
    newTiles = newTiles.replace(/'/g, '"');
    newTiles = JSON.parse(newTiles);

    tiles = newTiles;
    displayTiles();
}

function displayTiles(){
    let output = "";

    for (let tile_index = 0; tile_index < tiles.length; tile_index++) {
        output += "\n<div class='tile'>\n";
        for (let element_index = 0; element_index < tiles[tile_index].length; element_index++) {
            if (tiles[tile_index][element_index] === 1) {
                output += "<div class='tilled'></div>";
            }
            if (tiles[tile_index][element_index] === 0) {
                output += "<div class='empty'></div>";
            }
        }
        output += "\n</div>";
    }
    $("#tiles_table").html(output);
};
