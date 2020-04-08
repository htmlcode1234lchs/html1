var w, h, ratio, i, s, el, g, div, dragQ, game, my = {};
var chooseQ, mode, dragNo, pts;

function geomquadMain(imode, modeType) {
    my.version = '0.85';
    imode = typeof imode !== 'undefined' ? imode : 'choose';
    chooseQ = false
    my.inscrQ = false
    switch (imode) {
        case 'type':
        case 'choose':
            chooseQ = true
            mode = modeType
            break
        case 'inscr':
            mode = modeType
            chooseQ = true
            my.inscrQ = true
            break
        default:
            mode = imode
    }
    console.log("mode", mode, my.inscrQ, chooseQ);
    var canvasid = "canvas" + mode;
    my.titleid = "title" + mode;
    my.infoid = "info" + mode;
    dragQ = false;
    w = 540;
    h = 310;
    if (!chooseQ) {
        w = 450;
        h = 320;
    }
    var s = '';
    s += '<div style="position:relative;margin-top:-36% !important; width:' + w + 'px; height:' + h + 'px;  border-radius: 9px; margin:auto; display:block; ">';
    s += '<canvas id="' + canvasid + '" width="' + w + '" height="' + h + '" style="z-index:4;"></canvas>';
    s += '<div id="' + my.titleid + '" style="font: 12pt arial; font-weight: bold; position:absolute; top:14px; left:0px; width:540px; text-align:center;"></div>';
    s += '<div id="' + my.infoid + '" style="font: 10pt arial; font-weight: bold; color: #6600cc; position:absolute; top:35px; left:0px; width:540px; text-align:center;"></div>';
   
    /* if (chooseQ) {
        s += '<form onclick="doType()" id="formtype" style="display:none;font: 11pt arial; font-weight: bold; color: #6600cc; background: rgba(200,220,256,0.7); padding: 5px; position:absolute; top:45px; left:2px; z-index:3; text-align:left; ">';
        var opts = [
            [0, "Any"],
            [1, "Parallelogram"],
            [2, "Square"],
            [2, "Rectangle"],
            [2, "Rhombus"],
            [1, "Trapezoid"],
            [1, "Kite"]
        ];
        for (i = 0; i < opts.length; i++) {
            var chkStr = opts[i][0] == 0 ? 'checked' : '';
            var tabStr = opts[i][0] == 2 ? ' &nbsp; ' : '';
            var idStr = 'r' + i;
            s += tabStr + '<label for="' + idStr + '" style="cursor:pointer;"><input type="radio" name="typ" id="' + idStr + '" value="' + opts[i][1] + '" style="height:18px;" ' + chkStr + ' />' + opts[i][1] + '</label><br/>';
        }
        s += '</form>';
    } */
    //s += '<button id="anglesBtn" onclick="toggleAngles()" style="z-index:2; position:absolute; right:183px; bottom:3px;" class="togglebtn lo" >Angles</button>';
    //s += '<button id="sidesBtn" onclick="toggleSides()" style="z-index:2; position:absolute; right:123px; bottom:3px;" class="togglebtn lo" >Sides</button>';
    //s += '<button id="diagsBtn" onclick="toggleDiags()" style="z-index:2; position:absolute; right:63px; bottom:3px;" class="togglebtn lo" >Diags</button>';
    //s += '<button id="resetBtn" onclick="reset()" style="z-index:2; position:absolute; right:3px; bottom:3px;" class="togglebtn" >Reset</button>';
    //s += '<div id="copyrt" style="font: 9px arial; color: #6600cc; position:absolute; left:3px; bottom:3px;"></div>';
    s += '</div>';
   // document.write(s);
   $('#content').empty();
   document.getElementById('content').innerHTML += s;
   //$('#content').innerHTML = document.write(s);
    el = document.getElementById(canvasid);
    
    ratio = 2;
    el.width = w * ratio;
    el.height = h * ratio;
    el.style.width = w + "px";
    el.style.height = h + "px";
    g = el.getContext("2d");
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    dragNo = 0;
    my.anglesQ = false;
    my.sidesQ = false;
    my.diagsQ = false;
    my.titleStr = "Quadrilateral";
    my.descrStr = "";
    my.numPts = 4;
    my.shapes = [];
    my.quad = new Quad();
    my.quad.setLabels("", "", "", "", "", "");
    makeShapes();
    drawShapes();
    el.addEventListener("mousedown", mouseDownListener, false);
    el.addEventListener('touchstart', ontouchstart, false);
    el.addEventListener("mousemove", domousemove, false);
    doType();
    toggleSides();
}

function reset() {
    makeShapes();
    update();
}

function update() {
    doType();
}

function toggleAngles() {
    my.anglesQ = !my.anglesQ;
    toggleBtn("anglesBtn", my.anglesQ);
    update();
}

