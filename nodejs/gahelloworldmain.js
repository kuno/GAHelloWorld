//  Copyright (c) 2010 Guan 'kuno' Qing
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


 //////////////////////////////////////////////////////////////////////////////
// main program for genetic algorithms of 'Hello, World!'
///////////////////////////////////////////////////////////////////////////////
var Chromosome = require('./gahelloworld.js').Chromosome,
    Population = require('./gahelloworld.js').Population;
  
var maxGeneration = 16834;
var pop = new Population(2048, 0.8, 0.1, 0.3);

for (var i = 0; i < maxGeneration; ++i) {
  console.log('Generation #' + i + ': ' + pop.population[0].gene);
  if (pop.population[0].fitness === 0) {
    break;
  } else if (i < maxGeneration && pop.population[0].fitness !== 0) {
    pop.evolve();
  } else {
    console.log('Maximum generations reached without success.');
  }
}
                                           
