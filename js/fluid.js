var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*------------------------------*\
|* Fluid
\*------------------------------*/

// Formula for updating the wave was taken from
// http://jsfiddle.net/phil_mcc/sXmpD/8/#run
// Also see: https://gamedev.stackexchange.com/a/45247

// And another example of the spring motion:
// https://codepen.io/jscottsmith/pen/dRyRWZ

// Resolution of simulation
var NUM_POINTS = 50;
// Spring constant for forces applied by adjacent points
var SPRING_CONSTANT = 0.1;
// Sprint constant for force applied to baseline
var SPRING_CONSTANT_BASELINE = 0.005;
// Damping to apply to speed changes
var DAMPING = 0.89;
// Mass of each point
var POINT_MASS = 1;
// Draw points
var SHOW_VERTS = false;
// Draw radius for wave points
var POINT_RADIUS = 4;
// Number of points to affect when interacting
var INTERACTIVE_SPREAD = Math.ceil(NUM_POINTS / 4);
// Mouse Interactive Power
var MOUSE_POW = 0.002;

/*------------------------------*\
|* Main Canvas
\*------------------------------*/

var Canvas = function () {
    function Canvas() {
        _classCallCheck(this, Canvas);

        // setup a canvas
        this.canvas = document.getElementById('canvas');
        this.dpr = window.devicePixelRatio || 1;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(this.dpr, this.dpr);

        this.mouse = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            mousedown: false,
            power: 15 // initial wave power for demo purpose, resets to 1 in loop
        };

        this.setCanvasSize = this.setCanvasSize.bind(this);
        this.handleMousedown = this.handleMousedown.bind(this);
        this.handleMouseup = this.handleMouseup.bind(this);
        this.handleMouse = this.handleMouse.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.render = this.render.bind(this);

        this.setCanvasSize();
        this.setupListeners();

        this.constructWave();

        this.triggerWave(this.canvas.width, this.canvas.height * 1.4);
        this.triggerWave(this.canvas.width / 8, 0);

        this.tick = 0;
        this.render();
    }

    _createClass(Canvas, [{
        key: 'constructWave',
        value: function constructWave() {
            var padding = 60 * this.dpr;
            var points = NUM_POINTS;

            var y = this.canvas.height / 2;

            var p1 = new Point(0, y);

            var p2 = new Point(this.canvas.width, y);

            this.wave = new Wave(points, p1, p2);
        }
    }, {
        key: 'setupListeners',
        value: function setupListeners() {
            window.addEventListener('resize', this.setCanvasSize);
            window.addEventListener('mousedown', this.handleMousedown);
            window.addEventListener('mouseup', this.handleMouseup);
            window.addEventListener('mousemove', this.handleMouse);
            window.addEventListener('click', this.handleClick);
        }
    }, {
        key: 'handleClick',
        value: function handleClick(event) {
            // const x = event.clientX * this.dpr;
            // const y = event.clientY * this.dpr;
            // this.mouse.x = x;
            // this.mouse.y = y;
        }
    }, {
        key: 'handleMousedown',
        value: function handleMousedown(event) {
            this.mouse.mousedown = true;
        }
    }, {
        key: 'handleMouseup',
        value: function handleMouseup(event) {
            this.mouse.mousedown = false;
        }
    }, {
        key: 'handleMouse',
        value: function handleMouse(event) {
            var x = event.clientX * this.dpr;
            var y = event.clientY * this.dpr;
            this.mouse.x = x;
            this.mouse.y = y;
        }
    }, {
        key: 'updateWavePower',
        value: function updateWavePower() {
            var max = 10;
            var mouse = this.mouse;

            if (mouse.mousedown && mouse.power > max) {
                mouse.power = max;
                console.log(max);
            } else if (mouse.mousedown) {
                mouse.power += 0.1;
            } else {
                mouse.power = 1;
            }
        }
    }, {
        key: 'triggerWave',
        value: function triggerWave(x, y) {

            var closestPoint = {};
            var closestDistance = -1;

            var points = this.wave.points;
            var idx = 0;

            // Gets the closest point to the x coordinates
            for (var n = 0; n < points.length; n++) {
                var p = points[n];
                var distance = Math.abs(x - p.x);

                if (closestDistance === -1) {
                    closestPoint = p;
                    closestDistance = distance;
                    idx = n;
                } else if (distance <= closestDistance) {
                    closestPoint = p;
                    closestDistance = distance;
                    idx = n;
                }
            }

            var halfHeight = this.canvas.height / 2;
            var dy = y - halfHeight; // delta y from baseline

            var spread = INTERACTIVE_SPREAD; // number of points to affect from closest point
            var mod = (idx - spread) % points.length; // modulus
            var start = mod < 0 ? points.length + mod : mod; // starting idx accounting for negatives
            var length = spread * 2 + 1; // number of points total 

            var rad = 0; // start radian
            var radInc = Math.PI / length; // radians bases on total length

            // updates the wave points at the start index applying a sin wave 
            // so that it's peak is centered on the mouse
            for (var _n = 0; _n < length; _n++) {
                var i = (start + _n) % points.length;
                var point = points[i];
                var pow = Math.sin(rad) * dy * MOUSE_POW * this.mouse.power; // power determined by delta y from baseline
                point.vy += pow;
                // inc radians for sin
                rad += radInc;
            }
        }
    }, {
        key: 'setCanvasSize',
        value: function setCanvasSize() {
            this.canvas.width = window.innerWidth * this.dpr;
            this.canvas.height = window.innerHeight * this.dpr;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';

            this.constructWave();
        }
    }, {
        key: 'drawBackground',
        value: function drawBackground() {
            var gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            gradient.addColorStop(0, '#beb1ed');
            gradient.addColorStop(1, '#ea839b');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }, {
        key: 'drawText',
        value: function drawText() {
            var c7 = this.canvas.width / 7;
            var max = 200 * this.dpr;
            var size1 = c7 > max ? max : c7;
            this.ctx.font = 'bold ' + size1 + 'px Futura';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('Kyle', this.canvas.width / 2, this.canvas.height / 2 + size1 / 3);

            var size2 = 24 * this.dpr;
            this.ctx.font = 'bold ' + size2 + 'px Futura';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#09203f';
            this.ctx.fillText('Lets make waves.', this.canvas.width / 2, this.canvas.height / 4 + size2 / 3);

            var size3 = 12 * this.dpr;
            this.ctx.font = 'normal ' + size3 + 'px Futura';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#f2e6ef';
            this.ctx.fillText('(Click and hold to interact)', this.canvas.width / 2, this.canvas.height / 3.5 + size3 / 3);
        }
    }, {
        key: 'drawCurve',
        value: function drawCurve() {
            this.ctx.lineCap = 'round';
            this.ctx.lineWidth = 3 * this.dpr;
            this.ctx.strokeStyle = '#b224ef';

            // handy ref for getting the max or min value of an array
            // https://stackoverflow.com/a/4020842
            var highestPoint = Math.min.apply(Math, this.wave.points.map(function (o) {
                return o.y;
            }));

            var gradient = this.ctx.createLinearGradient(0, highestPoint, 20, this.canvas.height + highestPoint / 4);
            gradient.addColorStop(0, 'rgba(124, 231, 249, 0.7)');
            gradient.addColorStop(0.5, 'rgba(72, 197, 239, 0.8)');
            gradient.addColorStop(1, '#1380b2');
            this.ctx.fillStyle = gradient;

            this.ctx.beginPath();
            this.ctx.moveTo(this.wave.points[0].x, this.wave.points[0].y);

            for (var n = 0; n < this.wave.points.length - 1; n++) {

                var p1 = this.wave.points[n];
                var p2 = this.wave.points[n + 1];

                var cpx = (p1.x + p2.x) / 2;
                var cpy = (p1.y + p2.y) / 2;

                if (n === this.wave.points.length - 2) {
                    this.ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
                } else {
                    this.ctx.quadraticCurveTo(p1.x, p1.y, cpx, cpy);
                }
            }

            this.ctx.lineTo(this.canvas.width, this.canvas.height);

            this.ctx.lineTo(0, this.canvas.height);

            this.ctx.closePath();
            this.ctx.fill();
        }
    }, {
        key: 'drawVerts',
        value: function drawVerts() {
            var _this = this;

            this.ctx.lineWidth = 2 * this.dpr;
            this.ctx.strokeStyle = '#009efd';

            this.wave.points.forEach(function (p) {
                _this.ctx.beginPath();
                _this.ctx.arc(p.x, p.y, POINT_RADIUS * _this.dpr, 0, Math.PI * 2, true);
                _this.ctx.closePath();
                _this.ctx.fill();
                _this.ctx.stroke();
            });
        }
    }, {
        key: 'drawMouse',
        value: function drawMouse() {
            this.ctx.lineWidth = 2 * this.dpr;

            if (this.mouse.mousedown) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.strokeStyle = '#537895';
                this.ctx.beginPath();
                this.ctx.arc(this.mouse.x, this.mouse.y, 16 * this.dpr * this.mouse.power, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
            }

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.strokeStyle = this.mouse.mousedown ? '#ed6ea0' : '#537895';

            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 16 * this.dpr, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.mouse.mousedown && this.ctx.fill();
            this.ctx.stroke();
        }
    }, {
        key: 'updateWave',
        value: function updateWave() {
            // http://jsfiddle.net/phil_mcc/sXmpD/8/#run
            // https://gamedev.stackexchange.com/a/45247

            var points = this.wave.points;

            for (var n = 0; n < points.length; n++) {
                var p = points[n];

                // force to apply to this point
                var force = 0;

                // forces caused by the point immediately to the left or the right
                var forceFromLeft = void 0;
                var forceFromRight = void 0;

                if (n === 0) {
                    // wrap to left-to-right
                    var _dy = points[points.length - 1].y - p.y;
                    forceFromLeft = SPRING_CONSTANT * _dy;
                } else {
                    // normally
                    var _dy2 = points[n - 1].y - p.y;
                    forceFromLeft = SPRING_CONSTANT * _dy2;
                }
                if (n === points.length - 1) {
                    // wrap to right-to-left
                    var _dy3 = points[0].y - p.y;
                    forceFromRight = SPRING_CONSTANT * _dy3;
                } else {
                    // normally
                    var _dy4 = points[n + 1].y - p.y;
                    forceFromRight = SPRING_CONSTANT * _dy4;
                }

                // Also apply force toward the baseline
                var dy = this.canvas.height / 2 - p.y;
                var forceToBaseline = SPRING_CONSTANT_BASELINE * dy;

                // Sum up forces
                force = force + forceFromLeft;
                force = force + forceFromRight;
                force = force + forceToBaseline;

                // Calculate acceleration
                var acceleration = force / p.mass;

                // Apply acceleration (with damping)
                p.vy = DAMPING * p.vy + acceleration;

                // Apply speed
                p.y = p.y + p.vy;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            this.drawBackground();
            this.drawText();
            this.drawCurve();
            SHOW_VERTS && this.drawVerts();
            this.drawMouse();

            // Trigger on mousedown
            if (this.mouse.mousedown) {
                var _mouse = this.mouse,
                    x = _mouse.x,
                    y = _mouse.y;

                this.triggerWave(x, y);
            }

            this.updateWavePower();
            this.updateWave();

            this.tick++;

            window.requestAnimationFrame(this.render);
        }
    }]);

    return Canvas;
}();

/*------------------------------*\
|* Wave
\*------------------------------*/

var Wave = function Wave(points, p1, p2) {
    _classCallCheck(this, Wave);

    this.p1 = p1;
    this.p2 = p2;

    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;

    var vx = dx / (points - 1);
    var vy = dy / (points - 1);

    this.points = new Array(points).fill(null).map(function (p, i) {
        return new Point(p1.x + vx * i, p1.y + vy * i);
    });
};

/*------------------------------*\
|* Point
\*------------------------------*/

var Point = function () {
    function Point() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;

        this.vy = 0;
        this.vx = 0;

        this.mass = POINT_MASS;
    }

    _createClass(Point, [{
        key: 'moveTo',
        value: function moveTo() {
            this.x = arguments.length <= 0 ? undefined : arguments[0];
            this.y = arguments.length <= 1 ? undefined : arguments[1];
        }
    }, {
        key: 'position',
        get: function get() {
            return {
                x: this.x,
                y: this.y
            };
        }
    }]);

    return Point;
}();

new Canvas();