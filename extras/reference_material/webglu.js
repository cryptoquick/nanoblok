/*
 *  Copyright (c) 2009 Benjamin P. DeLillo
 *  
 *  Permission is hereby granted, free of charge, to any person
 *  obtaining a copy of this software and associated documentation
 *  files (the "Software"), to deal in the Software without
 *  restriction, including without limitation the rights to use,
 *  copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following
 *  conditions:
 *  
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *  OTHER DEALINGS IN THE SOFTWARE.
 */
 
// Unless otherwise specified, vectors and matricies are assumed to be
// Sylvester types, or at least have the same interface.
 
// Unless otherwise specified, `wglu` refers to a WGLU object
// on which .initialize has already been called.
 
 
function WGLUTexture() {
    this.image = new Image();
	this.texid = this.WGLU.GL.createTexture();
 
    this.load = function(url) {
		this.image.src = url;
    }
}
 
function WGLUShader(name, source, type) {
    this.WGLU.logGroup("creating shader '" + name + "'");
    this.WGLU.shaders[name] = this;
 
    this.name 	  = name;
	this.source   = "";
	this.type 	  = -1;
	this.glShader = null;
 
    this.attributes = [];
    this.uniforms   = [];
 
	// names of programs which use this shader
	this.programs 	= [];
 
	this.isDirty = true;
 
	this._dirty = function() {
		this.glShader = null;
		this.isDirty = true;
	}
	this._clean = function() {
		this.isDirty = false;
	}
 
	this._addProgram = function(name) {
    	this.programs.push(name);
	}
	this._removeProgram = function(name) {
		this.programs = this.programs.remove(name);
	}
	
	this.setSource = function(src) {
		this._dirty();
		this.source = src;
	}
 
    this.setModelViewUniform = function(name) {
        this.WGLU.log("using '" + name + "' as ModelView uniform");
        var index = this.uniforms.indexOf(name);
        var uniform = this.uniforms[index];
 
        uniform[1] = function(wglu, uLocation) {
            //wglu.log('processing modelview uniform');
            wglu.GL.uniformMatrix4fv(uLocation, false, 
                    wglu.modelview.getForUniform());
        }
    }
 
    this.setProjectionUniform = function(name) {
        this.WGLU.log("using '" + name + "' as Projection uniform");
        var index = this.uniforms.indexOf(name);
        var uniform = this.uniforms[index];
 
        uniform[1] = function(wglu, uLocation) {
            //wglu.log('processing projection uniform');
            wglu.GL.uniformMatrix4fv(uLocation, false, 
                    wglu.projection.getForUniform());
        }
 
    }
 
	this.getGLShader = function() {
		if (this.isDirty) {
            this.WGLU.log("'" + this.name + "' is dirty");
			if (!this.compile()) {
				return false;
			}else {
				this._clean();
			}
		}else {
            this.WGLU.log("'" + this.name + "' is clean, using");
        }
		return this.glShader;
	}
 
    //--------------------------------------------------------------------------
    // Store the information about this named uniform.
    this.addUniform = function(name, action) {
        this.WGLU.log("adding uniform '" + name + "'");
        if (!action) {
            action = this.WGLU._noFun();
        }
		this.uniforms.push([name, action]);
    }
 
    //--------------------------------------------------------------------------
    // Store the information about this named attribute.
    this.addAttribute = function(name, length) {
        this.WGLU.log("adding attribute '" + name + "'");
        if (!length) { length = 3; }
		this.attributes.push([name, length]);
    }
 
    //--------------------------------------------------------------------------
	// Find and initialize all uniforms and attributes found in the source
    this._parseShaderVariables = function(str) {
        var tokens = str.split(/[\s\n;]+?/);
 
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i] == "attribute") {
				var type = tokens[i+1];
				var name = tokens[i+2];
				var length = this.types[type];
				this.addAttribute(name, length);
            }                               
            if (tokens[i] == "uniform") {
				var type = tokens[i+1];
				var name = tokens[i+2];
				this.addUniform(name);
 
                if (name == this.WGLU._ModelViewUniform) {
                    this.setModelViewUniform(this.WGLU._ModelViewUniform);
                }else if (name == this.WGLU._ProjectionUniform) {
                    this.setProjectionUniform(this.WGLU._ProjectionUniform);
                }
			}
        }
    }
 
	this.compile = function() {
		this.WGLU.log("compiling '" + this.name + "'");
		if (!!this.glShader) {
			this.WGLU.GL.deleteShader(this.glShader);
			this.glShader = null;
        }
 
		var shader = this.WGLU.GL.createShader(this.type);
		
		this.WGLU.GL.shaderSource(shader, this.source);
        this.WGLU.GL.compileShader(shader);
 
        if (!this.WGLU.GL.getShaderi(shader, this.WGLU.GL.COMPILE_STATUS)) {
			this.WGLU.log('error compiling ' + this.name + ': ' + this.WGLU.GL.getShaderInfoLog(shader));
			this.glShader = null;
        } else {
            this._clean();
			this.glShader = shader;
		}
 
		return (!!this.glShader);
	}
 
    this._getShaderSourceById = function(id) {
        var source;
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
			this.WGLU.log("No script with id '" + id + "'");
            return null;
        }
 
		source = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                source += k.textContent;
            }
            k = k.nextSibling;
        }
 
        return source;
    }
 
	this._getShaderTypeById = function(id) {
        var type;
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
			this.WGLU.log("No script with id '" + id + "'");
            return null;
        }
 
        if (shaderScript.type == "x-shader/x-fragment") {
			type = this.WGLU.GL.FRAGMENT_SHADER;
        } else if (shaderScript.type == "x-shader/x-vertex") {
			type = this.WGLU.GL.VERTEX_SHADER;
        } else {
			this.WGLU.log('invalid shader type' + shaderScript.type);
        }
 
		return type;
	}
 
	// If the source wasn't passed in we assume name is an element
	// ID in the page
	if (!source) {
        //[this.source, this.type] = this._getShaderSourceByElementId(name);
		this.source = this._getShaderSourceById(name);
		this.type  	= this._getShaderTypeById(name);
	// Else we just use the provided source and type, and compile
	}else {
		this.source = source;
		this.type = type;
	}
 
	this._parseShaderVariables(this.source);
	//this.compile();
 
    this.WGLU.logGroupEnd();
}
WGLUShader.prototype.types = [];
WGLUShader.prototype.types['int'] = 1;
WGLUShader.prototype.types['float'] = 1;
WGLUShader.prototype.types['bool'] = 1;
WGLUShader.prototype.types['vec2'] = 2;
WGLUShader.prototype.types['vec3'] = 3;
WGLUShader.prototype.types['vec4'] = 4;
 
