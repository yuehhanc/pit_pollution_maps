var latitude = [];
var longitude = [];
var CO = [];
var O3 = [];
var PM025 = [];
var prev_degO3 = 90;
var prev_degPM025 = 90;
var flag = 0; // 0: PM2.5, 1: O3
var flagMobile = 0;
var isClairton = 0;

var mobileScreenSize = 768;
var gridVals = new Array(84);
for (var i = 0; i < 84; i++) {
  gridVals[i] = new Array(100);
}
var gridValsMobile = new Array(76);
for (var i = 0; i < 76; i++) {
  gridValsMobile[i] = new Array(100);
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/static/pollution_map/Interpolated_Map_sample.csv?q=" + Math.random(),
        dataType: "text",
        success: function(data) {
            processData(data);
            if (screen.width < mobileScreenSize) {
                addGridsMobile(flagMobile);
            } else {
                addGrids(flag);
            }
            
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
    if (screen.width < mobileScreenSize) {
        o3RadioCheckedMobile();
        return;
    }
    var isPM25Arrow = document.getElementById("pm25_arrow");
    if (isPM25Arrow != null) {
        document.getElementById("arrow").innerHTML = "";
    }
    // var isO3Arrow = document.getElementById("o3_arrow");
    // if (isO3Arrow == null) {
    //     var newArrow = document.createElement("div");
    //     newArrow.innerHTML = '<img src="' + "/static/pollution_map/images/blue_arrow.png" + '" class="blue_arrow" id="o3_arrow">';
    //     document.getElementById("arrow").appendChild(newArrow);
    // }
    var dial_pic = document.getElementById("dial_pic");
    dial_pic.src = '/static/pollution_map/images/dial_gradient_blue_test.png';
    flag = 1;
    addGrids(flag);
}

function pm25RadioChecked() {
    if (screen.width < mobileScreenSize) {
        o3RadioCheckedMobile();
        return;
    }
    var isO3Arrow = document.getElementById("o3_arrow");
    if (isO3Arrow != null) {
        document.getElementById("arrow").innerHTML = "";
    }
    // var isPM25Arrow = document.getElementById("pm25_arrow");
    // if (isPM25Arrow == null) {
    //     var newArrow = document.createElement("div");
    //     newArrow.innerHTML = '<img src="' + "/static/pollution_map/images/red_arrow.png" + '" class="red_arrow" id="pm25_arrow">';
    //     document.getElementById("arrow").appendChild(newArrow);
    // }
    var dial_pic = document.getElementById("dial_pic");
    dial_pic.src = '/static/pollution_map/images/dial_gradient_red_test.png';
    flag = 0;
    addGrids(flag);
}

var index4Avg = 0;
function addGrids(flag) {
    var screenFactor = 1;
    var startHeight = 16;

    //gcd(1440, 675) = 45
    var map = document.getElementById("map");
    var map_area = document.getElementById("map_area");
    if (isClairton == 1) {
        map_area.innerHTML = '<img src="/static/pollution_map/images/pit_map_clairton.png" onclick="searchPoint(event)" class="map" id="map">';
    } else {
        map_area.innerHTML = '<img src="/static/pollution_map/images/5_routes_3.png" onclick="searchPoint(event)" class="map" id="map">';
    }
    for (var i = 0; i < 100; i += 4) {
        for (var j = 0; j < 84; j += 6) {
            var newGrid = document.createElement("div");
            var x = i;
            var y = (startHeight + j);
            var avg = assignAvg(x, y, 0, flag);
            gridVals[j][i] = avg;
            // console.log(j + "," + i + "GridVal: " + gridVals[j][i]);
            // console.log("avg: " + avg);
            var multi = 1;
            var meanO3 = 25.8896573;
            var stdO3 = 12.2525487;
            var meanPM25 = 9.14702301;
            var stdPM25 = 5.67227436;
            avg = Math.round(avg);
            if (flag == 0) {
                if (avg < (meanPM25-stdPM25)) {
                    multi = 0;
                } else if (avg < (meanPM25-0.5*stdPM25)) {
                    multi = 0.5;
                } else if (avg < (meanPM25-0.25*stdPM25)) {
                    multi = 1;
                } else if (avg < meanPM25) {
                    multi = 2;
                } else if (avg < (meanPM25+0.5*stdPM25)) {
                    multi = 3.5;
                } else if (avg < (meanPM25+1*stdPM25)) {
                    multi = 4.5;
                } else if (avg < (meanPM25+2*stdPM25)) {
                    multi = 6;
                } else {
                    multi = 7;
                }
            } else {
                if (avg < (meanO3-stdO3)) {
                    multi = 0;
                } else if (avg < (meanO3-0.5*stdO3)) {
                    multi = 0.5;
                } else if (avg < (meanO3-0.25*stdO3)) {
                    multi = 1;
                } else if (avg < meanO3) {
                    multi = 1.5;
                } else if (avg < (meanO3+0.25*stdO3)) {
                    multi = 2.5;
                } else if (avg < (meanO3+0.5*stdO3)) {
                    multi = 3.5;
                } else if (avg < (meanO3+stdO3)) {
                    multi = 4.5;
                } else {
                    multi = 5;
                }
            }

            var trans = 0.1*multi;
            newGrid.className = "layer";
            newGrid.style.left = x.toString() + "vw";
            newGrid.style.top = (y*screenFactor).toString() + "vh";
            if (flag == 0) {
                newGrid.style.background = "rgba(255,0,0," + trans.toString() +")";
            } else {
                newGrid.style.background = "rgba(0,0,255," + trans.toString() +")";
            }
            newGrid.onclick = searchPoint;
            newGrid.innerHTML = '<input type="hidden" value="'+Math.round(avg).toString()+'">';
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
        // console.log("count: " + count);
        return sum/count;
    } else {
        var i = x;
        var j = y-16;
        if (j-6 > 0) {
            sum += gridVals[j-6][i];
            count++;
        }
        if (i-4 > 0) {
            sum += gridVals[j][i-4];
            count++;
        }
        
        if (sum > 0) {
            return sum/count;
        } else {
            console.log("Client Width: " + x*scaleX + ", Client Height:" + y*scaleY);
            console.log("Long: " + xMin + ", Lat:" + yMin);
            console.log("Long: " + xMax+ ", Lat:" + yMax);
            return 1;
        }
    }
}

function assignAvgMobile(x, y, index, flag) {
    var map = document.getElementById("map_mobile");
    var sum = 0;
    var count = 0;
    var scaleX = map.clientWidth/100.0;
    var scaleY = (map.clientHeight/0.76)/100.0;
    var xMin = toLonMobile(x*scaleX, map);
    var yMax = toLatMobile(y*scaleY, map);
    var xMax = toLonMobile((x+2)*scaleX, map);
    var yMin = toLatMobile((y+2)*scaleY, map);
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
            index4AvgMobile = i;
            break;
        }
    }
    // console.log("count: " + count + " sum: " + sum);
    if (count > 0) {
        // console.log("count: " + count);
        return sum/count;
    } else {
        var i = x;
        var j = y-24;
        if (j-4 > 0) {
            sum += gridValsMobile[j-4][i];
            count++;
        }
        if (i-4 > 0) {
            sum += gridValsMobile[j][i-4];
            count++;
        }
        
        if (sum > 0) {
            return sum/count;
        } else {
            // console.log("Client Width: " + x*scaleX + ", Client Height:" + y*scaleY);
            // console.log("Long: " + xMin + ", Lat:" + yMin);
            // console.log("Long: " + xMax+ ", Lat:" + yMax);
            return 1;
        }
    }
}

