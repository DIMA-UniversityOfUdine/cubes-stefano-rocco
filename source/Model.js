var materials = [
	new THREE.MeshPhongMaterial({ color: 0x543215 }),	// 0	kobicha (brown)
	new THREE.MeshPhongMaterial({ color: 0xf2f0e6 }),	// 1	alabaster
	new THREE.MeshPhongMaterial({ color: 0xb7410e }),	// 2	rust (brown)
	new THREE.MeshPhongMaterial({ color: 0x960018 }),	// 3	carmine
	new THREE.MeshPhongMaterial({ color: 0x003320 }),	// 4	dark green
	new THREE.MeshPhongMaterial({ color: 0xd70f01 }),	// 5	persian red
	new THREE.MeshPhongMaterial({ color: 0xc00e0e }),	// 6	carnelian red
	new THREE.MeshPhongMaterial({ color: 0x00363e }),	// 7	midnight green
	new THREE.MeshPhongMaterial({ color: 0x01796f }),	// 8	pine green
	new THREE.MeshPhongMaterial({ color: 0xa0a0a0 }),	// 9	grey
	new THREE.MeshPhongMaterial({ color: 0x101010 }),	// 10	very dark grey
	new THREE.MeshPhongMaterial({ color: 0xefcc00 }),	// 11	yellow (Munsell)
	new THREE.MeshPhongMaterial({ color: 0x606060 })	// 12	dark grey
]

// grouping is used for convenience
// ----------------------------------------------------------- temple
function drawTemple() {

	var geometry = new THREE.BoxGeometry(1, 1, 1)
	var box;

	var temple_body = new THREE.Group();
	var temple_layer_scale = 1;
	var ypos_tot = 0;

	for (var h = 0; h < 3; h++) {							// for each temple layer

		var temple_layer = new THREE.Group();
		var ypos = 0;

		// base: 3 layers, each one on top of the other
		var layers_yscales = [2.2, .3, .5];
		var layers_xzscales = [2.5, 2.8, 2.8];
		var layers_materials = [[0, 1, 2], [3, 3, 3], [1, 1, 1]];

		for (var i = 0; i < layers_yscales.length; i++) {
			var layer = new THREE.Group();					// new base layer
			var yscale = layers_yscales[i];
			layer.position.y = ypos;						// put base layer on top

			box = new THREE.Mesh(geometry);					// layers have the same x-z
			box.scale.set(3, yscale, 3);						// proportions
			layer.add(box);

			box = box.clone();
			box.scale.set(4, yscale, 2);
			layer.add(box);

			box = box.clone();
			box.rotation.y = Math.PI/2;
			layer.add(box);

			for (var j = 0; j < layer.children.length; j++) {
				var material = materials[layers_materials[i][j]];
				layer.children[j].scale.multiplyScalar(layers_xzscales[i]);
				layer.children[j].scale.y = yscale;
				layer.children[j].position.y = yscale/2;
				layer.children[j].material = material;
			}
			temple_layer.add(layer);
			ypos += yscale;
		}
		
		// 3 sets of columns, in order: front, corner, side

		var columns_xshifts = [1.5+h/2, 1.5, .5+h/2];		// adds a bit of variation
		var columns_numofcols = [2, 3-2*h, 11-2*h];				// between two temple layers
		var columns_numofsubsets = [2, 4, 2];
		var columns_yrots = [0, Math.PI/4, Math.PI/2];
		var columns_materials = [4, 5, 5];

		for (var i = 0; i < columns_xshifts.length; i++) {
			for (var j = 0; j < columns_numofsubsets[i]; j++) {
				var columns = new THREE.Group();
				columns.rotation.y = columns_yrots[i];
				columns.rotation.y += j*2*Math.PI/columns_numofsubsets[i];
				var material = materials[columns_materials[i]];

				for (var k = 0; k < columns_numofcols[i]; k++) {
					// displace columns in base steps of 0, -1, 1... for odd; -1, 1... for
						// even numbers of columns (in one subset)
					var xstep = Math.ceil((k+(1-columns_numofcols[i]%2))/2);
					var xshift = columns_xshifts[i]*Math.pow(-1,k)*xstep;

					col = new THREE.Mesh(geometry, material);
					col.scale.set(.2, ypos, .2);			// y-scale to current top
					col.rotation.y = columns_yrots[i];			// position
					col.position.set(xshift, ypos/2, 6);
					columns.add(col);
				}
				temple_layer.add(columns);
			}
		}
		
		// roof: 4 layers, one on top of the other
		var roof = new THREE.Group();
		roof.position.y = ypos;								// put on current top position
		var roof_zscales = [13, 15, 18, 13];
		var roof_materials = [6, 7, 8, 8];

		for (var i = 0; i < 2; i++) {
			var half = new THREE.Group();
			
			for (var j = 0; j < roof_zscales.length; j++) {
				var material = materials[roof_materials[j]];
				box = new THREE.Mesh(geometry, material);
				box.scale.set(9.5, .5, roof_zscales[j]);
				half.add(box);
			}

			ypos = 0;
			yscale = 0;
			for (var j = 0; j < half.children.length; j++) {
				ypos += (yscale + half.children[j].scale.y)/2;
				half.children[j].rotation.y = i*Math.PI/2;
				half.children[j].position.y = ypos;			// put "half" layer on top
				yscale = half.children[j].scale.y;
			}
			roof.add(half);
		}
		box = new THREE.Mesh(geometry, materials[7]);		// central top box
		box.scale.set(9.5, 1, 9.5);
		ypos += (yscale + box.scale.y)/2;
		box.position.y = ypos;
		roof.add(box);

		temple_layer.add(roof);
		ypos = roof.position.y + ypos + box.scale.y/2;		// current top position

		// merge whole temple layer and put on top of the temple body
		temple_layer.scale.multiplyScalar(temple_layer_scale);
		temple_layer.position.y = ypos_tot;
		ypos_tot += ypos*temple_layer_scale;
		temple_layer_scale *= .75;
		temple_body.add(temple_layer);
	}

	// rooftop
	var temple_rooftop = new THREE.Group();
	temple_rooftop.scale.multiplyScalar(temple_layer_scale);
	temple_rooftop.position.y = ypos_tot;

	box = new THREE.Mesh(geometry, materials[7]);
	box.scale.set(6, 2, 6);
	box.position.y = box.scale.y/2;
	var yscale = box.scale.y;
	temple_rooftop.add(box);

	box = box.clone();
	box.scale.set(2, 2, 2);
	box.position.y += (yscale + box.scale.y)/2;
	temple_rooftop.add(box);

	// temple base
	var temple_base = new THREE.Group();

	var box = new THREE.Mesh(geometry, materials[9]);
	box.scale.set(13, 3, 13);
	temple_base.add(box);
	{														// temple base details
		for (var i = 0; i < 3; i++) {
			var temple_base_detail = new THREE.Group();
			var n = 10;
			var box1;
			for (var j = 0; j < n; j++) {
				box1 = new THREE.Mesh(geometry, materials[12]);
				box1.scale.set(.3, 1, .3);
				box1.position.x = -box.scale.x/2 + (.5+j)/n*box.scale.x;
				box1.position.y = (box.scale.y + box1.scale.y)/2;
				box1.position.z = box.scale.z/2;
				temple_base_detail.add(box1);
			}
			var box2 = new THREE.Mesh(geometry, materials[12]);
			box2.scale.set(box.scale.x, .6, .1);
			box2.scale.x -= box2.scale.z;
			box2.position.y = box1.position.y;
			box2.position.z = box.scale.z/2;
			temple_base_detail.add(box2);

			temple_base_detail.rotation.y = (i+1)*Math.PI/2;
			temple_base.add(temple_base_detail);
		}
	}

	// merge all
	temple_base.position.y = box.scale.y/2;
	temple_body.position.y += box.scale.y;
	temple_rooftop.position.y += box.scale.y;

	temple = new THREE.Group();
	temple.add(temple_base);
	temple.add(temple_body);
	temple.add(temple_rooftop);

	return temple;
}