function toggleSides() {
    my.sidesQ = !my.sidesQ;
   // toggleBtn("sidesBtn", my.sidesQ);
    update();
}

function toggleDiags() {
    my.diagsQ = !my.diagsQ;
    toggleBtn("diagsBtn", my.diagsQ);
    update();
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

function drawBGS(w, h) {
    g.lineWidth = 1;
    for (var i = 0; i < 10; i++) {
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
    for (i = 0; i < 6; i++) {
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

function ontouchstart(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    mouseDownListener(evt);
}

function ontouchmove(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    mouseMoveListener(evt);
    evt.preventDefault();
}

function ontouchend(evt) {
    el.addEventListener('touchstart', ontouchstart, false);
    window.removeEventListener("touchend", ontouchend, false);
    if (dragQ) {
        dragQ = false;
        window.removeEventListener("touchmove", ontouchmove, false);
    }
}

function domousemove(e) {
    document.body.style.cursor = "default";
    var bRect = el.getBoundingClientRect();
    var mouseX = (e.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (e.clientY - bRect.top) * (el.height / ratio / bRect.height);
    for (var i = 0; i < my.numPts; i++) {
        if (hitTest(my.shapes[i], mouseX, mouseY)) {
            dragNo = i;
            document.body.style.cursor = "pointer";
        }
    }
}

function mouseDownListener(evt) {
    var i;
    var highestIndex = -1;
    var bRect = el.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
    for (i = 0; i < my.numPts; i++) {
        if (hitTest(my.shapes[i], mouseX, mouseY)) {
            dragNo = i;
            dragQ = true;
            if (i > highestIndex) {
                my.dragHoldX = mouseX - my.shapes[i].x;
                my.dragHoldY = mouseY - my.shapes[i].y;
                highestIndex = i;
                dragNo = i;
            }
        }
    }
    if (dragQ) {
        if (evt.touchQ) {
            window.addEventListener('touchmove', ontouchmove, false);
        } else {
            window.addEventListener("mousemove", mouseMoveListener, false);
        }
        doType();
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

function mouseUpListener(evt) {
    el.addEventListener("mousedown", mouseDownListener, false);
    window.removeEventListener("mouseup", mouseUpListener, false);
    if (dragQ) {
        dragQ = false;
        window.removeEventListener("mousemove", mouseMoveListener, false);
    }
}

function mouseMoveListener(evt) {
    var posX;
    var posY;
    var shapeRad = my.shapes[dragNo].rad;
    var minX = shapeRad;
    var maxX = el.width - shapeRad;
    var minY = shapeRad;
    var maxY = el.height - shapeRad;
    var bRect = el.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
    posX = mouseX - my.dragHoldX;
    posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
    posY = mouseY - my.dragHoldY;
    posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
    my.shapes[dragNo].x = posX;
    my.shapes[dragNo].y = posY;
    doType();
}

function hitTest(shape, mx, my) {
    var dx;
    var dy;
    dx = mx - shape.x;
    dy = my - shape.y;
    return (dx * dx + dy * dy < shape.rad * shape.rad);
}

function doType() {
    switch (getType().toLowerCase()) {
        case "any":
            my.titleStr = "Quadrilateral";
            my.descrStr = "";
            break;
        case "parallelogram":
            my.titleStr = "Parallelogram";
            my.descrStr = "Opposite sides parallel";
            my.quad.makeParallel(dragNo);
            break;
        case "square":
            my.titleStr = "Square";
            my.descrStr = "All sides equal, all right angles";
            my.quad.makeRegular(dragNo, w / 2 + 30, h / 2);
            break;
        case "rectangle":
            my.titleStr = "Rectangle";
            my.descrStr = "All right angles";
            my.quad.makeRectangle(dragNo);
            break;
        case "rhombus":
            my.titleStr = "Rhombus";
            my.descrStr = "All sides equal";
            my.quad.makeRhombus(dragNo);
            break;
        case "trapezoid":
            my.titleStr = "Trapezoid (UK: Trapezium)";
            my.descrStr = "One pair of sides parallel";
            my.quad.makeTrapez(dragNo);
            break;
        case "kite":
            my.titleStr = "Kite";
            my.descrStr = "Two sets of equal adjacent sides";
            my.quad.makeKite(dragNo);
            break;
        default:
    }
    g.clearRect(0, 0, el.width, el.height);
    drawBGS(this.w, this.h);
    drawShapes();
}

function getType() {
    var typeStr = mode;
    if (chooseQ) {
        var buttons = document.getElementsByName('typ');
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            if (button.checked) {
                typeStr = button.value;
            }
        }
    }
    return typeStr;
}

function getDescr() {}

function makeShapes() {
    var i;
    var tempX;
    var tempY;
    var tempColor;
    var pos = [
        [200, 60, "A"],
        [293, 210, "B"],
        [143, 244, "C"],
        [126, 86, "D"]
    ];
    switch (getType().toLowerCase()) {
        case "any":
            break;
        case "parallelogram":
            pos = [
                [230, 64, "A"],
                [318, 201, "B"],
                [138, 235, "C"],
                [50, 98, "D"]
            ];
            break;
        case "square":
        case "rectangle":
        case "rhombus":
            break;
        case "trapezoid":
            pos = [
                [154, 113, "A"],
                [280, 124, "B"],
                [291, 217, "C"],
                [73, 198, "D"]
            ];
            break;
        case "kite":
            pos = [
                [259, 155, "A"],
                [201, 75, "B"],
                [108, 110, "C"],
                [145, 258, "D"]
            ];
            break;
        default:
    }
    my.shapes = [];
    for (i = 0; i < my.numPts; i++) {
        tempX = pos[i][0];
        tempY = pos[i][1];
        if (chooseQ) {
            tempX += 100;
        }
        tempColor = "rgb(" + 0 + "," + 0 + "," + 255 + ")";
        var tempShape = {
            x: tempX,
            y: tempY,
            rad: 9,
            color: tempColor
        };
        my.shapes.push(tempShape);
    }
}

function drawShapes() {
    var i, s;
    g.strokeStyle = "#888";
    g.moveTo(my.shapes[my.numPts - 1].x, my.shapes[my.numPts - 1].y);
    for (i = 0; i < my.numPts; i++) {
        g.lineTo(my.shapes[i].x, my.shapes[i].y);
        g.fillStyle = "rgba(255, 255, 0, 0.2)";
    }
    g.fill();
    g.stroke();
    var dbg = "";
    for (i = 0; i < my.numPts; i++) {
        g.fillStyle = "rgba(0, 0, 255, 0.3)";
        g.beginPath();
        g.arc(my.shapes[i].x, my.shapes[i].y, my.shapes[i].rad, 0, 2 * Math.PI, false);
        g.closePath();
        g.fill();
        g.fillStyle = "rgba(0, 0, 0, 0.8)";
        g.beginPath();
        g.arc(my.shapes[i].x, my.shapes[i].y, 2, 0, 2 * Math.PI, false);
        g.closePath();
        g.fill();
        g.font = "14px Arial";
        g.fillText(String.fromCharCode(65 + i), my.shapes[i].x + 5, my.shapes[i].y - 5, 100);
        my.quad.setxy(i, my.shapes[i].x, my.shapes[i].y);
        dbg += '[' + Math.floor(my.shapes[i].x) + "," + Math.floor(my.shapes[i].y) + "],";
    }
    my.quad.updateMe();
    if (my.anglesQ) my.quad.drawAngles(g);
    if (my.sidesQ) my.quad.drawSides(g);
    if (my.diagsQ) my.quad.drawDiags(g);
    if (my.inscrQ) my.quad.drawInscr(g);
    if (mode == 'area') {
        my.quad.setDec(1);
        my.quad.setKnown("a", true);
        var base = Number(my.quad.getUserStr("a"));
        var ht = my.quad.getAltitude(0);
        if (ht < 0.3 || base < 0.3) {
            s = "Is that a Quadrilateral?";
        } else {
            s = "Area = &frac12; &times; ";
            s += base;
            s += " &times; ";
            s += ht;
            s += " = ";
            s += Math.round(0.5 * base * ht, 2);
        }
        my.quad.drawAltitude(g, 0);
        my.quad.drawSides(g);
        document.getElementById(my.titleid).innerHTML = s;
    }
    if (mode == 'perim') {
        my.quad.drawSides(g);
        s = "Perimeter = ";
        var sum = 0;
        for (i = 0; i < my.numPts; i++) {
            var side = Math.round(my.quad.getVal(String.fromCharCode(97 + i)));
            s += side + " + ";
            sum += side;
        }
        s = s.substring(0, s.length - 2);
        s += " = " + sum;
        document.getElementById(my.titleid).innerHTML = s;
    }
    var angs;
    if (mode == 'angles') {
        angs = my.quad.drawAngles(g);
        console.lg(angs)
        s = "";
        for (i = 0; i < my.numPts; i++) {
            s += angs[i] + "° + ";
        }
        s = s.substring(0, s.length - 2);
        s += " = 180°";
        document.getElementById(my.titleid).innerHTML = s;
    }
    if (mode == 'type') {
        angs = my.quad.drawAngles(g);
        console.log(angs)
        document.getElementById(my.titleid).innerHTML = my.titleStr;
        document.getElementById(my.infoid).innerHTML = my.descrStr;
    }
}

function TextBox(ig, ifont, ifontSize, iwd, ilines, itxt, ix, iy, iinputQ) {
    this.g = ig;
    this.font = ifont;
    this.fontSize = ifontSize;
    this.wd = iwd;
    this.lines = ilines;
    this.txt = itxt;
    this.posx = ix;
    this.posy = iy;
    this.clr = "#000000";
    this.refresh();
}
TextBox.prototype.refresh = function() {
    this.g.font = this.fontSize + "px " + this.font;
    this.g.fillStyle = this.clr;
    this.g.fillText(this.txt, this.posx, this.posy, this.wd);
};
TextBox.prototype.setText = function(itxt) {
    this.txt = itxt;
    this.refresh();
};
TextBox.prototype.setClr = function(iclr) {
    this.clr = iclr;
};

function Quad() {
    var sideTextArray = [];
    this.sideLabels = [];
    this.angleLabels = [];
    var angleTextArray = [];
    var isAngleKnownQ = [false, false, false];
    var isSideKnownQ = [false, false, false];
    var dec = 1;
    var types = [];
    var fillQ = true;
    this.scaleFactor = 1;
    pts = new Array(my.numPts);
    for (var k = 0; k < my.numPts; k++) {
        pts[k] = new Pt(0, 0);
    }
}
Quad.prototype.makeRegular = function(PointNum, midX, midY) {
    var movedQ = true;
    var obj = my.shapes[PointNum];
    var radius = dist(midX - obj.x, midY - obj.y);
    if (radius > 180) radius = 180;
    var SttAngle = Math.atan2(obj.y - midY, obj.x - midX);
    var dAngle = Math.PI * 2 / 4;
    for (var i = 0; i < my.numPts; i++) {
        obj = my.shapes[i];
        var angle = SttAngle + (i - PointNum) * dAngle;
        obj.x = midX + radius * Math.cos(angle);
        obj.y = midY + radius * Math.sin(angle);
        if (i != PointNum) {
            my.shapes[i].x = obj.x;
            my.shapes[i].y = obj.y;
        }
    }
    return movedQ;
};
Quad.prototype.makeParallel = function(PointNum) {
    var ANum = PointNum;
    var BNum = PointNum + 1;
    var CNum = PointNum + 2;
    var DNum = PointNum + 3;
    if (BNum >= my.numPts)
        BNum -= my.numPts;
    if (CNum >= my.numPts)
        CNum -= my.numPts;
    if (DNum >= my.numPts)
        DNum -= my.numPts;
    var Aobj = my.shapes[ANum];
    var Bobj = my.shapes[BNum];
    var Cobj = my.shapes[CNum];
    var Dobj = my.shapes[DNum];
    var ABx = Aobj.x - Bobj.x;
    var ABy = Aobj.y - Bobj.y;
    Dobj.x = Cobj.x + ABx;
    Dobj.y = Cobj.y + ABy;
};
Quad.prototype.makeKite = function(PointNum) {
    var ANum = 3;
    var BNum = 0;
    var CNum = BNum + 1;
    var DNum = CNum + 1;
    var Aobj = my.shapes[ANum];
    var Bobj = my.shapes[BNum];
    var Cobj = my.shapes[CNum];
    var Dobj = my.shapes[DNum];
    var Ox = (Bobj.x + Dobj.x) / 2;
    var Oy = (Bobj.y + Dobj.y) / 2;
    var Angle = 0;
    var d = 0;
    if (PointNum == ANum) {
        d = dist(Aobj.x - Ox, Aobj.y - Oy);
        if (d > 20) {
            Angle = Math.atan2(Aobj.y - Oy, Aobj.x - Ox);
        } else {
            Angle = Math.atan2(Cobj.y - Oy, Cobj.x - Ox) + Math.PI;
        }
        console.log("A");
    }
    if (PointNum == BNum) {
        Angle = Math.atan2(Bobj.y - Oy, Bobj.x - Ox) + Math.PI / 2;
        console.log("B");
    }
    if (PointNum == CNum) {
        d = dist(Cobj.x - Ox, Cobj.y - Oy);
        if (d > 20) {
            Angle = Math.atan2(Cobj.y - Oy, Cobj.x - Ox) + Math.PI;
        } else {
            Angle = Math.atan2(Aobj.y - Oy, Aobj.x - Ox);
        }
        console.log("C");
    }
    if (PointNum == DNum) {
        Angle = Math.atan2(Dobj.y - Oy, Dobj.x - Ox) - Math.PI / 2;
        console.log("D");
    }
    var BO = dist(Bobj.x - Ox, Bobj.y - Oy);
    Bobj.x = Ox + BO * Math.cos(Angle - Math.PI / 2);
    Bobj.y = Oy + BO * Math.sin(Angle - Math.PI / 2);
    Dobj.x = Ox + BO * Math.cos(Angle + Math.PI / 2);
    Dobj.y = Oy + BO * Math.sin(Angle + Math.PI / 2);
    Aobj = this.kitePosNegPt(Aobj, Ox, Oy, Angle);
    Cobj = this.kitePosNegPt(Cobj, Ox, Oy, Angle);
};
Quad.prototype.kitePosNegPt = function(pt, Ox, Oy, Angle) {
    var d = dist(pt.x - Ox, pt.y - Oy);
    var posPt = new Pt(0, 0);
    posPt.x = Ox + d * Math.cos(Angle);
    posPt.y = Oy + d * Math.sin(Angle);
    var posD = dist(pt.x - posPt.x, pt.y - posPt.y);
    var negPt = new Pt(0, 0);
    negPt.x = Ox - d * Math.cos(Angle);
    negPt.y = Oy - d * Math.sin(Angle);
    var negD = dist(pt.x - negPt.x, pt.y - negPt.y);
    if (posD < negD) {
        pt.x = Ox + d * Math.cos(Angle);
        pt.y = Oy + d * Math.sin(Angle);
    } else {
        pt.x = Ox - d * Math.cos(Angle);
        pt.y = Oy - d * Math.sin(Angle);
    }
    return pt;
};
Quad.prototype.makeKiteConcaveOnly = function(PointNum) {
    var ANum = 3;
    var BNum = 0;
    var CNum = BNum + 1;
    var DNum = CNum + 1;
    var Aobj = my.shapes[ANum];
    var Bobj = my.shapes[BNum];
    var Cobj = my.shapes[CNum];
    var Dobj = my.shapes[DNum];
    var Ox = (Bobj.x + Dobj.x) / 2;
    var Oy = (Bobj.y + Dobj.y) / 2;
    var Angle = 0;
    var d = 0;
    if (PointNum == ANum) {
        d = dist(Aobj.x - Ox, Aobj.y - Oy);
    }
    if (PointNum == BNum) {
        Angle = Math.atan2(Bobj.y - Oy, Bobj.x - Ox) + Math.PI / 2;
    }
    if (PointNum == CNum) {
        Angle = Math.atan2(Cobj.y - Oy, Cobj.x - Ox) + Math.PI;
    }
    if (PointNum == DNum) {
        Angle = Math.atan2(Dobj.y - Oy, Dobj.x - Ox) - Math.PI / 2;
    }
    var BO = dist(Bobj.x - Ox, Bobj.y - Oy);
    Bobj.x = Ox + BO * Math.cos(Angle - Math.PI / 2);
    Bobj.y = Oy + BO * Math.sin(Angle - Math.PI / 2);
    Dobj.x = Ox + BO * Math.cos(Angle + Math.PI / 2);
    Dobj.y = Oy + BO * Math.sin(Angle + Math.PI / 2);
    var AO = dist(Aobj.x - Ox, Aobj.y - Oy);
    var CO = dist(Cobj.x - Ox, Cobj.y - Oy);
    Aobj.x = Ox + AO * Math.cos(Angle);
    Aobj.y = Oy + AO * Math.sin(Angle);
    Cobj.x = Ox + CO * Math.cos(Angle - Math.PI);
    Cobj.y = Oy + CO * Math.sin(Angle - Math.PI);
};
Quad.prototype.makeRhombus = function(PointNum) {
    var ANum = PointNum - 1;
    var BNum = PointNum;
    var CNum = PointNum + 1;
    var DNum = PointNum + 2;
    if (ANum < 0)
        ANum += my.numPts;
    if (CNum >= my.numPts)
        CNum -= my.numPts;
    if (DNum >= my.numPts)
        DNum -= my.numPts;
    var Aobj = my.shapes[ANum];
    var Bobj = my.shapes[BNum];
    var Cobj = my.shapes[CNum];
    var Dobj = my.shapes[DNum];
    var Side = 150;
    var Angle = Math.atan2(Aobj.y - Bobj.y, Aobj.x - Bobj.x);
    Aobj.x = Bobj.x + Side * Math.cos(Angle);
    Aobj.y = Bobj.y + Side * Math.sin(Angle);
    Angle = Math.atan2(Cobj.y - Bobj.y, Cobj.x - Bobj.x);
    Cobj.x = Bobj.x + Side * Math.cos(Angle);
    Cobj.y = Bobj.y + Side * Math.sin(Angle);
    var AngleAB = Math.atan2(Bobj.y - Aobj.y, Bobj.x - Aobj.x);
    var AngleAC = Math.atan2(Cobj.y - Aobj.y, Cobj.x - Aobj.x);
    var AngleDiff = AngleAB - AngleAC;
    var AngleAD = AngleAB - AngleDiff * 2;
    Dobj.x = Aobj.x + Side * Math.cos(AngleAD);
    Dobj.y = Aobj.y + Side * Math.sin(AngleAD);
};
Quad.prototype.makeRectangle = function(PointNum) {
    var ANum = PointNum - 1;
    var BNum = PointNum;
    var CNum = PointNum + 1;
    var DNum = PointNum + 2;
    if (ANum < 0)
        ANum += my.numPts;
    if (CNum >= my.numPts)
        CNum -= my.numPts;
    if (DNum >= my.numPts)
        DNum -= my.numPts;
    var Aobj = my.shapes[ANum];
    var Bobj = my.shapes[BNum];
    var Cobj = my.shapes[CNum];
    var Dobj = my.shapes[DNum];
    var Angle = Math.atan2(Aobj.y - Bobj.y, Aobj.x - Bobj.x);
    var AD = dist(Dobj.x - Aobj.x, Dobj.y - Aobj.y);
    Cobj.x = Bobj.x + AD * Math.cos(Angle - Math.PI / 2);
    Cobj.y = Bobj.y + AD * Math.sin(Angle - Math.PI / 2);
    Dobj.x = Aobj.x + AD * Math.cos(Angle - Math.PI / 2);
    Dobj.y = Aobj.y + AD * Math.sin(Angle - Math.PI / 2);
};
Quad.prototype.makeTrapez = function(PointNum) {
    var ANum = 0;
    var BNum = 1;
    var CNum = 2;
    var DNum = 3;
    if (ANum < 0)
        ANum += my.numPts;
    if (CNum >= my.numPts)
        CNum -= my.numPts;
    if (DNum >= my.numPts)
        DNum -= my.numPts;
    var Aobj = my.shapes[ANum];
    var Bobj = my.shapes[BNum];
    var Cobj = my.shapes[CNum];
    var Dobj = my.shapes[DNum];
    var Angle = 0;
    var AB = 0;
    var CD = 0;
    switch (PointNum) {
        case 0:
            Angle = Math.atan2(Aobj.y - Bobj.y, Aobj.x - Bobj.x);
            CD = dist(Dobj.x - Cobj.x, Dobj.y - Cobj.y);
            Dobj.x = Cobj.x + CD * Math.cos(Angle);
            Dobj.y = Cobj.y + CD * Math.sin(Angle);
            break;
        case 1:
            Angle = Math.atan2(Bobj.y - Aobj.y, Bobj.x - Aobj.x);
            CD = dist(Dobj.x - Cobj.x, Dobj.y - Cobj.y);
            Cobj.x = Dobj.x + CD * Math.cos(Angle);
            Cobj.y = Dobj.y + CD * Math.sin(Angle);
            break;
        case 2:
            Angle = Math.atan2(Cobj.y - Dobj.y, Cobj.x - Dobj.x);
            AB = dist(Aobj.x - Bobj.x, Aobj.y - Bobj.y);
            Bobj.x = Aobj.x + AB * Math.cos(Angle);
            Bobj.y = Aobj.y + AB * Math.sin(Angle);
            break;
        case 3:
            Angle = Math.atan2(Dobj.y - Cobj.y, Dobj.x - Cobj.x);
            AB = dist(Aobj.x - Bobj.x, Aobj.y - Bobj.y);
            Aobj.x = Bobj.x + AB * Math.cos(Angle);
            Aobj.y = Bobj.y + AB * Math.sin(Angle);
            break;
    }
};
Quad.prototype.getAngles = function() {
    return [pts[0].getAngle(), pts[1].getAngle(), pts[2].getAngle()];
};
Quad.prototype.getNo = function(varName) {
    switch (varName) {
        case "A":
            return 0;
        case "B":
            return 1;
        case "C":
            return 2;
        case "D":
            return 2;
        case "a":
            return 1;
        case "b":
            return 2;
        case "c":
            return 3;
        case "d":
            return 0;
    }
    return -1;
};
Quad.prototype.getVal = function(varName) {
    switch (varName) {
        case "A":
        case "B":
        case "C":
        case "D":
            return pts[this.getNo(varName)].getAngle();
        case "a":
        case "b":
        case "c":
        case "d":
            return this.sides[this.getNo(varName)];
        default:
    }
    return 0;
};
Quad.prototype.setLabels = function(angleA, angleB, angleC, angleD, sidea, sideb, sidec, sided) {
    this.setLabel("A", angleA);
    this.setLabel("B", angleB);
    this.setLabel("C", angleC);
    this.setLabel("D", angleC);
    this.setLabel("a", sidea);
    this.setLabel("b", sideb);
    this.setLabel("c", sidec);
    this.setLabel("d", sidec);
};
Quad.prototype.setLabel = function(varName, labelStr) {
    var lblNo = this.getNo(varName);
    if (lblNo < 0)
        return;
    if (labelStr == null)
        return;
    switch (varName) {
        case "A":
        case "B":
        case "C":
        case "D":
            this.angleLabels[lblNo] = labelStr;
            break;
        case "a":
        case "b":
        case "c":
        case "d":
            this.sideLabels[lblNo] = labelStr;
            break;
        default:
    }
};
Quad.prototype.getUserStr = function(varName) {
    switch (varName) {
        case "A":
        case "B":
        case "C":
        case "D":
            if (this.isKnown(varName)) {
                return (this.userAngle(pts[this.getNo(varName)].getAngle()).toString() + "º");
            } else {
                return (this.angleLabels[this.getNo(varName)]);
            }
            break;
        case "a":
        case "b":
        case "c":
        case "d":
            if (this.isKnown(varName)) {
                return (this.userSide(this.getNo(varName)).toString());
            } else {
                return (this.sideLabels[this.getNo(varName)]);
            }
            break;
        default:
    }
    return "";
};
Quad.prototype.setxy = function(ptNo, ix, iy) {
    pts[ptNo].setxy(ix, iy);
};
Quad.prototype.updateMe = function() {
    setAngles(pts);
    this.sides = getSides(pts);
};
Quad.prototype.setAllKnown = function(knownQ) {
    this.isAngleKnownQ = [knownQ, knownQ, knownQ, knownQ];
    this.isSideKnownQ = [knownQ, knownQ, knownQ, knownQ];
};
Quad.prototype.setKnown = function(varName, knownQ) {
    switch (varName) {
        case "A":
        case "B":
        case "C":
        case "D":
            this.isAngleKnownQ[this.getNo(varName)] = knownQ;
            break;
        case "a":
        case "b":
        case "c":
        case "d":
            this.isSideKnownQ[this.getNo(varName)] = knownQ;
            break;
        default:
    }
};
Quad.prototype.isKnown = function(varName) {
    switch (varName) {
        case "A":
        case "B":
        case "C":
        case "D":
            return this.isAngleKnownQ[this.getNo(varName)];
        case "a":
        case "b":
        case "c":
        case "d":
            return this.isSideKnownQ[this.getNo(varName)];
        default:
    }
    return false;
};
Quad.prototype.userSide = function(i) {
    return Math.round(this.sides[i] * this.scaleFactor, this.dec);
};
Quad.prototype.userAngle = function(x) {
    return Math.round(x * 180 / Math.PI, this.dec);
};
Quad.prototype.drawSides = function(g) {
    var ptC = new Pt();
    ptC.setAvg(pts);
    g.fillStyle = "#000000";
    g.font = "bold 12px Arial";
    var ptM = new Pt();
    for (var i = 0; i < 4; i++) {
        ptM.setAvg([pts[i], pts[loop(i, 0, 3, 1)]]);
        ptM.interpolate(ptM, ptC, 1.2);
        var side = Math.round(this.getVal(String.fromCharCode(97 + loop(i + 2, 0, 3, 1))));
        g.fillText(side, ptM.x - 10, ptM.y + 5, 100);
    }
};
Quad.prototype.drawInscr = function(g) {
    g.beginPath()
    g.lineWidth = 2
    g.fillStyle = "hsla(240,100%,60%,0.1)";
    var ptM = new Pt();
    for (var i = 0; i < 4; i++) {
        ptM.setAvg([pts[i], pts[loop(i, 0, 3, 1)]]);
        g.lineTo(ptM.x, ptM.y)
    }
    g.closePath()
    g.stroke()
    g.fill()
    g.fillStyle = "black";
    for (var i = 0; i < 4; i++) {
        ptM.setAvg([pts[i], pts[loop(i, 0, 3, 1)]]);
        g.beginPath()
        g.arc(ptM.x, ptM.y, 2, 0, 2 * Math.PI)
        g.fill()
    }
}
Quad.prototype.drawAngles = function(g) {
    var angSum = 0;
    var angDescr = "";
    var angs = [];
    for (var i = 0; i < pts.length; i++) {
        var angDeg = Math.round(pts[i].getAngle() * 180 / Math.PI);
        console.log(angDeg)
        var d = 30;
        if (angDeg == 90) {
            g.drawBox(pts[i].x, pts[i].y, 25, pts[i].angleOut - Math.PI / 2);
        } else {
            if (angDeg > 90) {
                d = Math.max(20, 30 - (angDeg - 90) / 6);
            } else {}
            g.fillStyle = "rgba(0, 0, 255, 0.3)";
            g.beginPath();
            g.moveTo(pts[i].x, pts[i].y);
            g.arc(pts[i].x, pts[i].y, d, pts[i].angleIn, pts[i].angleOut, false);
            g.closePath();
            g.fill();
        }
        var ang = this.userAngle(pts[i].getAngle());
        if (i < 3) {
            angSum += ang;
        } else {
            ang = 360 - angSum;
            if (ang < 0) ang += 360;
        }
        angs[i] = ang;
        angDescr += ang + "° + ";
        var aMid = (pts[i].angleIn + pts[i].angleOut) / 2;
        var txtPt = new Pt(0, 0);
        txtPt.x = pts[i].x + (d + 15) * Math.cos(aMid) - 0;
        txtPt.y = pts[i].y + (d + 15) * Math.sin(aMid) - 0;
        g.fillStyle = "rgba(0, 0, 255, 1)";
        g.fillText(Math.round(ang) + "°", txtPt.x - 10, txtPt.y + 5, 100);
        console.log(ang)
    }
    return angs;
};
Quad.prototype.drawDiags = function(g) {
    g.strokeStyle = "#666666";
    var diagCount = 0;
    for (var i = 0; i < pts.length - 2; i++) {
        for (var j = i + 2; j < pts.length; j++) {
            if (i == 0 && j == pts.length - 1) {} else {
                g.beginPath();
                g.moveTo(pts[i].x, pts[i].y);
                g.lineTo(pts[j].x, pts[j].y);
                g.stroke();
                diagCount++;
            }
        }
    }
};
Quad.prototype.setDec = function(decimals) {
    this.dec = decimals;
};
Line.prototype.getLength = function(n) {
    var dx = this.b.x - this.a.x;
    var dy = this.b.y - this.a.y;
    return Math.sqrt(dx * dx + dy * dy) * this.scaleFactor;
};

function Pt(ix, iy) {
    this.x = ix;
    this.y = iy;
    this.prevx = 0;
    this.prevy = 0;
    this.prevQ = false;
    var a;
    var validPtQ;
    this.angleIn = 0;
    this.angleOut = 0;
}
Pt.prototype.setxy = function(ix, iy) {
    this.x = ix;
    this.y = iy;
    this.validPtQ = true;
};
Pt.prototype.setPrevPt = function() {
    if (this.validPtQ) {
        this.prevx = this.x;
        this.prevy = this.y;
        this.prevQ = true;
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
    var newPt = new Pt(xSum / pts.length, ySum / pts.length);
    newPt.x = xSum / pts.length;
    newPt.y = ySum / pts.length;
    return newPt;
};
Pt.prototype.setAvg = function(pts) {
    this.setPrevPt();
    var newPt = this.getAvg(pts);
    this.x = newPt.x;
    this.y = newPt.y;
    this.validPtQ = true;
};
Pt.prototype.interpolate = function(pt1, pt2, f) {
    this.setPrevPt();
    this.x = pt1.x * f + pt2.x * (1 - f);
    this.y = pt1.y * f + pt2.y * (1 - f);
    this.validPtQ = true;
};
Pt.prototype.translate = function(pt, addQ) {
    addQ = typeof addQ !== 'undefined' ? addQ : true;
    var t = new Pt(this.x, this.y);
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

function setAngles(pts) {
    var CW = getClockwise(pts);
    var numPoints = pts.length;
    var angles = [];
    for (var i = 0; i < numPoints; i++) {
        var pt = pts[i];
        var ptm1 = pts[loop(i, 0, numPoints - 1, -1)];
        var ptp1 = pts[loop(i, 0, numPoints - 1, 1)];
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
        var ptm1 = pts[loop(i, 0, numPoints - 1, -1)];
        var ptp1 = pts[loop(i, 0, numPoints - 1, 1)];
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

function handleResponse(message) {
    console.log(`Message from the background script:  ${message.response}`);
  }
  
  function handleError(error) {
    console.log(`Error: ${error}`);
  }
  
  function notifyBackgroundPage(e) {
    var sending = browser.runtime.sendMessage({
      greeting: "Greeting from the content script"
    });
    sending.then(handleResponse, handleError);  
  }
  
  

function getSides(pts) {
    var numPoints = pts.length;
    var sides = [];
    for (var i = 0; i < numPoints; i++) {
        var pt = pts[i];
        var ptp1 = pts[loop(i, 0, numPoints - 1, 1)];
        sides.push(dist(ptp1.x - pt.x, ptp1.y - pt.y));
    }
   // console.log(sides);
    var tot = 0;
    for(var i= 0;i<sides.length;i++){
        //console.log(Math.round(sides[i]));
        tot += Math.round(sides[i]);
    }
   // localStorage.setItem('tot', tot);
   // console.log(document.getElementById('lab-perivalue'));
    $('#lab-perivalue').text(tot);

   // window.addEventListener("click", notifyBackgroundPage);
   // document.getElementById('lab-perivalue').htmlFor = tot;
    return (sides);
}

function dist(dx, dy) {
    return (Math.sqrt(dx * dx + dy * dy));
}

function loop(currNo, minNo, maxNo, incr) {
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
Line.prototype.getMidPt = function() {
    return new Pt((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
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
    var closest = this.a.translate(AB.multiply(t));
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