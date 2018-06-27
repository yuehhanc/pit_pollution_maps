var latitude = [];
var longitude = [];
var CO = [];
var O3 = [];
var PM025 = [];
var prev_degO3 = 90;
var prev_degPM025 = 90;
var flag = 0; // 0: PM2.5, 1: O3

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/static/pollution_map/Interpolated_Map.csv?q=" + Math.random(),
        dataType: "text",
        success: function(data) {
            processData(data);
            addGrids(flag);
        }
     });
});

function processData(allText) {
    var record_num = 5;
    var allTextLines = allText.split(/\r\n|\n/);
    // Ignore the first line
    allTextLines.shift();

    while (allTextLines.length) {
        var entries = allTextLines.shift().split(',');
        latitude.push(parseFloat(entries.shift()));
        longitude.push(parseFloat(entries.shift()));
        CO.push(parseFloat(entries.shift()));
        O3.push(parseFloat(entries.shift()));
        PM025.push(parseFloat(entries.shift()));
    }
}

function o3RadioChecked() {
    var isPM25Arrow = document.getElementById("pm25_arrow");
    if (isPM25Arrow != null) {
        document.getElementById("arrow").innerHTML = "";
    }
    var isO3Arrow = document.getElementById("o3_arrow");
    if (isO3Arrow == null) {
        var newArrow = document.createElement("div");
        newArrow.innerHTML = '<img src="' + "/static/pollution_map/images/blue_arrow.png" + '" class="blue_arrow" id="o3_arrow">';
        document.getElementById("arrow").appendChild(newArrow);
    }
    flag = 1;
    addGrids(flag);
}

function pm25RadioChecked() {
    var isO3Arrow = document.getElementById("o3_arrow");
    if (isO3Arrow != null) {
        document.getElementById("arrow").innerHTML = "";
    }
    var isPM25Arrow = document.getElementById("pm25_arrow");
    if (isPM25Arrow == null) {
        var newArrow = document.createElement("div");
        newArrow.innerHTML = '<img src="' + "/static/pollution_map/images/red_arrow.png" + '" class="blue_arrow" id="pm25_arrow">';
        document.getElementById("arrow").appendChild(newArrow);
    }
    flag = 0;
    addGrids(flag);
}

// function getCursor(event) {
//     var x = event.clientX;
//     var y = event.clientY;
//     var lat = 40.520537 - 0.00025509*(x-129);
//     var lon = -80.229309 + 0.00032544*(y-1440);
//     $.ajax({
//         url: "/pollution_map/get_cursor_json",
//         data: {'lat': lat, 'lon': lon},
//         datatype: "json",
//         success: rotateDials,
//     });
// }

// function rotateDials(coord) {
//     var lat = coord[0];
//     var lon = coord[1];

//     var dist = 2147483647;
//     var index = 0;
//     for (i = 0; i < latitude.length; i++) {
//         var dX = latitude[i]-lat;
//         var dY = longitude[i]-lon;
//         var curr_dist = dX*dX + dY*dY;
//         if (curr_dist < dist) {
//             dist = curr_dist;
//             index = i;
//         }
//     }

//     var degO3 = (O3[index] - 22)*180/16.0;
//     var degPM025 =  (PM025[index] - 2)*180/10.0;
//     if (degO3 > 180) {
//         degO3 = 180;
//     }
//     if (degO3 < 0) {
//         degO3 = 0;
//     }
//     if (degPM025 > 180) {
//         degPM025 = 180;
//     }
//     if (degPM025 < 0) {
//         degPM025 = 0;
//     }
    
