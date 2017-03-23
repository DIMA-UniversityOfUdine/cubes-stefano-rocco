function getHeightData(img, scale) {

	if (scale == undefined) {
	 	scale=1;
	}

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d');

    var size = img.width * img.height;
	console.log(size);
    var data = {							// we want to carry width & height properties too
    	map: new Float32Array(size),
    	width: img.width,
    	height: img.height
    };

    context.drawImage(img, 0, 0);

    for (var i = 0; i < size; i++) {
        data.map[i] = 0;
    }

    var imgd = context.getImageData(0, 0, img.width, img.height);
    var pix = imgd.data;

    var j = 0;
    for (var i = 0; i < pix.length; i += 4) {
        var all = pix[i]+pix[i+1]+pix[i+2];  // all is in range 0 - 255*3
        data.map[j++] = scale*all/3;   
    }

    return data;
}

function heightMap(data, material) {

	var terrain = new THREE.Group();
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	
	for (var i = 0; i < data.height; i++) {
		for (var j = 0; j < data.width; j++) {

			var y = data.map[i*data.width+j];
			if (y != 0) {
				var cube = new THREE.Mesh(geometry, material);
				cube.position.set(j+.5, 0, i+.5);
				cube.scale.y = y;
				cube.position.y = y/2;
				terrain.add(cube);
			}
		}
	}
	return terrain;
}