/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

function MyGraphLeaf(graph, xmlelem) {

    this.graph = graph;
    var specs = [];
    var type = this.graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);
    var args = xmlelem.args;
    console.log(args, "teste");


    switch (type) {
        case 'rectangle':
            this.primitive = new MyQuad(this.graph.scene);
            break;
        case 'cylinder':
            break;
        case 'sphere':
            break;
        case 'triangle':
            break;
    }

}
