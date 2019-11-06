(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * CrayonBrush class
 * @class fabric.CrayonBrush
 * @extends fabric.BaseBrush
 */
(function(fabric){

  fabric.CrayonBrush = fabric.util.createClass(fabric.BaseBrush, {

    color: "#000000",
    opacity: 0.6,
    width: 30,

    _baseWidth: 20,
    _inkAmount: 10,
    _latestStrokeLength: 0,
    _point: null,
    _sep: 5,
    _size: 0,

    initialize: function(canvas, opt) {
      opt = opt || {};

      this.canvas = canvas;
      this.width = opt.width || canvas.freeDrawingBrush.width;
      this.color = opt.color || canvas.freeDrawingBrush.color;
      this.opacity = opt.opacity || canvas.contextTop.globalAlpha;
      this._point = new fabric.Point(0, 0);
    },

    changeColor: function(color){
      this.color = color;
    },

    changeOpacity: function(value){
      this.opacity = value;
    },

    onMouseDown: function(pointer){
      this.canvas.contextTop.globalAlpha = this.opacity;
      this._size = this.width / 2 + this._baseWidth;
      this.set(pointer);
    },

    onMouseMove: function(pointer){
      this.update(pointer);
      this.draw(this.canvas.contextTop);
    },

    onMouseUp: function(pointer){
    },

    set: function(p) {
      if (this._latest) {
        this._latest.setFromPoint(this._point);
      } else {
        this._latest = new fabric.Point(p.x, p.y);
      }
      fabric.Point.prototype.setFromPoint.call(this._point, p);
    },

    update: function(p) {
      this.set(p);
      this._latestStrokeLength = this._point.subtract(this._latest).distanceFrom({ x: 0, y: 0 });
    },

    draw: function(ctx) {
      var i, j, p, r, c, x, y, w, h, v, s, stepNum, dotSize, dotNum, range;

      v = this._point.subtract(this._latest);
      s = Math.ceil(this._size / 2);
      stepNum = Math.floor(v.distanceFrom({ x: 0, y: 0 }) / s) + 1;
      v.normalize(s);

      dotSize = this._sep * fabric.util.clamp(this._inkAmount / this._latestStrokeLength * 3, 1, 0.5);
      dotNum = Math.ceil(this._size * this._sep);

      range = this._size / 2;

      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      for (i = 0; i < dotNum; i++) {
        for (j = 0; j < stepNum; j++) {
          p = this._latest.add(v.multiply(j));
          r = fabric.util.getRandom(range);
          c = fabric.util.getRandom(Math.PI * 2);
          w = fabric.util.getRandom(dotSize, dotSize / 2);
          h = fabric.util.getRandom(dotSize, dotSize / 2);
          x = p.x + r * Math.sin(c) - w / 2;
          y = p.y + r * Math.cos(c) - h / 2;
          ctx.rect(x, y, w, h);
        }
      }
      ctx.fill();
      ctx.restore();
    }
  });

})(fabric);

},{}],2:[function(require,module,exports){
/**
 * Drip class
 * @class fabric.Drip
 * @extends fabric.Object
 */
(function(fabric) {

  fabric.Drip = fabric.util.createClass(fabric.Object, {
    rate: 0,
    color: "#000000",
    amount: 10,
    life: 10,
    _point: null,
    _lastPoint: null,
    _strokeId: 0,
    _interval: 20,

    initialize: function(ctx, pointer, amount, color, _strokeId) {
      this.ctx = ctx;
      this._point = pointer;
      this._strokeId = _strokeId;
      this.amount = fabric.util.getRandom(amount, amount * 0.5);
      this.color = color;
      this.life = this.amount * 1.5;
      ctx.lineCap = ctx.lineJoin = "round";

      this._render();
    },

    _update: function(brush) {
      this._lastPoint = fabric.util.object.clone(this._point);
      this._point.addEquals({
        x: this.life * this.rate,
        y: fabric.util.getRandom(this.life * this.amount / 30)
      });

      this.life -= 0.05;

      if (fabric.util.getRandom() < 0.03) {
        this.rate += fabric.util.getRandom(0.03, - 0.03);
      } else if (fabric.util.getRandom() < 0.05) {
        this.rate *= 0.01;
      }
    },

    _draw: function() {
      this.ctx.save();
      this.line(this.ctx, this._lastPoint, this._point, this.color, this.amount * 0.8 + this.life * 0.2);
      this.ctx.restore();
    },

    _render: function() {
      var context = this;

      setTimeout(draw, this._interval);

      function draw() {
        context._update();
        context._draw();
        if(context.life > 0) {
          setTimeout(draw, context._interval);
        }
      }
    },

    line: function(ctx, point1, point2, color, lineWidth) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);

      ctx.stroke();
    }
  });

})(fabric);

},{}],3:[function(require,module,exports){
/**
* InkBrush class
* @class fabric.InkBrush
* @extends fabric.BaseBrush
*/
(function(fabric){

  fabric.InkBrush = fabric.util.createClass(fabric.BaseBrush, {

    color: "#000000",
    opacity: 1,
    width: 30,

    _baseWidth: 20,
    _dripCount: 0,
    _drips: [],
    _inkAmount: 7,
    _lastPoint: null,
    _point: null,
    _range: 10,
    _strokeCount: 0,
    _strokeId: null,
    _strokeNum: 40,
    _strokes: null,

    initialize: function(canvas, opt) {
      opt = opt || {};

      this.canvas = canvas;
      this.width = opt.width || canvas.freeDrawingBrush.width;
      this.color = opt.color || canvas.freeDrawingBrush.color;
      this.opacity = opt.opacity || canvas.contextTop.globalAlpha;

      this._point = new fabric.Point();
    },

    changeColor: function(color){
      this.color = color;
    },

    changeOpacity: function(value){
      this.opacity = value;
      this.canvas.contextTop.globalAlpha = value;
    },

    _render: function(pointer){
      var subtractPoint, distance, point, i, len, strokes, stroke;
      this._strokeCount++;
      if (this._strokeCount % 120 === 0 && this._dripCount < 10) {
        this._dripCount++;
      }

      point = this.setPointer(pointer);
      subtractPoint = point.subtract(this._lastPoint);
      distance = point.distanceFrom(this._lastPoint);
      strokes = this._strokes;

      for (i = 0, len = strokes.length; i < len; i++) {
        stroke = strokes[i];
        stroke.update(point, subtractPoint, distance);
        stroke.draw();
      }

      if (distance > 30) {
        this.drawSplash(point, this._inkAmount);
      } else if (distance < 10 && fabric.util.getRandom() < 0.085 && this._dripCount) {
        this._drips.push(new fabric.Drip(this.canvas.contextTop, point, fabric.util.getRandom(this.size * 0.25, this.size * 0.1), this.color, this._strokeId));
        this._dripCount--;
      }
    },

    onMouseDown: function(pointer){
      this._resetTip(pointer);
      this._strokeId = +new Date();
      this._dripCount = fabric.util.getRandom(6, 3) | 0;
    },

    onMouseMove: function(pointer){
      if(this.canvas._isCurrentlyDrawing){
        this._render(pointer);
      }
    },

    onMouseUp: function(){
      this._strokeCount = 0;
      this._dripCount = 0;
      this._strokeId = null;
    },

    drawSplash: function(pointer, maxSize) {
      var c, r, i, point,
          ctx = this.canvas.contextTop,
          num = fabric.util.getRandom(12),
          range = maxSize * 10,
          color = this.color;

      ctx.save();
      for (i = 0; i < num; i++) {
        r = fabric.util.getRandom(range, 1);
        c = fabric.util.getRandom(Math.PI * 2);
        point = new fabric.Point(pointer.x + r * Math.sin(c), pointer.y + r * Math.cos(c));

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, fabric.util.getRandom(maxSize) / 2, 0, Math.PI * 2, false);
        ctx.fill();
      }
      ctx.restore();
    },

    setPointer: function(pointer) {
      var point = new fabric.Point(pointer.x, pointer.y);

      this._lastPoint = fabric.util.object.clone(this._point);
      this._point = point;

      return point;
    },

    _resetTip: function(pointer){
      var strokes, point, len, i;

      point = this.setPointer(pointer);
      strokes = this._strokes = [];
      this.size = this.width / 5 + this._baseWidth;
      this._strokeNum = this.size;
      this._range = this.size / 2;

      for (i = 0, len = this._strokeNum; i < len; i++) {
        strokes[i] = new fabric.Stroke(this.canvas.contextTop, point, this._range, this.color, this.width, this._inkAmount);
      }
    }
  });

})(fabric);

},{}],4:[function(require,module,exports){
/**
* MarkerBrush class
* @class fabric.MarkerBrush
* @extends fabric.BaseBrush
*/
(function(fabric) {

  fabric.MarkerBrush = fabric.util.createClass(fabric.BaseBrush, {

    color: "#000000",
    opacity: 1,
    width: 30,

    _baseWidth: 10,
    _lastPoint: null,
    _lineWidth: 3,
    _point: null,
    _size: 0,

    initialize: function(canvas, opt) {
      opt = opt || {};

      this.canvas = canvas;
      this.width = opt.width || canvas.freeDrawingBrush.width;
      this.color = opt.color || canvas.freeDrawingBrush.color;
      this.opacity = opt.opacity || canvas.contextTop.globalAlpha;
      this._point = new fabric.Point();

      this.canvas.contextTop.lineJoin = 'round';
      this.canvas.contextTop.lineCap = 'round';
    },

    changeColor: function(color) {
      this.color = color;
    },

    changeOpacity: function(value) {
      this.opacity = value;
    },

    _render: function(pointer) {
      var ctx, lineWidthDiff, i;

      ctx = this.canvas.contextTop;

      ctx.beginPath();

      for(i = 0, len = (this._size / this._lineWidth) / 2; i < len; i++) {
        lineWidthDiff = (this._lineWidth - 1) * i;

        ctx.globalAlpha = 0.8 * this.opacity;
        ctx.moveTo(this._lastPoint.x + lineWidthDiff, this._lastPoint.y + lineWidthDiff);
        ctx.lineTo(pointer.x + lineWidthDiff, pointer.y + lineWidthDiff);
        ctx.stroke();
      }

      this._lastPoint = new fabric.Point(pointer.x, pointer.y);
    },

    onMouseDown: function(pointer) {
      this._lastPoint = pointer;
      this.canvas.contextTop.strokeStyle = this.color;
      this.canvas.contextTop.lineWidth = this._lineWidth;
      this._size = this.width + this._baseWidth;
    },

    onMouseMove: function(pointer) {
      if (this.canvas._isCurrentlyDrawing) {
        this._render(pointer);
      }
    },

    onMouseUp: function() {
      this.canvas.contextTop.globalAlpha = this.opacity;
    }
  });

})(fabric);

},{}],5:[function(require,module,exports){
/**
* SprayBrush class
* @class fabric.SprayBrush
* @extends fabric.BaseBrush
*/
(function(fabric){

  fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {

    color: "#000000",
    opacity: 1,
    width: 30,

    _baseWidth: 40,
    _drips: [],
    _dripThreshold: 15,
    _inkAmount: 0,
    _interval: 20,
    _lastPoint: null,
    _point: null,
    _strokeId: 0,
    brush: null,
    sprayBrushDataUrl: "data:image/png;base64,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",

    initialize: function(canvas, opt) {
      var context = this;
      opt = opt || {};

      this.canvas = canvas;
      this.width = opt.width || canvas.freeDrawingBrush.width;
      this.opacity = opt.opacity || canvas.contextTop.globalAlpha;
      this.color = opt.color || canvas.freeDrawingBrush.color;

      this.canvas.contextTop.lineJoin = "round";
      this.canvas.contextTop.lineCap = "round";

      this._reset();

      fabric.Image.fromURL(this.sprayBrushDataUrl, function(brush) {
        context.brush = brush;
        context.brush.filters = [];
        context.changeColor(context.color || this.color);
      }, { crossOrigin: "anonymous" });
    },

    changeColor: function(color) {
      this.color = color;
      this.brush.filters[0] = new fabric.Image.filters.Tint({ color: color });
      this.brush.applyFilters(this.canvas.renderAll.bind(this.canvas));
    },

    changeOpacity: function(value) {
      this.opacity = value;
      this.canvas.contextTop.globalAlpha = value;
    },

    onMouseDown: function(pointer) {
      this._point = new fabric.Point(pointer.x, pointer.y);
      this._lastPoint = this._point;

      this.size = this.width + this._baseWidth;
      this._strokeId = +new Date();
      this._inkAmount = 0;

      this.changeColor(this.color);
      this._render();
    },

    onMouseMove: function(pointer) {
      this._lastPoint = this._point;
      this._point = new fabric.Point(pointer.x, pointer.y);
    },

    onMouseUp: function(pointer) {
    },

    _render: function() {
      var context = this;

      setTimeout(draw, this._interval);

      function draw() {
        var point, distance, angle, amount, x, y;

        point = new fabric.Point(context._point.x || 0, context._point.y || 0);
        distance = point.distanceFrom(context._lastPoint);
        angle = point.angleBetween(context._lastPoint);
        amount = (100 / context.size) / (Math.pow(distance, 2) + 1);

        context._inkAmount += amount;
        context._inkAmount = Math.max(context._inkAmount - distance / 10, 0);
        if (context._inkAmount > context._dripThreshold) {
          context._drips.push(new fabric.Drip(context.canvas.contextTop, point, context._inkAmount / 2, context.color, context._strokeId));
          context._inkAmount = 0;
        }

        x = context._lastPoint.x + Math.sin(angle) - context.size / 2;
        y = context._lastPoint.y + Math.cos(angle) - context.size / 2;
        context.canvas.contextTop.drawImage(context.brush._element, x, y, context.size, context.size);

        if (context.canvas._isCurrentlyDrawing) {
          setTimeout(draw, context._interval);
        } else {
          context._reset();
        }
      }
    },

    _reset: function() {
      this._drips.length = 0;
      this._point = null;
      this._lastPoint = null;
    }
  });

})(fabric);

},{}],6:[function(require,module,exports){
/**
 * Stroke class
 * @class fabric.Stroke
 * @extends fabric.Object
 */
(function(fabric) {

  fabric.Stroke = fabric.util.createClass(fabric.Object,{
    color: null,
    inkAmount: null,
    lineWidth: null,
    _point: null,
    _lastPoint: null,
    _currentLineWidth: null,

    initialize: function(ctx, pointer, range, color, lineWidth, inkAmount){

      var rx = fabric.util.getRandom(range),
      c = fabric.util.getRandom(Math.PI * 2),
      c0 = fabric.util.getRandom(Math.PI * 2),
      x0 = rx * Math.sin(c0),
      y0 = rx / 2 * Math.cos(c0),
      cos = Math.cos(c),
      sin = Math.sin(c);

      this.ctx = ctx;
      this.color = color;
      this._point = new fabric.Point(pointer.x + x0 * cos - y0 * sin, pointer.y + x0 * sin + y0 * cos);
      this.lineWidth = lineWidth;
      this.inkAmount = inkAmount;
      this._currentLineWidth = lineWidth;

      ctx.lineCap = "round";
    },

    update: function(pointer, subtractPoint, distance) {
      this._lastPoint = fabric.util.object.clone(this._point);
      this._point = this._point.addEquals({ x: subtractPoint.x, y: subtractPoint.y });

      var n = this.inkAmount / (distance + 1);
      var per = (n > 0.3 ? 0.2 : n < 0 ? 0 : n);
      this._currentLineWidth = this.lineWidth * per;
    },

    draw: function(){
      var ctx = this.ctx;
      ctx.save();
      this.line(ctx, this._lastPoint, this._point, this.color, this._currentLineWidth);
      ctx.restore();
    },

    line: function(ctx, point1, point2, color, lineWidth) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(point2.x, point2.y);

      ctx.stroke();
    }
  });

})(fabric);

},{}],7:[function(require,module,exports){
(function(fabric) {

  fabric.Point.prototype.angleBetween = function(that){
    return Math.atan2( this.x - that.x, this.y - that.y);
  };

  fabric.Point.prototype.normalize = function(thickness) {
    if (null === thickness || undefined === thickness) {
      thickness = 1;
    }

    var length = this.distanceFrom({ x: 0, y: 0 });

    if (length > 0) {
      this.x = this.x / length * thickness;
      this.y = this.y / length * thickness;
    }

    return this;
  };

})(fabric);
},{}],8:[function(require,module,exports){
(function(fabric){

  fabric.util.getRandom = function(max, min){
    min = min ? min : 0;
    return Math.random() * ((max ? max : 1) - min) + min;
  };

  fabric.util.clamp = function (n, max, min) {
    if (typeof min !== 'number') min = 0;
    return n > max ? max : n < min ? min : n;
  };

})(fabric);
},{}]},{},[1,2,3,4,5,6,7,8]);
