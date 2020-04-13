var w, h, g, el, ratio, dragN, my = {};

function geomtriangletypesMain(imode) {
    var version = '0.662';
    my.mode = typeof imode !== 'undefined' ? imode : 'type';
    var modes = ['type', 'median', 'circum', 'incircle', 'ortho', 'area', 'perim', 'inequal', 'angles', 'choose']
    w = 800;
    h = 400;
    var canvasid = "canvas" + my.mode;
    my.titleid = "title" + my.mode;
    my.infoid = "info" + my.mode;
    my.anglesQ = true
    my.sidesQ = false
    var s = '';
   /*  s += '<style>'
    s += '.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
    s += '.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
    s += '.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
    s += '.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
    s += '.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
    s += '</style>'
    */ s += '<div style=" position:relative; width:' + w + 'px; height:' + h + 'px;  border-radius: 9px; margin:auto; display:block; ">';
    s += '<canvas id="' + canvasid + '" width="' + w + '" height="' + h + '" style="z-index:4;"></canvas>';
    this.typs = [
        [1, 'any', 'Any'],
        [0, 'scal', 'Scalene'],
        [0, 'iso', 'Isosceles'],
        [1, 'equi', 'Equilateral'],
        [0, 'right', 'Right'],
        [0, 'acute', 'Acute'],
        [0, 'obtuse', 'Obtuse']
    ];
  //  s += '<div style="position:absolute; left:10px; top:30px; width:100px; text-align:center;">';
    //s += radioHTML(this.typs);
    //s += '</div>';
 //   s += '<div id="' + my.titleid + '" style="font: 26px arial; color: blue; position:absolute; left:120px; top:10px; width:' + (w - 120) + 'px; text-align:center; pointer-events: none;"></div>';
  //  s += '<div id="' + my.infoid + '" style="font: 18px arial; color: orange; position:absolute; left:120px; top:37px;  width:' + (w - 120) + 'px; text-align:center; pointer-events: none;"></div>';
   // s += '<button id="anglesBtn" onclick="toggleAngles()" style="z-index:2; position:absolute; right:123px; bottom:3px;" class="btn hi" >Angles</button>';
   // s += '<button id="sidesBtn" onclick="toggleSides()" style="z-index:2; position:absolute; right:63px; bottom:3px;" class="btn lo" >Sides</button>';
    //s += '<button id="resetBtn" onclick="reset()" style="z-index:2; position:absolute; right:3px; bottom:3px;" class="btn" >Reset</button>';
   // s += '<div id="copyrt" style="position:absolute; left:3px; bottom:3px; font: 10px Arial; color: blue; "></div>';
    s += '</div>';
   // document.write(s);
   $('#content').empty();
   document.getElementById('content').innerHTML += s;
    el = document.getElementById(canvasid);
    ratio = 2;
    el.width = w * ratio;
    el.height = h * ratio;
    el.style.width = w + "px";
    el.style.height = h + "px";
    g = el.getContext("2d");
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    dragging = false;
    dragN = 0;
    numShapesTriangle = 3;
    shapesTriangle = [];
    tri = new Triangle();
    tri.setAllKnown(false);
    tri.setLabels("", "", "", "", "", "");
    this.descr = "Triangle";
    this.info = "Three sides, three angles";
    my.triTyp = 'equi';
   el.addEventListener("mousedown", onMouseDown, false);
   el.addEventListener('touchstart', ontouchstart, false);
    el.addEventListener("mousemove", dopointer, false);
    makeShapesTriangle()
    //radio(0, 0)
    toggleSidesTriangle();
    updateTriangle()
    toggleAnglesTriangle()
}

function updateTriangle() {
   // doTypeT()
    drawShapesTriangle()
}

function doTypeT() {
    switch (my.triTyp) {
        case "scal":
            this.descr = "Scalene Triangle";
            this.info = "No equal angles and no equal sides";
            tri.makeScalene(dragN);
            break;
        case "iso":
            this.descr = "Isosceles Triangle";
            this.info = "Two equal sides and two equal angles";
            tri.makeIsosceles(dragN);
            break;
        case "equi":
            this.descr = "Equilateral Triangle";
            this.info = "Three equal sides and three equal angles of 60&deg; each";
            tri.makeRegular(dragN, w / 2 + 30, h / 2);
            break;
        case "right":
            this.descr = "Right Triangle";
            this.info = "Has a right angle (90&deg;)";
            tri.makeRight(dragN);
            break;
        case "acute":
            this.descr = "Acute Triangle";
            this.info = "All angles are less than 90&deg;";
            tri.makeAcute(dragN);
            break;
        case "obtuse":
            this.descr = "Obtuse Triangle";
            this.info = "Has an angle more than 90&deg;";
            tri.makeObtuse(dragN);
            break;
        case "any":
            this.descr = "";
            this.info = "";
            break;
        default:
    }
    document.getElementById(my.titleid).innerHTML = this.descr;
    document.getElementById(my.infoid).innerHTML = this.info;
}

function toggleAnglesTriangle() {
    my.anglesQ = !my.anglesQ;
   // toggleBtn("anglesBtn", my.anglesQ);
   updateTriangle();
}

function toggleSidesTriangle() {
    my.sidesQ = !my.sidesQ;
  //  toggleBtn("sidesBtn", my.sidesQ);
  updateTriangle();
}

function toggleBtn(btn, onq) {
    if (onq) {
        document.getElementById(btn).classList.add("hi");
        document.getElementById(btn).classList.remove("lo");
    } else {
        document.getElementById(btn).classList.add("lo");
        document.getElementById(btn).classList.remove("hi");
    }
}

function reset() {
    makeShapesTriangle();
    my.triTyp = 'any';
    updateTriangle();
    radio(0, 0);
}

function ontouchstart(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    onMouseDown(evt)
}

