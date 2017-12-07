/**
 * MyPatch
 * @param {*} scene the xml scene
 * @param {*} controlpoints arrays of arrays of arrays with the control lines and points of the nurb
 * @param {*} args slices and stacks of the nurb
 */

 function MyPatch(scene,controlpoints,args){
     this.scene = scene;
     this.controlpoints = controlpoints;
     this.args = args;

     this.nurb = this.makeSurface(controlpoints.length-1,controlpoints[0].length-1,controlpoints,args[0],args[1]);
 }

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

 MyPatch.prototype.getKnotsVector = function(degree) { 
	var v = new Array();

	for (var i=0; i<=degree; i++) {
		v.push(0);
	}

	for (var i=0; i<=degree; i++) {
		v.push(1);
	}

	return v;
}


MyPatch.prototype.makeSurface = function (degree1, degree2, controlvertexes,u,v) {

	var knots1 = this.getKnotsVector(degree1);
	var knots2 = this.getKnotsVector(degree2);

	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, u, v );
	return obj;
}
/**
 * Overload of the display function
 */
MyPatch.prototype.display = function(){
    this.nurb.display();
}
/**
 * //Function that applies the amp factors of the texture, since it is isnt necessary on the patch this 
 * function only exist to overload convenience
 */
MyPatch.prototype.loadTexture = function (texture) {

}
