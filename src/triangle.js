var gl;
var points;

var TriangleHelper = {
    triangles: [],
    /**
     * Create an array of vertices used to render a triangle at the given location.
     * @param {number} scale The size of the triangle.
     * @param {number} xCoord The x coordinate.
     * @param {number} yCoord The y coordinate.
     * @param {number} [rotation] The rotation of the triangle in degrees.
     */
    createVertexArray: function (scale, xCoord, yCoord, rotation) {
        scale = 1 / scale;

        if (rotation === undefined) {
            rotation = 0;
        } else {
            rotation *= (Math.PI / 180 )
        }

        var middleToTopCornerLength = 0.5 * scale * ( Math.sqrt(3) - 0.5 ),
            topXCoord = xCoord + middleToTopCornerLength * Math.sin(rotation),
            topYCoord = yCoord + middleToTopCornerLength * Math.cos(rotation),
            leftXCoord = xCoord + middleToTopCornerLength * Math.sin(rotation + 2 * Math.PI / 3),
            leftYCoord = yCoord + middleToTopCornerLength * Math.cos(rotation + 2 * Math.PI / 3),
            rightXCoord = xCoord + middleToTopCornerLength * Math.sin(rotation + 4 * Math.PI / 3),
            rightYCoord = yCoord + middleToTopCornerLength * Math.cos(rotation + 4 * Math.PI / 3);
        //leftXCoord = xCoord - 0.5 * scale,
        //leftYCoord = yCoord - 0.25 * scale,
        //rightYCoord = yCoord - 0.25 * scale,
        //rightXCoord = xCoord + 0.5 * scale;

        return [
            vec2(topXCoord, topYCoord),
            vec2(leftXCoord, leftYCoord),
            vec2(rightXCoord, rightYCoord)
        ]
    },

    init: function () {
        // Three Vertices.
        TriangleHelper.registerTriangle(1.4, 0.5, 0.5, 30);
        TriangleHelper.registerTriangle(3, -0.5, -0.5, 50);

        TriangleHelper.drawTriangles();
    },

    drawTriangles: function() {
        var canvas = document.getElementById("gl-canvas");
        gl = WebGLUtils.setupWebGL(canvas);
        if (!gl) {
            alert("WebGL isn't available");
        }

        // Configure WebGL.
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        // Load shaders and initialize attribute buffers.
        var program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);
        // Load the data into the GPU.
        var bufferId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(TriangleHelper.triangles),
            gl.STATIC_DRAW);

        // Associate out shader variables with our data buffer.
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        TriangleHelper.render();
    },

    render: function () {
        gl.clear(gl.COLOR_BUFFER_BIT);
        /** The changes below have been adapted from [WebGL Fundamentals]{@link http://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html}*/
        gl.drawArrays(gl.TRIANGLES, 0, TriangleHelper.triangles.length);
    },

    clearTriangles: function () {
        TriangleHelper.triangles = [];
    },

    // TODO allow specification of colour. This property can be changed in gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    registerTriangle: function (scale, xCoord, yCoord, rotation) {
        var vertices = TriangleHelper.createVertexArray(scale, xCoord, yCoord, rotation);
        TriangleHelper.triangles = TriangleHelper.triangles.concat(vertices);
    }
};

window.onload = TriangleHelper.init;