function WGLUShaderProgram(name) {
    this.WGLU.log("creating shader program '" + name + "'");
 
	this.name = name;
    this.glProgram 	= null;
    this.isLinked 	= false;
    this.isDirty 	= true; // So we know when to relink
	
    this.shaders 	= [];
	this.attributes = [];
	this.uniforms 	= [];
 
	this._setupAttributes = function() {
		this.attributes = [];
 
		// Each shader keeps track of its attributes
		for (var i = 0; i < this.shaders.length; i++) {
			var shader = this.WGLU.shaders[this.shaders[i]];
 
			for (var j = 0; j < shader.attributes.length; j++) {
				//var [name, length] = shader.attributes[j];
				var name = shader.attributes[j][0];
				var length = shader.attributes[j][1];
 
				// Attribute locations are unique to each program
                var location = this.WGLU.GL.getAttribLocation(this.glProgram, name);
				var buffer = this.WGLU.GL.createBuffer();
 
				this.attributes.push([name, location, length, buffer]);
			}
		}
	}
 
	this._setupUniforms = function() {
		var uniforms = [];
 
		// Each shader keeps track of its uniforms
		for (var i = 0; i < this.shaders.length; i++) {
			var shader = this.WGLU.shaders[this.shaders[i]];
 
			for (var j = 0; j < shader.uniforms.length; j++) {
				//var [name, action] = shader.uniforms[j];
				var name = shader.uniforms[j][0];
				var action = shader.uniforms[j][1];
 
				// locations are unique to each program (I think)
                var location = this.WGLU.GL.getUniformLocation(this.glProgram, name);
				uniforms.push([location, action]);
			}
		}
 
		this.uniforms = uniforms;
	}
 
    this.processUniforms = function() {
        for (var i = 0; i < this.uniforms.length; i++) {
            //var [location, action] = this.uniforms[i];
			var location = this.uniforms[i][0];
			var action = this.uniforms[i][1];
            action(this.WGLU, location);
        }
    }
 
    this.link = function() {
        this.WGLU.logGroup("linking '" + this.name + "'");
 
        if (this.isLinked) {
            this.WGLU.log("already exists, deleting and relinking");
 
            // Only delete the program if one already exists
            if (!!this.glProgram) {
                this.WGLU.GL.deleteProgram(this.glProgram);
				this.attributes = [];
                this.glProgram = null;
            }
        }
 
        this.glProgram = this.WGLU.GL.createProgram();
 
        // Attach all the shaders
        for (var i = 0; i < this.shaders.length; i++) {
        /*
            this.WGLU.GL.attachShader(this.glProgram, 
                    this.WGLU.shaders[this.shaders[i]].glShader);
        */
			var shader = this.WGLU.shaders[this.shaders[i]];
			var glShader = shader.getGLShader();
 
			// if the shader is still dirty after calling get,
			// which should have cleaned it, then the compile failed.
			if (shader.isDirty) {
				this.WGLU.log(this.shaders[i] + " failed to compile");
			}else {
				// originally just the following
				this.WGLU.GL.attachShader(this.glProgram, 
                        this.WGLU.shaders[this.shaders[i]].glShader);
			}	//~
        }
 
        this.WGLU.GL.linkProgram(this.glProgram);
 
        // Check for errors
        if (!this.WGLU.GL.getProgrami(this.glProgram, this.WGLU.GL.LINK_STATUS)) {
            this.WGLU.log(this.WGLU.GL.getProgramInfoLog(this.glProgram));
            this.isLinked = false;
        }
            
        this.isLinked = true;
        this.isDirty = false;
		this._setupAttributes();
		this._setupUniforms();
 
        this.WGLU.logGroupEnd();
        return this.isLinked;
    }
 
    this.detachShaderByName = function(name) {
        var tempShaders = [];
 
        for (var i = 0; i < this.shaders.length; i++) {
            if (this.shaders[i] != name) {
                tempShaders.push(this.shaders[i]);
            }
        }
 
        this.isDirty = true;
        this.shaders = tempShaders;
    }
 
	this.attachNewShader = function(name, source, type) {
        this.attachShader(new WGLUShader(name, source, type));
	}
 
    this.attachShader = function(shader) {
        this.WGLU.log("attaching '" + shader.name + "' to '" + this.name + "'");
		shader._addProgram(this.name);
        this.isDirty = true;
        this.shaders.push(shader.name);
    }
 
    this.attachShaderByID = function(name) {
        this.attachShader(new WGLUShader(name));
    }
 
    this.use = function() {
		// Try to link if needed
        if (!this.isLinked || this.isDirty) {
            if (!this.link()) { return false; }
        }
		this.WGLU.GL.useProgram(this.glProgram);
		return true;
    }
 
    this.WGLU.logGroupEnd();
}
 
