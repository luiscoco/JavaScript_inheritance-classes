'use strict';
// # class declaration
// in fact class is a wrapper function around the constructor function and expressions, used to write the method to prototype
// 🕮 <ltc> 66301620-cdee-4d43-874f-34d2e6d3cd5e.md
{
	class User {
		// in fact, a common constructor function, used to create an object
		// it is called automatically on new User() call
		// ~ constructor:
		constructor(name) {
			this.name = name;
		}

		// ~ class fields:
		counter = 0; // equivalent to this.counter = 0;

		// method can also be assigned as a class field, it will also be individual
		// 🕮 <ltc> ab567357-5bdd-4304-8fe0-b0f8bfe8b8d3.md
		increaseCounter = () => {
			console.log(this);
			this.counter++;
		};

		// ~ prototype methods:
		// all methods, declared within a class, are written into the object prototype
		increaseCounter() {
			console.log(this);
			this.counter++;
		}

		sayHi() {
			console.log(`Hello, ${this.name}`);
		}

		sayBye() {
			console.log(`Bye, ${this.name}`);
		}

		getSurname() {
			return this.surname;
		}

		setSurname(surname) {
			this.surname = surname;
		}

		// ~ getter / setter
		get age() {
			return this._age;
		}

		set age(age) {
			this._age = age;
		}
	}

	console.log(typeof User);
	console.log(User);

	// 🕮 <cyberbiont> 9919ac5f-703f-4e1a-b694-1357dd4fafdb.md

	const user = new User('John');
	// user[[Prototype]] -> User.prototype
	// User.prototype.increaseCounter

	// const boundUser = user.increaseCounter.bind(user);
	// boundUser();

	const increase = user.increaseCounter;
	increase();

	const user2 = new User('Bob');
	user2.increaseCounter();
	user2.increaseCounter();
	console.log(user2.counter);

	user.sayHi();
	user.setSurname('Connor');
	user.age = 25;

	console.log(user.surname, user.age);

	for (const prop in user) {
		// console.log(prop);
		// 🕮 <cyberbiont> a4575c66-8ad7-47c8-aefe-f42b9109b0b6.md
	}
}

// # class expression
{
	// just like functions, there can be Class Expressions, Named Class Expressions and anonymous classes

	// ~ Class Expression
	const User = class {
		sayHi() {
			alert('Hello');
		}
	};

	// ~ Named Class Expression
	const User2 = class MyClass {
		sayHi() {
			console.log(MyClass);
		}
	};

	function makeClass(phrase) {
		// anonymous class - declared in-place and returned
		return class {
			sayHi() {
				console.log(phrase);
			}
		};
	}
	const myClass = makeClass();
}

// get/set 🕮 <cyberbiont> 524342e5-da86-48fd-9115-1915dfb59d26.md

// ~ methods and properties can interact through 'this'
{
	class Training {
		constructor(type, time, distance) {
			this.type = type;
			this.time = time;
			this.distance = distance;
			this.start();
		}

		start() {
			this.startTimer();
			this.trackDistance();
		}

		startTimer() {
			setTimeout(() => console.log('training is over!'), this.time);
		}

		trackDistance() {
			// this.distance...
		}
	}

	const training = new Training('running', 100, 20);
}

// ~ static methods / properties
{
	class Training {
		constructor(type, time, distance) {
			this.type = type;
			this._time = time;
			this.distance = distance;
			this.startTimer();
		}

		startTimer() {
			setTimeout(() => console.log('training is over!'), this._time);
		}

		getPulseRate() {
			// we can access static properties from within instance method using class name
			console.log(Training.NORMAL_PULSE_RATE);
			// or this.constructor (make sure that constructor property should be present in prototype)
			console.log(this.constructor.NORMAL_PULSE_RATE);
			console.log(Training.prototype.constructor.NORMAL_PULSE_RATE);
		}

		// implementation of factory pattern: we can easily create different pre-set types of objects
		static create(type) {
			switch (type) {
				case 'running':
					return new Training('running', 30, 12);
				case 'biking':
					return new Training('biking', 90, 30);
			}
		}

		static NORMAL_PULSE_RATE = 80;

		static increasePulseRate() {
			// accessing a static property from static method
			return this.NORMAL_PULSE_RATE++;
		}
	}

	// static objects and methods are properties of a class itself
	// static NORMAL_PULSE_RATE is equivalent to writing
	// Training.NORMAL_PULSE_RATE = 80

	const training = new Training('biking');
	const training2 = Training.create('biking');

	console.log(training);
	training.getPulseRate();

	// unlike instance methods, we access static methods on the class itself
	console.log(training.type);
	console.log(Training.NORMAL_PULSE_RATE);
}

