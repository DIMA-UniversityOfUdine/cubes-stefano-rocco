# Project 1 - Journal

## 03.18

- Beginning of project, prerequisites are satisfied, started with the scene design phase.
- I decided to do a few raw sketches of the scene, and eventually chose a chinese temple setting:

![raw sketches](/resources/raw_sketch1.png)
![raw sketches](/resources/raw_sketch2.png)

- Began modeling the temple.

I'm going to use a soft, minimal-ish palette for the scene and have shadows cast on the terrain, so I chose to edit the `StartingCode-withLights`.

I downloaded a few (free) reference images and put together a fast prototype of the temple's front view, which ought to be similar on all four sides, except a few details such as the columns.

![temple prototype](/resources/temple_proto.png)

I'm going to code it right into the scene as described in the section Steps/4/1 of the `README` file.

- I began having some troubles managing the code of the models, since a greater detail means a higher number of cubes and materials to handle, and thus a lot more lines of code to maintain, which is not convenient; for the moment I'll keep editing on a separate `source/drawScene` file.
	
On a side note, some cubes do overlap causing z-fighting; I could've removed those faces, but I thought it wasn't that much of a problem, since I plan to cover them anyways.

Also I haven't followed the initial idea to model using a virtual grid (much like what happens in _Minecraft_ game) but I might change my mind.
