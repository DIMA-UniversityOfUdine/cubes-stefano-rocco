class TranslationAnimation extends AbstractAnimation {

	constructor(object, controller, direction) {

		super(object, controller);
		this.direction = direction.normalize();
		this.position = 0;
	}

	begin() {

		this.position = 0;
		super.begin();
	}

	_computeMatrix(time_from_init, time_delta) {

		this.position = this.controller(this.position, time_from_init, time_delta);
		var matrix = (new THREE.Matrix4());
		var v = (new THREE.Vector3()).copy(this.direction).multiplyScalar(this.position);
		matrix.makeTranslation(v.x, v.y, v.z);
		return matrix;
	}

	invert() {

		this.direction.multiplyScalar(-1);
		this.position = -this.position;
	}

	/** Returns the current position relative to the direction.
	*/
	getPosition() {
		return this.position;
	}

	/** Sets a new position relative to the direction and resp. to the original translation.
	*/
	setPosition(position) {

		if (this.active) {
			var v = (new THREE.Vector3()).copy(direction).multiplyScalar(position);
			this.object.matrix = (new THREE.Matrix4()).makeTranslation(v.x, v.y, v.z);
			this.object.matrix.premultiply(this.matrix_chain);
			this.object.matrix.multiply(this.matrix_init);
			this.position = position;
		}
	}

	/** Sets a new original position relative to the direction form which to start the animation.
	*/
	setInitPosition(position) {

		var v = (new THREE.Vector3()).copy(direction).multiplyScalar(position);
		this.matrix_init = (new THREE.Matrix4()).makeTranslation(v.x, v.y, v.z);
	}
}