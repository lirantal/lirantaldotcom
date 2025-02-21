---
title: "Getting started with Neural Networks in JavaScript"
description: >-
    
date: '2025-12-12'
pubDate: '2025-12-12'
categories: []
keywords: []
draft: true
tags: ["ML", "Neural Networks", "Brain.js"]
slug: ""
image: ~/assets/images/blog/gamified-learning.png
---

Much of the tooling and educational content around machine learning is focused on Python and its ecosystem. Rightly so, to an extent, given that data scientists and machine learning engineers have been immersed with Python related tooling for a long time. However, as someone coming from the JavaScript ecosystem, I wanted to get started with machine learning using JavaScript.

About 12 years ago, while at HPE Software, I underwent through a machine learning course which was super fun. We learned the basics and coded some exercises like KNN algorithm from scratch. It was a nice experience and at the time it wasn't surprising that we got exposed to this as engineers at HPE Software. Back then, the buzzword was "Big Data" and HPE had dipped its toes into this space with products like Vertica and others.

Fast forward to 2025 (well, technically, November 2022) and artificial intelligence, machine learning, and neural networks are everywhere.

Can we bring this magic into JavaScript? A little library called `Brain.js` makes it possible.

In this post, I'll just put the fundamentals that helped me get started so you can grab the basics too and get started playing with this.

## Key Concepts in Neural Networks

Hardly is this going to be an expert or good enough coverage of key concepts in machine learning, so I highly recommend you perhaps start here but then go through other resources to get a deeper understanding.

In a nutshell, the following are a few key concepts you'll need to know in particular because they are part of the building blocks of the `Brain.js` library so you will be interacting with these concepts directly.

### Neurons and Hidden Layers

A neuron is one of those fundamental building blocks of neural networks. The simplest and most reductive way to think of a neuron is that it represents a value. That's really oversimplifying it and technically inaccurate too. To expand a bit more about it, think - how would that neuron get a value? If it gets a value, would it do something with it? This helps unveil the very basic idea of a neuron. A Neuron is a sort of computational unit that takes in some input, applies a mathematical function to it, which produces an output.

If a neuron is the very basic building block, a node if so to say, then a layer is a collection of neurons. Many such layers then make up for what is the neural network. In a classic representation of a neural network you can divide it to three parts - the input layer, the hidden layers, and the output layer. Visually it would look something like this:

```sh
Input Layer:   0 0 0.9 0 0.4 0 0.2 0 0
    |             \ | | | | | | /
Hidden Layer:   0.1 0.3 0.5 0.2 0.1
    |              / | | | | | \
Output Layer    0.1 0.2 0.3 0.4 0.5
```

The Hidden Layer part is where a lot of the "magic" happens. In simple terms you can think of it in a way that the more hidden layers you have, the more complex the neural network can be. The more "intelligence" or "room for understanding and learning" you can give to the neural network. Sometimes, if you try to train and test a neural network with not enough neurons or hidden layers, the network will simply be unable to learn. It's like trying to program a calculator that adds numbers from 1 to 1 million but you only provide it with an integer size of 8 bits. It technically can't do it.

### Forward and Backward Propagation

Ok so, neurons hold values, layers hold neurons and the role of the neural network is to learn. How does it learn? This is where forward and backward propagation come in.

Think of a person at a bowling night. They throw the ball and it needs to hit the pins. Perhaps the first throw is going to be off the mark and hit the side rails. What does the person do? They adjust their aim accordingly, perhaps pivot their hand a bit to the right, and throw again. This time they hit, but only 3 pins. They adjust again, maybe this time they also adjust the force of the throw. Did it help or did it make it worse?

```sh
    0
    |
   / \

    O
   / \
  /   \
 /     \
/       \
|       |
|       |
|       |
|       |
|       |
| | | | |
| | | | |
| | | | |
| | | | |
```

This is the learning process that we humans go through. A neural network follows this process through a method that it calls forward propagation and backward propagation. The forward propagation is the process of taking the input, passing it through the neural net, firing the neurons with some input, and getting an output. What was the output? did it match the expected output? If not, the neural network needs to adjust its weights. This is where the backward propagation comes in - it is the process of taking the output, comparing it to the expected output, and adjusting the weights of the neurons in the network. 

### Training a Neural Network

The learning process of forward and backward propagation that we described above is repeated many times until the neural network is able to produce the expected output. This process is called training a neural network. The neural network is trained on a dataset that has input and output pairs. The neural network is trained to produce the output given the input. The more the neural network is trained, the better it gets at producing the expected output. 

## Getting started with Brain.js for Neural Networks in JavaScript

If you're on a Linux machine you'll likely need to install the following dependencies because the `Brain.js` library uses native bindings:

```sh
sudo apt-get update
sudo apt-get install -y libgl1-mesa-dev
sudo apt-get install -y libxi-dev libx11-dev libxext-dev
```

