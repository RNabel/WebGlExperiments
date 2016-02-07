var gl;
var points;

var TriangleHelper = {
    vertices: [
        vec2(-1, -1),
        vec2(0, 5),
        vec2(1, -1)
    ],

    /**
     * Create an array of vertices used to render a triangle at the given location.
     * @param {number} scale CURRENTLY SIDE LENGTH. The size of the triangle - specifies bounding box of the triangle. If 1 then it is [1, 1]
     * @param {number} xCoord The x coordinate.
     * @param {number} yCoord The y coordinate.
     * @param {number} [rotation] The rotation of the triangle in degrees.
     */
    createVertexArray : function (scale, xCoord, yCoord, rotation) {
        var topYCoord = yCoord + 0.5 * scale * ( Math.sqrt(3) - 0.5 ),
            leftXCoord = xCoord - 0.5 * scale,
            leftYCoord = yCoord - 0.25 * scale,
            rightYCoord = yCoord - 0.25 * scale,
            rightXCoord = xCoord + 0.5 * scale;

        return [
            vec2(xCoord, topYCoord),
            vec2(leftXCoord, leftYCoord),
            vec2(rightXCoord, rightYCoord)
        ]
    },

    init: function () {
        var canvas = document.getElementById("gl-canvas");
        gl = WebGLUtils.setupWebGL(canvas);
        if (!gl) {
            alert("WebGL isn't available");
        }

        // Three Vertices.
        var vertices = TriangleHelper.createVertexArray(1, 1, 1);

        // Configure WebGL
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        // Load shaders and initialize attribute buffers.
        var program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);
        // Load the data into the GPU.
        var bufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices),
            gl.STATIC_DRAW);

        // Associate out shader variables with our data buffer.
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        TriangleHelper.render();
    },

    render: function () {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
};

window.onload = TriangleHelper.init;

