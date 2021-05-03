'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Open the following test webstrate for visual tests of transformer.js
 * {@link http://zaxxon.cs.au.dk/transformer-tests}
 */
;
(function (exports) {

    // Module object holding private variables.
    var module = {};

    console.warn('The transformer.js library is very much in flux. Do not use this API if you are not willing to adjust your code to the yet frequently changing Transformer API! Sk\xE5l!');

    Number.prototype.toFixedNumber = function (x, base) {
        var pow = Math.pow(base || 10, x);
        return +(Math.round(this * pow) / pow);
    };

    /**
        * Polyfill for requestAnimationFrame.
        * 
        * @memberOf TransformStack
        */
    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

        if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    })();

    /**
        * A simple point class.
        * 
        * @class Point
        */

    var Point = function () {

        /**
               * Creates an instance of Point.
               * 
               * @param {any} x The x value.
               * @param {any} y The y value.
               * 
               * @memberOf Point
               */
        function Point(x, y) {
            _classCallCheck(this, Point);

            this.x = x;
            this.y = y;
        }

        /**
               * Returns the string representation of the point.
               * 
               * @returns The string representation of the point.
               * 
               * @memberOf Point
               */


        _createClass(Point, [{
            key: 'toString',
            value: function toString() {
                return Point.name + ' [x=' + this.x + ',y=' + this.y + ']';
            }
        }]);

        return Point;
    }();

    /**
        * The matrix class provides convenient functions for affine transformations, e.g., translate, rotate, and
        * scale. It also offers functions like matrix multiplication or creating an inverse matrix.
        * 
        * @class Matrix
        */


    var Matrix = function () {

        /**
               * Creates an instance of Matrix. The matrix needs to be a two-dimensional array. The first index will
               * be rows and the second index will be columns. The array needs to be in a n x m format. For example,
               * an array [[1, 2, 3], [4, 5, 6], [7, 8 ,9]] will result in the following matrix:
               * 
               * 1   2   3
               * 4   5   6
               * 7   8   9
               * 
               * @param {any} M A two-dimensional array.
               * 
               * @memberOf Matrix
               */
        function Matrix(M) {
            _classCallCheck(this, Matrix);

            if (typeof M === 'undefined' || !Array.isArray(M)) {
                throw new Error('first parameter needs to be a two-dimensional array');
            }
            this.matrix = M;
        }

        /**
               * Sets the matrix. The matrix needs to be a two-dimensional array. The first index will be rows and
               * the second index will be columns. The array needs to be in a n x m format.
               * 
               * @memberOf Matrix
               */


        _createClass(Matrix, [{
            key: 'translate',


            /**
                   * Translates the matrix by tx and ty.
                   * 
                   * @param {Number} tx The translation value in x.
                   * @param {Number} ty The translation value in y.
                   * 
                   * @memberOf Matrix
                   */
            value: function translate(tx, ty) {
                var truncate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

                var M = this.multiply(new Matrix([[1, 0, tx], [0, 1, ty], [0, 0, 1]]), truncate).matrix;

                this.matrix = M;
            }

            /**
                   * Rotates the matrix by angle. The rotation value has to be in degrees.
                   * 
                   * @param {Number} angle The rotation value in degrees.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'rotate',
            value: function rotate(angle) {
                var truncate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                var rad = angle * (Math.PI / 180);
                var costheta = Math.cos(rad);
                var sintheta = Math.sin(rad);

                var M = this.multiply(new Matrix([[costheta, -sintheta, 0], [sintheta, costheta, 0], [0, 0, 1]]), truncate).matrix;

                this.matrix = M;
            }

            /**
                   * Scales the matrix by sx and sy.
                   * 
                   * @param {Number} sx The scale value in x.
                   * @param {Number} sy The scale value in y.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'scale',
            value: function scale(sx, sy) {
                var truncate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

                var M = this.multiply(new Matrix([[sx, 0, 0], [0, sy, 0], [0, 0, 1]]), truncate).matrix;

                this.matrix = M;
            }

            /**
                   * Skwes the matrix in degX and degY.
                   * 
                   * @param {Number} degX The skew value in x in degrees.
                   * @param {Number} degY The skew value in y in degrees.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'skew',
            value: function skew(degX, degY) {
                var truncate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

                var radX = degX * (Math.PI / 180);
                var radY = degY * (Math.PI / 180);
                var x = Math.tan(radX);
                var y = Math.tan(radY);

                var M = this.multiply(new Matrix([[1, x, 0], [y, 1, 0], [0, 0, 1]]), truncate).matrix;

                this.matrix = M;
            }

            /**
                   * Multiplies a given matrix with this matrix and returns the result as new matrix instance. In order
                   * to perform the matrix multiplication, rows of matrix M1 need to match columns of matrix M2 as well
                   * as columns of matrix M1 need to match rows of matrix M2.
                   * 
                   * @param {any} M The matrix used to multiply with this matrix.
                   * @returns The multipied matrix.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'multiply',
            value: function multiply(M) {
                var truncate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


                if (this.rows !== M.columns || this.columns !== M.rows) {
                    throw new Error('cannot multiply because matrix dimensions do not match (n*m !== m*n)');
                }

                var m = [];
                var m1 = this.matrix;
                var m2 = M.matrix;
                for (var i = 0; i < m1.length; i++) {
                    m[i] = [];
                    for (var j = 0; j < m2[0].length; j++) {
                        var sum = 0;
                        for (var k = 0; k < m1[0].length; k++) {
                            sum += m1[i][k] * m2[k][j];
                        }
                        // m[i][j] = sum;
                        m[i][j] = truncate ? parseFloat(sum.toFixed(3)) : sum;
                    }
                }

                return new Matrix(m);
            }

            /**
                   * Multiplies this matrix by the given matrix and replaces this matrix by the resulting matrix.
                   * 
                   * @param {any} The matrix used to multiply with this matrix.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'multiplyBy',
            value: function multiplyBy(M) {
                // const m = this.multiply(M).matrix;
                var m = M.multiply(this).matrix;
                this.matrix = m;
            }

            /**
                   * Creates a copy of the matrix.
                   * 
                   * @returns The copy of this matrix.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'copy',
            value: function copy() {
                var m = this.matrix;
                var copyM = JSON.parse(JSON.stringify(m));
                return new Matrix(copyM);
            }

            /**
                   * Returns the inverse matrix of this matrix.
                   * 
                   * http://blog.acipo.com/matrix-inversion-in-javascript/
                   * 
                   * @readonly
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'toJSON',
            value: function toJSON() {
                return JSON.stringify(this.matrix);
            }
        }, {
            key: 'toCss',


            /**
                   * Converts the matrix to a CSS matrix transform. It respects whether the matrix should be a
                   * CSS matrix() or CSS matrix3d().
                   * 
                   * @returns The CSS transform.
                   * 
                   * @memberOf Matrix
                   */
            value: function toCss() {
                var fixed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


                var M = this.matrix;

                var getFixedValue = function getFixedValue(row, column) {
                    if (fixed) {
                        return parseFloat(M[row][column].toFixed(3));
                    }
                    return M[row][column];
                };

                if (this.rows === 3 && this.columns === 3) {
                    if (this.equals(Matrix.identity(3))) {
                        return "none";
                    }

                    var a = getFixedValue(0, 0);
                    var b = getFixedValue(1, 0);
                    var c = getFixedValue(0, 1);
                    var d = getFixedValue(1, 1);
                    var tx = getFixedValue(0, 2);
                    var ty = getFixedValue(1, 2);

                    return 'matrix(' + a + ', ' + b + ', ' + c + ', ' + d + ', ' + tx + ', ' + ty + ')';
                }

                if (this.equals(Matrix.identity(4))) {
                    return "none";
                }

                var a1 = getFixedValue(0, 0);
                var b1 = getFixedValue(1, 0);
                var c1 = getFixedValue(2, 0);
                var d1 = getFixedValue(3, 0);
                var a2 = getFixedValue(0, 1);
                var b2 = getFixedValue(1, 1);
                var c2 = getFixedValue(2, 1);
                var d2 = getFixedValue(3, 1);
                var a3 = getFixedValue(0, 2);
                var b3 = getFixedValue(1, 2);
                var c3 = getFixedValue(2, 2);
                var d3 = getFixedValue(3, 2);
                var a4 = getFixedValue(0, 3);
                var b4 = getFixedValue(1, 3);
                var c4 = getFixedValue(2, 3);
                var d4 = getFixedValue(3, 3);

                return 'matrix3d(' + a1 + ', ' + b1 + ', ' + c1 + ', ' + d1 + ', ' + a2 + ', ' + b2 + ', ' + c2 + ', ' + d2 + ', ' + a3 + ', ' + b3 + ', ' + c3 + ', ' + d3 + ', ' + a4 + ', ' + b4 + ', ' + c4 + ', ' + d4 + ')';
            }

            /**
                   * Returns true if matrix M equals to this matrix.
                   * 
                   * @param {any} M A matrix to compare to.
                   * @returns True if this matrix and matrix M are equal.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'equals',
            value: function equals(M) {
                return Matrix.equals(this, M);
            }

            /**
                   * Returns true if both matrix have the same matrix values, false otherwise.
                   * 
                   * @static
                   * @param {any} M1 Matrix 1.
                   * @param {any} M2 Matrix 2.
                   * @returns True if matrix M1 and M2 are equal.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'toString',


            /**
                   * Returns the matrix in a human readable format. 
                   * 
                   * @returns The matrix in string format.
                   * 
                   * @memberOf Matrix
                   */
            value: function toString() {
                return 'Matrix [rows=' + this.rows + ',columns=' + this.columns + ',matrix=' + JSON.stringify(this.matrix) + ']';
            }
        }, {
            key: 'matrix',
            set: function set(matrix) {
                this._matrix = matrix;
                this._rows = matrix.length;
                this._columns = matrix[0].length;
            }

            /**
                   * Returns the matrix as a two-dimensional array.
                   * 
                   * @memberOf Matrix
                   */
            ,
            get: function get() {
                return this._matrix;
            }

            /**
                   * Returns number of rows of matrix.
                   * 
                   * @readonly
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'rows',
            get: function get() {
                return this._rows;
            }

            /**
                   * Returns number of columns of matrix.
                   * 
                   * @readonly
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'columns',
            get: function get() {
                return this._columns;
            }
        }, {
            key: 'a',
            get: function get() {
                return this.matrix[0][0];
            }
        }, {
            key: 'b',
            get: function get() {
                return this.matrix[1][0];
            }
        }, {
            key: 'c',
            get: function get() {
                return this.matrix[0][1];
            }
        }, {
            key: 'd',
            get: function get() {
                return this.matrix[1][1];
            }
        }, {
            key: 'tx',
            get: function get() {
                return this.matrix[0][2];
            }
        }, {
            key: 'ty',
            get: function get() {
                return this.matrix[1][2];
            }
        }, {
            key: 'angle',
            get: function get() {
                var rad = Math.atan2(this.b, this.a);
                return rad * 180 / Math.PI;
            }
        }, {
            key: 'scaleX',
            get: function get() {
                return this.a;
            }
        }, {
            key: 'scaleY',
            get: function get() {
                return this.d;
            }
        }, {
            key: 'inverse',
            get: function get() {
                // I use Guassian Elimination to calculate the inverse:
                // (1) 'augment' the matrix (left) by the identity (on the right)
                // (2) Turn the matrix on the left into the identity by elemetry row ops
                // (3) The matrix on the right is the inverse (was the identity matrix)
                // There are 3 elemtary row ops: (I combine b and c in my code)
                // (a) Swap 2 rows
                // (b) Multiply a row by a scalar
                // (c) Add 2 rows

                var M = this.matrix;

                //if the matrix isn't square: exit (error)
                if (M.length !== M[0].length) {
                    throw new Error('matrix is not squared');
                }

                //create the identity matrix (I), and a copy (C) of the original
                var i = 0,
                    ii = 0,
                    j = 0,
                    dim = M.length,
                    e = 0,
                    t = 0;
                var I = [],
                    C = [];
                for (i = 0; i < dim; i += 1) {
                    // Create the row
                    I[I.length] = [];
                    C[C.length] = [];
                    for (j = 0; j < dim; j += 1) {

                        //if we're on the diagonal, put a 1 (for identity)
                        if (i == j) {
                            I[i][j] = 1;
                        } else {
                            I[i][j] = 0;
                        }

                        // Also, make the copy of the original
                        C[i][j] = M[i][j];
                    }
                }

                // Perform elementary row operations
                for (i = 0; i < dim; i += 1) {
                    // get the element e on the diagonal
                    e = C[i][i];

                    // if we have a 0 on the diagonal (we'll need to swap with a lower row)
                    if (e == 0) {
                        //look through every row below the i'th row
                        for (ii = i + 1; ii < dim; ii += 1) {
                            //if the ii'th row has a non-0 in the i'th col
                            if (C[ii][i] != 0) {
                                //it would make the diagonal have a non-0 so swap it
                                for (j = 0; j < dim; j++) {
                                    e = C[i][j]; //temp store i'th row
                                    C[i][j] = C[ii][j]; //replace i'th row by ii'th
                                    C[ii][j] = e; //repace ii'th by temp
                                    e = I[i][j]; //temp store i'th row
                                    I[i][j] = I[ii][j]; //replace i'th row by ii'th
                                    I[ii][j] = e; //repace ii'th by temp
                                }
                                //don't bother checking other rows since we've swapped
                                break;
                            }
                        }
                        //get the new diagonal
                        e = C[i][i];
                        //if it's still 0, not invertable (error)
                        if (e == 0) {
                            throw new Error('matrix is not invertable');
                        }
                    }

                    // Scale this row down by e (so we have a 1 on the diagonal)
                    for (j = 0; j < dim; j++) {
                        C[i][j] = C[i][j] / e; //apply to original matrix
                        I[i][j] = I[i][j] / e; //apply to identity
                    }

                    // Subtract this row (scaled appropriately for each row) from ALL of
                    // the other rows so that there will be 0's in this column in the
                    // rows above and below this one
                    for (ii = 0; ii < dim; ii++) {
                        // Only apply to other rows (we want a 1 on the diagonal)
                        if (ii == i) {
                            continue;
                        }

                        // We want to change this element to 0
                        e = C[ii][i];

                        // Subtract (the row above(or below) scaled by e) from (the
                        // current row) but start at the i'th column and assume all the
                        // stuff left of diagonal is 0 (which it should be if we made this
                        // algorithm correctly)
                        for (j = 0; j < dim; j++) {
                            C[ii][j] -= e * C[i][j]; //apply to original matrix
                            I[ii][j] -= e * I[i][j]; //apply to identity
                        }
                    }
                }

                //we've done all operations, C should be the identity
                //matrix I should be the inverse:
                return new Matrix(I);
            }
        }], [{
            key: 'fromJSON',
            value: function fromJSON(json) {
                var matrix = JSON.parse(json);
                return new Matrix(matrix);
            }
        }, {
            key: 'equals',
            value: function equals(M1, M2) {
                return JSON.stringify(M1.matrix) === JSON.stringify(M2.matrix);
            }

            /**
                   * Creates an n x n identity matrix.
                   * 
                   * @static
                   * @param {any} n The number of rows and columns to create this n x n identity matrix.
                   * @returns The identity matrix.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'identity',
            value: function identity(n) {

                var m = [];
                for (var row = 0; row < n; row++) {
                    var mRow = m[row] = [];

                    for (var col = 0; col < n; col++) {
                        mRow[col] = col === row ? 1 : 0;
                    }
                }

                return new Matrix(m);
            }

            /**
                   * Creates a matrix from a DOM element (e.g., a HTMLElement or a SVGElement).
                   * 
                   * @static
                   * @param {any} element A DOM element from which the matrix is created from.
                   * @returns The matrix.
                   * 
                   * @memberOf Matrix
                   */

        }, {
            key: 'from',
            value: function from(element) {

                var rawTransform = "none";

                if (element instanceof SVGElement) {
                    rawTransform = element.getAttribute("transform");

                    // SAFARI does not return a proper transform with window.getComputedStyle for SVGElement.
                    // TODO This is a nasty workaround.
                    if (!rawTransform || rawTransform === "") {
                        rawTransform = element.style.transform;
                    }
                } else if (element.nodeType === 1) {
                    rawTransform = window.getComputedStyle(element).transform;
                }

                if (rawTransform === "" || rawTransform === "none") {
                    return Matrix.identity(3);
                } else {
                    var regEx = /([-+]?[\d\.]+)/g;

                    // console.log('rawTransform %o', rawTransform);

                    if (rawTransform.indexOf("matrix3d") > -1) {
                        // throw new Error(`matrix3d transformation not yet supported`);

                        // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d
                        var a1 = parseFloat(regEx.exec(rawTransform)[0]);
                        var b1 = parseFloat(regEx.exec(rawTransform)[0]);
                        var c1 = parseFloat(regEx.exec(rawTransform)[0]);
                        var d1 = parseFloat(regEx.exec(rawTransform)[0]);
                        var a2 = parseFloat(regEx.exec(rawTransform)[0]);
                        var b2 = parseFloat(regEx.exec(rawTransform)[0]);
                        var c2 = parseFloat(regEx.exec(rawTransform)[0]);
                        var d2 = parseFloat(regEx.exec(rawTransform)[0]);
                        var a3 = parseFloat(regEx.exec(rawTransform)[0]);
                        var b3 = parseFloat(regEx.exec(rawTransform)[0]);
                        var c3 = parseFloat(regEx.exec(rawTransform)[0]);
                        var d3 = parseFloat(regEx.exec(rawTransform)[0]);
                        var a4 = parseFloat(regEx.exec(rawTransform)[0]);
                        var b4 = parseFloat(regEx.exec(rawTransform)[0]);
                        var c4 = parseFloat(regEx.exec(rawTransform)[0]);
                        var d4 = parseFloat(regEx.exec(rawTransform)[0]);

                        return new Matrix([[a1, a2, a3, a4], [b1, b2, b3, b4], [c1, c2, c3, c4], [d1, d2, d3, d4]]);
                    } else {

                        // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
                        var a = parseFloat(regEx.exec(rawTransform)[0]);
                        var b = parseFloat(regEx.exec(rawTransform)[0]);
                        var c = parseFloat(regEx.exec(rawTransform)[0]);
                        var d = parseFloat(regEx.exec(rawTransform)[0]);
                        var tx = parseFloat(regEx.exec(rawTransform)[0]);
                        var ty = parseFloat(regEx.exec(rawTransform)[0]);

                        return new Matrix([[a, c, tx], [b, d, ty], [0, 0, 1]]);
                    }
                }
            }
        }]);

        return Matrix;
    }();

    /**
        * The base class for a transforms.
        * 
        * @class Transform
        */


    var Transform = function () {

        /**
               * Creates an instance of Transform. It will create an instance with a default identity matrix.
               * 
               * @memberOf Transform
               */
        function Transform() {
            _classCallCheck(this, Transform);

            this.matrix = Matrix.identity(3);
            this._centerPoint = new Point(0, 0);
        }

        _createClass(Transform, [{
            key: 'apply',


            /**
                   * Applies this transform to the matrix given as parameter.
                   * 
                   * @param {any} matrix The matrix to which this transform will be applied.
                   * 
                   * @memberOf Transform
                   */
            value: function apply(matrix) {
                var centerPointMatrix = Matrix.identity(3);
                centerPointMatrix.translate(this._centerPoint.x, this._centerPoint.y);

                matrix.multiplyBy(centerPointMatrix.inverse);
                matrix.multiplyBy(this.matrix);
                matrix.multiplyBy(centerPointMatrix);
            }

            /**
                   * Unapplies this transformation from the matrix given as paramter.
                   * 
                   * @param {any} matrix The matrix from which this transform will be unapplied.
                   * 
                   * @memberOf Transform
                   */

        }, {
            key: 'unapply',
            value: function unapply(matrix) {
                var centerPointMatrix = Matrix.identity(3);
                centerPointMatrix.translate(this._centerPoint.x, this._centerPoint.y);

                matrix.multiplyBy(centerPointMatrix.inverse);
                // console.log('matrix1 %o', this.matrix.toString());
                matrix.multiplyBy(this.matrix.inverse);
                // console.log('matrix2 %o', this.matrix.toString());
                matrix.multiplyBy(centerPointMatrix);
            }
        }, {
            key: 'reset',
            value: function reset() {
                this._centerPoint.x = 0;
                this._centerPoint.y = 0;
            }
        }, {
            key: 'centerPoint',
            get: function get() {
                return this._centerPoint;
            }
        }, {
            key: 'inverse',
            get: function get() {
                throw new Error('inverse not implemented for ' + this.constructor.name);
            }
        }], [{
            key: 'from',
            value: function from(matrix) {
                throw new Error('inverse not implemented for transform');
            }
        }]);

        return Transform;
    }();

    /**
        * The translate transform.
        * 
        * @class TranslateTransform
        * @extends {Transform}
        */


    var TranslateTransform = function (_Transform) {
        _inherits(TranslateTransform, _Transform);

        /**
               * Creates an instance of TranslateTransform. It will translate a matrix by tx and ty.
               * 
               * @param {any} tx The translate value in x.
               * @param {any} ty The translate value in y.
               * 
               * @memberOf TranslateTransform
               */
        function TranslateTransform() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            _classCallCheck(this, TranslateTransform);

            var _this = _possibleConstructorReturn(this, (TranslateTransform.__proto__ || Object.getPrototypeOf(TranslateTransform)).call(this));

            _this.set(x, y);
            return _this;
        }

        _createClass(TranslateTransform, [{
            key: 'set',
            value: function set(x, y) {
                this.x = x;
                this.y = y;

                this.matrix = new Matrix([[1, 0, x], [0, 1, y], [0, 0, 1]]);
            }
        }, {
            key: 'update',
            value: function update(matrix) {

                if (!(matrix instanceof Matrix)) {
                    throw new Error('matrix needs to be of type ' + Matrix.name);
                }

                var M = matrix;

                // http://math.stackexchange.com/questions/13150/extracting-rotation-scale-values-from-2d-transformation-matrix
                var tx = M.tx;
                var ty = M.ty;

                this.set(tx, ty);
            }

            /**
                   * Reset translate transform.
                   * 
                   * @memberOf TranslateTransform
                   */

        }, {
            key: 'reset',
            value: function reset() {
                this.set(0, 0);
                _get(TranslateTransform.prototype.__proto__ || Object.getPrototypeOf(TranslateTransform.prototype), 'reset', this).call(this);
            }
        }, {
            key: 'toString',
            value: function toString() {
                return this.constructor.name + ' [x=' + this.x + ',y=' + this.y + ']';
            }
        }, {
            key: 'inverse',
            get: function get() {
                return TranslateTransform.from(this.matrix.inverse);
            }
        }], [{
            key: 'from',
            value: function from(matrix) {
                var transform = new TranslateTransform();
                transform.update(matrix);
                return transform;
            }
        }]);

        return TranslateTransform;
    }(Transform);

    /**
        * The rotate transform.
        * 
        * @class RotateTransform
        * @extends {Transform}
        */


    var RotateTransform = function (_Transform2) {
        _inherits(RotateTransform, _Transform2);

        /**
               * Creates an instance of RotateTransform. It will rotate a matrix by an angle [in degrees].
               * 
               * @param {any} deg The rotate value in degrees.
               * 
               * @memberOf RotateTransform
               */
        function RotateTransform() {
            var angle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            _classCallCheck(this, RotateTransform);

            var _this2 = _possibleConstructorReturn(this, (RotateTransform.__proto__ || Object.getPrototypeOf(RotateTransform)).call(this));

            _this2.set(angle);
            return _this2;
        }

        _createClass(RotateTransform, [{
            key: 'set',
            value: function set(angle) {
                this.angle = angle;

                var rad = angle * (Math.PI / 180);
                var costheta = Math.cos(rad);
                var sintheta = Math.sin(rad);

                this.matrix = new Matrix([[costheta, -sintheta, 0], [sintheta, costheta, 0], [0, 0, 1]]);
            }
        }, {
            key: 'update',
            value: function update(matrix) {

                if (!(matrix instanceof Matrix)) {
                    throw new Error('matrix needs to be of type ' + Matrix.name);
                }

                var M = matrix;

                // http://math.stackexchange.com/questions/13150/extracting-rotation-scale-values-from-2d-transformation-matrix
                // const psi1 = Math.atan2(-M.b, M.a);
                // const psi2 = Math.atan2(M.c, M.d);

                // if (psi1 !== psi2) {
                //     throw new Error(`matrix error ${psi1} !== ${psi2}`);
                // }

                // const angle = (psi2 * 180) / Math.PI;

                var rad = Math.atan2(M.b, M.a);
                var angle = rad * 180 / Math.PI;

                this.set(angle);
            }

            /**
                   * Reset rotate transform.
                   * 
                   * @memberOf RotateTransform
                   */

        }, {
            key: 'reset',
            value: function reset() {
                this.set(0);
                _get(RotateTransform.prototype.__proto__ || Object.getPrototypeOf(RotateTransform.prototype), 'reset', this).call(this);
            }
        }, {
            key: 'toString',
            value: function toString() {
                return this.constructor.name + ' [angle=' + this.angle + ']';
            }
        }, {
            key: 'inverse',
            get: function get() {
                return RotateTransform.from(this.matrix.inverse);
            }
        }], [{
            key: 'from',
            value: function from(matrix) {
                var transform = new RotateTransform();
                transform.update(matrix);
                return transform;
            }
        }]);

        return RotateTransform;
    }(Transform);

    /**
        * The scale transform.
        * 
        * @class ScaleTransform
        * @extends {Transform}
        */


    var ScaleTransform = function (_Transform3) {
        _inherits(ScaleTransform, _Transform3);

        /**
               * Creates an instance of ScaleTransform. It will scale a matrix by x and y.
               * 
               * @param {any} x The scale factor in x.
               * @param {any} y The scale factor in y.
               * 
               * @memberOf ScaleTransform
               */
        function ScaleTransform() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;

            _classCallCheck(this, ScaleTransform);

            var _this3 = _possibleConstructorReturn(this, (ScaleTransform.__proto__ || Object.getPrototypeOf(ScaleTransform)).call(this));

            _this3.set(x, y);
            return _this3;
        }

        _createClass(ScaleTransform, [{
            key: 'set',
            value: function set(x, y) {
                this.x = x;
                this.y = y;

                this.matrix = new Matrix([[x, 0, 0], [0, y, 0], [0, 0, 1]]);
            }
        }, {
            key: 'update',
            value: function update(matrix) {

                if (!(matrix instanceof Matrix)) {
                    throw new Error('matrix needs to be of type ' + Matrix.name);
                }

                var M = matrix;

                // http://math.stackexchange.com/questions/13150/extracting-rotation-scale-values-from-2d-transformation-matrix
                // const sx = Math.sign(M.a) * Math.sqrt(Math.pow(M.a, 2) + Math.pow(M.b, 2));
                // const sy = Math.sign(M.d) * Math.sqrt(Math.pow(M.c, 2) + Math.pow(M.d, 2));

                var sx = Math.sqrt(Math.pow(M.a, 2) + Math.pow(M.b, 2));
                var sy = Math.sqrt(Math.pow(M.c, 2) + Math.pow(M.d, 2));

                this.set(sx, sy);
            }

            /**
                   * Reset scale transform.
                   * 
                   * @memberOf ScaleTransform
                   */

        }, {
            key: 'reset',
            value: function reset() {
                this.set(1, 1);
                _get(ScaleTransform.prototype.__proto__ || Object.getPrototypeOf(ScaleTransform.prototype), 'reset', this).call(this);
            }
        }, {
            key: 'toString',
            value: function toString() {
                return this.constructor.name + ' [x=' + this.x + ',y=' + this.y + ']';
            }
        }, {
            key: 'inverse',
            get: function get() {
                return ScaleTransform.from(this.matrix.inverse);
            }
        }], [{
            key: 'from',
            value: function from(matrix) {
                var transform = new ScaleTransform();
                transform.update(matrix);
                return transform;
            }
        }]);

        return ScaleTransform;
    }(Transform);

    var TransformOrigin = function (_Transform4) {
        _inherits(TransformOrigin, _Transform4);

        function TransformOrigin(element) {
            var ratioX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var ratioY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            _classCallCheck(this, TransformOrigin);

            var _this4 = _possibleConstructorReturn(this, (TransformOrigin.__proto__ || Object.getPrototypeOf(TransformOrigin)).call(this));

            if (!element) {
                throw new Error('element is null or undefined');
            }

            _this4.element = element;
            _this4.set(ratioX, ratioY);
            return _this4;
        }

        _createClass(TransformOrigin, [{
            key: 'set',
            value: function set(ratioX, ratioY) {
                this.ratioX = ratioX;
                this.ratioY = ratioY;
            }
        }, {
            key: 'apply',


            /**
                   * Applies this transform to the matrix given as parameter.
                   * 
                   * @param {any} matrix The matrix to which this transform will be applied.
                   * 
                   * @memberOf TransformOrigin
                   */
            value: function apply(matrix) {

                // TODO Remove if a notifier to property clientWidth/clientHeight change has been
                // attached to element. Until then always reforce calculation of transform origin.
                var x = this.element.clientWidth * this.ratioX;
                var y = this.element.clientHeight * this.ratioY;

                this.matrix = new Matrix([[1, 0, x], [0, 1, y], [0, 0, 1]]);

                _get(TransformOrigin.prototype.__proto__ || Object.getPrototypeOf(TransformOrigin.prototype), 'apply', this).call(this, matrix);
            }

            /**
                   * Unapplies this transformation from the matrix given as paramter.
                   * 
                   * @param {any} matrix The matrix from which this transform will be unapplied.
                   * 
                   * @memberOf TransformOrigin
                   */

        }, {
            key: 'unapply',
            value: function unapply(matrix) {

                // TODO Remove if a notifier to property clientWidth/clientHeight change has been
                // attached to element. Until then always reforce calculation of transform origin.
                var x = this.element.clientWidth * this.ratioX;
                var y = this.element.clientHeight * this.ratioY;

                this.matrix = new Matrix([[1, 0, x], [0, 1, y], [0, 0, 1]]);

                _get(TransformOrigin.prototype.__proto__ || Object.getPrototypeOf(TransformOrigin.prototype), 'unapply', this).call(this, matrix);
            }
        }, {
            key: 'update',
            value: function update(matrix) {

                if (!(matrix instanceof Matrix)) {
                    throw new Error('matrix needs to be of type ' + Matrix.name);
                }

                var M = matrix;

                this.set(M.tx, M.ty);
            }

            /**
                   * Reset transform origin.
                   * 
                   * @memberOf TransformOrigin
                   */

        }, {
            key: 'reset',
            value: function reset() {
                this.set(0, 0);
                _get(TransformOrigin.prototype.__proto__ || Object.getPrototypeOf(TransformOrigin.prototype), 'reset', this).call(this);
            }
        }, {
            key: 'toString',
            value: function toString() {
                return this.constructor.name + ' [ratioX=' + this.ratioX + ', ratioY=' + this.ratioY + ']';
            }
        }, {
            key: 'inverse',
            get: function get() {
                return TransformOrigin.from(this.element, this.matrix.inverse);
            }
        }], [{
            key: 'from',
            value: function from(element, matrix) {
                var transform = new TransformOrigin(element);
                transform.update(matrix);
                return transform;
            }
        }]);

        return TransformOrigin;
    }(Transform);

    /**
        * The transform group can hold multiple transform of type TranslateTransform, RotateTransform, ScaleTransform, or
        * even another TransformGroup. When the apply function is called, it will apply all added transform in the exact
        * order in which they have been added to the transform group. The unapply function will unapply all transform in
        * the reverse order in which they have been added to the transform group.
        * 
        * @class TransformGroup
        * @extends {Transform}
        */


    var TransformGroup = function (_Transform5) {
        _inherits(TransformGroup, _Transform5);

        /**
               * Creates an instance of TransformGroup.
               * 
               * @memberOf TransformGroup
               */
        function TransformGroup() {
            _classCallCheck(this, TransformGroup);

            var _this5 = _possibleConstructorReturn(this, (TransformGroup.__proto__ || Object.getPrototypeOf(TransformGroup)).call(this));

            _this5.transforms = [];
            return _this5;
        }

        /**
               * Add a transform (e.g., TranslateTransform, RotateTransform, or ScaleTransform) to the transform
               * group. All transforms will be applied in the order they were added to the transform group. If a
               * transform group is unapplied, it will unapply all transforms in reverse order.
               * 
               * @param {Transform} transform A transform of type Transform (e.g., TranslateTransform, RotateTransform,
               * or ScaleTransform). Eventually, a TransformGroup can also be added.
               * 
               * @throws {Error} Throws an error if transform is not of type Transform.
               * 
               * @memberOf TransformGroup
               */


        _createClass(TransformGroup, [{
            key: 'add',
            value: function add(transform) {
                var inverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


                // Check if transform is of proper type.
                if (!(transform instanceof Transform)) {
                    throw new Error('transform needs to be of type ' + Transform.name);
                }

                // Add transform to transforms.
                this.transforms.push({
                    inverse: inverse,
                    transform: transform
                });
            }

            /**
                   * Remove a transform from this transform group. The transform has to be part of the transform group,
                   * otherwise an error will be thrown.
                   * 
                   * @param {Transform} transform
                   * 
                   * @throws {Error} Throws an error if transform is not of type Transform and if transform is not part
                   * of transform group.
                   * 
                   * @memberOf TransformGroup
                   */

        }, {
            key: 'remove',
            value: function remove(transform) {

                // Check if transform is of proper type.
                if (!(transform instanceof Transform)) {
                    throw new Error('transform needs to be of type ' + Transform.name);
                }

                // Check if transform is part of transform group.
                if (!this.transforms.contains(transform)) {
                    throw new Error('transform is not part of this transform group');
                }

                // Remove transform from transform group.
                var idx = this.transforms.indexOf(transform);
                this.transforms.splice(idx, 1);
            }

            /**
                   * Applies all transforms in the order in which they have been added to this transform group. The
                   * TransformGroup#apply function is specified in Transform ({@see Transform#apply}).
                   * 
                   * @param {any} matrix The matrix to which transforms are applied.
                   * 
                   * @memberOf TransformGroup
                   */

        }, {
            key: 'apply',
            value: function apply(matrix) {
                var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


                // Apply each transform to the matrix.
                this.transforms.forEach(function (_ref) {
                    var transform = _ref.transform,
                        inverse = _ref.inverse;

                    if (type && !(transform instanceof type) && !(transform instanceof TransformGroup)) {
                        return;
                    }
                    // console.log('apply inverse=%o transform=%o', inverse, transform.toString());
                    inverse ? transform.unapply(matrix, type) : transform.apply(matrix, type);
                });
            }

            /**
                   * Unapplies all transforms in reverse order in which they have been added to this transform group. The
                   * TransformGroup#unapply function is specified in Transform ({@see Transform#unapply}).
                   * 
                   * @param {any} matrix The matrix from which the transforms are unapplied.
                   * 
                   * @memberOf TransformGroup
                   */

        }, {
            key: 'unapply',
            value: function unapply(matrix) {
                var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


                // Unapply each transform from the matrix in reverse order.
                this.transforms.slice().reverse().forEach(function (_ref2) {
                    var transform = _ref2.transform,
                        inverse = _ref2.inverse;

                    if (type && !(transform instanceof type) && !(transform instanceof TransformGroup)) {
                        return;
                    }
                    // console.log('unapply inverse=%o transform=%o', inverse, transform.toString());
                    inverse ? transform.apply(matrix, type) : transform.unapply(matrix, type);
                });
            }

            /**
                   * Reset transform group.
                   * 
                   * @memberOf TransformGroup
                   */

        }, {
            key: 'reset',
            value: function reset() {
                this.transforms.forEach(function (_ref3) {
                    var transform = _ref3.transform;

                    transform.reset();
                });
            }

            /**
                   * Transform group to string.
                   * 
                   * @returns Transform group in string representation.
                   * 
                   * @memberOf TransformGroup
                   */

        }, {
            key: 'toString',
            value: function toString() {
                return this.constructor.name + ' [transforms=[' + this.transforms.map(function (_ref4) {
                    var transform = _ref4.transform,
                        inverse = _ref4.inverse;

                    return inverse ? transform.inverse.toString() : transform.toString();
                }).join(", ") + ']]';
            }
        }]);

        return TransformGroup;
    }(Transform);

    /**
        * The transform stack builds the base object responsible for transforming a DOM element. It takes an
        * element as constructor parameter and binds itself to this element. The transform stack allows push
        * and pop of transforms. A transform is immediately applied on the element and poping will immediately
        * unapply the transform from the element.
        * 
        * @class Transformer
        */


    var Transformer = function () {

        /**
               * Creates an instance of Transformer. It takes a DOM element as contstructor parameter to which
               * this transform stack will bind itself. The transform stack will receive the elements current 
               * transform as matrix, which will be used to apply transforms.
               * 
               * @param {any} element A DOM element to which transforms will be applied. 
               * 
               * @memberOf Transformer
               */
        function Transformer(element, callback) {
            var debug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            _classCallCheck(this, Transformer);

            // Element needs to be in DOM to get its clientWidth and clientHeight.
            if (!element.parentElement) {
                throw new Error('Element has no parent element. Is the element in the DOM?');
            }

            // Check if callback is set and if it is a function.
            if (callback && typeof callback !== "function") {
                throw new Error('callback needs to be a function');
            }

            this.element = element;
            this.element.transformer = this;
            this.callback = callback;
            this.updateInProgress = false;

            // Make sure the element is positioned absolute and its origin is at point (0, 0, 0).
            this.element.style.position = "absolute";
            this.element.style.transformOrigin = "0 0 0";

            var matrix = this.getTransformMatrix();

            // this._transformOrigin = new TransformOrigin(element);
            this._scaleTransform = ScaleTransform.from(matrix);
            this._rotateTransform = RotateTransform.from(matrix);
            this._translateTransform = TranslateTransform.from(matrix);

            var transformGroup = new TransformGroup();
            transformGroup.add(this._rotateTransform);
            transformGroup.add(this._scaleTransform);
            transformGroup.add(this._translateTransform);

            this._transforms = transformGroup;

            // Listen for Webstrates updates.
            // this.listenForUpdates();

            if (debug) {

                var visualTransformOrigin = this.element.querySelector(':scope > .transform-origin-point');

                if (!visualTransformOrigin) {
                    // Create visual transform origin
                    visualTransformOrigin = document.createElement("transient");
                    visualTransformOrigin.setAttribute("class", "transform-origin-point");
                    element.appendChild(visualTransformOrigin);
                }

                // const _transformOriginSet = this.transformOrigin.set;
                // this.transformOrigin.set = function(x, y) {
                //     visualTransformOrigin.style.zIndex = "99999";
                //     visualTransformOrigin.style.position = `absolute`;
                //     visualTransformOrigin.style.left = `${x * 100}%`;
                //     visualTransformOrigin.style.top = `${y * 100}%`;
                //     visualTransformOrigin.style.transform = `translate(-50%, -50%)`;
                //     _transformOriginSet.apply(this, arguments);
                // }
            }
        }

        /**
               * Get transform matrix from element transform.
               * 
               * @returns Element transform matrix.
               * 
               * @memberOf Transformer
               */


        _createClass(Transformer, [{
            key: 'getTransformMatrix',
            value: function getTransformMatrix() {
                return Matrix.from(this.element);
            }

            /**
                   * Refresh transfroms from element transform.
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'refreshTransforms',
            value: function refreshTransforms() {
                var matrix = this.getTransformMatrix();
                this._translateTransform.update(matrix);
                this._rotateTransform.update(matrix);
                this._scaleTransform.update(matrix);
            }

            /**
                   * Reapplies all transforms again. This function should be used when any of the transforms in the transform
                   * chain changed.
                   * 
                   * @memberOf TransformStack
                   */

        }, {
            key: 'reapplyTransforms',
            value: function reapplyTransforms() {
                var updateElementsTransform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

                var matrix = Matrix.identity(3);

                if (this.element.renderTransform) {
                    this.element.renderTransform.apply(matrix);
                }
                this._transforms.apply(matrix);

                this.elementMatrix = matrix;

                if (updateElementsTransform) {
                    // Update element transform.
                    return this.updateElement();
                } else {
                    return new Promise(function (resolve, reject) {
                        resolve();
                    });
                }
            }

            /**
                   * Merge render transform to main transform and reset
                   * render transform on success.
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'complete',
            value: function complete() {
                if (this.element.renderTransform) {
                    this.refreshTransforms();
                    this.element.renderTransform.reset();
                }
            }

            /**
                   * Updates the element's transform matrix.
                   * 
                   * @returns A promise resolved when element updated successfully.
                   * 
                   * @memberOf TransformStack
                   */

        }, {
            key: 'updateElement',
            value: function updateElement() {
                var _this6 = this;

                return new Promise(function (resolve, reject) {

                    if (_this6.updateInProgress) {
                        // reject(`update already in progress`);
                        // resolve(this.elementMatrix);
                        return;
                    };

                    window.requestAnimationFrame(function () {

                        var updateElementTransform = function updateElementTransform() {
                            var elementTransform = _this6.elementMatrix.toCss();
                            _this6.setCssTransform(elementTransform);
                        };

                        if (_this6.callback) {
                            if (_this6.callback.call(_this6, _this6.elementMatrix)) {
                                updateElementTransform();
                            }
                        } else {
                            updateElementTransform();
                        }

                        _this6.updateInProgress = false;

                        resolve(_this6.elementMatrix);
                    });

                    _this6.updateInProgress = true;
                });
            }

            /**
                   * Sets the element's transform also compensating for various vendor prefixes.
                   * 
                   * @param {any} cssTansform The CSS transform.
                   * 
                   * @memberOf TransformStack
                   */

        }, {
            key: 'setCssTransform',
            value: function setCssTransform(cssTransform) {

                // Stop listening for DOM changes on style element.
                module.disconnectObserver();

                if (this.element instanceof SVGElement) {
                    cssTransform === "none" ? this.element.removeAttribute("transform") : this.element.setAttribute("transform", cssTransform);
                } else if (this.element.nodeType === 1) {
                    this.element.style.webkitTransform = cssTransform;
                    this.element.style.mozTransform = cssTransform;
                    this.element.style.msTransform = cssTransform;
                    this.element.style.oTransform = cssTransform;
                    this.element.style.transform = cssTransform;
                }

                // Listening for DOM changes on style element.
                module.connectObserver();
            }

            /**
                   * tbd.
                   * 
                   * @returns
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'getTransformHierarchy',
            value: function getTransformHierarchy() {
                var allTransformers = [];

                // Also collect transforms of parents.
                var parent = this.element;
                do {
                    if (parent.transformer) {
                        allTransformers.push({
                            transformer: parent.transformer,
                            renderTransform: parent.renderTransform
                        });
                    }
                } while ((parent = parent.parentElement) != null);

                // Reverse transform order to start with root transform.
                allTransformers.reverse();

                return allTransformers;
            }

            /**
             * tbd.
                   * 
                   * @returns
             *
             * @memberOf Transformer
             */

        }, {
            key: 'getAncesterElementWithoutTransformer',
            value: function getAncesterElementWithoutTransformer() {
                var parent = this.element;
                do {
                    if (!parent.transformer) {
                        return parent;
                    }
                } while ((parent = parent.parentElement) != null);

                return window.document.body;
            }

            /**
                   * tbd.
                   * @param {any} m
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'applyToLocalTransform',
            value: function applyToLocalTransform(m) {
                var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                this._transforms.apply(m, type);

                if (this.element.renderTransform) {
                    this.element.renderTransform.apply(m, type);
                }
            }

            /**
                   * tbd.
                   * 
                   * @param {any} m
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'applyToGlobalTransform',
            value: function applyToGlobalTransform(m) {
                var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                var allTransformers = this.getTransformHierarchy();

                allTransformers.forEach(function (_ref5) {
                    var transformer = _ref5.transformer,
                        renderTransform = _ref5.renderTransform;


                    // Undo main transforms.
                    if (transformer) {
                        transformer._transforms.unapply(m, type);
                    }

                    // Undo render transforms.
                    if (renderTransform) {
                        renderTransform.unapply(m, type);
                    }
                });
            }

            /**
                   * Converts a point from global coordinates to local coordinates.
                   * 
                   * @param {Point} point The point with global x- and y-coordinates.
                   * @returns The point with local x- and y-coordinates.
                   * 
                   * @memberOf TransformStack
                   */

        }, {
            key: 'fromGlobalToLocal',
            value: function fromGlobalToLocal(point) {

                if (!(point instanceof Point)) {
                    throw new Error('point needs to be of instance ' + Point.name);
                }

                // adjust x and y according to ancestor element offset
                var ancestor = this.getAncesterElementWithoutTransformer();

                var _ancestor$getBounding = ancestor.getBoundingClientRect(),
                    left = _ancestor$getBounding.left,
                    top = _ancestor$getBounding.top;

                var x = left ? point.x - left : point.x;
                var y = top ? point.y - top : point.y;

                var m = Matrix.identity(3);
                m.translate(x, y);

                this.applyToGlobalTransform(m);

                return new Point(m.tx, m.ty);
            }

            /**
                   * Converts a point from local coordinates to global coordinates.
                   * 
                   * @param {any} point The point with local x- and y-coordinates.
                   * @returns The point with global x- and y-coordinates.
                   * 
                   * @memberOf TransformStack
                   */

        }, {
            key: 'fromLocalToGlobal',
            value: function fromLocalToGlobal(point) {
                throw new Error('not implemented');
            }

            /**
                   * Converts a delta point from global coordinates to local coordinates.
                   * 
                   * @param {any} point The delta point with global x- and y-coordinates.
                   * @returns The delta point with local x- and y-coordinates.
                   * 
                   * @memberOf TransformStack
                   * 
                   * @see TransformStack#fromGlobalToLocal
                   */

        }, {
            key: 'fromGlobalToLocalDelta',
            value: function fromGlobalToLocalDelta(deltaPoint) {

                if (!(deltaPoint instanceof Point)) {
                    throw new Error('delta point needs to be of instance ' + Point.name);
                }

                // adjust x and y according to ancestor element offset
                var ancestor = this.getAncesterElementWithoutTransformer();

                var _ancestor$getBounding2 = ancestor.getBoundingClientRect(),
                    left = _ancestor$getBounding2.left,
                    top = _ancestor$getBounding2.top;

                var x = left ? deltaPoint.x - left : deltaPoint.x;
                var y = top ? deltaPoint.y - top : deltaPoint.y;

                var allTransforms = this.getTransformHierarchy();

                var m = Matrix.identity(3);
                m.translate(x, y);

                allTransforms.forEach(function (_ref6) {
                    var transformer = _ref6.transformer,
                        renderTransform = _ref6.renderTransform;


                    // Undo main transforms.
                    if (transformer) {
                        transformer._transforms.unapply(m, ScaleTransform);
                        transformer._transforms.unapply(m, RotateTransform);
                    }
                });

                return new Point(m.tx, m.ty);
            }

            /**
                   * tbd.
                   * 
                   * @readonly
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'destroy',


            /**
                   * tbd.
                   * 
                   * @memberOf Transformer
                   */
            value: function destroy() {
                delete this._scaleTransform;
                delete this._rotateTransform;
                delete this._translateTransform;
                delete this._transforms;
            }
        }, {
            key: 'localRotation',
            get: function get() {
                var m = Matrix.identity(3);
                this.applyToLocalTransform(m, RotateTransform);
                return m.angle;
            }

            /**
                   * tbd.
                   * 
                   * @readonly
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'globalRotation',
            get: function get() {
                var m = Matrix.identity(3);
                this.applyToGlobalTransform(m, RotateTransform);
                return m.angle;
            }

            /**
                   * tbd.
                   * 
                   * @readonly
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'localScale',
            get: function get() {
                var m = Matrix.identity(3);
                this.applyToLocalTransform(m, ScaleTransform);
                return new Point(m.scaleX, m.scaleY);
            }

            /**
                   * tbd.
                   * 
                   * @readonly
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'globalScale',
            get: function get() {
                var m = Matrix.identity(3);
                this.applyToGlobalTransform(m, ScaleTransform);
                return new Point(m.scaleX, m.scaleY);
            }

            /**
                   * tbd.
                   * 
                   * @readonly
                   * 
                   * @memberOf Transformer
                   */

        }, {
            key: 'globalScaleTest',
            get: function get() {
                var m = Matrix.identity(3);
                m.scale(1, 1);

                var allTransformers = [];

                // Also collect transforms of parents.
                var parent = this.element;
                do {
                    if (parent.transformer) {
                        allTransformers.push({
                            transformer: parent.transformer,
                            renderTransform: parent.renderTransform
                        });
                    }
                } while ((parent = parent.parentElement) != null);

                // Apply all transforms in reverse order.
                allTransformers.reverse().forEach(function (_ref7) {
                    var transformer = _ref7.transformer,
                        renderTransform = _ref7.renderTransform;


                    // Undo main transforms.
                    if (transformer) {
                        transformer._transforms.apply(m, ScaleTransform);
                    }

                    // Undo render transforms.
                    if (renderTransform) {
                        renderTransform.apply(m, ScaleTransform);
                    }
                });

                var scaleX = m.a;
                var scaleY = m.d;

                return new Point(scaleX, scaleY);
            }
        }]);

        return Transformer;
    }();

    (function () {

        var observerOptions = {
            attributes: true,
            subtree: true,
            attributeFilter: ['style']
        };

        var observer = new MutationObserver(function (mutations) {

            mutations.forEach(function (mutation) {
                switch (mutation.type) {
                    case "attributes":
                        var target = mutation.target;
                        if (target.transformer) {
                            target.transformer.refreshTransforms();
                        }
                        break;
                }
            });
        });

        var isConnected = false;

        module.connectObserver = function () {
            if (!isConnected) {
                observer.observe(document.body, observerOptions);
                isConnected = true;
            }
        };

        module.disconnectObserver = function () {
            if (isConnected) {
                observer.disconnect();
                isConnected = false;
            }
        };

        // Listening for DOM changes on style element.
        module.connectObserver();
    })();

    // Export the transform classes to window.Transformer.
    exports.Transformer = {
        Point: Point,
        Matrix: Matrix,
        TranslateTransform: TranslateTransform,
        RotateTransform: RotateTransform,
        ScaleTransform: ScaleTransform,
        TransformGroup: TransformGroup,
        bindElement: function bindElement(element, callback, debug) {

            // check for Promise support
            if (!Promise) {
                throw new Error('The Transformer library requires Promise support');
            }

            return new Promise(function (resolve, reject) {

                if (element.transformer) {
                    return resolve(element.transformer);
                }

                var oldVisbilityValue = element.style.visibility;
                // element.style.visibility = "hidden";

                var makeStack = function makeStack() {
                    var transformer = new Transformer(element, callback, debug);

                    transformer.reapplyTransforms().then(function () {
                        console.debug('transformer transforms successfully applied %o', element);
                        // element.style.visibility = oldVisbilityValue;
                        resolve(transformer);
                    }).catch(function (reason) {
                        // element.style.visibility = oldVisbilityValue;
                        console.error('Could not bind ' + RenderTransform.name + ' because "' + reason + '"');
                        reject(reason);
                    });
                };

                var runs = 60 * 5; // ca. 5 seconds
                function waitFor() {
                    --runs;

                    if (runs > 0 && (element.offsetWidth === 0 || element.offsetHeight === 0)) {
                        return window.requestAnimationFrame(waitFor);
                    }

                    if (runs <= 0) {
                        console.warn('could not identify element size width=' + element.offsetWidth + ', height=' + element.offsetHeight);
                    }
                    makeStack();
                };
                waitFor();
            });
        }
    };
})(window);