function toLat(y, map) {
    if (isClairton == 0) {
        return 40.48 - (0.1/(1+map.clientHeight))*(y-129);
    } else {
        return 40.38 - (0.11/(1+map.clientHeight))*(y-129);
    }
    
}

function toLatMobile(y, map) {
    return 40.48 - (0.18/(1+map.clientHeight))*(y-425);
}

function toLon(x, map) {
    if (isClairton == 0) {
        return -80.12 + (0.29/(1+map.clientWidth))*x;
    } else {
        return -80.11 + (0.26/(1+map.clientWidth))*x;
    }
}

function toLonMobile(x, map) {
    return -80.08 + (0.21/(1+map.clientWidth))*x;
}

function searchPoint(event) {
    if (flag == 1) {
        var isPM25Arrow = document.getElementById("pm25_arrow");
        if (isPM25Arrow != null) {
            document.getElementById("arrow").innerHTML = "";
        }
        var isO3Arrow = document.getElementById("o3_arrow");
        if (isO3Arrow == null) {
            var newArrow = document.createElement("div");
            newArrow.innerHTML = '<img src="' + "/static/pollution_map/images/black_arrow.png" + '" class="blue_arrow" id="o3_arrow">';
            document.getElementById("arrow").appendChild(newArrow);
        }
    } else if (flag == 0) {
        var isO3Arrow = document.getElementById("o3_arrow");
        if (isO3Arrow != null) {
            document.getElementById("arrow").innerHTML = "";
        }
        var isPM25Arrow = document.getElementById("pm25_arrow");
        if (isPM25Arrow == null) {
            var newArrow = document.createElement("div");
            newArrow.innerHTML = '<img src="' + "/static/pollution_map/images/black_arrow.png" + '" class="red_arrow" id="pm25_arrow">';
            document.getElementById("arrow").appendChild(newArrow);
        }
    }
    var x = event.clientX;
    var y = event.clientY;
    var map = document.getElementById("map");
    // console.log("x: " + x + ", y:" + y);
    // 1440 800
    // coord: top-left:40.38, -80.12 bottom-right: 40.48, -79.83
    var lat, lon;
    if (isClairton == 0) {
        lat = 40.48 - (0.1/(1+map.clientHeight))*(y-129);//+1 to avoid zero division
        lon = -80.12 + (0.29/(1+map.clientWidth))*x;
    } else {
        lat = 40.38 - (0.11/(1+map.clientHeight))*(y-129);//+1 to avoid zero division
        lon = -80.11 + (0.26/(1+map.clientWidth))*x; 
    }
    
    console.log("Latitude: " + lat + ", Longitude:" + lon);
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

    var innerHTML = event.target.innerHTML;
    var count = 0;
    var val = "";
    for (var i = innerHTML.length-1; i >=0; i--) {
        // console.log(innerHTML.charAt(i));
        if (count == 1) {
            val = innerHTML.charAt(i) + val;
        }
        if (innerHTML.charAt(i) == '"') {
            count++;
            if (count == 2) {
                break;
            }
        }
    }
    var value = parseInt(val.substring(1));

    var degO3;
    if (value > 70) {
        degO3 = 180;
    } else if (value > 50) {
        degO3 = 135 + (value - 50)*22.5/10;
    } else if (value > 20) {
        degO3 = 45 + (value - 20)*90.0/30;
    } else if (value > 0) {
        degO3 = value*45.0/20;
    } else {
        degO3 = 0;
    }
    var degPM025;
    if (value > 50) {
        degPM025 = 180;
    } else if (value > 25) {
        degPM025 = 157.5 + (value - 25)*22.5/25;
    } else if (value > 15) {
        degPM025 = 135 + (value - 15)*22.5/10;
    } else if (value > 10) {
        degPM025 = 90 + (value - 10)*45.0/5;
    } else if (value > 6){
        degPM025 = 45 + (value - 6)*45.0/4;
    } else if (value > 0) {
        degPM025 = value*45/6.0;
    } else {
        degPM025 = 0;
    }
    
    //Calibration
    var meanO3 = 25.8896573;
    var stdO3 = 12.2525487;
    var meanPM25 = 9.14702301;
    var stdPM25 = 5.67227436;
    var red_cali = 0;
    var blue_cali = 0;
    if (value < meanPM25 - 0.5*stdPM25) red_cali = -5;
    if (value > meanPM25) red_cali = 5;
    if (value > meanPM25 + 0.5*stdPM25) red_cali = 15;
    if (value >= (meanO3-0.5*stdO3)) blue_cali = 5;
    if (value >= (meanO3-0.25*stdO3)) blue_cali = 15;
    if (value >= meanO3) blue_cali = 35;
    if (value >= (meanO3+0.25*stdO3)) blue_cali = 50;
    if (value > (meanO3+0.5*stdO3)) blue_cali = 55;
    // aminate rotation
    $({deg: prev_degO3}).animate({deg: degO3}, {
        duration: 200,
        step: function(now) {
            $("#o3_arrow").css({
                transform: 'rotate(' + (now - 90 + blue_cali) + 'deg)'
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
                transform: 'rotate(' + (now - 90 + red_cali) + 'deg)'
            });
        }
    });

    ////////////////
    prev_degPM025 = degPM025;
    prev_degO3 = degO3;

    var map_area = document.getElementById("map_area");
    if (document.getElementById("marker") != null) {
        document.getElementById("marker").remove();
    }
    var newCursor = document.createElement("div");
    newCursor.className = "cursor2";
    newCursor.id = "marker";
    newCursor.style.left = (x-8).toString() + "px";
    newCursor.style.top = (y-8).toString() + "px";
    // newCursor.onclick = searchPoint;
    var p = Math.round(PM025[index]);
    var o = Math.round(O3[index]);
    if (flag == 0) {
        newCursor.innerHTML = value;
    } else {
        newCursor.innerHTML = value;
    }
    map_area.appendChild(newCursor);
}

