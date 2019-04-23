var latitude = [];
var longitude = [];
var CO = [];
var O3 = [];
var PM025 = [];
var prev_degO3 = 90;
var prev_degPM025 = 90;
var flag = 0; // 0: PM2.5, 1: O3
var gridVals = new Array(84);
var numClicks = 0;
for (var i = 0; i < 84; i++) {
  gridVals[i] = new Array(100);
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/static/pollution_map/Interpolated_Map_sample.csv?q=" + Math.random(),
        dataType: "text",
        success: function(data) {
            processData(data);
            addGrids(flag);
            numClicks = 0;
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
    // var isO3Arrow = document.getElementById("o3_arrow");
    // if (isO3Arrow == null) {
    //     var newArrow = document.createElement("div");
    //     newArrow.innerHTML = '<img src="' + "/static/pollution_map/images/blue_arrow.png" + '" class="blue_arrow" id="o3_arrow">';
    //     document.getElementById("arrow").appendChild(newArrow);
    // }
    // var dial_pic = document.getElementById("dial_pic");
    // dial_pic.src = '/static/pollution_map/images/dial_trafficlight.png';
    flag = 1;
    addGrids(flag);
}

function pm25RadioChecked() {
    var isO3Arrow = document.getElementById("o3_arrow");
    if (isO3Arrow != null) {
        document.getElementById("arrow").innerHTML = "";
    }
    // var isPM25Arrow = document.getElementById("pm25_arrow");
    // if (isPM25Arrow == null) {
    //     var newArrow = document.createElement("div");
    //     newArrow.innerHTML = '<img src="' + "/static/pollution_map/images/red_arrow.png" + '" class="blue_arrow" id="pm25_arrow">';
    //     document.getElementById("arrow").appendChild(newArrow);
    // }
    // var dial_pic = document.getElementById("dial_pic");
    // dial_pic.src = '/static/pollution_map/images/dial_trafficlight.png';
    flag = 0;
    addGrids(flag);
}

var index4Avg = 0;
function addGrids(flag) {
    var map = document.getElementById("map");
    var map_area = document.getElementById("map_area");
    map_area.innerHTML = '<img src="/static/pollution_map/images/routes_5.png" onclick="searchPoint(event)" class="map" id="map">';
    for (var i = 0; i < 100; i += 4) {
        for (var j = 0; j < 84; j += 6) {
            var newGrid = document.createElement("div");
            var x = i;
            var y = (16 + j);
            var avg = assignAvg(x, y, 0, flag);
            gridVals[j][i] = avg;
            // console.log(j + "," + i + "GridVal: " + gridVals[j][i]);
            // console.log("avg: " + avg);
            var red = 0;
            var green = 0;
            var blue = 0;
            var meanO3 = 25.8896573;
            var stdO3 = 12.2525487;
            var meanPM25 = 9.14702301;
            var stdPM25 = 5.67227436;
            avg = Math.round(avg);
            if (flag == 0) {
                if (avg < 3) {
                    red = 0;
                    green = 143;
                    blue = 0;
                } else if (avg < 6) {
                    red = 0;
                    green = 143;
                    blue = 0;
                } else if (avg < 8) {
                    red = 238;
                    green = 251;
                    blue = 74;
                } else if (avg < 10) {
                    red = 248;
                    green = 239;
                    blue = 25;
                } else if (avg < 12.5) {
                    red = 248;
                    green = 213;
                    blue = 0;
                } else if (avg < 15) {
                    red = 255;
                    green = 147;
                    blue = 0;
                } else if (avg < 25) {
                    red = 238;
                    green = 65;
                    blue = 12;
                } else {
                    red = 238;
                    green = 34;
                    blue = 12;
                }
            } else {
                if (avg < 10) {
                    red = 0;
                    green = 143;
                    blue = 0;
                } else if (avg < 20) {
                    red = 0;
                    green = 143;
                    blue = 0;
                } else if (avg < 27.5) {
                    red = 238;
                    green = 251;
                    blue = 74;
                } else if (avg < 35) {
                    red = 248;
                    green = 239;
                    blue = 25;
                } else if (avg < 42.5) {
                    red = 248;
                    green = 213;
                    blue = 0;
                } else if (avg < 50) {
                    red = 255;
                    green = 147;
                    blue = 0;
                } else if (avg < 60) {
                    red = 238;
                    green = 65;
                    blue = 12;
                } else {
                    red = 238;
                    green = 34;
                    blue = 12;
                }
            }

            newGrid.className = "layer";
            newGrid.style.left = x.toString() + "vw";
            newGrid.style.top = y.toString() + "vh";
            if (flag == 0) {
                newGrid.style.background = "rgba(" + red.toString() +"," + green.toString() + "," + blue.toString() + "," + "0.7)";
            } else {
                newGrid.style.background = "rgba(" + red.toString() +"," + green.toString() +"," + blue.toString() + "," + "0.7)";
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
    if (count > 0) {
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

function toLat(y, map) {
    return 40.48 - (0.1/(1+map.clientHeight))*(y-129);
}

function toLon(x, map) {
    return -80.12 + (0.29/(1+map.clientWidth))*x;
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
    var lat = 40.48 - (0.1/(1+map.clientHeight))*(y-129);//+1 to avoid zero division
    var lon = -80.12 + (0.29/(1+map.clientWidth))*x;
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

    var meanO3 = 25.8896573;
    var stdO3 = 12.2525487;
    var meanPM25 = 9.14702301;
    var stdPM25 = 5.67227436;

    var degO3;
    if (value >= 70) {
        degO3 = 180;
    } else if (value >= 50) {
        degO3 = 135 + (value - 50)*22.5/10;
    } else if (value >= 20) {
        degO3 = 45 + (value - 20)*90.0/30;
    } else if (value >= 0) {
        degO3 = value*45.0/20;
    } else {
        degO3 = 0;
    }
    var degPM025;
    if (value >= 50) {
        degPM025 = 180;
    } else if (value >= 25) {
        degPM025 = 157.5 + (value - 25)*22.5/25;
    } else if (value >= 15) {
        degPM025 = 135 + (value - 15)*22.5/10;
    } else if (value >= 10) {
        degPM025 = 90 + (value - 10)*45.0/5;
    } else if (value >= 6){
        degPM025 = 45 + (value - 6)*45.0/4 - 2;
    } else if (value >= 0) {
        degPM025 = value*45/6.0 - 5;
        if (degPM025 < 0) degPM025 = 0;
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
    // if (value < meanPM25 - 0.5*stdPM25) red_cali = -5;
    // if (value > meanPM25) red_cali = 10;
    // if (value > meanPM25 + 0.25*stdPM25) red_cali = 25;
    // if (value > meanPM25 + 0.5*stdPM25) red_cali = 35;
    // if (value >= (meanO3-0.5*stdO3)) blue_cali = 5;
    // if (value >= (meanO3-0.25*stdO3)) blue_cali = 15;
    // if (value >= meanO3) blue_cali = 35;
    // if (value >= (meanO3+0.25*stdO3)) blue_cali = 50;
    // if (value > (meanO3+0.5*stdO3)) blue_cali = 55;
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

    prev_degPM025 = degPM025;
    prev_degO3 = degO3;

    var map_area = document.getElementById("map_area");
    if (document.getElementById("marker") != null) {
        document.getElementById("marker").remove();
    }
    var newCursor = document.createElement("div");
    newCursor.className = "cursor3";
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
    numClicks++;
}

function detectMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location = "http://www.youtube.com";
    }
}

function getCSRFToken() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith("csrftoken=")) {
            return cookies[i].substring("csrftoken=".length, cookies[i].length);
        }
    }
    return "unknown";
}

function saveNumClicks() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState != 4) return;
        if (req.status != 200) return;
        var response = JSON.parse(req.responseText);
    }

    req.open("POST", "/pollution_map/recordNumClicks", true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("numClicks="+numClicks+"&category="+"traffic_light"+"&csrfmiddlewaretoken="+getCSRFToken());
    console.log("number clicks: " + numClicks);
}

window.onbeforeunload= function() {
    saveNumClicks();
}

// window.setInterval(saveNumClicks, 5000);