//--------------------------------------------------------------------------
// WGLUObject
//
// An object containing pertinent render information for an individual
// renderable entity.
//
// Make sure to set vertexCount correctly
//
// Animations are clunky right now, I'm working on it.
//
function WGLUObject(type) {
    this.WGLU.addObject(this);
 
	this.shaderProgram = 'default';
	this.vertexCount = 0;
	this.type = type; // render type (wglu.GL.LINES, wglu.GL.POINTS, wglu.GL.TRIANGLES, etc.)
 
	this._elements = false;
	this._elementBuffer = null;;
	this._elementCount = 0;
 
    this.arrays 	= [];
    this.textures 	= [];
 
    this.state = new WGLUObjectState();
	this.animation = new WGLUAnimation();
 
	this._drawFunction = null;
 
	this.setElements = function(elements) {
		// don't use drawElements
		if (elements === false) {
			this._elements = false;
			this._drawFunction = this._drawArrays();
 
		// use drawElements
		}else {
			this._elements = elements.flatten();
			this._elementCount = this._elements.length;
			this._elementBuffer = this.WGLU.GL.createBuffer();
			this._drawFunction = this._drawElements();
		}
	}
 
    //----------------------------
    // Fills the array of the given name, where name is a 
    // vertex attribute in the shader. Be sure to add all your
    // attributes with the gl.addAttribute call
    this.fillArray = function(name, contents) {
        this.arrays[name] = contents.flatten();
    }
 
 
    //----------------------------
    // buffer all the data stored in this object's attribute
    // arrays and set vertexAttribPointers for them.
    this.bufferArrays = function() {
		var program = this.WGLU.programs[this.shaderProgram];
 
        for (var i = 0; i < program.attributes.length; i++) {
			//var [name, attribute, length, buffer] = program.attributes[i];
			var name  	  = program.attributes[i][0];
			var attribute = program.attributes[i][1];
			var length 	  = program.attributes[i][2];
			var buffer 	  = program.attributes[i][3];
 
            this.WGLU.GL.bindBuffer(this.WGLU.GL.ARRAY_BUFFER, buffer);
            this.WGLU.GL.bufferData(this.WGLU.GL.ARRAY_BUFFER, new CanvasFloatArray(this.arrays[name]), 
					this.WGLU.GL.STATIC_DRAW);
 
            this.WGLU.GL.vertexAttribPointer(attribute, length, this.WGLU.GL.FLOAT, false, 0, 0);
            this.WGLU.GL.enableVertexAttribArray(attribute);
		}
 
		
		// if elements aren't disabled
		// XXX convert to callback to avoid `if`
		if (!(this._elements === false)) {
			this.WGLU.GL.bindBuffer(this.WGLU.GL.ELEMENT_ARRAY_BUFFER, this._elementBuffer);
			this.WGLU.GL.bufferData(this.WGLU.GL.ELEMENT_ARRAY_BUFFER,new CanvasUnsignedShortArray(this._elements), 
					this.WGLU.GL.STATIC_DRAW);
		}
    }
 
 
    this.bufferTextures = function() {
        for (var i = 0; i < this.WGLU.textureUniformNames.length; i++) {
            var name = this.WWGLU.GLU.textureUniformNames[i];
            var id = this.WGLU.GL.createTexture();
 
            this.WGLU.GL.activeTexture(this.WGLU.GL.TEXTURE0);
            this.WGLU.GL.bindTexture(this.WGLU.GL.TEXTURE_2D, id);
            this.WGLU.GL.texImage2D(this.WGLU.GL.TEXTURE_2D, 0, this.image);
            this.WGLU.GL.generateMipmap(this.WGLU.GL.TEXTURE_2D);
 
            this.WGLU.GL.uniform1i(this.WGLU.textureUniforms[name], 0);
        }
    }
 
    
    // XXX these are also clunky
    this.getScale = function() {
        // XXX broken
        //return this.scale.add(this.animation.getScale());
        return this.state.scale;
    }
    this.getPosition = function() {
        return this.state.position.add(this.animation.getPosition());
    }
    this.getRotation = function() {
        return this.state.rotation.add(this.animation.getRotation());
    }
    this.setPosition = function(x, y, z) {
        this.state.setPosition(x,y,z);
    }
    this.setRotation = function(x, y, z) {
        this.state.setRotation(x,y,z);
    }
    this.setScale = function(x, y, z) {
        this.state.setScale(x,y,z);
    }
    this.setScaleUniformly = function(s) {
        this.state.scale = $V([s,s,s]);
    }
 
	// These allow us to do array or element drawing without
	// testing a boolean every frame
	this._drawArrays = function() {
		return (function() {
			this.WGLU.GL.drawArrays(this.type, 0, this.vertexCount)
		});
	}
 
	this._drawElements = function() {
		return (function() {
			this.WGLU.GL.drawElements(this.type, this._elementCount, 
					this.WGLU.GL.UNSIGNED_SHORT, this._elements);
		});
	}
 
	// drawArrays by default
	this._drawFunction = this._drawArrays();
    
    //----------------------------
    // draw this object at the given postion, rotation, and scale
    this.drawAt = function(pos, rot, scale) {
			this.WGLU.programs[this.shaderProgram].use();
            this.bufferArrays();
 
            this.WGLU.modelview.pushMatrix();
 
            this.WGLU.modelview.scale(scale.elements);
            this.WGLU.modelview.rotate(rot.e(2), [1, 0, 0]);
            this.WGLU.modelview.rotate(rot.e(1), [0, 1, 0]);
            this.WGLU.modelview.translate(pos.elements);
            
            this.WGLU.programs[this.shaderProgram].processUniforms();
			this._drawFunction();
 
            this.WGLU.modelview.popMatrix();
    }
 
    
    //----------------------------
    // draw this object at its internally stored position, rotation, and
    // scale, INCLUDING its current animation state
    this.draw = function() {
        this.drawAt(this.getPosition(), this.getRotation(), this.getScale());
    }
 
 
    //----------------------------
    // update the animation
    this.update = function(dt) {
        this.animation.update(dt);
    }
}
//--------------------------------------------------------------------------
 
