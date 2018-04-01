I am trying to figure out how to adjust the mutation rate.  

Currently, I am iterating through the poly list, then

	iterating through the points list, then

		checking whether random(1) <  morphRate

			morph, or don’t

I think this results in my morph rate being dependent on the size of the parent list and points list.  AKA if parent list is 100 items, each with 3 points, and morph rate it 0.01, I should have 0.01 * 100 * 3 = 3 morphs.  If parent list is 500 each with 5 points, I should have 0.01 * 500 * 5 = 25 morphs.  In order to get better accuracy on the final image, I’d like to limit the morphs (at least later in the game), scaled with
		
