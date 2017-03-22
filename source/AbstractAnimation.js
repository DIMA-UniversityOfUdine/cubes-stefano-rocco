class AbstractAnimation {

	/** Constructs a new animation on the object and which step is defined by the controller,
	*	which is a function defined by the caller and of the form:
	*
	*	function((number)time_since_begin, (number)time_since_last_step, ...)
	*
	*	where any additional parameter is specified by the concrete class. In particular,
	*	the two time parameters shown above shall be affected by velocity.
	*/
	constructor(object, controller) {

		if (this.constructor == AbstractAnimation) {
			throw new Error('Abstract class.');
		}
		this.object = object;
		this.controller = controller;
		this.velocity = 1;
		this.next = null;
		this.matrix_init = new THREE.Matrix4();
		this.matrix_chain = new THREE.Matrix4();
		this.matrix_last = new THREE.Matrix4();
		this.active = false;
	}

	/** Starts this animation by activating it and resetting time.
	*/
	begin() {

		this.active = true;
		this.time_shift = 0;
		this.time_init = Date.now();
		this.time_curr = this.time_init;
	}

	/** Resumes this animation by activating it, without resetting its state. If recursive = true
	*	also resumes active chain, default is true.
	*/
	resume(recursive = true) {

		if (!this.active) {
			this.active = true;
			this._resume(Date.now(), recursive);
		}
	}

	/** Protected */
	_resume(time, recursive) {

		if (this.isActive) {
			this.time_shift -= time - this.time_curr;
			this.time_curr = time;
			if (recursive && this.next != null) {
				this.next._resume(time, recursive);
			}
		}
	}

	/** Performs a step of this animation by calling the controller on the object, both passed as
	*	arguments of the constructor. The animation will replace the object's local matrix without
	*	setting the property .matrixAutoUpdate to false.
	*/
	perform() {

		if (this.active) {
			var time = Date.now();
			var time_delta = (time - this.time_curr) * this.velocity;
			this.time_shift += time_delta - (time - this.time_curr);
			var time_from_init = time - this.time_init + this.time_shift;
			
			this.matrix_last = this._computeMatrix(time_from_init, time_delta);
			this.matrix_last.multiply(this.matrix_init);

			if (this.next != null) {
				this.matrix_chain = this.next.perform();
				this.matrix_last.multiply(this.object.matrix);
			}			
			this.time_curr = time;
		}
		this.object.matrix.copy(this.matrix_last);
		return this.matrix_last;
	}

	/** Protected */
	_computeMatrix(time_from_init, time_delta) {
		throw new Error('Abstract method.');
	}

	/** Inverts this animation. */
	invert() {
		throw new Error('Abstract method.');
	}

	end() {
		this.active = false;
	}

	/** Tells if this animation is running or, more generally, if it's perform()able. */
	isActive() {
		return this.active;
	}

	/**	Chains the animation passed as argument to this animation, provided they operate on the
	*	same object, so that this animation will take place AFTER the chained one.
	*
	*	Stopping the chained animation won't stop this animation, stopping this animation will stop
	*	all chained animations, unless perform()ed manually. Queuing an animation to any of the
	*	animations in the chain will chain it to the last one.
	*
	*	Any other modification to any of the animations in the chain shall not affect the others.
	*/
	chain(animation) {
		
		if (this.object == animation.object) {
			if (this.next != null) {
				this.next.chain(animation)
			} else {
				this.next = animation;
			}
		} else {
			throw new Error(this.constructor + ': chain: Objects are different.');
		}
	}

	/** Modifies the velocity of this animation, making it appear like it's running faster. Default
	*	is 1.
	*/
	setVelocity(velocity) {
		this.velocity = velocity;
	}
}