//--------------------------------------------------------------------------
// WGLUMatrixStack
//
// Operates similarly to the standard OpenGL built in matricies. However
// it is not identical. Rather than calling glMatrixMode, you specify the
// matrix you want to modify prior to the call.
// e.g. if `myTranslationVector` is the vector to translate by then to 
// translate the ModelView matrix you would call
// `wglu.GL.modelview.translate(myTranslationVector);`
//
function WGLUMatrixStack() {
    this._matrixStack = [];
    this.matrix = Matrix.I(4);
 
    //----------------------------
    // converts the matrix to the format we need when we send it to OpenGL
    this.getForUniform = function() {
       return new CanvasFloatArray(this.matrix.flatten());
    }
 
 
    //----------------------------
    // glPushMatrix
    // (c) 2009 Vladimir Vukicevic
    this.pushMatrix = function (m) {
        if (m) {
            this._matrixStack.push(m.dup());
            this.matrix = m.dup();
        } else {
            this._matrixStack.push(this.matrix.dup());
        }
    }
 
    //----------------------------
    // glPopMatrix
    // (c) 2009 Vladimir Vukicevic
    this.popMatrix = function () {
        if (this._matrixStack.length === 0) {
            throw "Invalid popMatrix!";
        }
        this.matrix = this._matrixStack.pop();
        return this.matrix;
    }
 
    //----------------------------
    // glMultMatrix
    // (c) 2009 Vladimir Vukicevic
    this.multMatrix = function (m) {
        this.matrix = this.matrix.x(m);
    }
    //----------------------------
    // glTranslate
    // (c) 2009 Vladimir Vukicevic
    this.translate = function (v) {
        var m = Matrix.Translation($V([v[0],v[1],v[2]])).ensure4x4();
        this.multMatrix(m);
    }
 
    //----------------------------
    // glRotate
    // (c) 2009 Vladimir Vukicevic
    this.rotate = function (ang, v) {
        var arad = ang * Math.PI / 180.0;
        var m = Matrix.Rotation(arad, $V([v[0], v[1], v[2]])).ensure4x4();
        this.multMatrix(m);
    }
 
    //----------------------------
    // glScale
    // (c) 2009 Vladimir Vukicevic
    this.scale = function (v) {
        var m = Matrix.Diagonal([v[0], v[1], v[2], 1]);
        this.multMatrix(m);
    }
 
    //----------------------------
    // invert
    // (c) 2009 Vladimir Vukicevic
    this.invert = function () {
        this.matrix = this.matrix.inv();
    }
 
    //----------------------------
    // glLoadIdentity
    // (c) 2009 Vladimir Vukicevic
    this.loadIdentity = function () {
        this.matrix = Matrix.I(4);
    }
}
//--------------------------------------------------------------------------
 