//     // aminate rotation
//     $({deg: prev_degO3}).animate({deg: degO3}, {
//         duration: 200,
//         step: function(now) {
//             $("#o3_arrow").css({
//                 transform: 'rotate(' + (now - 90) + 'deg)'
//             });
//         }
//     });
//     $({deg: prev_degPM025}).animate({deg: degPM025}, {
//         duration: 200,
//         step: function(now) {
//             $("#pm25_arrow").css({
//                 transform: 'rotate(' + (now - 90) + 'deg)'
//             });
//         }
//     });
//     ////////////////
//     prev_degPM025 = degPM025;
//     prev_degO3 = degO3;
// }
var index4Avg = 0;
function addGrids(flag) {
    //gcd(1440, 675) = 45
    var map = document.getElementById("map");
    var map_area = document.getElementById("map_area");
    map_area.innerHTML = '<img src="/static/pollution_map/images/pit_map.png" onclick="searchPoint(event)" class="map" id="map">';
    for (var i = 0; i < 100; i += 4) {
        for (var j = 0; j < 84; j += 6) {
            var newGrid = document.createElement("div");
            var x = i;
            var y = (16 + j);
            var avg = assignAvg(x, y, 0, flag);
            // console.log("avg: " + avg);
            var multi = 1;
            var meanO3 = 25.8896573;
            var stdO3 = 12.2525487;
            var meanPM25 = 9.14702301;
            var stdPM25 = 5.67227436;
            if (flag == 0) {
                if (avg < (meanPM25-stdPM25)) {
                    multi = 1;
                } else if (avg < (meanPM25-0.5*stdPM25)) {
                    multi = 2.5;
                } else if (avg < (meanPM25-0.25*stdPM25)) {
                    multi = 3;
                } else if (avg < meanPM25) {
                    multi = 3.5;
                } else if (avg < (meanPM25+0.25*stdPM25)) {
                    multi = 4;
                } else if (avg < (meanPM25+0.5*stdPM25)) {
                    multi = 4.5;
                } else if (avg < (meanPM25+stdPM25)) {
                    multi = 5;
                } else {
                    multi = 6;
                }
            } else {
                if (avg < (meanO3-stdO3)) {
                    multi = 1;
                } else if (avg < (meanO3-0.5*stdO3)) {
                    multi = 2.5;
                } else if (avg < (meanO3-0.25*stdO3)) {
                    multi = 3;
                } else if (avg < meanO3) {
                    multi = 3.5;
                } else if (avg < (meanO3+0.25*stdO3)) {
                    multi = 4;
                } else if (avg < (meanO3+0.5*stdO3)) {
                    multi = 4.5;
                } else if (avg < (meanO3+stdO3)) {
                    multi = 5;
                } else {
                    multi = 6;
                }
            }

            var trans = 0.1*multi;
            newGrid.className = "layer";
            newGrid.style.left = x.toString() + "vw";
            newGrid.style.top = y.toString() + "vh";
            if (flag == 0) {
                newGrid.style.background = "rgba(255,0,0," + trans.toString() +")";
            } else {
                newGrid.style.background = "rgba(0,0,255," + trans.toString() +")";
            }
            newGrid.onclick = searchPoint;
            map_area.appendChild(newGrid);
        }
    }
    index4Avg = 0;
}

function assignAvg(x, y, index, flag) {
    var sum = 0;
    var count = 0;
    var scaleX = map.clientWidth/100.0;
    var scaleY = (map.clientHeight/0.84)/100.0;
    var xMin = toLon(x*scaleX, map);
    var yMax = toLat(y*scaleY, map);
    var xMax = toLon((x+2)*scaleX, map);
    var yMin = toLat((y+2)*scaleY, map);
    // console.log("gridX: " + xMin + " gridY:" + yMin);
    // console.log("gridXM: " + xMax + " gridYM:" + yMax);
    for (i = index; i < latitude.length; i++) {
        if (latitude[i] < yMax && latitude[i] >= yMin && longitude[i] < xMax && longitude[i] >= xMin) {
            if (flag == 0) {
                sum += PM025[i];
            } else {
                sum += O3[i];
            }
            count += 1;
        }
        if (longitude[i] >= xMax) {
            index4Avg = i;
            break;
        }
    }
    // console.log("count: " + count + " sum: " + sum);
    if (count > 0) {
        return sum/count;
    } else {
        return 1;
    }
}

function toLat(y, map) {
    return 40.48 - (0.1/(1+map.clientHeight))*(y-129);
}