function searchPointMobile(event) {
    var x = event.clientX;
    var y = event.clientY;
    var map = document.getElementById("map_mobile");
    console.log("x: " + x + ", y:" + y);
    // 1440 800
    // coord: top-left:40.48, -80.08 bottom-right: 40.30, -79.87
    var lat = 40.48 - (0.18/(1+map.clientHeight))*(y-425);//+1 to avoid zero division
    var lon = -80.08 + (0.21/(1+map.clientWidth))*x;
    console.log("Latitude: " + lat + ", Longitude:" + lon);
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

    var degO3;
    if (O3[index] > 70) {
        degO3 = 180;
    } else if (O3[index] > 50) {
        degO3 = 135 + (O3[index] - 50)*22.5/10;
    } else if (O3[index] > 20) {
        degO3 = 45 + (O3[index] - 20)*90.0/30;
    } else if (O3[index] > 0) {
        degO3 = O3[index]*45.0/20;
    } else {
        degO3 = 0;
    }
    var degPM025;
    if (PM025[index] > 50) {
        degPM025 = 180;
    } else if (PM025[index] > 25) {
        degPM025 = 157.5 + (PM025[index] - 25)*22.5/25;
    } else if (PM025[index] > 15) {
        degPM025 = 135 + (PM025[index] - 15)*22.5/10;
    } else if (PM025[index] > 10) {
        degPM025 = 90 + (PM025[index] - 10)*45.0/5;
    } else if (PM025[index] > 6){
        degPM025 = 45 + (PM025[index] - 6)*45.0/4;
    } else if (PM025[index] > 0) {
        degPM025 = PM025[index]*45/6.0;
    } else {
        degPM025 = 0;
    }

    // aminate rotation
    $({deg: prev_degO3}).animate({deg: degO3}, {
        duration: 200,
        step: function(now) {
            $("#o3_arrow_mobile").css({
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
            $("#pm25_arrow_mobile").css({
                transform: 'rotate(' + (now - 90) + 'deg)'
            });
        }
    });
    $({deg: 0}).animate({deg: 0}, {
        duration: 1,
        step: function(now) {
            // in the step-callback (that is fired each step of the animation),
            // you can use the `now` paramter which contains the current
            // animation-position (`0` up to `angle`)
            $("#black_circle").css({
                transform: 'rotate(' + (now) + 'deg)'
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

    var map_area = document.getElementById("map_area_mobile");
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

function goToClairton() {
    isClairton = 1;
    var map_area = document.getElementById("map_area");
    map_area.innerHTML = '<img src="/static/pollution_map/images/pit_map_clairton.png" onclick="searchPoint(event)" class="map" id="map">';
    addGrids(flag);
    $("#down_arrow").hide();
    $("#up_arrow").show();
}

function goToPit() {
    isClairton = 0;
    var map_area = document.getElementById("map_area");
    map_area.innerHTML = '<img src="/static/pollution_map/images/routes_5.png" onclick="searchPoint(event)" class="map" id="map">';
    addGrids(flag);
    $("#up_arrow").hide();
    $("#down_arrow").show();
}

// window.location.reload(true);
// window.onload = function() {
//     addGrids(flag);
// }
window.onload = function() {
    try {
        var map = document.getElementById("map_area");
        if (map != null) {
            var box = document.getElementById("pop-up-box");
            var newMessage = document.createElement("div");
            var url = "/pollution_map/map"
            newMessage.innerHTML = '<div class="pop-up-layer" id="layer"><div class="popup"><h2 class="error">Welcome to the Pittsburgh Air Quality Map!</h2><h2>Please click around the map to find pollution information. You can choose which pollutant you view in the “current displayed pollutant” menu to the right. If you want to learn more about a pollutant, click on the pollutant in the table (e.g. Particulate Matter and Ozone).!</h2>' +
                        '<br><br><button class="get_it_btn" onclick="' + "location.href='"+ url +"'" + '">Get it!</button>';
            box.appendChild(newMessage);
            $('body').css('overflow', 'hidden');
            $('body').css('height', '100vh');
        }
    } catch(err) {
        if (document.getElementById("demo")!=null) {
            document.getElementById("demo").innerHTML = err.message;
        }
    }
}

