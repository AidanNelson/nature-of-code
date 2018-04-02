A recreation of Roger Johansson's Evolving Mona Lisa found [here](// https://rogerjohansson.blog/2008/12/07/genetic-programming-evolution-of-mona-lisa/), which uses a simple genetic algorithm to 'evolve' an image out of randomly generated / mutated polygon array.  

From his site:
```
I created a small program that keeps a string of DNA for polygon rendering.
The procedure of the program is quite simple:

Setup a random DNA string  (application start)

1. Copy the current DNA sequence and mutate it slightly
2. Use the new DNA to render polygons onto a canvas
3. Compare the canvas to the source image
4. If the new painting looks more like the source image than the previous painting did, then overwrite the current DNA with the new DNA
5. Repeat from 1

```