function toLon(x, map) {
    return -80.12 + (0.29/(1+map.clientWidth))*x;
}

function searchPoint(event) {
    var x = event.clientX;
    var y = event.clientY;
    var map = document.getElementById("map");
    // console.log("x: " + x + ", y:" + y);
    // 1440 800
    // coord: top-left:40.38, -80.12 bottom-right: 40.48, -79.83
    var lat = 40.48 - (0.1/(1+map.clientHeight))*(y-129);//+1 to avoid zero division
    var lon = -80.12 + (0.29/(1+map.clientWidth))*x;
    // console.log("Latitude: " + lat + ", Longitude:" + lon);
    var dist = 2147483647;
    var index = 0;
    for (i = 0; i < latitude.length; i++) {
        var dX = latitude[i]-lat;
        var dY = longitude[i]-lon;
        var curr_dist = dX*dX + dY*dY;
        if (curr_dist < dist) {
            dist = curr_dist;
            index = i;
        }
    }
    // console.log("Client Width: " + map.clientWidth + ", Client Height:" + map.clientHeight);
    // console.log("CO: " + CO[index]);
    // console.log("O3: " + O3[index]); //max: 38, min:22, avg: 30, mean: 25.8896573, std=12.2525487
    // console.log("PM2.5: " + PM025[index]); //max:14, min:2, avg: 8, mean: 9.14702301, std=5.67227436
    var meanO3 = 25.8896573;
    var stdO3 = 12.2525487;
    var meanPM25 = 9.14702301;
    var stdPM25 = 5.67227436;

    var degO3 = (O3[index] - (meanO3 - 2*stdO3))*180/(4*stdO3);
    var degPM025 =  (PM025[index] - (meanPM25 - 2*stdPM25))*180/(4*stdPM25);
    if (degO3 > 180) {
        degO3 = 180;
    }
    if (degO3 < 0) {
        degO3 = 0;
    }
    if (degPM025 > 180) {
        degPM025 = 180;
    }
    if (degPM025 < 0) {
        degPM025 = 0;
    }
    // console.log("PM25: " + degPM025 + ", " + PM025[index]);
    // console.log("O3: " + degO3 + ", " + O3[index]);
    
    // aminate rotation
    $({deg: prev_degO3}).animate({deg: degO3}, {
        duration: 200,
        step: function(now) {
            $("#o3_arrow").css({
                transform: 'rotate(' + (now - 90) + 'deg)'
            });
        }
    });
    $({deg: prev_degPM025}).animate({deg: degPM025}, {
        duration: 200,
        step: function(now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $("#pm25_arrow").css({
                transform: 'rotate(' + (now - 90) + 'deg)'
            });
        }
    });

    // console.log("Rotate O3: " + rotateO3);
    // console.log("Rotate PM25: " + rotatePM025);
    // console.log("O3 deg: " + degO3);
    // console.log("PM2.5 deg: " + degPM025);
    ////////////////
    prev_degPM025 = degPM025;
    prev_degO3 = degO3;

    var map_area = document.getElementById("map_area");
    if (document.getElementById("marker") != null) {
        document.getElementById("marker").remove();
    }
    // map_area.innerHTML = map_area.innerHTML + '<div onclick="searchPoint(event)" style="z-index: 5; border-color: orange; border-style: solid; border-width: 6px; width: 1.5vw; height: 1.5vw; z-index: 5; position: absolute; left: ' + 
    //                       (x-8) + 'px; top: ' + (y-8) + 'px;" id="marker"></div>';
    var newCursor = document.createElement("div");
    newCursor.className = "cursor";
    newCursor.id = "marker";
    newCursor.style.left = (x-8).toString() + "px";
    newCursor.style.top = (y-8).toString() + "px";
    newCursor.onclick = searchPoint;
    map_area.appendChild(newCursor);
}

function detectMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location = "http://www.youtube.com";
    }
}
// window.location.reload(true);
// window.onload = function() {
//     addGrids(flag);
// }
