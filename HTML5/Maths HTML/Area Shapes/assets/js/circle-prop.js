var w, h, el, g, ratio, dragIndex, dragging, dragHoldX, dragHoldY, shapes, numPts, my = {}

function circlepropMain(imode, iw) {
    my.version = '0.87';
    var mode = typeof imode !== 'undefined' ? imode : 'type';
    my.modes = [{
        id: 'arc',
        numPts: 2,
        resizeQ: false
    }, {
        id: 'arcs',
        numPts: 2,
        resizeQ: false
    }, {
        id: 'arclen',
        numPts: 2,
        resizeQ: false
    }, {
        id: 'angle',
        numPts: 2,
        resizeQ: false
    }, {
        id: 'sector',
        numPts: 2,
        resizeQ: false
    }, {
        id: 'segment',
        numPts: 2,
        resizeQ: false
    }, {
        id: 'chord',
        numPts: 2,
        resizeQ: false
    }, {
        id: 'inscribe',
        fn: drawInscribe,
        numPts: 3,
        resizeQ: false
    }, {
        id: 'radius',
        numPts: 1,
        resizeQ: true
    }, {
        id: 'radian',
        numPts: 1,
        resizeQ: true
    }, {
        id: 'thales',
        fn: drawThales,
        numPts: 1,
        resizeQ: false
    }, ];
    var modeNo = 0
    for (var i = 0; i < my.modes.length; i++) {
        if (my.modes[i].id == mode) {
            modeNo = i
            break
        }
    }
    my.mode = my.modes[modeNo];
    console.log("my.mode", my.mode);
    if (typeof iw !== 'undefined') {
        w = iw
    } else {
        w = 260
    }
    h = w
    my.circle = {
        x: w / 2,
        y: h / 2,
        rad: 100,
        clr: "rgba(0,0,0,0.4)"
    }
    var id = "circleprop";
    var s = "";
    s += '<div style="position:relative; width:' + w + 'px; height:' + h + 'px; border: none; margin:auto; display:block; background-color:hsla(240,100%,95%,0.5); border-radius:10px;">';
    s += '<canvas id="canvas' + id + '" width="' + w + '" height="' + h + '" style="top: -25% !important;z-index:2; position: absolute; top: 0px; left: 0px;"></canvas>';
    s += '<div id="dragem" style="font: bold 14px arial; bold; color: #000000; position:absolute; top:8px; left:2px; text-align:center;">Drag a point!</div>';
    if (my.mode.id == 'arclen') {
        s += '<div style="font: 15px arial; color: #000000; position:absolute; left:' + (my.circle.x - 65) + 'px;  top:' + (my.circle.y - 25) + 'px; text-align:right;">Radius:</div>';
        s += '<input type="text" id="rad" style="font-size: 19px; position:absolute; left:' + (my.circle.x - 10) + 'px; top:' + (my.circle.y - 30) + 'px; width:66px; z-index:2; color: #0000ff; background-color: #f0f8ff; text-align:center; border-radius: 10px; z-index:3;" value="1" onkeyup="update()" />';
        s += '<div id="len" style="font: bold 15px arial; color: #000000; position:absolute; left:' + (my.circle.x - 100) + 'px;  top:' + (my.circle.y + 5) + 'px;  width:200px; text-align:center;">?</div>';
    }
    s += '<div id="copyrt" style="font: 11px Arial; color: blue; position:absolute; bottom:3px; right:8px;"></div>';
    s += '</div>';
    document.write(s);
    el = document.getElementById('canvas' + id);
    ratio = 2;
    el.width = w * ratio;
    el.height = h * ratio;
    el.style.width = w + "px";
    el.style.height = h + "px";
    g = el.getContext("2d");
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    dragIndex = 0;
    shapes = [];
    numPts = my.mode.numPts
    dragging = false;
    makeShapes();
    update();
    el.addEventListener("mousedown", mouseDownListener, false);
    el.addEventListener('touchstart', ontouchstart, false);
    el.addEventListener("mousemove", dopointer, false);
}