For more detailed install instructions you can refer to the [Brain.js GitHub repository](https://github.com/BrainJS/brain.js?tab=readme-ov-file#installation-and-usage).

Next, make sure you have allowed npm installs to run scripts. This is because the `Brain.js` library uses a script to compile the native bindings. You can do this by running:

```sh
npm config set ignore-scripts false
```

Then you can continue with installing the `Brain.js` library:

```sh
npm install brain.js
```

## Creating a Neural Network with Brain.js

Many of the examples for Brain.js and neural networks show a simple example to predict the output of a XOR operation. Let's try something different.

Let's train a neural network to learn to go beyond XOR with a simple, yet valuable, example using Brain.js: Predicting if a number is even or odd.

What would be your input for the neural network? We'll represent numbers through their binary representation. So, for example, the number 3 would be represented as `0011` and the number 4 would be represented as `0100`. So our input could be represented as follows:

```js
const trainingData = [
  { input: [0, 0, 0, 0], output: [1] }, // 0 (even)
  { input: [0, 0, 0, 1], output: [0] }, // 1 (odd)
  { input: [0, 0, 1, 0], output: [1] }, // 2 (even)
  { input: [0, 0, 1, 1], output: [0] }, // 3 (odd)
  { input: [0, 1, 0, 0], output: [1] }, // 4 (even)
  { input: [0, 1, 0, 1], output: [0] }, // 5 (odd)
  { input: [0, 1, 1, 0], output: [1] }, // 6 (even)
  { input: [0, 1, 1, 1], output: [0] }, // 7 (odd)
  { input: [1, 0, 0, 0], output: [1] }, // 8 (even)
  { input: [1, 0, 0, 1], output: [0] }, // 9 (odd)
  { input: [1, 0, 1, 0], output: [1] }, // 10 (even)
  { input: [1, 0, 1, 1], output: [0] }, // 11 (odd)
  { input: [1, 1, 0, 0], output: [1] }, // 12 (even)
  { input: [1, 1, 0, 1], output: [0] }, // 13 (odd)
  { input: [1, 1, 1, 0], output: [1] }, // 14 (even)
  { input: [1, 1, 1, 1], output: [0] }, // 15 (odd)
];
```

As you can see we're showing the neural net "what good looks like", so we provide it with the input of a binary representation of a number, and what I expect it to provide back as an output: 1 for even, 0 for odd.

The neural net, however, isn't going to reply back with 1 or 0 though, it's going to reply back with a number between 0 and 1 that represents the probability of the number being even or odd. We can then round this number to get the final result, or more accurately, we'd check if the threshold is closer to 0 or 1, to base our decision on.

How would we test the neural net? We will provide it with some number, say 5 (well, its binary representation `0101`), and see what the neural net predicts. However, you might wonder, what's the point of this? what's the magic? we already told the neural network that 5 is odd. Yes?

So, I suggest maybe we remove some of the training data and see how the neural net performs. Consider the following:

```js

// 1. Prepare training data
const trainingData = [
  { input: [0, 0, 0, 0], output: [1] }, // 0 (even)
  // { input: [0, 0, 0, 1], output: [0] }, // 1 (odd)
  // { input: [0, 0, 1, 0], output: [1] }, // 2 (even)
  { input: [0, 0, 1, 1], output: [0] }, // 3 (odd)
  { input: [0, 1, 0, 0], output: [1] }, // 4 (even)
  // { input: [0, 1, 0, 1], output: [0] }, // 5 (odd)
  // { input: [0, 1, 1, 0], output: [1] }, // 6 (even)
  // { input: [0, 1, 1, 1], output: [0] }, // 7 (odd)
  // { input: [1, 0, 0, 0], output: [1] }, // 8 (even)
  // { input: [1, 0, 0, 1], output: [0] }, // 9 (odd)
  { input: [1, 0, 1, 0], output: [1] }, // 10 (even)
  { input: [1, 0, 1, 1], output: [0] }, // 11 (odd)
  // { input: [1, 1, 0, 0], output: [1] }, // 12 (even)
//   { input: [1, 1, 0, 1], output: [0] }, // 13 (odd)
//   { input: [1, 1, 1, 0], output: [1] }, // 14 (even)
//   { input: [1, 1, 1, 1], output: [0] }, // 15 (odd)
];
```

Next, let's not forget to import the `Brain.js` dependency:

```js
const brain = require('brain.js');
```

Ok, so now let's go on. Next step is to create the neural network:

```js
// 2. Create the neural network
const net = new brain.NeuralNetwork({
  // 8 neurons in the layer
  hiddenLayers: [8],
})
```

Note: we'll get back to the hidden layer configuration here but I specifically didn't leave the default. As an exercise, you should play with the hidden layer and try to expand on providing more neurons and more layers. How does the neural network perform when you set hidden layers to `[8,8,8,8,8,8,8,8,8,8,8]` for example?

The above neural network is initialized using defaults, including an activation function and other parameters. Now we're ready to train:

```js
// 3. Train the network
net.train(trainingData);
```

This is a CPU-bound synchronous process that happens in the Node.js main thread. You can also read the training data result from the returned object to get some statistics about the training process.

Finally, let's test the network:

```js
// 4. Test the network
function testNumber(number) {
  const binary = number.toString(2).padStart(4, '0').split('').map(Number);
  const result = net.run(binary);
  const isEven = result[0] > 0.5;
  const correctNess = isEven === (number % 2 === 0);
  console.log(`${correctNess ? '✅' : '❌'} Number: ${number} (Binary: ${binary}) - Even: ${isEven} (Accuracy: ${result[0]})`);
}

testNumber(1);
testNumber(2);
testNumber(3);
testNumber(5);
testNumber(15);
testNumber(4);
testNumber(7);
testNumber(10);
testNumber(13);
```

In the `testNumber()` function we convert the number to the binary representation of it as is aligned with the same format of the training data. Then run the neural network, and then check if the result is above 0.5 to determine if the number is even or odd. We then compare this to the actual number to see if the neural network was correct.

Just like that, you've created a neural network that can predict if a number is even or odd. You can expand on this by providing more training data, or by changing the hidden layers and neurons in the neural network.