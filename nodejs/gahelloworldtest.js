//  Copyright (c) 2011 Guan 'kuno' Qing
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


///////////////////////////////////////////////////////////////////////////////
// unit testing for genetic algorithms of 'Hello, World!'
///////////////////////////////////////////////////////////////////////////////
var int            = parseInt,
    round          = Math.round,
    assert         = require('assert'),
    Chromosome     = require('./gahelloworld.js').Chromosome,
    Population     = require('./gahelloworld.js').Population,
    sortPopulation = require('./gahelloworld.js').sortPopulation;


///////////////////////////////////////////////////////////////////////////////
// chromosome
///////////////////////////////////////////////////////////////////////////////
function test_updateFitness() {
  c = new Chromosome('Hello, world!');
  assert.strictEqual(c.fitness, 0, 'Wrong fitness ' + c.fitness);

  c = new Chromosome('H5p&J;!l<X\\7l');
  assert.strictEqual(c.fitness, 399, 'Wrong fitness ' + c.fitness);

  c = new Chromosome('Vc;fx#QRP8V\\$');
  assert.strictEqual(c.fitness, 297, 'Wrong fitness ' + c.fitness);

  c = new Chromosome("t\\O`E_Jx$n=NF");
  assert.strictEqual(c.fitness, 415, 'Wrong fitness: ' + 415 + ' !== ' + c.fitness);
}

function test_gen_random() {
  var i, j;
  for (i = 0; i < 1000; ++i) {
    c = Chromosome.gen_random();
    assert.ok((c.fitness > 0));
    assert.equal(c.gene.length, 13);
    for (j = 0; j < c.gene.length; ++j) {
      assert.ok(c.gene[j].charCodeAt(0) >= 32);
      assert.ok(c.gene[j].charCodeAt(0) <= 121);
    }
  }
}

function test_mutate() {
  var i, c1, c2; 
  for (i = 0; i < 1000; ++i) {
    c1 = Chromosome.gen_random();
    c2 = c1.mutate();
    assert.equal(c1.gene.length, c2.gene.length);

    b1 = new Buffer(c1.gene, encoding='ascii');
    b2 = new Buffer(c2.gene, encoding='utf8');

    assert.ok(b1.length - b2.length <= 1);
  }
}

function test_mate() {
  var c1, c2, tmpArr1, tmpArr2, pivot, children, i;

  c1 = Chromosome.gen_random();
  c2 = Chromosome.gen_random();

  children = c1.mate(c2);
  assert.equal(children.length, 2);
  assert.equal(children[0].gene.length, 13);
  assert.equal(children[1].gene.length, 13);

  tmpArr1 = children[0].gene;
  for (i = 0; i < tmpArr1.length; ++i) {
    if (c1.gene[i] !== tmpArr1[i]) {
      pivot = i;
      break;
    }
  }

  for (i = 0; i < tmpArr1.length; ++i) {
    if (i < pivot) {
      assert.equal(c1.gene[i], tmpArr1[i]);
    } else {
      assert.equal(c2.gene[i], tmpArr1[i]);
    }
  }

  tmpArr2 = children[1];
  for (i = 0; i < tmpArr2.length; ++i) {
    if (i < pivot) {
      assert.equal(c2.gene[i], tmpArr2[i]);
    } else {
      assert.equal(c1.gene[i], tmpArr2[i]);
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// population
////////////////////////////////////////////////////////////////////////////////
function test_crossover() {
  var pop = new Population(1024, 0.8, 0.1, 0.05);
  assert.equal(int(pop.crossover * 100, 10), 80);

  pop = new Population(1024, 0.0, 0.1, 0.05);
  assert.equal(int(pop.crossover * 100, 10), 0);

  pop = new Population(1024, 1.0, 0.1, 0.05);
  assert.equal(int(pop.crossover * 100, 10), 100);
}

function test_elitism() {
  var pop = new Population(1024, 0.8, 0.1, 0.05);
  assert.equal(int(pop.elitism * 100, 10), 10);

  pop = new Population(1024, 0.8, 0.0, 0.05);
  assert.equal(int(pop.elitism * 100, 10), 0);

  pop = new Population(1024, 0.8, 0.99, 0.05);
  assert.equal(int(pop.elitism * 100, 10), 99); 
}

function test_mutation() {
  var pop = new Population(1024, 0.8, 0.1, 0.05);
  assert.equal(int(pop.mutation * 100, 10), 5);

  pop = new Population(1024, 0.8, 0.1, 0.0);
  assert.equal(int(pop.mutation * 100, 10), 0);

  pop = new Population(1024, 0.8, 0.1, 1.0);
  assert.equal(int(pop.mutation * 100, 10), 100); 
}

function test_population() {
  var pop = new Population(1024, 0.8, 0.1, 0.05),
      oldArr = pop.population, newArr, i;

  assert.equal(oldArr.length, 1024);

  newArr = sortPopulation(oldArr);
  assert.strictEqual(oldArr.length, newArr.length);

  for (i = 0; i < oldArr.length; i++) {
    // what about same fitness but different gene?
    assert.deepEqual(oldArr[i].fitness, newArr[i].fitness);
  }
}

function test_evolve() {
  var pop = new Population(1024, 0.8, 0.1, 0.05),
      oldArr = pop.population, newArr, elitismCount,
      count, i;

  pop.evolve();
  newArr = pop.population;

  assert.equal(int(pop.crossover * 100, 10), 80);
  assert.equal(int(pop.elitism * 100, 10), 10);
  assert.equal(int(pop.mutation * 100, 10), 5);

  elitismCount = int(round(1024 * 0.1), 10);
  count = 0;

  for (i = 0; i < oldArr.length; i++) {
    newArr.some(function(e, j, a) {
        if (oldArr[i].gene === e.gene) {
          count += 1;
        }
    });
  }

  assert.ok(count >= elitismCount);
  assert.ok(count < oldArr.length);
}


///////////////////////////////////////////////////////////////////////////////
// run tests
///////////////////////////////////////////////////////////////////////////////
//test_updateFitness();
//test_gen_random();
//test_mutate();
//test_mate();

//test_crossover();
//test_elitism();
//test_mutation();
test_population();
//test_evolve();