function ontouchstart(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    mouseDownListener(evt)
}

function ontouchmove(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    mouseMoveListener(evt);
    evt.preventDefault();
}

function ontouchend() {
    el.addEventListener('touchstart', ontouchstart, false);
    window.removeEventListener("touchend", ontouchend, false);
    if (dragging) {
        dragging = false;
        window.removeEventListener("touchmove", ontouchmove, false);
    }
}

function dopointer(e) {
    var bRect = el.getBoundingClientRect();
    var mouseX = (e.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (e.clientY - bRect.top) * (el.height / ratio / bRect.height);
    var inQ = false;
    for (var i = 0; i < numPts; i++) {
        if (hitTest(shapes[i], mouseX, mouseY)) {
            inQ = true;
        }
    }
    if (inQ) {
        document.body.style.cursor = "pointer";
    } else {
        document.body.style.cursor = "default";
    }
}

function mouseDownListener(evt) {
    var i;
    var highestIndex = -1;
    var bRect = el.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
    for (i = 0; i < numPts; i++) {
        if (hitTest(shapes[i], mouseX, mouseY)) {
            dragging = true;
            if (i > highestIndex) {
                dragHoldX = mouseX - shapes[i].x;
                dragHoldY = mouseY - shapes[i].y;
                highestIndex = i;
                dragIndex = i;
            }
        }
    }
    if (dragging) {
        document.getElementById("dragem").style.visibility = "hidden";
        if (evt.touchQ) {
            window.addEventListener('touchmove', ontouchmove, false);
        } else {
            window.addEventListener("mousemove", mouseMoveListener, false);
        }
    }
    if (evt.touchQ) {
        el.removeEventListener("touchstart", ontouchstart, false);
        window.addEventListener("touchend", ontouchend, false);
    } else {
        el.removeEventListener("mousedown", mouseDownListener, false);
        window.addEventListener("mouseup", mouseUpListener, false);
    }
    if (evt.preventDefault) {
        evt.preventDefault();
    } else if (evt.returnValue) {
        evt.returnValue = false;
    }
    return false;
}

function mouseUpListener() {
    el.addEventListener("mousedown", mouseDownListener, false);
    window.removeEventListener("mouseup", mouseUpListener, false);
    if (dragging) {
        dragging = false;
        window.removeEventListener("mousemove", mouseMoveListener, false);
    }
}

function mouseMoveListener(evt) {
    var posX;
    var posY;
    var shapeRad = shapes[dragIndex].rad;
    var minX = shapeRad;
    var maxX = el.width - shapeRad;
    var minY = shapeRad;
    var maxY = el.height - shapeRad;
    var bRect = el.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
    posX = mouseX - dragHoldX;
    posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
    posY = mouseY - dragHoldY;
    posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
    if (dragging) {
        shapes[dragIndex].x = posX;
        shapes[dragIndex].y = posY;
    }
    update();
}

function hitTest(shape, mx, my) {
    var dx;
    var dy;
    dx = mx - shape.x;
    dy = my - shape.y;
    return (dx * dx + dy * dy < shape.rad * shape.rad);
}

function makeShapes() {
    var i;
    var pos = [
        [97, -25, "A"],
        [21, -98, "B"],
        [-80, 60, "C"],
    ];
    shapes = [];
    for (i = 0; i < numPts; i++) {
        var angle = Math.atan2(pos[i][0], pos[i][1]) - Math.PI / 2;
        var cX = Math.cos(angle) * my.circle.rad;
        var cY = -Math.sin(angle) * my.circle.rad;
        shapes.push({
            x: my.circle.x + cX,
            y: my.circle.y + cY,
            rad: 10,
            color: "rgb(0,0,255)",
            name: pos[i][2]
        });
    }
}

function drawShapes() {
    var i;
    g.strokeStyle = '#aaaaaa'
    g.lineWidth = 1
    if (false) {
        g.beginPath()
        g.moveTo(shapes[numPts - 1].x, shapes[numPts - 1].y);
        for (i = 0; i < numPts; i++) {
            g.lineTo(shapes[i].x, shapes[i].y);
        }
        g.fillStyle = "rgba(255, 255, 0, 0.2)";
        g.fill();
        g.stroke();
    }
    for (i = 0; i < numPts; i++) {
        g.fillStyle = "rgba(0, 0, 255, 0.2)";
        g.beginPath();
        g.arc(shapes[i].x, shapes[i].y, shapes[i].rad, 0, 2 * Math.PI, false);
        g.closePath();
        g.fill();
        g.fillStyle = "rgba(0, 0, 0, 0.8)";
        g.beginPath();
        g.arc(shapes[i].x, shapes[i].y, 2, 0, 2 * Math.PI, false);
        g.closePath();
        g.fill();
        g.font = "14px Arial";
        g.textAlign = 'left'
        g.fillText(String.fromCharCode(65 + i), shapes[i].x + 5, shapes[i].y - 5, 100);
    }
}

function update() {
    var i, dx, dy, txt, t, rad, lblX, lblY, midAngle, dang, ang
    g.clearRect(0, 0, g.canvas.width, g.canvas.height)
    if (dragging) {
        var x0 = shapes[dragIndex].x - my.circle.x;
        var y0 = shapes[dragIndex].y - my.circle.y;
        var cX = 0;
        var cY = 0;
        var angle = Math.atan2(-y0, x0);
        if (angle < 0) angle += 2 * Math.PI;
        if (my.mode.resizeQ) {
            cX = x0;
            cY = y0;
            my.circle.rad = dist(x0, y0);
            console.log('my.circle.rad = '+my.circle.rad)
        } else {
            cX = Math.cos(angle) * my.circle.rad;
            cY = -Math.sin(angle) * my.circle.rad;
        }
        shapes[dragIndex].x = my.circle.x + cX;
        shapes[dragIndex].y = my.circle.y + cY;
    }
    drawShapes();
    g.lineWidth = 1;
    g.strokeStyle = my.circle.clr
    g.beginPath();
    g.arc(my.circle.x, my.circle.y, my.circle.rad, 0, 2 * Math.PI);
    g.stroke();
    var angles = [];
    for (i = 0; i < numPts; i++) {
        var pt = shapes[i];
        angles[i] = Math.atan2(-(pt.y - my.circle.y), pt.x - my.circle.x);
        angles[i] = angles[i];
        if (angles[i] < 0)
            angles[i] += 2 * Math.PI;
    }
    var angDiff = angles[1] - angles[0];
    if (angDiff < 0)
        angDiff += 2 * Math.PI;
    var angleSnap = parseInt(angleDeg(angDiff, true));
    var pts = shapes;
    if (my.mode.hasOwnProperty('fn')) {
        my.mode.fn(pts)
    }
    switch (my.mode.id) {
        case 'radian':
            g.beginPath();
            g.strokeStyle = "#ff0000";
            g.moveTo(my.circle.x, my.circle.y);
            g.lineTo(pts[0].x, pts[0].y);
            g.stroke();
            dx = pts[0].x - my.circle.x;
            dy = pts[0].y - my.circle.y;
            var ang1 = Math.atan2(-dy, dx) + 1
            var len = dist(dx, dy)
            var xr = my.circle.x + len * Math.cos(ang1)
            var yr = my.circle.y - len * Math.sin(ang1)
            g.beginPath();
            g.strokeStyle = "#ff0000";
            g.moveTo(my.circle.x, my.circle.y);
            g.lineTo(xr, yr);
            g.stroke();
            g.strokeStyle = "#0000ff";
            g.lineWidth = 3;
            g.beginPath();
            g.arc(my.circle.x, my.circle.y, len, -ang1, -ang1 + 1)
            g.stroke();
            g.lineWidth = 1;
            g.strokeStyle = 'black';
            g.fillStyle = 'yellow';
            g.beginPath()
            g.moveTo(my.circle.x, my.circle.y);
            g.arc(my.circle.x, my.circle.y, 40, -ang1, -ang1 + 1)
            g.closePath()
            g.stroke();
            g.fill()
            g.fillStyle = 'black';
            xr = my.circle.x + 60 * Math.cos(ang1 - 0.5)
            yr = my.circle.y - 60 * Math.sin(ang1 - 0.5)
            g.textAlign = 'center'
            g.fillText('1 radian', xr, yr);
            if (len > 30) {
                g.beginPath();
                g.fillStyle = 'orange';
                g.font = '16px Lucida Console';
                txt = 'radius';
                if (dx < 0) txt = 'suidar';
                for (i = 0; i < txt.length; i++) {
                    t = txt.charAt(i);
                    g.fillText(t, my.circle.x + (i + 2) * (dx / 10), my.circle.y + (i + 2) * (dy / 10));
                }
                g.fill();
                rad = dist(pts[0].x - my.circle.x, pts[0].y - my.circle.y) - 4;
               
                txt = 'radius';
                if (dx > 0) txt = 'suidar';
                g.fillStyle = 'orange';
                dang = 10 / rad;
                ang = 1.57 + dang * 6;
                ang = -ang1 + 0.8
                for (i = 0; i < txt.length; i++) {
                    t = txt.charAt(i);
                    dx = (rad + 10) * Math.cos(ang) + 5;
                    dy = (rad + 10) * Math.sin(ang) + 5;
                    ang -= dang;
                    g.fillText(t, my.circle.x + dx - 5, my.circle.y + dy);
                    g.fill();
                }
            }
            break;
        case 'radius':
            g.beginPath();
            g.strokeStyle = "#ff0000";
            g.moveTo(pts[0].x, pts[0].y);
            g.lineTo(my.circle.x, my.circle.y);
            g.stroke();
            g.fillStyle = 'orange';
            g.font = '16px Lucida Console';
            dx = pts[0].x - my.circle.x;
            dy = pts[0].y - my.circle.y;
            txt = 'radius';
            if (dx < 0) txt = 'suidar';
            for (i = 0; i < txt.length; i++) {
                t = txt.charAt(i);
                g.fillText(t, my.circle.x + (i + 2) * (dx / 10), my.circle.y + (i + 2) * (dy / 10));
            }
            g.fill();
            rad = dist(pts[0].x - my.circle.x, pts[0].y - my.circle.y) - 4;
            console.log('radius = '+rad)
            txt = 'circumference';
            g.fillStyle = 'orange';
            dang = 10 / rad;
            ang = 1.57 + dang * 6;
            for (i = 0; i < txt.length; i++) {
                t = txt.charAt(i);
                dx = rad * Math.cos(ang);
                dy = rad * Math.sin(ang);
                ang -= dang;
                g.fillText(t, my.circle.x + dx - 5, my.circle.y + dy);
                g.fill();
            }
            break;
        case "angle":
            g.beginPath();
            g.strokeStyle = "#ff0000";
            g.moveTo(pts[0].x, pts[0].y);
            g.lineTo(my.circle.x, my.circle.y);
            g.lineTo(pts[1].x, pts[1].y);
            g.stroke();
            if (angleSnap == 90) {
                g.drawBox(my.circle.x, my.circle.y, 25, -Math.PI / 2 - angles[0]);
            } else {
                g.beginPath()
                g.fillStyle = 'hsla(60,100%,80%,0.5)'
                g.moveTo(my.circle.x, my.circle.y)
                g.arc(my.circle.x, my.circle.y, 30, -angles[1], -angles[0]);
                g.fill()
                g.stroke();
                midAngle = (angles[0] + angles[1]) / 2;
                if (angles[0] > angles[1]) midAngle += Math.PI;
                lblX = Math.cos(midAngle) * 60;
                lblY = -Math.sin(midAngle) * 60;
                g.font = "24px Arial";
                g.fillStyle = "#0000ff";
                g.textAlign = "center";
                g.fillText(angleSnap.toString() + "Â°", my.circle.x + lblX, my.circle.y + lblY + 10);
            }
            break;
        case "sector":
        case "segment":
            var n0 = 0;
            var n1 = 1;
            if (angDiff > Math.PI) {
                var temp = n1;
                n1 = n0;
                n0 = temp;
                angDiff = angles[n1] - angles[n0];
                if (angDiff < 0)
                    angDiff += 2 * Math.PI;
                angleSnap = parseInt(angleDeg(angDiff, true));
            }
            g.beginPath();
            g.strokeStyle = "#0000ff";
            g.fillStyle = "rgba(255,255,184,0.5)";
            g.lineWidth = 2;
            g.moveTo(pts[n0].x, pts[n0].y);
            if (my.mode.id == "sector") g.lineTo(my.circle.x, my.circle.y);
            g.lineTo(pts[n1].x, pts[n1].y);
            g.arc(my.circle.x, my.circle.y, my.circle.rad, -angles[n1], -angles[n0]);
            g.fill();
            g.stroke();
            if (my.mode.id == "sector") {
                if (angleSnap == 90) {
                    g.drawBox(my.circle.x, my.circle.y, 25, -Math.PI / 2 - angles[n0]);
                } else {
                    g.beginPath();
                    g.arc(my.circle.x, my.circle.y, 30, -angles[n1], -angles[n0]);
                    g.stroke();
                    midAngle = (angles[n0] + angles[n1]) / 2;
                    if (angles[n0] > angles[n1]) midAngle += Math.PI;
                    lblX = Math.cos(midAngle) * 60;
                    lblY = -Math.sin(midAngle) * 60;
                    g.font = "24px Arial";
                    g.fillStyle = "#0000ff";
                    g.textAlign = "center";
                    g.fillText(angleSnap.toString() + "Â°", my.circle.x + lblX, my.circle.y + lblY + 10);
                }
            } else {
                g.font = "24px Arial";
                g.fillStyle = "#0000ff";
                g.textAlign = "center";
                g.fillText(angleSnap.toString() + "Â°", my.circle.x, my.circle.y + 10);
            }
            break;
        case "chord":
            var n0 = 0;
            var n1 = 1;
            if (angDiff > Math.PI) {
                var temp = n1;
                n1 = n0;
                n0 = temp;
                angDiff = angles[n1] - angles[n0];
                if (angDiff < 0)
                    angDiff += 2 * Math.PI;
                angleSnap = parseInt(angleDeg(angDiff, true));
            }
            g.beginPath();
            g.strokeStyle = "#0000ff";
            g.lineWidth = 2;
            g.moveTo(pts[n0].x, pts[n0].y);
            g.lineTo(pts[n1].x, pts[n1].y);
            g.stroke();
            break;
        case "arc":
        case "arclen":
            g.beginPath();
            g.strokeStyle = "#0000ff";
            g.lineWidth = 3;
            g.arc(my.circle.x, my.circle.y, my.circle.rad, -angles[1], -angles[0]);
            g.stroke();
            g.lineWidth = 1;
            midAngle = (angles[0] + angles[1]) / 2;
            if (angles[0] > angles[1]) midAngle += Math.PI;
            lblX = Math.cos(midAngle) * 70;
            lblY = -Math.sin(midAngle) * 70;
            g.font = "24px Arial";
            g.fillStyle = "#0000ff";
            g.textAlign = "center";
            angleSnap = parseInt(angleDeg(angDiff, true));
            g.fillText(angleSnap.toString() + "Â°", my.circle.x + lblX, my.circle.y + lblY + 10);
            g.font = "18px Arial";
            lblX = Math.cos(midAngle) * 116;
            lblY = -Math.sin(midAngle) * 116;
            g.fillText('arc', my.circle.x + lblX, my.circle.y + lblY + 10);
            if (my.mode.id == 'arclen') {
                var r = document.getElementById('rad').value;
                document.getElementById('len').innerHTML = 'Arc Length = ' + (r * (angleSnap * Math.PI / 180.0)).toPrecision(6);
            }
            break;
        case "arcs":
            var n0 = 0;
            var n1 = 1;
            if (angDiff > Math.PI) {
                var temp = n1;
                n1 = n0;
                n0 = temp;
                angDiff = angles[n1] - angles[n0];
                if (angDiff < 0)
                    angDiff += 2 * Math.PI;
                angleSnap = parseInt(angleDeg(angDiff, true));
            }
            midAngle = (angles[n0] + angles[n1]) / 2;
            if (angles[n0] > angles[n1]) midAngle += Math.PI;
            lblX = Math.cos(midAngle) * 60;
            lblY = -Math.sin(midAngle) * 60;
            g.font = "18px Arial";
            g.fillStyle = "#0000ff";
            g.textAlign = "center";
            g.fillText('Minor\nArc', my.circle.x + lblX, my.circle.y + lblY + 10);
            g.beginPath();
            g.strokeStyle = "#0000ff";
            g.lineWidth = 2;
            g.arc(my.circle.x, my.circle.x, my.circle.rad, -angles[n1], -angles[n0]);
            g.stroke();
            midAngle = (angles[n0] + angles[n1]) / 2;
            if (angles[n0] < angles[n1]) midAngle += Math.PI;
            lblX = Math.cos(midAngle) * 60;
            lblY = -Math.sin(midAngle) * 60;
            g.font = "18px Arial";
            g.fillStyle = "orange";
            g.textAlign = "center";
            g.fillText('Major\nArc', my.circle.x + lblX, my.circle.y + lblY + 10);
            g.beginPath();
            g.strokeStyle = "orange";
            g.lineWidth = 2;
            g.arc(my.circle.x, my.circle.y, my.circle.rad, -angles[n1], -angles[n0], true);
            g.stroke();
            break;
        default:
    }
}

function drawInscribe(pts) {
    var ptm1 = pts[0];
    var pt = pts[1]
    var ptp1 = pts[2];
    var a1 = Math.atan2(ptm1.y - pt.y, ptm1.x - pt.x);
    var a2 = Math.atan2(ptp1.y - pt.y, ptp1.x - pt.x);
    if (a1 > a2) a2 += 2 * Math.PI;
    if (a2 - a1 > Math.PI) {
        var temp = a1;
        a1 = a2;
        a2 = temp;
    }
    var angDeg = (a2 - a1) * 180.0 / Math.PI
    if (angDeg < 0) angDeg += 360.0
    angDeg = Math.round(angDeg)
    g.beginPath()
    g.strokeStyle = 'hsla(60,100%,20%,1)'
    g.fillStyle = 'hsla(60,100%,80%,0.5)'
    if (angDeg == 90) {
        g.drawBox(pts[1].x, pts[1].y, 30, a1)
    } else {
        g.moveTo(pts[1].x, pts[1].y)
        g.arc(pts[1].x, pts[1].y, 30, a1, a2)
        g.fill();
    }
    g.stroke();
    var midAngle = (a1 + a2) / 2;
    if (a1 > a2) midAngle += Math.PI;
    var lblX = Math.cos(midAngle) * 50;
    var lblY = Math.sin(midAngle) * 50;
    g.font = "20px Arial";
    g.fillStyle = "#0000ff";
    g.textAlign = "center";
    g.fillText(angDeg.toString() + "Â°", pt.x + lblX, pt.y + lblY + 10);
    g.beginPath();
    g.strokeStyle = "#0000ff";
    g.lineWidth = 1;
    g.moveTo(pts[0].x, pts[0].y);
    g.lineTo(pts[1].x, pts[1].y);
    g.lineTo(pts[2].x, pts[2].y);
    g.stroke();
}

function drawThales(pts) {
    var ptm1 = {
        x: my.circle.x - my.circle.rad,
        y: my.circle.y
    }
    var pt = pts[0]
    var ptp1 = {
        x: my.circle.x + my.circle.rad,
        y: my.circle.y
    }
    var a1 = Math.atan2(ptm1.y - pt.y, ptm1.x - pt.x);
    var a2 = Math.atan2(ptp1.y - pt.y, ptp1.x - pt.x);
    if (a1 > a2) a2 += 2 * Math.PI;
    if (a2 - a1 > Math.PI) {
        var temp = a1;
        a1 = a2;
        a2 = temp;
    }
    var angDeg = (a2 - a1) * 180.0 / Math.PI
    if (angDeg < 0) angDeg += 360.0
    angDeg = Math.round(angDeg)
    g.beginPath()
    g.strokeStyle = 'hsla(60,100%,20%,1)'
    g.fillStyle = 'hsla(60,100%,80%,0.5)'
    if (angDeg == 90) {
        g.drawBox(pt.x, pt.y, 25, a1)
    } else {
        g.moveTo(pt.x, pt.y)
        g.arc(pt.x, pt.y, 30, a1, a2)
        g.fill();
    }
    g.stroke();
    var midAngle = (a1 + a2) / 2;
    if (a1 > a2) midAngle += Math.PI;
    var lblX = Math.cos(midAngle) * 50;
    var lblY = Math.sin(midAngle) * 50;
    g.font = "20px Arial";
    g.fillStyle = "#0000ff";
    g.textAlign = "center";
    g.fillText(angDeg.toString() + "Â°", pt.x + lblX, pt.y + lblY + 10);
    g.beginPath();
    g.strokeStyle = my.circle.clr
    g.lineWidth = 1;
    g.moveTo(ptm1.x, ptm1.y);
    g.lineTo(ptp1.x, ptp1.y);
    g.stroke();
    g.beginPath();
    g.strokeStyle = "#0000ff";
    g.lineWidth = 1;
    g.moveTo(ptm1.x, ptm1.y);
    g.lineTo(pt.x, pt.y);
    g.lineTo(ptp1.x, ptp1.y);
    g.stroke();
}

function angleDeg(angleRad, snap90sQ) {
    var angle = angleRad * 180.0 / Math.PI;
    if (snap90sQ) {
        if (angle <= 1 || angle >= 359)
            angle = 0;
        if (angle >= 89 && angle < 92)
            angle = 90;
        if (angle >= 179 && angle < 182)
            angle = 180;
        if (angle >= 269 && angle < 272)
            angle = 270;
    }
    return angle;
}
CanvasRenderingContext2D.prototype.drawBox = function(midX, midY, radius, angle) {
    g.beginPath();
    var pts = [
        [0, 0],
        [Math.cos(angle), Math.sin(angle)],
        [Math.cos(angle) + Math.cos(angle + Math.PI / 2), Math.sin(angle) + Math.sin(angle + Math.PI / 2)],
        [Math.cos(angle + Math.PI / 2), Math.sin(angle + Math.PI / 2)],
        [0, 0]
    ];
    for (var i = 0; i < pts.length; i++) {
        if (i == 0) {
            g.moveTo(midX + radius * pts[i][0], midY + radius * pts[i][1]);
        } else {
            g.lineTo(midX + radius * pts[i][0], midY + radius * pts[i][1]);
        }
    }
    g.stroke();
};

function dist(dx, dy) {
    return (Math.sqrt(dx * dx + dy * dy));
}