// ----------------------------------------------------------- lantern

function drawLantern() {

	var geometry = new THREE.BoxGeometry(1, 1, 1)
	var box;

	var lantern = new THREE.Group();
	var ypos;

	box = new THREE.Mesh(geometry, materials[10]);			// cord
	box.scale.set(.1, 2, .1);
	box.position.y = -box.scale.y/2;
	lantern.add(box);
	ypos = box.position.y - box.scale.y/2;

	box = new THREE.Mesh(geometry, materials[11]);			// base
	box.scale.set(.5, 3, .5);
	box.position.y = ypos - box.scale.y/2;;
	lantern.add(box);
	ypos = box.position.y;

	box = new THREE.Mesh(geometry, materials[5]);			// body	
	box.scale.set(1.3, 2.5, 1.3);
	box.position.y = ypos;
	lantern.add(box);

	box = box.clone();
	box.rotation.y = Math.PI/4;
	lantern.add(box);

	return lantern;
}


// ----------------------------------------------------------- arch

function drawArch() {

	var geometry = new THREE.BoxGeometry(1, 1, 1)
	var box;

	var arch = new THREE.Group();
	var ypos = 12;

	column = new THREE.Mesh(geometry, materials[5]);		// columns
	
	column.scale.set(.5, ypos, .5);
	column.position.set(3.5, ypos/2, 0);
	arch.add(column);

	column = column.clone();
	column.position.x = -column.position.x;
	arch.add(column);

	var middle_arch = new THREE.Group();
	middle_arch.position.y = .85 * ypos;

	box = new THREE.Mesh(geometry, materials[6]);			// middle arch
	box.scale.set(10, 1.5, 1);
	middle_arch.add(box);
	{														// middle arch details
		box1 = box.clone();
		box1.scale.set(1, 2, 1);
		box1.position.x = (box1.scale.x + box.scale.x)/2 
		box1.position.y += (box1.scale.y - box.scale.y)/2;
		middle_arch.add(box1);

		box1 = box1.clone();
		box1.position.x = -box1.position.x;
		middle_arch.add(box1);

		for (var i = 0; i < 3; i++) {						// lanterns
			var lantern = drawLantern();
			var xlantern = Math.pow(-1, i)*Math.floor((i+1)/2)*2;
			lantern.scale.multiplyScalar(.5);
			lantern.position.set(xlantern, -box.scale.y/2, 0);
			middle_arch.add(lantern);
		}
	}
	arch.add(middle_arch);

	top_arch = box.clone();									// top arch
	top_arch.scale.set(9, 1, 1);
	top_arch.position.y = ypos + top_arch.scale.y/2;
	ypos = top_arch.position.y + top_arch.scale.y/2;
	arch.add(top_arch);

	{														// more details
		box1 = new THREE.Mesh(geometry, materials[5]);
		box1.scale.set(.5, top_arch.position.y-middle_arch.position.y, .5);
		box1.position.y = top_arch.position.y - box1.scale.y/2;
		arch.add(box1);
	}

	roof = new THREE.Mesh(geometry, materials[7]);			// roof
	roof.scale.set(13, .5, 2);
	roof.position.y = ypos + roof.scale.y/2;
	arch.add(roof);

	return arch;
}