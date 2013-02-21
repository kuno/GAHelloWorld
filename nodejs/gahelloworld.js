// Copyright (c) 2011 Guan 'kuno' Qing
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
// nodejs implementation of genetic algorithms of 'Hello World!'
///////////////////////////////////////////////////////////////////////////////
// target
var _target_gene = "Hello, world!";

// Mathematical tools
var abs = Math.abs, rand = Math.random, round = Math.round, floor = Math.floor;

// produce a random interger number
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


function updateFitness(gene) {
  var fitness = 0;
  var buf1 = new Buffer(gene, encoding='ascii');
  var buf2 = new Buffer(_target_gene, encoding='ascii');
  var len = (buf1.length == buf2.length) ? buf1.length : null;

  for (var i = 0; i < len; ++i) {
    fitness += abs(buf1[i] - buf2[i]);
  }

  return fitness;
}

function sortPopulation(population) {
  if (population.length <= 1) { return population;}

  var pop = [];
  // copy population to a new array
  population.forEach(function(p) {
      if (p) { pop.push(p);}
  });

  var pivotIndex = floor(pop.length / 2);
  var pivot = pop.splice(pivotIndex, 1)[0];
  var left = [];
  var right = [];

  for (var i = 0; i < pop.length; ++i) {
    if (pop[i].fitness <= pivot.fitness) {
      left.push(pop[i]);
    } else {
      right.push(pop[i]);
    }
  }

  return sortPopulation(left).concat([pivot], sortPopulation(right));
}

///////////////////////////////////////////////////////////////////////////////
// chromosome
///////////////////////////////////////////////////////////////////////////////
function Chromosome(gene) {
  this.gene    = gene;
  this.fitness = updateFitness(gene);
}

Chromosome.prototype.mate = function(mate) {
  var pivot = randInt(0, this.gene.length - 1);
  var gene1 = this.gene.slice(0, pivot) + mate.gene.slice(pivot, mate.gene.length);
  var gene2 = mate.gene.slice(0, pivot) + this.gene.slice(pivot, this.gene.length);

  return [new Chromosome(gene1), new Chromosome(gene2)];
};

Chromosome.prototype.mutate = function() {
  var gene  = this.gene;
  var delta = randInt(0, 89) + 32;
  var index = randInt(0, gene.length - 1);

  gene[index] = String.fromCharCode((gene[index].charCodeAt(0) + delta) % 122);

  return new Chromosome(gene.toString());
};

Chromosome.gen_random = function() {
  var gene = '';

  for (var i = 0; i < _target_gene.length; ++i) {
    gene += String.fromCharCode(randInt(0, 89) + 32);
  }

  return new Chromosome(gene.toString());
};


///////////////////////////////////////////////////////////////////////////////
// population
///////////////////////////////////////////////////////////////////////////////
function Population(size, crossover, elitism, mutation) {
  var buf = [];

  this._tournamentSize = 3;

  this.size      = size;
  this.crossover = crossover;
  this.elitism   = elitism;
  this.mutation  = mutation;

  // produce random chromosomes
  for (var i = 0; i < size; ++i) {
    buf.push(Chromosome.gen_random());
  }

  this.population = sortPopulation(buf);
}

Population.prototype._tournament_selection = function() {
  var best = this.population[randInt(0, this.population.length - 1)];
  var cont;

  for (var i = 0; i < this._tournamentSize.length; ++i) {
    cont = this.population[randInt(0, this.population.length - 1)];
    if (cont.fitness < best.fitness) {
      best = cont;
    }
  }

  return best;
};

Population.prototype._selectParents = function() {
  return [this._tournament_selection(), this._tournament_selection()];
};

Population.prototype.evolve = function() {
  var size = this.population.length;
  var index = parseInt(round(size * this.elitism), 10);
  var buf = this.population.slice(0, index);
  var parents, children;

  while (index <  size) {
    if (rand() <= this.crossover) {
      parents = this._selectParents();
      children = parents[0].mate(parents[1]);

      children.forEach(function(chromosome) {
          if (rand() <= this.mutation) {
            buf.push(chromosome.muate());
          } else {
            buf.push(chromosome);
          }
      });
    } else {
      if (rand() <= this.mutation) {
        buf.push(this.population[index].mutate());
      } else {
        buf.push(this.population[index]);
      }

      index += 1;
    }
  }

  this.population = sortPopulation(buf.slice(0, size));
};


///////////////////////////////////////////////////////////////////////////////
// exports
///////////////////////////////////////////////////////////////////////////////
exports.Chromosome     = Chromosome;
exports.Population     = Population;
exports.sortPopulation = sortPopulation;
