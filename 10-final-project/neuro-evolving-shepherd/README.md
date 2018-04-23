Herding simulation based on algorithm described [here](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4191104/) build in javascript using [P5.js library](https://p5js.org/).


Neuro-Evolving Shepherd Project:

For this project, I plan to implement a neuro-evolving 'shepherd' agent which interacts with a number of static (non-evolving) 'sheep' agents.  The goal of the shepherd is to keep the sheep contained.  The sheep have no goal, but their behaviors include avoiding the shepherd and grazing.

Steps required:

[ ] - initialize new population of shepherds (with NN brain) and their respective herds
[ ] - give shepherd location of each sheep in its herd as input to NN brain
[ ] - shepherd will move according to output of NN brain
[ ] - order population of shepherds by fitness
[ ] - create next generation of shepherds / herds

links:
http://blog.otoro.net/2017/10/29/visual-evolution-strategies/
