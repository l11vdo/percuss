var step = new Array(3);

function hexToRgb(hex) {
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function Color(r,g,b) {
    var arr = new Array(r,g,b)
    return {
        r: r,
        g: g,
        b: b,
        coll: arr,
        valid: cVerify(arr),
        text:  cText(arr),
        bg: cText(arr)
    }
}

function cVerify(c) {
	var valid = 'n';
	if ((!isNaN(c[0])) && (!isNaN(c[1])) && (!isNaN(c[2]))) {valid = 'y'}
	return valid;
}

function cText(c) {
	var result = '';
    var d = 1;
    var cT = 'hex';
	var base = 16;
	for (k = 0; k < 3; k++) {
		val = Math.round(c[k]/d);
		piece = val.toString(base);
		if (cT == 'hex' && piece.length < 2) {piece = '0' + piece;}
		if (cT == 'rgbp') {piece = piece + '%'};
		if (cT != 'hex' && k < 2) {piece = piece + ',';}
		result = result + piece;
	}
	if (cT == 'hex') {result = '#' + result.toUpperCase();}
		else {result = 'rgb(' + result + ')';}
	return result;
}

function colorParse(c,t) {
    var m = 1;
	c = c.toUpperCase();
	col = c.replace('RGB','').replace(/[\#\(]*/i,'');
    if (col.length == 3) {
        a = col.substr(0,1);
        b = col.substr(1,1);
        c = col.substr(2,1);
        col = a + a + b + b + c + c;
    }
    var num = new Array(col.substr(0,2),col.substr(2,2),col.substr(4,2));
    var base = 16;

	var ret = new Array(parseInt(num[0],base)*m,parseInt(num[1],base)*m,parseInt(num[2],base)*m);
	return(ret);
}
function colorStore(startColor, endColor) {
    var ends = []
    var c = colorParse(startColor,'hex')
	ends.push(new Color(c[0],c[1],c[2]))
	var c = colorParse(endColor,'hex')
	ends.push(new Color(c[0],c[1],c[2]))
    //if (ends[0].valid == 'y') {colorPour('col',n)}
    return ends
}
function stepCalc(steps, ends) {
    step[0] = Math.round((ends[1].r - ends[0].r) / steps)
	step[1] = Math.round((ends[1].g - ends[0].g) / steps)
	step[2] = Math.round((ends[1].b - ends[0].b) / steps)
}
export function colorPalette(startColor, endColor, steps)
{
    var palette = []
    var ends = colorStore(startColor, endColor)
    stepCalc(steps, ends)
	var count = steps + 1;
	palette.push(rgbToHex(ends[0].r,ends[0].g,ends[0].b))
	for (i = 1; i < count; i++) {
		var r = (ends[0].r + (step[0] * i))
		var g = (ends[0].g + (step[1] * i))
		var b = (ends[0].b + (step[2] * i))
		palette.push(rgbToHex(r,g,b))
	}
    palette.push(rgbToHex(ends[1].r,ends[1].g,ends[1].b))
    return palette
}

export function paletteColor(startColor, endColor, steps, step)
{
    var palette = []
    var ends = colorStore(startColor, endColor)
    stepCalc(steps, ends)
	var count = steps + 1;
	palette.push(rgbToHex(ends[0].r,ends[0].g,ends[0].b))
	for (i = 1; i < count; i++) {
		var r = (ends[0].r + (step[0] * i))
		var g = (ends[0].g + (step[1] * i))
		var b = (ends[0].b + (step[2] * i))
		palette.push(rgbToHex(r,g,b))
	}
    palette.push(rgbToHex(ends[1].r,ends[1].g,ends[1].b))
    return palette[step]
}