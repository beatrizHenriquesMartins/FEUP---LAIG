/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

function MyGraphLeaf(graph, xmlelem) {

    this.graph = graph;
    var type = this.graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle', 'patch']);
    this.xmlelem = xmlelem;
    this.primitive;
    this.initBuffers(type);

}



MyGraphLeaf.prototype.initBuffers = function (type) {

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

    }
}


MyGraphLeaf.prototype.createPatch = function (args){


    var u =args[0];
    var v =args[1];

    var cplines = this.xmlelem.children;
    var controlpoints = [];
    for(let i = 0; i < cplines.length ;i++)
    {
        var aux = cplines[i].children;
        var controlines =[];
    
        for(let j = 0; j < aux.length;j++)
        {
            var aux2 = aux[j];
            var point = [];
            var x =  parseFloat(this.graph.reader.getString(aux2, 'xx'));
            point.push(x);
            var y = parseFloat(this.graph.reader.getString(aux2, 'yy'));
            point.push(y);
            var z = parseFloat(this.graph.reader.getString(aux2, 'zz'));
            point.push(z);
            var w = parseFloat(this.graph.reader.getString(aux2, 'ww'));
            point.push(w);
            controlines.push(point);

        }
        controlpoints.push(controlines);
    
    

    }
    this.primitive = new MyPatch(this.graph.scene,controlpoints,args);
}