// private / protected 🕮 <ltc> 794650de-ad14-4c06-9df1-a3e9d69e39a4.md

{
	const User = class {
		// new syntax
		#counter = 0;
		increaseCounter() {
			this.#counter++;
		}

		// 'protected' properties convention
		_counter = 0;

		set counter(value) {
			this._counter = value;
		}

		get counter() {
			return this._counter;
		}
	};

	const user = new User();

	user._counter++;
	// user.#counter++; //

	console.log(user._counter);

	// user.counter = 2;
}

// ~ inheritance
{
	class Animal {
		constructor(name) {
			this.name = name;
		}

		eaten = 0;

		eat(food) {
			this.eaten += food;
			console.log(`${this.name} has already eaten: ${this.eaten}`);
		}
	}

	// Inherit Animal using "extends Animal"
	class Cat extends Animal {
		// if there is no own constructor, parent constructor is called
		meow() {
			console.log(`${this.name}: meow!`);
		}
	}

	class Dog extends Animal {
		woof() {
			console.log(`${this.name}: woof!`);
		}
	}

	const animal = new Animal('animal');
	const cat = new Cat('Garfield');

	console.log(cat.name);
	cat.eat(5);
	cat.meow();
	cat.eat(10);

	const dog = new Dog('dog');
	dog.eat(10);
	dog.woof();
}

// ~ overriding methods using super
// 🕮 <cyberbiont> 1b9c6a4d-e85f-40b5-97a9-d1d5fdf7242b.md
{
	class Animal {
		constructor(name) {
			this.name = name;
		}

		eaten = 0;

		eat(food) {
			this.eaten += food;
			console.log(`${this.name} has already eaten: ${this.eaten}`);
		}
	}

	class Cat extends Animal {
		meow() {
			console.log(`${this.name}: meow!`);
		}

		eat(food) {
			super.eat(food); // call parent method
			this.meow(); // do something additionally
		}
	}

	const cat = new Cat('Garfield');
	cat.eat(5);

	class SlowCat extends Cat {
		meow() {
			// arrow functions do not have their own 'super', they borrow it from the parent function
			setTimeout(() => super.meow(), 2000); // calls parent method after 2 s
		}
	}

	const slowCat = new SlowCat('slow cat');
	slowCat.meow();
}

const err = new Error('mess');

// ~ constructor override
{
	class Animal {
		constructor(name) {
			this.name = name;
			this.eaten = 0;
		}

		eat(food) {
			this.eaten += food;
			console.log(`${this.name} has already eaten: ${this.eaten}`);
		}

		static type = 'heterotrophic';
	}

	class Elephant extends Animal {
		constructor(name, earsDiameter) {
			/* before using 'this' in descendant constructor, we MUST call parent constructor (using super()),
      passing all necessary arguments */
			super(name);
			this.earsDiameter = earsDiameter;
		}

		static type = 'vegetarian';
	}

	const elephant = new Elephant('Dumbo', 5);
	// elephant[[Prototype]] => Elephant.prototype

	console.log(elephant);
	elephant.eat(40);

	// Elephant[[Prototype]] => Animal

	console.log(Elephant.type);

	// Elephant.prototype[[Prototype]] -> Animal.prototype
	// Elephant[[Prototype]] -> Animal

	// # instanceof

	// The instanceof operator allows to check whether an object belongs to a certain class. It also takes inheritance into account.
	// instanceof examines the prototype chain for the check

	console.log(elephant instanceof Elephant);
	console.log(elephant instanceof Animal);
}
