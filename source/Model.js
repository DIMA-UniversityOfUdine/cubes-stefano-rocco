var colors = [
	0x543215,	// 0	kobicha (brown)
	0xf2f0e6,	// 1	alabaster
	0xb7410e,	// 2	rust (brown)
	0x960018,	// 3	carmine
	0x003320,	// 4	dark green
	0xd70f01,	// 5	persian red
	0xc00e0e,	// 6	carnelian red
	0x00363e,	// 7	midnight green
	0x01796f,	// 8	pine green
	0xa0a0a0,	// 9	grey
	0x101010,	// 10	very dark grey
	0xefcc00,	// 11	yellow (Munsell)
	0x606060	// 12	dark grey
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
		var layers_colors = [[0, 1, 2], [3, 3, 3], [1, 1, 1]];

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
				var material = new THREE.MeshPhongMaterial({ color: colors[layers_colors[i][j]] });
				layer.children[j].scale.multiplyScalar(layers_xzscales[i]);
				layer.children[j].scale.y = yscale;
				layer.children[j].position.y = yscale/2;
				layer.children[j].material = material;
				layer.children[j].receiveShadow = true;
			}
			temple_layer.add(layer);
			ypos += yscale;
		}
		
		// 3 sets of columns, in order: front, corner, side

		var columns_xshifts = [1.5+h/2, 1.5, .5+h/2];		// adds a bit of variation
		var columns_numofcols = [2, 3-2*h, 11-2*h];				// between two temple layers
		var columns_numofsubsets = [2, 4, 2];
		var columns_yrots = [0, Math.PI/4, Math.PI/2];
		var columns_colors = [4, 5, 5];

		for (var i = 0; i < columns_xshifts.length; i++) {
			for (var j = 0; j < columns_numofsubsets[i]; j++) {
				var columns = new THREE.Group();
				columns.rotation.y = columns_yrots[i];
				columns.rotation.y += j*2*Math.PI/columns_numofsubsets[i];
				var material = new THREE.MeshPhongMaterial({ color: colors[columns_colors[i]] });

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
		var roof_colors = [6, 7, 8, 8];

		for (var i = 0; i < 2; i++) {
			var half = new THREE.Group();
			
			for (var j = 0; j < roof_zscales.length; j++) {
				var material = new THREE.MeshPhongMaterial({ color: colors[roof_colors[j]] });
				box = new THREE.Mesh(geometry, material);
				box.scale.set(9.5, .5, roof_zscales[j]);
				box.castShadow = true;
				box.receiveShadow = true;
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
		var material = new THREE.MeshPhongMaterial({ color: colors[7] });
		box = new THREE.Mesh(geometry, material);			// central top box
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

	var material;

	// rooftop
	var temple_rooftop = new THREE.Group();
	temple_rooftop.scale.multiplyScalar(temple_layer_scale);
	temple_rooftop.position.y = ypos_tot;

	material = new THREE.MeshPhongMaterial({ color: colors[7] });
	box = new THREE.Mesh(geometry, material);
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

	material = new THREE.MeshPhongMaterial({ color: colors[9] });
	var box = new THREE.Mesh(geometry, material);
	box.scale.set(13, 3, 13);
	temple_base.add(box);
	{														// temple base details
		for (var i = 0; i < 3; i++) {
			var temple_base_detail = new THREE.Group();
			var n = 10;
			var box1;
			for (var j = 0; j < n; j++) {
				material = new THREE.MeshPhongMaterial({ color: colors[12] });
				box1 = new THREE.Mesh(geometry, material);
				box1.scale.set(.3, 1, .3);
				box1.position.x = -box.scale.x/2 + (.5+j)/n*box.scale.x;
				box1.position.y = (box.scale.y + box1.scale.y)/2;
				box1.position.z = box.scale.z/2;
				temple_base_detail.add(box1);
			}
			var box2 = new THREE.Mesh(geometry, material);
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

	var material = new THREE.MeshPhongMaterial({ color: colors[10] });
	box = new THREE.Mesh(geometry, material);			// cord
	box.scale.set(.1, 2.5, .1);
	box.position.y = -box.scale.y/2;
	box.castShadow = true;
	lantern.add(box);
	ypos = box.position.y - box.scale.y/2;

	material = new THREE.MeshPhongMaterial({ color: colors[11] });
	box = new THREE.Mesh(geometry, material);			// base
	box.scale.set(.5, 3, .5);
	box.position.y = ypos - box.scale.y/2;;
	box.castShadow = true;
	lantern.add(box);
	ypos = box.position.y;

	material = new THREE.MeshPhongMaterial({ color: colors[5] });
	box = new THREE.Mesh(geometry, material);			// body	
	box.scale.set(1.3, 2.5, 1.3);
	box.position.y = ypos;
	box.castShadow = true;
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
	var ypos = 14;

	var material = new THREE.MeshPhongMaterial({ color: colors[5] });
	column = new THREE.Mesh(geometry, material);			// columns
	
	column.scale.set(.5, ypos, .5);
	column.position.set(3.5, ypos/2, 0);
	column.castShadow = true;
	arch.add(column);

	column = column.clone();
	column.position.x = -column.position.x;
	arch.add(column);

	var middle_arch = new THREE.Group();
	middle_arch.position.y = .85 * ypos;

	material = new THREE.MeshPhongMaterial({ color: colors[6] });
	box = new THREE.Mesh(geometry, material);				// middle arch
	box.scale.set(10, 1.5, 1);
	box.castShadow = true;
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
		/*
		for (var i = 0; i < 3; i++) {						// lanterns
			var lantern = drawLantern();
			var xlantern = Math.pow(-1, i)*Math.floor((i+1)/2)*2;
			lantern.scale.multiplyScalar(.5);
			lantern.position.set(xlantern, -box.scale.y/2, 0);
			middle_arch.add(lantern);
		}
		*/
	}
	arch.add(middle_arch);

	top_arch = box.clone();									// top arch
	top_arch.scale.set(9, 1, 1);
	top_arch.position.y = ypos + top_arch.scale.y/2;
	ypos = top_arch.position.y + top_arch.scale.y/2;
	arch.add(top_arch);

	{														// more details
		material = new THREE.MeshPhongMaterial({ color: colors[5] });
		box1 = new THREE.Mesh(geometry, material);
		box1.scale.set(.5, top_arch.position.y-middle_arch.position.y, .5);
		box1.position.y = top_arch.position.y - box1.scale.y/2;
		box1.castShadow = true;
		arch.add(box1);
	}

	material = new THREE.MeshPhongMaterial({ color: colors[7] });
	roof = new THREE.Mesh(geometry, material);				// roof
	roof.scale.set(13, .5, 2);
	roof.position.y = ypos + roof.scale.y/2;
	roof.castShadow = true;
	arch.add(roof);

	return arch;
}

// --------------------------------------------------------- lights

function drawLights() {
    var lan = new THREE.Group();
    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 0.7, transparent: true } );
    light = new THREE.Mesh( geometry, material );
    light.position.y = 20;
    light.receiveShadow = true;
    lan.add(light);
    
    var bulbLight;
    var bulbMat;
    var bulbGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    bulbLight = new THREE.PointLight(0x0000ff, 2, 4, 3);
    bulbMat = new THREE.MeshStandardMaterial( {emissive: 0xffffee, emissiveIntensity: 100, color: 0x0000ff});
    bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat) );
    bulbLight.castShadow = true;
    bulbLight.position.y = 20;
    lan.add(bulbLight);
    
    var geometry = new THREE.BoxGeometry(0.03, 0.5, 0.03);
    var material = new THREE.MeshBasicMaterial( {color: 0x000000});
    bas = new THREE.Mesh(geometry, material);
    bas.position.y = 20.5;
    lan.add(bas);
    
    return lan;
    
            
}

