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


///////////////////////////////////////////////////////////////////////////////
// unit testing for genetic algorithms of 'Hello, World!'
///////////////////////////////////////////////////////////////////////////////
var assert     = require('assert'),
    Chromosome = require('./gahelloworld.js').Chromosome,
    Population = require('./gahelloworld.js').Population,
    children, pivot, c, c1, c2, b1, b2, i, j, k, o, p, q;

c = new Chromosome('Hello, world!');
assert.strictEqual(c.fitness, 0, 'Wrong fitness ' + c.fitness);

c = new Chromosome('H5p&J;!l<X\\7l');
assert.strictEqual(c.fitness, 399, 'Wrong fitness ' + c.fitness);

c = new Chromosome('Vc;fx#QRP8V\\$');
assert.strictEqual(c.fitness, 297, 'Wrong fitness ' + c.fitness);

c = new Chromosome("t\\O`E_Jx$n=NF");
assert.strictEqual(c.fitness, 415, 'Wrong fitness: ' + 415 + ' !== ' + c.fitness);

for (i = 0; i < 1000; ++i) {
  c = Chromosome.gen_random();
  assert.ok((c.fitness > 0));
  assert.equal(c.gene.length, 13);
  for (j = 0; j < c.gene.length; ++j) {
    assert.ok(c.gene[j].charCodeAt(0) >= 32);
    assert.ok(c.gene[j].charCodeAt(0) <= 121);
  }
}

for (k = 0; k < 1000; ++k) {
  c1 = Chromosome.gen_random();
  c2 = c1.mutate();
  assert.equal(c1.gene.length, c2.gene.length);

  b1 = new Buffer(c1.gene, encoding='ascii');
  b2 = new Buffer(c2.gene, encoding='utf8');

  assert.ok(b1.length - b2.length <= 1);
}

c1 = Chromosome.gen_random();
c2 = Chromosome.gen_random();

children = c1.mate(c2);
assert.equal(children.length, 2);
assert.equal(children[0].gene.length, 13);
assert.equal(children[1].gene.length, 13);

var tmpArr = children[0].gene;
for ( p = 0; p < tmpArr.length; ++p) {
  if (c1[p] !== tmpArr[p]) {
    pivot = p;
    break;
  }
}

for ( q = 0; p < tmpArr.length; ++q) {
  if (q < pivot) {
    assert.equal(c1.gene[q], tmpArr[q]);
  } else {
    assert.equal(c2.gene[q], tmpArr[q]);
  }
}

var tmpArr1 = children[1];
for ( o = 0; o < tmpArr1.length; ++o) {
  if (o < pivot) {
    assert.equal(c2.gene[o], tmpArr1[o]);
  } else {
    assert.equal(c1.gene[o], tmpArr[o]);
  }
}