function WGLUObjectState() {
    this.scale      = $V([1,1,1]);
	this.position	= Vector.Zero(3);
	this.rotation	= Vector.Zero(3);
 
    this.setPosition = function(x, y, z) {
        this.position.elements = [x, y, z];
    }
    this.setRotation = function(x, y, z) {
        this.rotation.elements = [x, y, z];
    }
    this.setScale = function(x, y, z) {
        this.scale.elements = [x, y, z];
    }
}
 
function WGLUAnimation() {
        this.age = 0;
        this.state = new WGLUObjectState();
 
        // Updaters
        this.update = function(dt) {
            this.age += dt;
            this.updatePosition(dt);
            this.updateRotation(dt);
            this.updateScale(dt);
        }
 
        this.updatePosition = function(dt) { 
        }
        this.updateRotation = function(dt) { 
        }
        this.updateScale 	= function(dt){ 
        }
 
        this.getPosition = function() 	{ return this.state.position; 	}
        this.getScale 	 = function()  	{ return this.state.scale;		}
        this.getRotation = function() 	{ return this.state.rotation;	}
}
 
function WGLUTimer() {
	this.t  = (new Date()).getTime();
	this.dt = 0;
	this.pt = 0;
 
	this.tick = function() {
		this.t = (new Date()).getTime();
		this.dt = this.t - this.pt;
		this.pt = this.t;
	}
}
 