// --------------------------------------------------------- fountain

function drawFountain() {
    var fountain = new THREE.Group();
    
    var geometry = new THREE.BoxGeometry(0.4, 0.2, 0.8);
    var material = new THREE.MeshBasicMaterial( {color: 0x776666} );
    var front = new THREE.Mesh(geometry, material);
    front.position.x = 23.7;
    front.position.y = 19.05;
    front.position.z = 6;
    fountain.add(front);
    
    var geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    var lefteye = new THREE.Mesh(geometry, material);
    lefteye.position.x = 23.9;
    lefteye.position.y = 19.05;
    lefteye.position.z = 5.8;
    fountain.add(lefteye);
    
    var geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    var righteye = new THREE.Mesh(geometry, material);
    righteye.position.x = 23.9;
    righteye.position.y = 19.05;
    righteye.position.z = 6.2;
    fountain.add(righteye);
    
    var geometry = new THREE.BoxGeometry(0.05, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial( {color: 0x444444} );
    var leftear = new THREE.Mesh(geometry, material);
    leftear.position.x = 23.6;
    leftear.position.y = 19.2;
    leftear.position.z = 5.75;
    fountain.add(leftear);
    
    var geometry = new THREE.BoxGeometry(0.05, 0.1, 0.1);
    var material = new THREE.MeshBasicMaterial( {color: 0x444444} );
    var rightear = new THREE.Mesh(geometry, material);
    rightear.position.x = 23.6;
    rightear.position.y = 19.2;
    rightear.position.z = 6.25;
    fountain.add(rightear);
    
    var geometry = new THREE.BoxGeometry(0.8, 0.5, 0.8);
    var material = new THREE.MeshBasicMaterial( {color: 0x707070} );
    var muzzle = new THREE.Mesh(geometry, material);
    muzzle.position.x = 23.9;
    muzzle.position.y = 18.7;
    muzzle.position.z = 6;
    fountain.add(muzzle);
    
    
    return fountain;
}
