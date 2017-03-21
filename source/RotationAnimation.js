class RotationAnimation extends AbstractAnimation {

	/** Constructs a new simple rotation animation on the object and which step is defined by the
	*	controller, which must be a function of the form:
	*
	*	function((number)angle_radians, (number)time_since_begin, (number)time_since_last_step)
	*
	*	and returning the new angle from which to build the transformation matrix.
	*/
	constructor(object, controller, axis) {

		super(object, controller);
		this.axis = axis;
		this.angle = 0;
	}

	begin() {

		this.angle = 0;
		super.begin();
	}

	_computeMatrix(time_from_init, time_delta) {

		this.angle = this.controller(this.angle, time_from_init, time_delta);
		var matrix = (new THREE.Matrix4()).makeRotationAxis(this.axis, this.angle);
		return matrix;
	}

	invert() {

		this.axis.multiplyScalar(-1);
		this.angle = -this.angle;
	}

	/** Returns the current angle resp. to the rotation axis.
	*/
	getAngle() {
		return this.angle;
	}

	/** Sets a new angle resp. to the rotation axis and the original rotation.
	*/
	setAngle(angle) {

		if (this.active) {
			this.object.matrix = (new THREE.Matrix4()).makeRotationAxis(this.axis, angle);
			this.object.matrix.premultiply(this.matrix_chain);
			this.object.matrix.multiply(this.matrix_init);
			this.angle = angle;
		}
	}

	/** Sets a new original rotation resp. to the rotation axis form which to start the animation.
	*/
	setInitAngle(angle) {

		this.matrix_init = (new THREE.Matrix4()).makeRotationAxis(this.axis, angle);
	}
}