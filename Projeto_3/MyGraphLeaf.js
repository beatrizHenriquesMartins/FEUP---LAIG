/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

function MyGraphLeaf(graph, xmlelem) {
    this.graph = graph;
    var type = this.graph.reader.getItem(xmlelem, 'type', 
                    ['rectangle', 'cylinder', 'sphere', 'triangle', 'patch','obj','board']);
    this.xmlelem = xmlelem;
    this.primitive;
    this.initBuffers(type);
}


/**
 * Initiate the primitive established on xml file for the spefici leaf
 */
MyGraphLeaf.prototype.initBuffers = function (type) {

    //obj draw by blender
    if(type === 'obj'){
        var args = this.graph.reader.getString(this.xmlelem, 'args').split(" ");
        this.primitive = new MyObj(this.graph.scene, args[0]);
    }

    console.log("antes do switch");
    var args = this.graph.reader.getString(this.xmlelem, 'args').split(" ").map(Number);
    switch (type) {
        case 'rectangle':
            this.primitive = new MyQuad(this.graph.scene, args[0], args[1], args[2], args[3]);
            break;
        case 'cylinder':
            this.primitive = new MyCompleteCylinder(this.graph.scene, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            break;
        case 'sphere':
            this.primitive = new MySphere(this.graph.scene, args[0], args[1], args[2]);
            break;
        case 'triangle':
            this.primitive = new MyTriangle(this.graph.scene, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
            break;
        case 'patch':
            this.createPatch(args);
            break;
        case 'board':
            this.primitive = new MyBoard(this.graph.scene, args[0], args[1], args[2]);
            console.log("depois de criar a primitiva board");
            break;
    }
}

/**
 * Parses the xml unique patch args in order to create a primitive of type patch with error detection
 */
MyGraphLeaf.prototype.createPatch = function (args) {
    var u = args[0];
    var v = args[1];

    var cplines = this.xmlelem.children;
    var controlpoints = [];
    
   
    for (let i = 0; i < cplines.length; i++) {
        var nodeName = cplines[i].nodeName;
        if (cplines[i] != null && nodeName == "CPLINE") {
            var aux = cplines[i].children;
            var controlines = [];

            for (let j = 0; j < aux.length; j++) {
                var pointName = aux[j].nodeName;
                if(aux[j] != null && pointName == "CPOINT"){
                    var aux2 = aux[j];
                    var point = [];
                    var x = parseFloat(this.graph.reader.getString(aux2, 'xx'));
                    if(x == null){
                        this.onXMLMinorError("unable to parse x value; point");
                        break;
                    }else if(isNaN(x)){
                        return "non-numeric value for rotation x value of cpoint (leaf ID = " + this.graph.reader.getItem(xmlelem, 'id') + ")";
                    }
                    point.push(x);
                    var y = parseFloat(this.graph.reader.getString(aux2, 'yy'));
                    if(y == null){
                        this.onXMLMinorError("unable to parse y value; point");
                        break;
                    }else if(isNaN(y)){
                        return "non-numeric value for rotation y value of cpoint (leaf ID = " + this.graph.reader.getItem(xmlelem, 'id') + ")";
                    }
                    point.push(y);
                    var z = parseFloat(this.graph.reader.getString(aux2, 'zz'));
                    if(z == null){
                        this.onXMLMinorError("unable to parse z value; point");
                        break;
                    }else if(isNaN(z)){
                        return "non-numeric value for rotation z value of cpoint (leaf ID = " + this.graph.reader.getItem(xmlelem, 'id') + ")";
                    }
                    point.push(z);
                    var w = parseFloat(this.graph.reader.getString(aux2, 'ww'));
                    if(w == null){
                        this.onXMLMinorError("unable to parse w value; point");
                        break;
                    }else if(isNaN(w)){
                        return "non-numeric value for rotation w value of cpoint (leaf ID = " + this.graph.reader.getItem(xmlelem, 'id') + ")";
                    }
                    point.push(w);
                    controlines.push(point);
                }else{
                    this.graph.onXMLMinorError("unknown tag <" + pointName + ">");
                }
            }
            controlpoints.push(controlines);
        }else{
            this.graph.onXMLMinorError("unknown tag <" + nodeName+ ">");
        }
    }

    this.primitive = new MyPatch(this.graph.scene, controlpoints, args);
}