function WGLUFPSTracker() {
	this.frameAvgCount = 50; // number of frames to average over
 
	// frame timing statistics
	this.mspf= 0; // milliseconds per frame
	this.fps = 0;
	this.recentFPS = []; // last several FPS calcs to average over
 
	this.update = function(dt) {
		this.mspf += dt; // add this past frame time and renormalize
		this.mspf /= 2;
 
		if (this.recentFPS.unshift(Math.floor(1000 / this.mspf)) > this.frameAvgCount) {
			this.recentFPS.pop();
		} // average FPS over the past frameAvgCount frames
		
		this.fps = 0;
		for (var i = 0; i < this.recentFPS.length; i++) {
			this.fps += this.recentFPS[i];
		}
		this.fps /= this.recentFPS.length;
	}
}
 
//--------------------------------------------------------------------------
// WGLU
//
// The wglu object itself, 
function WGLU() {
    this._ModelViewUniform = 'ModelViewMatrix';
    this._ProjectionUniform = 'ProjectionMatrix';
 
    // XXX what about if one page has multiple contexts?
    WGLUObject.prototype.WGLU = this;
    WGLUShader.prototype.WGLU = this;
    WGLUShaderProgram.prototype.WGLU = this;
 
    this.GL = null;
 
    this.camera = new WGLUObjectState();
    this.camera.yfov = 75;
    this.camera.aspectRatio = 1;
    this.camera.target = $V([0,0,0]);
    this.camera.setTarget = function(x, y, z) {
        this.target.elements = [x, y, z];
    }
 
    this.objects        = [];
 
    this.shaders        = [];
    this.programs       = [];
 
    this.textureUniformNames = [];
    this.textureUniforms = [];
 
	this.timer = new WGLUTimer();
	this.fpsTracker = new WGLUFPSTracker();
	this.FPS = 0;
 
 
    this.draw = function() {
        this.clear();
 
        this.modelview.loadIdentity();
        this.projection.loadIdentity();
 
        this.projection.multMatrix(this.perspective(
            this.camera.yfov, this.camera.aspectRatio, 
            0.01, 10000)); 
        this.projection.multMatrix(this.lookAt(
            this.camera.position.e(1),
            this.camera.position.e(2),
            this.camera.position.e(3),
            this.camera.target.e(1),
            this.camera.target.e(2),
            this.camera.target.e(3),
            0,1,0));
 
        this.drawObjects();                            
    }
 
    // logging
    this._noFun   = function() {return (function(){});}
    this._logFn= this._noFun();
    this._logGroupFn = this._noFun();
    this._logGroupEndFn = this._noFun();
 
    // pass a message and a parameter to start a logging group
    // pass a message without a parameter to close the open grouping
    this._firebugLog   = function() {
        return (function(msg){
            console.log(msg);
        });
    }
    this._firebugLogGroupFn = function() {
        return (function(param){
            console.group(param);
        });
    }
    this._firebugLogGroupEndFn = function() {
        return (function(){
            console.groupEnd();
        });
    }
 
 
	this.log = function(msg, param) {
        this._logFn(msg, param);
	}
    this.logGroup = function(param) {
        this._logGroupFn(param);
    }
    this.logGroupEnd = function(param) {
        this._logGroupEndFn(param);
    }
 
    this.enableLogging = function(type) {
        if (type = 'firebug') {
            this._logFn = this._firebugLog();
            this._logGroupFn = this._firebugLogGroupFn();
            this._logGroupEndFn = this._firebugLogGroupEndFn();
        }
        this.log('logging enabled');
    }
 
    this.disableLogging = function() {
        this.log('disabling logging');
        this._logFunction = this._noFun();
            this._logGroupFn =  this._noFun();
            this._logGroupEndFn = this._noFun();
        this.log('logging failed to disable');
    }
 
	this._updateState = function() {
		this.timer.tick();
		this.fpsTracker.update(this.timer.dt);
		this.FPS = this.fpsTracker.fps;
	}
 
	this.update = function() {
		this._updateState();
 
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update(this.timer.dt);
        }
	}
    this.drawObjects = function() {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw();
        }
    }
	this.clear = function() {
		// clearing the color buffer is really slow
		this.GL.clear(this.GL.COLOR_BUFFER_BIT|this.GL.DEPTH_BUFFER_BIT);
	}
 
 
    this.newProgram = function(name) {
        this.programs[name] = new WGLUShaderProgram(name);
    }
 
    //--------------------------------------------------------------------------
    // create the matrix/matrix stacks we'll be using to store
    // transformations
    //--------------------------------------------------------------------------
    this.modelview = new WGLUMatrixStack(); 
    this.projection = new WGLUMatrixStack();
    this.getNormalMatrixForUniform = function() {
        return new CanvasFloatArray(this.modelview.matrix.inverse().transpose().make3x3().flatten());
    }
 
    //--------------------------------------------------------------------------
    // getGLContext
    //
    // Create a context for the specified canvas
    //--------------------------------------------------------------------------
    this.getGLContext = function(canvas) {
        var gl = null;
        var type = '';
 
        try { if (!gl) {                       
                  type = '3d';                 
                  gl = canvas.getContext(type);
        }} catch (e){}
        try { if (!gl) { 
                  type = 'moz-webgl';
                  gl = canvas.getContext(type); 
        }} catch (e){}
        try { if (!gl) {                       
                  type = 'webkit-3d';          
                  gl = canvas.getContext(type);
        }} catch (e){}
 
        this.log('using ' + type);
 
        return gl;
    }
            
    this.addObject = function(obj) {
        this.objects.push(obj);
    }
 
    //--------------------------------------------------------------------------
    // initialize
    //  
    // Initialize this WGLU object's GL system for the canvas
    // object specified by element name, assumes 'canvas' if none is
    // provided
    //--------------------------------------------------------------------------
    this.initialize = function (canvasNode) {
        // Options init
        //this.enableLogging('firebug');
        this.logGroup('initializing WebGLU');
 
        // GL init
        if (!canvasNode) {
            canvasNode = document.getElementById('canvas');
        }
 
        this.GL = null;
        this.GL = this.getGLContext(canvasNode);
 
        // on by default
        if (!!this.GL) {
            this.GL.enable(this.GL.DEPTH_TEST);
            //this.GL.enable(this.GL.TEXTURING);
            //this.GL.enable(this.GL.TEXTURE_2D);
        }
 
        // True when init was successful
        if (!!this.GL) {
            this.log('initialization successful');
        }
        this.logGroupEnd();
        return (!!this.GL);
    }
 
    //----------------------------
    // these are like the OpenGL functions of the same name
	
    //----------------------------
    // glLookAt
    // (c) 2009 Vladimir Vukicevic
    this.lookAt = function (ex, ey, ez,
                            tx, ty, tz,
                            ux, uy, uz) {
            var eye = $V([ex, ey, ez]);
            var target = $V([tx, ty, tz]);
            var up = $V([ux, uy, uz]);
 
            var z = eye.subtract(target).toUnitVector();
            var x = up.cross(z).toUnitVector();
            var y = z.cross(x).toUnitVector();
 
            var m = $M([[x.e(1), x.e(2), x.e(3), 0],
                    [y.e(1), y.e(2), y.e(3), 0],
                    [z.e(1), z.e(2), z.e(3), 0],
                    [0, 0, 0, 1]]);
 
            var t = $M([[1, 0, 0, -ex],
                    [0, 1, 0, -ey],
                    [0, 0, 1, -ez],
                    [0, 0, 0, 1]]);
            return m.x(t);
    }
 
    //----------------------------
    // glOrtho
    // (c) 2009 Vladimir Vukicevic
    this.ortho = 
        function (left, right,
                bottom, top,
                znear, zfar)
        {
            var tx = -(right+left)/(right-left);
            var ty = -(top+bottom)/(top-bottom);
            var tz = -(zfar+znear)/(zfar-znear);
 
            return $M([[2/(right-left), 0, 0, tx],
                    [0, 2/(top-bottom), 0, ty],
                    [0, 0, -2/(zfar-znear), tz],
                    [0, 0, 0, 1]]);
        }
 
    //----------------------------
    // glFrustrum
    // (c) 2009 Vladimir Vukicevic
    this.frustrum = 
        function (left, right,
                bottom, top,
                znear, zfar)
        {
            var X = 2*znear/(right-left);
            var Y = 2*znear/(top-bottom);
            var A = (right+left)/(right-left);
            var B = (top+bottom)/(top-bottom);
            var C = -(zfar+znear)/(zfar-znear);
            var D = -2*zfar*znear/(zfar-znear);
 
            return $M([[X, 0, A, 0],
                    [0, Y, B, 0],
                    [0, 0, C, D],
                    [0, 0, -1, 0]]);
        }
 
    //----------------------------
    // glPerpective
    // (c) 2009 Vladimir Vukicevic
    this.perspective = 
        function (fovy, aspect, znear, zfar)
        {
            var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
            var ymin = -ymax;
            var xmin = ymin * aspect;
            var xmax = ymax * aspect;
 
            return this.frustrum(xmin, xmax, ymin, ymax, znear, zfar);
        }
 
    //----------------------------
    // color constants
    this.red  = [1,0,0];
    this.green= [0,1,0];
    this.blue = [0,0,1];
    this.grey = [0.5, 0.5, 0.5];
    this.white= [1,1,1];
    this.black= [0,0,0];
}
//--------------------------------------------------------------------------
 
