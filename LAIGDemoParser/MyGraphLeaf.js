/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

function MyGraphLeaf(graph, xmlelem) {

    this.graph = graph;
    var type = this.graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);
    this.xmlelem = xmlelem;
    this.primitive;
    this.initBuffers(type);

}



MyGraphLeaf.prototype.initBuffers = function (type) {

        var args = this.graph.reader.getString(this.xmlelem, 'args').split(" ").map(Number);
        console.log(args, "teste");
        switch (type) {
            case 'rectangle':
                this.primitive = new MyQuad(this.graph.scene, args[0], args[1], args[2], args[3]);
                break;
            case 'cylinder':
                this.primitive = new MyCylinder(this.graph.scene, args[0], args[1], args[2], args[3], args[4]);
                break;
            case 'sphere':
                this.primitive = new MySphere(this.graph.scene, args[0], args[1], args[2]);
                break;
            case 'triangle':
                this.primitive = new MyTriangle(this.graph.scene, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
                break;

        }
    }
