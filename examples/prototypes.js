'use strict';
/*
Inheritance in Javascript is based on prototypes

Each object has a special hidden property [[Prototype]], that is either null or references another object. That object is called a “prototype”.

When we read a property from object, and it’s missing, JS automatically tries to find it in the prototype.
Prototype object can have its own prototype set with [[Prototype]], so we can have a prototype chain, that will be used to search for property.
This is called “prototypal inheritance”.

It is similar to how variables are searched in a chain of LexicalEnvironment objects, linked by [[Environment]] references
*/

// 🕮 <ltc> a22018be-16b5-43b0-ba20-763dd7d32d25.md

// 🕮 <cyberbiont> b8a15bb0-4b36-47a5-b0bc-4bc83f287352.md

// # ways to set a [[Prototype]]
{
	// Object.setPropotypeOf / Object.getPrototypeOf / Object.create
	const bank = {
		money: 1000,
	};

	const pocket = {};

	Object.setPrototypeOf(pocket, bank);

	console.log(Object.getPrototypeOf(pocket)); // now `pocket` inherits `bank` as a prototype

	console.log(pocket.money); // money is taken from bank
}

// @if level !== 'basic'
// # __proto__
{
	// old non-standard __proto__
	// in fact it is the setter/getter for [[Prototype]], property

	// ~ __proto__ pseudo-code

	/* const obj = {
	get __proto__() {
		return this.[[Prototype]];
	},

	set __proto__(value) {
		this.[[Prototype]] = value;
	},
}; */

	// ~ example

	const bank = {
		money: 1000,
	};

	const pocket = {};

	// problem: does not work, if we try to assign something else apart from null or object:
	// pocket.__proto__ = 'bank'; // undefined
	pocket.__proto__ = bank; // __proto__ as a setter
	console.log(pocket.money);

	console.log(Object.getPrototypeOf(pocket));
	console.log(pocket.__proto__); // __proto__ as a getter

	// 🕮 <ltc> 7a6074ab-c38f-44f4-8d5f-7698e66900ab.md
}
// @endif

// # Object.create()
{
	// it's better to set the prototype at once when we are creating the object (changing prototype later may break engine optimizations)
	// we can use Object.create() method to do it

	const bank = {
		money: 1000,
		getMoney() {
			console.log(this.money);
		},
	};

	const pocket = Object.create(bank);

	// we can also do:
	// const pocket = {
	//   __proto__: bank
	// }

	// pocket.money = 5000;
	console.log(pocket.money);
	pocket.getMoney();

	// We also can create an object without a prototype
	// 🕮 <cyberbiont> 7ed2e1bc-11b5-4158-96bd-51c1b9455b82.md

	const bareObject = Object.create(null);

	const obj = {}; // normally created object has Object.prototype as a prototype

	console.log(Object.getPrototypeOf(obj));

	console.log('is prototype of pocket?', obj.isPrototypeOf(pocket));

	const arr = [];
	console.log(Object.getPrototypeOf(arr));
}

/*
- There is no multiple inheritance in JS, there's only one [[Prototype]] property so the object cannot inherit from 2 objects at once
- Circular links are forbidden
- The prototype is only used for reading properties.
- `this` value is not affected by prototype inheritance, it will always be equal to the object before the dot
*/

// # Object.hasOwnProperty
{
	/* for...in loop iterates also properties from prototype (the only way to iterate them)
  to check if property is taken from prototype, we can use Object.hasOwnProperty(key)
  */
	const animal = {
		eats: true,
	};

	const rabbit = {
		jumps: true,
	};

	Object.setPrototypeOf(rabbit, animal);

	for (const prop in rabbit) {
		console.log(prop);

		const isOwn = rabbit.hasOwnProperty(prop);

		if (isOwn) console.log(`Own: ${prop}`);
		// Own: jumps
		// else console.log(`Inherited: ${prop}`); // Inherited: eats
	}
}

// # constructor function
{
	function User(name, surname) {
		this.name = name;
		this.surname = surname;

		this.sayHi = () => {
			console.log('hello');
		};
	}

	const user1 = new User('John', 'Snow');
	const user2 = new User('Mike', 'Snow');

	console.log(user1);
	console.log(user2);
	user1.sayHi();

	// 🕮 <ltc> f192db28-a55f-4d99-8b3e-afd3645dc43e.md
}

// #  prototype property
{
	/* Prototype inheritance using a constructor function

  Each function has 'prototype' property (by default it's an object with single 'constructor' property that references the function itself)
  If function is called with 'new', and `prototype` is an object, then the 'new' operator uses it to set [[Prototype]] for the created object.

  So 'propotype' makes sense only with constructor function (i.e. a function that we called with new)

  as opposed to __proto__ or Object.setPrototypeOf, that allow to set the propotype for the already existing object

  In the following example, setting
  Rabbit.prototype = animal
  literally tells Javascript: "When creating a new object with new Rabbit() call, set for this object  [[Prototype]]: animal"
  */

	// object[[Prototype]] -> function.prototype

	{
		const animal = {
			eats: true,
		};

		function Rabbit(name) {
			this.name = name;
		}

		Rabbit.prototype = animal;
		// Rabbit.prototype.constructor = Rabbit;

		// rabbit[[Prototype]] -> Rabbit.prototype -> animal

		console.log(Rabbit);

		const rabbit = new Rabbit('White Rabbit');
		console.log(rabbit);

		//  rabbit.__proto__ == animal
		console.log(Object.getPrototypeOf(rabbit));

		console.log(rabbit.eats); // true
	}

	// ~ constructor property

	// by default
	function User(name) {
		this.name = name;
	}

	const user = new User('Arnold');
	console.log(User.prototype);
	console.log(User.prototype.constructor);

	/* can be used to create another object of the same type */
	const anotherUser = new user.constructor('Silvester');
	console.log(anotherUser);

	// we need to be careful to no lose constructor property (mayy happen if we manually re-assign th whole prototype property)
}

// # adding methods to prototype
{
	/*
  so, the object with methods, that is referenced by [[Prototype]] property of created with 'new' objects, is stored as a property of constructor function.
  we can access it with .prototype and add methods to it */

	function User(name) {
		this.name = name;

		// 🕮 <cyberbiont> c695b8d4-e836-4091-9cbb-d87c360b1ed3.md
	}

	User.prototype.sayHi = function () {
		console.log(this.name);
	};

	User.prototype.sayBy = function () {
		console.log('By' + this.name);
	};

	// not very convenient if we have large number of methods, so it's better to use class syntax
}

// 🕮 <ltc> 19ca1661-181e-4570-aac2-26e29b466d0d.md
// # borrowing the method from prototype
{
	// array-like:
	const obj = {
		0: 'Hello',
		1: 'world!',
		length: 2,
	};

	// obj.join(obj, ','); // Error, objects do not have join method

	// we can borrow it from array
	console.log(Array.prototype.join.call(obj, ','));

	console.log([].join.call(obj, ','));

	// 🕮 <ltc> a138721a-8a22-45af-8ebb-7a353725de09.md
}