//--------------------------------------------------------------------------
// Utility functions
//--------------------------------------------------------------------------
// Takes a 2D array [[1,2],[3,4]] and makes it 1D [1,2,3,4]
//--------------------------------------------------------------------------
Array.prototype.flatten = function() {
    var res = [];
    for (var i = 0; i < this.length; i++) {
        res = res.concat(this[i]);
    }
    return res;
}
 
Array.prototype.remove = function(item) {
	var res = [];
 
	for (var i = 0; i < this.length; i++) {
		if (this[i] != item) {
			res.push(this[i]);
		}
	}
 
	return res;
}
 
// returns the index into this array of
// if it's an array of arrays it assumes the
// item in the first index of each subarry
// is the key.
Array.prototype.indexOf = function(item) {
	for (var i = 0; i < this.length; i++) {
        if (!this[i].length) {
            if (this[i] == item) {
                return i;
            }
        }else {
            if (this[i][0] == item) {
                return i;
            }
        }
	}
}
 
//--------------------------------------------------------------------------
//
// augment Sylvester some
// (c) 2009 Vladimir Vukicevic
//
//--------------------------------------------------------------------------
Matrix.Translation = function (v)
{
  if (v.elements.length == 2) {
    var r = Matrix.I(3);
    r.elements[2][0] = v.elements[0];
    r.elements[2][1] = v.elements[1];
    return r;
  }
 
  if (v.elements.length == 3) {
    var r = Matrix.I(4);
    r.elements[0][3] = v.elements[0];
    r.elements[1][3] = v.elements[1];
    r.elements[2][3] = v.elements[2];
    return r;
  }
 
  throw "Invalid length for Translation";
}
 
