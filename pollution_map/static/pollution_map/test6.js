var latitude = [];
var longitude = [];
var CO = [];
var O3 = [];
var PM025 = [];
var prev_degO3 = 90;
var prev_degPM025 = 90;
var flag = 0; // 0: PM2.5, 1: O3
var gridVals = new Array(84);
for (var i = 0; i < 84; i++) {
  gridVals[i] = new Array(100);
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/static/pollution_map/Interpolated_Map.csv?q=" + Math.random(),
        dataType: "text",
        success: function(data) {
            processData(data);
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
    var tb_avg = document.getElementById("tb_avg");
    tb_avg.innerHTML = 30;
    var displayer = document.getElementById("displayer");
    displayer.innerHTML = 30;
    var tb_hazard = document.getElementById("tb_hazard");
    tb_hazard.innerHTML = 55;
    var tb_title = document.getElementById("tb_title");
    tb_title.innerHTML = 'O3';
    flag = 1;
}

function pm25RadioChecked() {
    var tb_avg = document.getElementById("tb_avg");
    tb_avg.innerHTML = 8;
    var displayer = document.getElementById("displayer");
    displayer.innerHTML = 8;
    var tb_hazard = document.getElementById("tb_hazard");
    tb_hazard.innerHTML = 19;
    var tb_title = document.getElementById("tb_title");
    tb_title.innerHTML = 'PM 2.5';
    flag = 0;
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

    if (flag == 1) {
        var displayer = document.getElementById("displayer");
        displayer.innerHTML = Math.round(O3[index]);
    } else {
        var displayer = document.getElementById("displayer");
        displayer.innerHTML = Math.round(PM025[index]);
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
    newCursor.onclick = searchPoint;
    var p = Math.round(PM025[index]);
    var o = Math.round(O3[index]);
    if (flag == 0) {
        newCursor.innerHTML = p;
    } else {
        newCursor.innerHTML = o;
    }
    map_area.appendChild(newCursor);
}

function detectMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location = "http://www.youtube.com";
    }
}