function ontouchmove(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    onMouseMove(evt);
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

function dopointer(evt) {
    var bRect = el.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
    var inQ = false;
    for (var i = 0; i < numShapesTriangle; i++) {
        if (hitTest(shapesTriangle[i], mouseX, mouseY)) {
            inQ = true;
        }
    }
    if (inQ) {
        document.body.style.cursor = "pointer";
    } else {
        document.body.style.cursor = "default";
    }
}

function onMouseDown(evt) {
    var i;
    var highestIndex = -1;
    var bRect = el.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
    for (i = 0; i < numShapesTriangle; i++) {
        if (hitTest(shapesTriangle[i], mouseX, mouseY)) {
            dragging = true;
            if (i > highestIndex) {
                dragHoldX = mouseX - shapesTriangle[i].x;
                dragHoldY = mouseY - shapesTriangle[i].y;
                highestIndex = i;
                dragN = i;
            }
        }
    }
    if (dragging) {
        if (evt.touchQ) {
            window.addEventListener('touchmove', ontouchmove, false);
        } else {
            window.addEventListener("mousemove", onMouseMove, false);
        }
    }
    if (evt.touchQ) {
        el.removeEventListener("touchstart", ontouchstart, false);
        window.addEventListener("touchend", ontouchend, false);
    } else {
        el.removeEventListener("mousedown", onMouseDown, false);
        window.addEventListener("mouseup", onMouseUp, false);
    }
    if (evt.preventDefault) {
        evt.preventDefault();
    } else if (evt.returnValue) {
        evt.returnValue = false;
    }
    return false;
}

function onMouseUp() {
    el.addEventListener("mousedown", onMouseDown, false);
    window.removeEventListener("mouseup", onMouseUp, false);
    if (dragging) {
        dragging = false;
        window.removeEventListener("mousemove", onMouseMove, false);
    }
}

function onMouseMove(evt) {
    var posX;
    var posY;
    var shapeRad = shapesTriangle[dragN].rad;
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
    shapesTriangle[dragN].x = posX;
    shapesTriangle[dragN].y = posY;
    updateTriangle();
}

function hitTest(shape, mx, my) {
    var dx;
    var dy;
    dx = mx - shape.x;
    dy = my - shape.y;
    return (dx * dx + dy * dy < shape.rad * shape.rad);
}

function makeShapesTriangle() {
    var i;
    var tempX;
    var tempY;
    var tempColor;
    var posTriangle = [
        [255, 140, "A"],
        [66, 236, "B"],
        [263, 284, "C"]
    ];
    switch (my.triTyp) {
        case "acute":
            posTriangle = [
                [157, 97, "A"],
                [85, 196, "B"],
                [233, 236, "C"]
            ];
            break;
        case "equi":
            posTriangle = [
                [195, 88, "A"],
                [85, 196, "B"],
                [233, 236, "C"]
            ];
            break;
        case "iso":
            posTriangle = [
                [188, 110, "A"],
                [85, 196, "B"],
                [233, 236, "C"]
            ];
            break;
        case "obtuse":
            posTriangle = [
                [190, 245, "A"],
                [119, 87, "B"],
                [398, 225, "C"]
            ];
            break;
        case "right":
            posTriangle = [
                [157, 227, "A"],
                [167, 102, "B"],
                [337, 241, "C"]
            ];
            break;
        default:
    } 
    shapesTriangle = [];
    for (i = 0; i < numShapesTriangle; i++) {
        tempX = posTriangle[i][0];
        tempY = posTriangle[i][1];
        tempColor = "rgb(" + 0 + "," + 0 + "," + 255 + ")";
        var tempShape = {
            x: tempX + 100,
            y: tempY,
            rad: 9,
            color: tempColor
        };
        shapesTriangle.push(tempShape);
    }
    //console.log(shapesTriangle)
}
function drawBG(w, h) {
    g.lineWidth = 1;
    for (var i = 0; i < 20; i++) {
        var xPix = i * 60;
        g.beginPath();
        if (i % 2) {
            g.strokeStyle = "rgba(0,0,256,0.2)";
        } else {
            g.strokeStyle = "rgba(0,0,256,0.1)";
        }
        g.moveTo(xPix, 0);
        g.lineTo(xPix, h);
        g.stroke();
    }
    for (i = 0; i < 12; i++) {
        var yPix = i * 60;
        g.beginPath();
        if (i % 2) {
            g.strokeStyle = "rgba(0,0,256,0.2)";
        } else {
            g.strokeStyle = "rgba(0,0,256,0.1)";
        }
        g.moveTo(0, yPix);
        g.lineTo(w, yPix);
        g.stroke();
    }
}
function drawShapesTriangle() {
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    drawBG(this.w, this.h);
    var i;
    g.beginPath();
    g.lineWidth = 2;
    g.fillStyle = "rgba(255, 255, 0, 0.1)";
    g.strokeStyle = "rgba(136, 136, 204, 1)";
    g.moveTo(shapesTriangle[numShapesTriangle - 1].x, shapesTriangle[numShapesTriangle - 1].y);
    for (i = 0; i < numShapesTriangle; i++) {
        g.lineTo(shapesTriangle[i].x, shapesTriangle[i].y);
    }
    g.fill();
    g.stroke();
    for (i = 0; i < numShapesTriangle; i++) {
        g.fillStyle = "rgba(0, 0, 255, 0.3)";
        g.beginPath();
        g.arc(shapesTriangle[i].x, shapesTriangle[i].y, 8, 0, 2 * Math.PI, false);
        g.closePath();
        g.fill();
        g.fillStyle = "rgba(0, 0, 0, 0.8)";
        g.beginPath();
        g.arc(shapesTriangle[i].x, shapesTriangle[i].y, 2, 0, 2 * Math.PI, false);
        g.closePath();
        g.fill();
        g.font = "14px Arial";
        g.fillText(String.fromCharCode(65 + i), shapesTriangle[i].x + 5, shapesTriangle[i].y - 5, 100);
        tri.setxy(i, shapesTriangle[i].x, shapesTriangle[i].y);
       // console.log(g)
    }
    tri.updateMe();
    if (my.mode == 'median') {
        var mid = drawMedians();
        drawDot(mid.x, mid.y);
    }
    if (my.mode == 'circum') {
        var mid = drawPerpBisectors();
        drawDot(mid.x, mid.y);
        var radLn = new Line(mid, new Pt(shapesTriangle[0].x, shapesTriangle[0].y));
        var r = radLn.getLength();
        g.beginPath();
        g.strokeStyle = 'orange';
        g.arc(mid.x, mid.y, r, 0, 2 * Math.PI);
        g.stroke();
    }
    if (my.mode == 'incircle') {
        var mid = drawAngleBisectors();
        drawDot(mid.x, mid.y);
        radius = 2 * tri.getHeronArea() / tri.getPerimeter();
        g.beginPath();
        g.strokeStyle = 'orange';
        g.arc(mid.x, mid.y, radius, 0, 2 * Math.PI);
        g.stroke();
    }
    if (my.mode == 'ortho') {
        var mid = drawOrthocenter();
        drawDot(mid.x, mid.y);
    }
    if (my.mode == 'area') {
        tri.setDec(1);
        tri.setKnown("a", true);
        var base = Number(tri.getUserStr("a"));
        var ht = tri.getAltitude(0);
        var s = ''
        if (ht < 0.3 || base < 0.3) {
            s = "Is that a Triangle?";
        } else {
            s = "Area = &frac12; &times; ";
            s += base;
            s += " &times; ";
            s += ht;
            s += " = ";
            s += Math.round(0.5 * base * ht * 100) / 100;
        }
        tri.drawAltitude(g, 0);
        tri.drawSides(g);
        document.getElementById(my.titleid).innerHTML = s;
    }
    if (my.mode == 'perim') {
        tri.drawSides(g);
        var s = "Perimeter = ";
        var sum = 0;
        for (i = 0; i < numShapesTriangle; i++) {
            var side = Math.round(tri.getVal(String.fromCharCode(97 + i)));
            s += side + " + ";
            sum += side;
        }
        s = s.substring(0, s.length - 2);
        s += " = " + sum;
        document.getElementById(my.titleid).innerHTML = s;
    }
    if (my.mode == 'inequal') {
        tri.drawSides(g);
        var len0 = tri.userSide(0);
        var len1 = tri.userSide(1);
        var len2 = tri.userSide(2);
        var s = "";
        if (len0 >= Math.round(len1 + len2)) {} else {
            s += len0.toString();
            s += "&nbsp; <i>is less than</i> &nbsp;";
            s += len1.toString();
            s += " + ";
            s += len2.toString();
            s += " = ";
            s += Math.round(len1 + len2).toString();
        }
        document.getElementById(my.titleid).innerHTML = s;
    }
    if (my.mode == 'angles') {
        var angs = tri.getAngles()
        tri.drawAngles(g);
        var s = "";
        var okQ = true;
        for (i = 0; i < numShapesTriangle; i++) {
            if (angs[i] == 180) okQ = false;
            s += angs[i] + "&deg; + ";
            //console.log(s)
        }
        s = s.substring(0, s.length - 2);
        s += " = 180&deg;";
        if (!okQ) s = 'Is that a triangle?';
        document.getElementById(my.titleid).innerHTML = s;
    }
    if (my.mode == 'type') {
        var angs = tri.getAngles()
        if (my.anglesQ) tri.drawAngles(g);
        if (my.sidesQ) tri.drawSides(g);
        var angleAbove90 = false;
        var angle90 = false;
        var angleSame = false;
        var angleEqual = -1;
        var angleAll60 = true;
        var angleZero = false;
        for (i = 0; i < 3; i++) {
            if (angs[i] == 0)
                angleZero = true;
            if (angs[i] > 90)
                angleAbove90 = true;
            if (angs[i] == 90)
                angle90 = true;
            if (angs[i] == angs[loopTriangle(i, 0, 2, 1)]) {
                angleSame = true;
                angleEqual = i;
            }
            if (angs[i] != 60)
                angleAll60 = false;
        }
        var descr = '';
        var info = '';
        if (angleAbove90) {
            var descrColor = '#ff0000';
            if (angleSame) {
                descr = "Obtuse Isosceles Triangle";
                info = "Has an angle more than 90&deg;, and also two equal angles and two equal sides";
            } else {
                descr = "Obtuse Triangle";
                info = "Has an angle more than 90&deg;";
            }
        } else if (angle90) {
            descrColor = '#00aa00';
            if (angleSame) {
                descr = "Right Isosceles Triangle";
                info = "Has a right angle (90&deg;) and also two equal angles and two equal sides";
            } else {
                descr = "Right Triangle";
                info = "Has a right angle (90&deg;)";
            }
        } else {
            descrColor = 'black';
            if (angleSame) {
                if (angleAll60) {
                    descr = "Equilateral Triangle";
                    info = "Three equal sides and three equal angles of 60&deg; each";
                } else {
                    descr = "Acute Isosceles Triangle";
                    info = "All angles are less than 90&deg; and has two equal sides and two equal angles";
                }
            } else {
                descr = "Acute Triangle";
                info = "All angles are less than 90&deg;";
            }
        }
        if (angleZero) {
            descr = 'Is that a Triangle?';
            info = 'An angle is Zero!';
        }
        /* if (my.triTyp == 'any') {
            document.getElementById(my.titleid).innerHTML = descr;
            document.getElementById(my.infoid).innerHTML = info;
        } */
    }
    if (my.mode == 'choose') {
        var angs = tri.getAngles()
        tri.drawAngles(g);
        var s = "";
        var okQ = true;
        for (i = 0; i < numShapesTriangle; i++) {
            if (angs[i] == 180) okQ = false;
            s += angs[i] + "° + ";
        }
        s = s.substring(0, s.length - 2);
        s += " = 180°";
        if (!okQ) s = 'Is that a triangle?';
        g.font = '20px Arial';
        g.textAlign = 'center';
        g.fillStyle = 'green';
        g.fillText(s, w / 2 + 50, h - 20);
    }
}

function drawDot(x, y) {
    g.beginPath();
    g.fillStyle = 'navy';
    g.arc(x, y, 3, 0, 2 * Math.PI);
    g.fill();
}

function Triangle() {
    var numPts = 3;
    sides = [3, 4, 5];
    sideLabels = [];
    var sideTextArray = [];
    angleLabels = [];
    var angleTextArray = [];
    var defaultAngleLabels = ["A", "B", "C"];
    var defaultSideLabels = ["c", "a", "b"];
    var isAngleKnownQ = [false, false, false];
    var isSideKnownQ = [false, false, false];
    var dec = 1;
    var types = [];
    var fillQ = true;
    scaleFactor = 1;
    pts = new Array(numPts);
    for (var k = 0; k < numPts; k++) {
        pts[k] = new Pt(0, 0);
    }
    sideLabels = defaultSideLabels;
    angleLabels = defaultAngleLabels;
    types["AAA"] = [
        ["A", "B", "C"]
    ];
    types["AAS"] = [
        ["A", "B", "a"],
        ["A", "B", "b"],
        ["A", "C", "a"],
        ["A", "C", "c"],
        ["B", "C", "b"],
        ["B", "C", "c"]
    ];
    types["ASA"] = [
        ["A", "c", "B"],
        ["A", "b", "C"],
        ["B", "a", "C"]
    ];
    types["SAS"] = [
        ["a", "C", "b"],
        ["a", "B", "c"],
        ["b", "A", "c"]
    ];
    types["SSA"] = [
        ["a", "b", "A"],
        ["a", "b", "B"],
        ["a", "c", "A"],
        ["a", "c", "C"],
        ["b", "c", "B"],
        ["b", "c", "C"]
    ];
    types["SSS"] = [
        ["a", "b", "c"]
    ];
}
Triangle.prototype.getNo = function(varName) {
    switch (varName) {
        case "A":
            return 0;
        case "B":
            return 1;
        case "C":
            return 2;
        case "a":
            return 1;
        case "b":
            return 2;
        case "c":
            return 0;
    }
    return -1;
};
Triangle.prototype.getVal = function(varName) {
    switch (varName) {
        case "A":
        case "B":
        case "C":
            return pts[this.getNo(varName)].getAngle();
            break;
        case "a":
        case "b":
        case "c":
            return sides[this.getNo(varName)];
            break;
        default:
    }
    return 0;
};
Triangle.prototype.setLabels = function(angleA, angleB, angleC, sidea, sideb, sidec) {
    this.setLabel("A", angleA);
    this.setLabel("B", angleB);
    this.setLabel("C", angleC);
    this.setLabel("a", sidea);
    this.setLabel("b", sideb);
    this.setLabel("c", sidec);
};
Triangle.prototype.setLabel = function(varName, labelStr) {
    var lblNo = this.getNo(varName);
    if (lblNo < 0)
        return;
    if (labelStr == null)
        return;
    switch (varName) {
        case "A":
        case "B":
        case "C":
            angleLabels[lblNo] = labelStr;
            break;
        case "a":
        case "b":
        case "c":
            sideLabels[lblNo] = labelStr;
            break;
        default:
    }
};
Triangle.prototype.getUserStr = function(varName) {
    switch (varName) {
        case "A":
        case "B":
        case "C":
            if (this.isKnown(varName)) {
                return (this.userAngle(pts[this.getNo(varName)].getAngle()).toString() + "º");
            } else {
                return (angleLabels[this.getNo(varName)]);
            }
            break;
        case "a":
        case "b":
        case "c":
            if (this.isKnown(varName)) {
                return (this.userSide(this.getNo(varName)).toString());
            } else {
                return (sideLabels[this.getNo(varName)]);
            }
            break;
        default:
    }
    return "";
};
Triangle.prototype.setxy = function(ptNo, ix, iy) {
    pts[ptNo].setxy(ix, iy);
};
Triangle.prototype.updateMe = function() {
    setAngles(pts);
    sides = getSidesTriangle(pts);
};
Triangle.prototype.setAllKnown = function(knownQ) {
    isAngleKnownQ = [knownQ, knownQ, knownQ];
    isSideKnownQ = [knownQ, knownQ, knownQ];
};
Triangle.prototype.setKnown = function(varName, knownQ) {
    switch (varName) {
        case "A":
        case "B":
        case "C":
            isAngleKnownQ[this.getNo(varName)] = knownQ;
            break;
        case "a":
        case "b":
        case "c":
            isSideKnownQ[this.getNo(varName)] = knownQ;
            break;
        default:
    }
};
Triangle.prototype.isKnown = function(varName) {
    switch (varName) {
        case "A":
        case "B":
        case "C":
            return isAngleKnownQ[this.getNo(varName)];
            break;
        case "a":
        case "b":
        case "c":
            return isSideKnownQ[this.getNo(varName)];
            break;
        default:
    }
    return false;
};
Triangle.prototype.userSide = function(i) {
    return Math.round(sides[i] * scaleFactor);
};
Triangle.prototype.userAngle = function(x) {
    return Math.round(x * 180 / Math.PI);
};
Triangle.prototype.drawSides = function(g) {
    var ptC = new Pt();
    ptC.setAvg(pts);
    var ptM = new Pt();
    var tsides = [];
    for (var i = 0; i < 3; i++) {
        ptM.setAvg([pts[i], pts[loopTriangle(i, 0, 2, 1)]]);
        ptM.interpolate(ptM, ptC, 1.4);
        var side = Math.round(this.getVal(String.fromCharCode(97 + loopTriangle(i + 1, 0, 2, 1))));
        //console.log('side= '+side);
        tsides.push(side);
        //console.log(ptM.x +' = '+ptM.y)
        g.fillText(side.toString(), ptM.x - 10, ptM.y + 5, 100);
    }
    //console.log(tsides+' tside;');
    /* var side1 = tsides[0]; 
    var side2 = tsides[0]; 
    var side3 = tsides[0]; 
    var perimeter = (side1 + side2 + side3)/2;
    var area =  Math.sqrt(perimeter*((perimeter-side1)*(perimeter-side2)*(perimeter-side3)));
    //console.log(area);
    $('#div-text').val(Math.round(area));
    $('#div-text-1').val(Math.round(tsides[0]*3));
    $('#div-text-2').val(Math.round(tsides[0])); */

    var side1 = tsides[0]; 
    var side2 = tsides[1]; 
    var side3 = tsides[2]; 
    var perimeter = (side1 + side2 + side3)/2;//((side1/2)* 1.732).toFixed(2);//
    var area =  (Math.sqrt(perimeter*((perimeter-side1)*(perimeter-side2)*(perimeter-side3)))).toFixed(2);
   // console.log(JSON.stringify(tsides));
    $('#lab-areavalue').text((area));
    $('#lab-perimetervalue').text(Math.round(sides[0] + sides[1] + sides[2]));
    tsides.sort;
    //console.log(JSON.stringify(tsides))
    $('#breadthId').text(Math.round(tsides[0]));
    $('#heightId').text(((area * 2)/tsides[0]).toFixed(2));
};
Triangle.prototype.getAngles = function() {
    var angs = [];
    var angSum = 0;
    for (var i = 0; i < 3; i++) {
        var ang = this.userAngle(pts[i].getAngle());
        if (i < 2) {
            angSum += ang;
        } else {
            ang = 180 - angSum;
        }
        angs[i] = ang;
    }
    return angs
};
Triangle.prototype.drawAngles = function(g) {
    var angSum = 0;
    var angDescr = "";
    var angs = [];
    var Perimeter = 0;
    /* for (var i = 0; i < 3; i++) {
        var ang = this.userAngle(pts[i].getAngle());
        Perimeter += ang;
    } */
    
  //  document.getElementById('lab-perivalue').text = 180;
    for (var i = 0; i < 3; i++) {
        var d = 30;
        var ang = this.userAngle(pts[i].getAngle());
        if (i < 2) {
            angSum += ang;
        } else {
            ang = 180 - angSum;
        }
        angs[i] = ang;
        angDescr += ang + "° + ";
        if (ang == 90) {
            g.drawBox(pts[i].x, pts[i].y, 25, pts[i].angleOut - Math.PI / 2);
        } else {
            if (ang > 90) {
                d = 30 - (ang - 90) / 6;
            } else {}
            g.fillStyle = "rgba(0, 0, 255, 0.3)";
            g.beginPath();
            g.moveTo(pts[i].x, pts[i].y);
            g.arc(pts[i].x, pts[i].y, d, pts[i].angleIn, pts[i].angleOut, false);
            g.closePath();
            g.fill();
        }
        var aMid = (pts[i].angleIn + pts[i].angleOut) / 2;
        var txtPt = new Pt(0, 0);
        txtPt.x = pts[i].x + (d + 15) * Math.cos(aMid) - 0;
        txtPt.y = pts[i].y + (d + 15) * Math.sin(aMid) - 0;
        g.textAlign = 'left';
        g.fillStyle = "rgba(0, 0, 255, 1)";
       // console.log('ang = '+ang)
        g.fillText(ang + "°", txtPt.x - 10, txtPt.y + 5, 100);
        var val
    }
};

function drawPerpBisectors() {
    var lns = [];
    for (var i = 0; i < 3; i++) {
        var ln = new Line(pts[i], pts[loopTriangle(i, 0, 2, 1)]);
        var perpLn = ln.clone();
        perpLn.rotateMidMe(Math.PI / 2);
        perpLn.setLen(1400);
        lns.push(perpLn);
        g.strokeStyle = 'black';
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(perpLn.a.x, perpLn.a.y);
        g.lineTo(perpLn.b.x, perpLn.b.y);
        g.stroke();
        var midPt = ln.getMidPt();
        g.drawBox(midPt.x, midPt.y, 15, perpLn.getAngle());
    }
    return lns[0].getIntersection(lns[1]);
}

function drawMedians() {
    var lns = [];
    for (var i = 0; i < 3; i++) {
        var ln = new Line(pts[i], pts[loopTriangle(i, 0, 2, 1)]);
        var midPt = ln.getMidPt();
        var medianLn = new Line(midPt, pts[loopTriangle(i + 1, 0, 2, 1)]);
        lns.push(medianLn);
        g.strokeStyle = 'black';
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(medianLn.a.x, medianLn.a.y);
        g.lineTo(medianLn.b.x, medianLn.b.y);
        g.stroke();
        g.fillStyle = 'black';
        g.arc(midPt.x, midPt.y, 2, 0, 2 * Math.PI);
        g.fill();
    }
    return lns[0].getIntersection(lns[1]);
}

function drawOrthocenter() {
    var ln0 = tri.drawAltitude(0, 0, false, false);
    var ln1 = tri.drawAltitude(0, 1, false, false);
    return ln0.getIntersection(ln1);
}

function drawAngleBisectors() {
    var lns = [];
    for (var i = 0; i < 3; i++) {
        var ln = getAngleBisector(i);
        ln.setLen(1400);
        lns.push(ln);
        g.strokeStyle = 'black';
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(ln.a.x, ln.a.y);
        g.lineTo(ln.b.x, ln.b.y);
        g.stroke();
    }
    return lns[0].getIntersection(lns[1]);
}
Triangle.prototype.getAltitude = function(ptNo) {
    var aa = pts[loopTriangle(ptNo, 0, 2, 1)];
    var ln = new Line(aa, pts[loopTriangle(ptNo, 0, 2, 2)]);
    var iPt = ln.getClosestPoint(pts[ptNo]);
    var htLn = new Line(pts[ptNo], iPt);
    return Math.round(htLn.getLength() * scaleFactor);
};
Triangle.prototype.drawAltitude = function(r, ptNo, drawAsSegmentQ, showTextQ) {
    drawAsSegmentQ = typeof drawAsSegmentQ !== 'undefined' ? drawAsSegmentQ : true;
    showTextQ = typeof showTextQ !== 'undefined' ? showTextQ : true;
    var ln = new Line(pts[loopTriangle(ptNo, 0, 2, 1)], pts[loopTriangle(ptNo, 0, 2, 2)]);
    var iPt = ln.getClosestPoint(pts[ptNo]);
    var htLn = new Line(pts[ptNo], iPt);
    g.strokeStyle = '#0000ff';
    g.lineWidth = 1;
    g.drawBox(htLn.b.x, htLn.b.y, 10, htLn.getAngle() + Math.PI);
    if (showTextQ) {
        var htMidPt = htLn.getMidPt();
        g.fillText(Math.round(htLn.getLength() * scaleFactor), htMidPt.x + 2, htMidPt.y + 10)
    }
    var iSegPt = ln.getClosestPoint(pts[ptNo], true);
    var extendedLn = new Line(iSegPt, iPt);
    if (extendedLn.getLength() > 20) {
        extendedLn.setLen(extendedLn.getLength() - 20);
        extendedLn.setLen(extendedLn.getLength() + 30, false);
        g.beginPath();
        g.lineWidth = 1;
        g.moveTo(extendedLn.a.x, extendedLn.a.y);
        g.lineTo(extendedLn.b.x, extendedLn.b.y);
        g.stroke();
    }
    if (!drawAsSegmentQ)
        htLn.setLen(1400);
    g.beginPath();
    g.lineWidth = 1;
    g.moveTo(htLn.a.x, htLn.a.y);
    g.lineTo(htLn.b.x, htLn.b.y);
    g.stroke();
    return htLn;
};
Triangle.prototype.setDec = function(decimals) {
    this.dec = decimals;
};

function getAngleBisector(i) {
    var p = new Pt(pts[i].x, pts[i].y);
    var ln = new Line(new Pt(p.x, p.y), new Pt(p.x + 100, p.y));
    var angle = -(pts[i].angleIn + pts[i].angleOut) / 2;
    ln.rotatePtMe(p, angle);
    return ln;
}
Triangle.prototype.getLength = function(n) {
    var pt1 = pts[n];
    var pt2 = pts[loopTriangle(n, 0, 2, 1)];
    var dx = pt2.x - pt1.x;
    var dy = pt2.y - pt1.y;
    return Math.sqrt(dx * dx + dy * dy) * scaleFactor;
};
Triangle.prototype.getPerimeter = function() {
    return this.getLength(0) + this.getLength(1) + this.getLength(2);
};
Triangle.prototype.getHeronArea = function() {
    var p = this.getPerimeter() / 2;
    var heron = p;
    for (var i = 0; i < 3; i++) {
        heron *= p - this.getLength(i);
    }
    return Math.sqrt(heron);
};
Triangle.prototype.makeRegular = function(PointNum, midX, midY) {
    var movedQ = true;
    var obj = shapesTriangle[PointNum];
    var radius = distTriangle(midX - obj.x, midY - obj.y);
    var SttAngle = Math.atan2(obj.y - midY, obj.x - midX);
    var dAngle = Math.PI * 2 / 3;
    for (var i = 0; i < 3; i++) {
        obj = shapesTriangle[i];
        var angle = SttAngle + (i - PointNum) * dAngle;
        obj.x = midX + radius * Math.cos(angle);
        obj.y = midY + radius * Math.sin(angle);
    }
    this.updateMe();
    return movedQ;
};
Triangle.prototype.makeScalene = function(PointNum) {
    var movedQ = false;
    var pushDist = 5;
    do {
        var angs = this.getAngles()
        var shovedQ = false;
        this.fromPts(shapesTriangle);
        var angSum = 0;
        var scaleneQ = true;
        var pushNum = 0;
        for (var i = 0; i < 3; i++) {
            var j = (i + 1) % 3;
            var ang1 = angs[i];
            var ang2 = angs[j];
            if (ang1 == ang2) {
                scaleneQ = false;
                pushNum = i;
            }
            angSum += ang1;
        }
        if (!scaleneQ) {
            console.log('makeScalene is not scalene:', scaleneQ, angs)
        }
        if (!scaleneQ) {
            while (pushNum == PointNum) {
                pushNum = (Math.random() * 3) << 0;
            }
            shapesTriangle[pushNum].x += getRandom(-pushDist, pushDist);
            shapesTriangle[pushNum].y += getRandom(-pushDist, pushDist);
            this.updateMe();
            shovedQ = true;
        }
        if (shovedQ) {
            movedQ = true;
        }
    } while (shovedQ);
    return movedQ;
};
Triangle.prototype.makeIsosceles = function(PointNum) {
    var Aobj = shapesTriangle[2];
    var Bobj = shapesTriangle[1];
    var Cobj = shapesTriangle[0];
    this.fromPts(shapesTriangle);
    var movedQ = false;
    do {
        var Ox = (Bobj.x + Cobj.x) / 2;
        var Oy = (Bobj.y + Cobj.y) / 2;
        var angle = 0;
        if (PointNum == 0) {
            angle = Math.atan2(Aobj.y - Oy, Aobj.x - Ox);
        }
        if (PointNum == 1) {
            angle = Math.atan2(Bobj.y - Oy, Bobj.x - Ox) + Math.PI / 2;
        }
        if (PointNum == 2) {
            angle = Math.atan2(Cobj.y - Oy, Cobj.x - Ox) - Math.PI / 2;
        }
        var BO = distTriangle(Bobj.x - Ox, Bobj.y - Oy);
        Bobj.x = Ox + BO * Math.cos(angle - Math.PI / 2);
        Bobj.y = Oy + BO * Math.sin(angle - Math.PI / 2);
        Cobj.x = Ox + BO * Math.cos(angle + Math.PI / 2);
        Cobj.y = Oy + BO * Math.sin(angle + Math.PI / 2);
        var AO = distTriangle(Aobj.x - Ox, Aobj.y - Oy);
        Aobj.x = Ox + AO * Math.cos(angle);
        Aobj.y = Oy + AO * Math.sin(angle);
        this.fromPts(shapesTriangle);
        var shovedQ = false;
        var doubledAng = Math.round(pts[1].getAngle() * 180 / Math.PI);
        var pushDist = 5;
        if (doubledAng == 90) {
            shapesTriangle[0].x += getRandom(-pushDist, pushDist);
            shapesTriangle[0].y += getRandom(-pushDist, pushDist);
            shovedQ = true;
        }
        if (doubledAng == 0) {
            shapesTriangle[0].x += getRandom(-pushDist, pushDist);
            shapesTriangle[0].y += getRandom(-pushDist, pushDist);
            shovedQ = true;
        }
        if (doubledAng == 60) {
            shapesTriangle[0].x += getRandom(-pushDist, pushDist);
            shapesTriangle[0].y += getRandom(-pushDist, pushDist);
            shovedQ = true;
        }
        if (shovedQ) movedQ = true;
    } while (shovedQ);
    return movedQ;
};
Triangle.prototype.fromPts = function(srcPts) {
    for (var i = 0; i < 3; i++) {
        pts[i].x = srcPts[i].x;
        pts[i].y = srcPts[i].y;
    }
    this.updateMe();
};
Triangle.prototype.makeRight = function(PointNum) {
    var movedQ = true;
    this.fromPts(shapesTriangle);
    if (Math.round(pts[0].getAngle() * 100) != 157) {
        var ANum = 0;
        var BNum = 1;
        var CNum = 2;
        var Aobj = shapesTriangle[ANum];
        var Bobj = shapesTriangle[BNum];
        var Cobj = shapesTriangle[CNum];
        var mult = 1;
        if (PointNum == 2) {
            Bobj = shapesTriangle[2];
            Cobj = shapesTriangle[1];
            mult = -1;
        }
        var Angle = Math.atan2(Aobj.y - Bobj.y, Aobj.x - Bobj.x);
        var AC = distTriangle(Cobj.x - Aobj.x, Cobj.y - Aobj.y);
        Cobj.x = Aobj.x + AC * Math.cos(Angle - Math.PI / 2) * mult;
        Cobj.y = Aobj.y + AC * Math.sin(Angle - Math.PI / 2) * mult;
    }
    this.updateMe();
    return movedQ;
};
Triangle.prototype.makeAcute = function(PointNum) {
    var movedQ = false;
    this.fromPts(shapesTriangle);
    for (var i = 0; i < 3; i++) {
        if (pts[i].getAngle() * 180 / Math.PI > 89) {
            var Aobj = shapesTriangle[i];
            var Bobj = shapesTriangle[(i + 1) % 3];
            var Cobj = shapesTriangle[(i + 2) % 3];
            var Angle = Math.atan2(Aobj.y - Bobj.y, Aobj.x - Bobj.x);
            var AC = distTriangle(Cobj.x - Aobj.x, Cobj.y - Aobj.y);
            Cobj.x = Aobj.x + AC * Math.cos(Angle - Math.PI / 2 - 0.02);
            Cobj.y = Aobj.y + AC * Math.sin(Angle - Math.PI / 2 - 0.02);
            movedQ = true;
            this.updateMe();
        }
    }
    return movedQ;
};
Triangle.prototype.makeObtuse = function(PointNum) {
    var movedQ = false;
    this.fromPts(shapesTriangle);
    if (pts[0].getAngle() * 180 / Math.PI < 91) {
        var Aobj = shapesTriangle[0];
        var Bobj = shapesTriangle[1];
        var Cobj = shapesTriangle[2];
        var mult = 1;
        if (PointNum == 2) {
            Bobj = shapesTriangle[2];
            Cobj = shapesTriangle[1];
            mult = -1;
        }
        var Angle = Math.atan2(Aobj.y - Bobj.y, Aobj.x - Bobj.x);
        var AC = distTriangle(Cobj.x - Aobj.x, Cobj.y - Aobj.y);
        Cobj.x = Aobj.x + AC * Math.cos(Angle - Math.PI / 2 + 0.02 * mult) * mult;
        Cobj.y = Aobj.y + AC * Math.sin(Angle - Math.PI / 2 + 0.02 * mult) * mult;
        movedQ = true;
        this.updateMe();
    }
    return movedQ;
};

function Pt(ix, iy) {
    this.x = ix;
    this.y = iy;
    angleIn = 0;
    angleOut = 0;
}
Pt.prototype.setxy = function(ix, iy) {
    this.x = ix;
    this.y = iy;
    //console.log(ix+" --- "+iy)
    validPtQ = true;
};
Pt.prototype.setPrevPt = function() {
    if (validPtQ) {
        prevx = this.x;
        prevy = this.y;
        prevQ = true;
    }
};
Pt.prototype.getAngle = function() {
    return this.angleOut - this.angleIn;
};
Pt.prototype.drawMe = function(g) {
    g.fillStyle = "rgba(0, 0, 255, 0.3)";
    g.beginPath();
    g.arc(this.x, this.y, 20, 0, 2 * Math.PI, false);
    g.closePath();
    g.fill();
};
Pt.prototype.getAvg = function(pts) {
    var xSum = 0;
    var ySum = 0;
    for (var i = 0; i < pts.length; i++) {
        xSum += pts[i].x;
        ySum += pts[i].y;
    }
    newPt = new Pt(xSum / pts.length, ySum / pts.length);
    newPt.x = xSum / pts.length;
    newPt.y = ySum / pts.length;
    return newPt;
};
Pt.prototype.setAvg = function(pts) {
    this.setPrevPt();
    var newPt = this.getAvg(pts);
    this.x = newPt.x;
    this.y = newPt.y;
    validPtQ = true;
};
Pt.prototype.interpolate = function(pt1, pt2, f) {
    this.setPrevPt();
    this.x = pt1.x * f + pt2.x * (1 - f);
    this.y = pt1.y * f + pt2.y * (1 - f);
    validPtQ = true;
};
Pt.prototype.translateMe = function(pt, addQ) {
    addQ = typeof addQ !== 'undefined' ? addQ : true;
    if (addQ) {
        this.x += pt.x;
        this.y += pt.y
    } else {
        this.x -= pt.x;
        this.y -= pt.y
    }
};
Pt.prototype.translate = function(pt, addQ) {
    addQ = typeof addQ !== 'undefined' ? addQ : true;
    t = new Pt(this.x, this.y);
    t.x = this.x;
    t.y = this.y;
    if (addQ) {
        t.x += pt.x;
        t.y += pt.y;
    } else {
        t.x -= pt.x;
        t.y -= pt.y;
    }
    return t;
};
Pt.prototype.multiply = function(fact) {
    return new Pt(this.x * fact, this.y * fact);
};
Pt.prototype.multiplyMe = function(fact) {
    this.x *= fact;
    this.y *= fact;
};
Pt.prototype.rotate = function(angle) {
    var cosa = Math.cos(angle);
    var sina = Math.sin(angle);
    var xPos = this.x * cosa + this.y * sina;
    var yPos = -this.x * sina + this.y * cosa;
    return new Pt(xPos, yPos);
};
Pt.prototype.rotateMe = function(angle) {
    var t = new Pt(this.x, this.y).rotate(angle);
    this.x = t.x;
    this.y = t.y;
};

function setAngles(pts) {
    var CW = getClockwise(pts);
    var numPoints = pts.length;
    var angles = [];
    for (var i = 0; i < numPoints; i++) {
        var pt = pts[i];
        var ptm1 = pts[loopTriangle(i, 0, numPoints - 1, -1)];
        var ptp1 = pts[loopTriangle(i, 0, numPoints - 1, 1)];
        var a1 = Math.atan2(ptm1.y - pt.y, ptm1.x - pt.x);
        var a2 = Math.atan2(ptp1.y - pt.y, ptp1.x - pt.x);
        if (CW == 1) {
            var temp = a1;
            a1 = a2;
            a2 = temp;
        }
        if (a1 > a2)
            a2 += 2 * Math.PI;
        pt.angleIn = a1;
        pt.angleOut = a2;
    }
}

function getClockwise(pts) {
    var numPoints = pts.length;
    var count = 0;
    for (var i = 0; i < numPoints; i++) {
        var pt = pts[i];
        var ptm1 = pts[loopTriangle(i, 0, numPoints - 1, -1)];
        var ptp1 = pts[loopTriangle(i, 0, numPoints - 1, 1)];
        var z = 0;
        z += (pt.x - ptm1.x) * (ptp1.y - pt.y);
        z -= (pt.y - ptm1.y) * (ptp1.x - pt.x);
        if (z < 0) {
            count--;
        } else if (z > 0) {
            count++;
        }
    }
    if (count > 0)
        return (1);
    if (count == 0)
        return (0);
    return (-1);
}

function getSidesTriangle(pts) {
    var numPoints = pts.length;
    var sides = [];
    for (var i = 0; i < numPoints; i++) {
        var pt = pts[i];
        var ptp1 = pts[loopTriangle(i, 0, numPoints - 1, 1)];
        sides.push(distTriangle((ptp1.x - pt.x)/31, (ptp1.y - pt.y)/31));
    }
    
    return (sides);
}

function distTriangle(dx, dy) {
    return (Math.sqrt(dx * dx + dy * dy));
}

function loopTriangle(currNo, minNo, maxNo, incr) {
    currNo += incr;
    var was = currNo;
    var range = maxNo - minNo + 1;
    if (currNo < minNo) {
        currNo = maxNo - (-currNo + maxNo) % range;
    }
    if (currNo > maxNo) {
        currNo = minNo + (currNo - minNo) % range;
    }
    return currNo;
}

function constrain(min, val, max) {
    return (Math.min(Math.max(min, val), max));
}

function Line(pt1, pt2) {
    this.a = pt1;
    this.b = pt2;
}
Line.prototype.getLength = function(n) {
    var dx = this.b.x - this.a.x;
    var dy = this.b.y - this.a.y;
    return Math.sqrt(dx * dx + dy * dy) * scaleFactor;
};
Line.prototype.getIntersection = function(ln, asSegmentsQ) {
    var A = this.a;
    var B = this.b;
    var E = ln.a;
    var F = ln.b;
    var a1 = B.y - A.y;
    var b1 = A.x - B.x;
    var c1 = B.x * A.y - A.x * B.y;
    var a2 = F.y - E.y;
    var b2 = E.x - F.x;
    var c2 = F.x * E.y - E.x * F.y;
    var denom = a1 * b2 - a2 * b1;
    if (denom == 0) {
        return null;
    }
    var ip = new Pt();
    ip.x = (b1 * c2 - b2 * c1) / denom;
    ip.y = (a2 * c1 - a1 * c2) / denom;
    if (asSegmentsQ) {
        if (Math.pow(ip.x - B.x, 2) + Math.pow(ip.y - B.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)) {
            return null;
        }
        if (Math.pow(ip.x - A.x, 2) + Math.pow(ip.y - A.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)) {
            return null;
        }
        if (Math.pow(ip.x - F.x, 2) + Math.pow(ip.y - F.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)) {
            return null;
        }
        if (Math.pow(ip.x - E.x, 2) + Math.pow(ip.y - E.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)) {
            return null;
        }
    }
    return ip;
};
Line.prototype.getMidPt = function() {
    return new Pt((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
};
Line.prototype.rotateMidMe = function(angle) {
    var midPt = this.getMidPt();
    this.a.translateMe(midPt, false);
    this.b.translateMe(midPt, false);
    this.a.rotateMe(angle);
    this.b.rotateMe(angle);
    this.a.translateMe(midPt);
    this.b.translateMe(midPt);
};
Line.prototype.rotatePtMe = function(pt, angle) {
    this.a.x -= pt.x;
    this.a.y -= pt.y;
    this.b.x -= pt.x;
    this.b.y -= pt.y;
    this.a.rotateMe(angle);
    this.b.rotateMe(angle);
    this.a.x += pt.x;
    this.a.y += pt.y;
    this.b.x += pt.x;
    this.b.y += pt.y;
};
Line.prototype.getClosestPoint = function(toPt, inSegmentQ) {
    var AP = toPt.translate(this.a, false);
    var AB = this.b.translate(this.a, false);
    var ab2 = AB.x * AB.x + AB.y * AB.y;
    var ap_ab = AP.x * AB.x + AP.y * AB.y;
    var t = ap_ab / ab2;
    if (inSegmentQ) {
        t = constrain(0, t, 1);
    }
    closest = this.a.translate(AB.multiply(t));
    return closest;
};
Line.prototype.setLen = function(newLen, fromMidQ) {
    fromMidQ = typeof fromMidQ !== 'undefined' ? fromMidQ : true;
    var len = this.getLength();
    if (fromMidQ) {
        var midPt = this.getMidPt();
        var halfPt = new Pt(this.a.x - midPt.x, this.a.y - midPt.y);
        halfPt.multiplyMe(newLen / len);
        this.a = midPt.translate(halfPt);
        this.b = midPt.translate(halfPt, false);
    } else {
        var diffPt = new Pt(this.a.x - this.b.x, this.a.y - this.b.y);
        diffPt.multiplyMe(newLen / len);
        this.b = this.a.translate(diffPt, false);
    }
};
Line.prototype.getAngle = function() {
    return Math.atan2(this.b.y - this.a.y, this.b.x - this.a.x);
};
Line.prototype.clone = function() {
    var ln = new Line(new Pt(0, 0), new Pt(0, 0));
    ln.a.x = this.a.x;
    ln.a.y = this.a.y;
    ln.b.x = this.b.x;
    ln.b.y = this.b.y;
    return ln;
};
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

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function radioHTML(opts) {
    var s = '';
    for (var i = 0; i < opts.length; i++) {
        var opt = opts[i][2];
        s += '<button  id="opt' + i + '" style="width:100px; padding: 3px; margin:3px; background-color:aliceblue; font: 16px Arial; cursor: pointer; border:none; " onclick="radio(0,' + i + ')" onmouseover="radio(1,' + i + ')"  onmouseout="radio(2,' + i + ')" class="btn" >' + opt + '</button>';
        if (opts[i][0] == 1) s += "<br><br>";
    }
    return s;
}

function radio(evTyp, n) {
    switch (evTyp) {
        case 0:
            for (var i = 0; i < this.typs.length; i++) {
                var div = document.getElementById('opt' + i);
                div.classList.toggle("hi", false);
                div.classList.toggle("lo", true);
            }
            my.triTyp = 'any';
            if (n >= 0) {
                var div = document.getElementById('opt' + n);
                div.classList.toggle("hi", true);
                div.classList.toggle("lo", false);
                my.triTyp = this.typs[n][1];
            }
            update();
            break;
    }
}