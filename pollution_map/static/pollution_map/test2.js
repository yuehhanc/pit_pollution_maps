var latitude = [];
var longitude = [];
var CO = [];
var O3 = [];
var PM025 = [];
var prev_degO3 = 90;
var prev_degPM025 = 90;
var flag = 0; // 0: PM2.5, 1: O3
var numClicks = 0;
var gridVals = new Array(84);
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
    var acpt = document.getElementById("acceptable");
    acpt.innerHTML = "0-20";
    var concern = document.getElementById("concern");
    concern.innerHTML = "20-50";
    var unhealthy = document.getElementById("unhealthy");
    unhealthy.innerHTML = "50+";
    var tb_bar_concern = document.getElementById("tb_bar_concern");
    tb_bar_concern.src = "/static/pollution_map/images/blue_concern.png"
    var tb_bar_unhealthy = document.getElementById("tb_bar_unhealthy");
    tb_bar_unhealthy.src = "/static/pollution_map/images/blue_unhealthy.png";
    var displayer = document.getElementById('displayer');
    displayer.innerHTML = "";
    flag = 1;
    addGrids(flag);
}

function pm25RadioChecked() {
    var acpt = document.getElementById("acceptable");
    acpt.innerHTML = "0-6";
    var concern = document.getElementById("concern");
    concern.innerHTML = "7-15";
    var unhealthy = document.getElementById("unhealthy");
    unhealthy.innerHTML = "15+";
    var tb_bar_concern = document.getElementById("tb_bar_concern");
    tb_bar_concern.src = "/static/pollution_map/images/red_concern.png"
    var tb_bar_unhealthy = document.getElementById("tb_bar_unhealthy");
    tb_bar_unhealthy.src = "/static/pollution_map/images/red_unhealthy.png";
    var displayer = document.getElementById('displayer');
    displayer.innerHTML = "";
    flag = 0;
    addGrids(flag);
}

var index4Avg = 0;
function addGrids(flag) {
    var map = document.getElementById("map");
    var map_area = document.getElementById("map_area");
    map_area.innerHTML = '<img src="/static/pollution_map/images/routes.png" onclick="searchPoint(event)" class="map" id="map">';
    for (var i = 0; i < 100; i += 4) {
        for (var j = 0; j < 84; j += 6) {
            var newGrid = document.createElement("div");
            var x = i;
            var y = (16 + j);
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
                    multi = 0;
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
                    multi = 0;
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
            newGrid.style.top = y.toString() + "vh";
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

    if (flag == 1) {
        var displayer = document.getElementById("displayer");
        displayer.innerHTML = Math.round(value);
    } else {
        var displayer = document.getElementById("displayer");
        displayer.innerHTML = Math.round(value);
    }

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
    req.send("numClicks="+numClicks+"&category="+"Color+Table"+"&csrfmiddlewaretoken="+getCSRFToken());

}

window.onbeforeunload= function() {
    saveNumClicks();
}


