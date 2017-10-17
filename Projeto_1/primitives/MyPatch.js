/**
 * MyPatch
 * @constructor
 */

 function MyPatch(scene,controlpoints,args){
     this.scene = scene;
     this.controlpoints = controlpoints;
     this.args = args;

    this.nurb = this.makeSurface(controlpoints.length-1,controlpoints[0].length-1,controlpoints,args[0],args[1]);
 }

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

 MyPatch.prototype.getKnotsVector = function(degree) { // TODO (CGF 0.19.3): add to CGFnurbsSurface
	
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
		
	var knots1 = this.getKnotsVector(degree1); // to be built inside webCGF in later versions ()
	var knots2 = this.getKnotsVector(degree2); // to be built inside webCGF in later versions
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); // TODO  (CGF 0.19.3): remove knots1 and knots2 from CGFnurbsSurface method call. Calculate inside method.
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, u, v );
	return obj;
}

MyPatch.prototype.display = function(){
    this.nurb.display();
}

MyPatch.prototype.loadTexture = function (texture) {
    
  }