Matrix.prototype.flatten = function ()
{
    var result = [];
    if (this.elements.length === 0) {
        return [];
    }
 
 
    for (var j = 0; j < this.elements[0].length; j++) {
        for (var i = 0; i < this.elements.length; i++) {
            result.push(this.elements[i][j]);
        }
    }
    return result;
}
 
Matrix.prototype.ensure4x4 = function()
{
    if (this.elements.length == 4 && 
        this.elements[0].length == 4) {
        return this;
    }
 
    if (this.elements.length > 4 ||
        this.elements[0].length > 4) {
        return null;
    }
 
    for (var i = 0; i < this.elements.length; i++) {
        for (var j = this.elements[i].length; j < 4; j++) {
            if (i == j) {
                this.elements[i].push(1);
            }else {
                this.elements[i].push(0);
            }
        }
    }
 
    for (var i = this.elements.length; i < 4; i++) {
        if (i === 0) {
            this.elements.push([1, 0, 0, 0]);
        }else if (i == 1) {
            this.elements.push([0, 1, 0, 0]);
        }else if (i == 2) {
            this.elements.push([0, 0, 1, 0]);
        }else if (i == 3) {
            this.elements.push([0, 0, 0, 1]);
        }
    }
 
    return this;
};
 
Matrix.prototype.make3x3 = function()
{
    if (this.elements.length != 4 ||
        this.elements[0].length != 4) {
        return null;
    }
 
    return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
                          [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
                          [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};
 
Vector.prototype.flatten = function ()
{
    return this.elements;
};
 
function mht(m) {
    var s = "";
    if (m.length == 16) {
        for (var i = 0; i < 4; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*4+0].toFixed(4) + "," + m[i*4+1].toFixed(4) + "," + m[i*4+2].toFixed(4) + "," + m[i*4+3].toFixed(4) + "]</span><br>";
        }
    } else if (m.length == 9) {
        for (var i = 0; i < 3; i++) {
            s += "<span style='font-family: monospace'>[" + m[i*3+0].toFixed(4) + "," + m[i*3+1].toFixed(4) + "," + m[i*3+2].toFixed(4) + "]</font><br>";
        }
    } else {
        return m.toString();
    }
    return s;
}
//--------------------------------------------------------------------------