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
	
On a side note, some cubes do overlap causing z-fighting; I could've removed those faces, but I thought it wasn't that much of a problem since I plan to cover them anyways.

Also I haven't followed the initial idea to model using a virtual grid (much like what happens in _Minecraft_ game) but I might change my mind.

## 03.19

- The basic temple is complete, I'm going to model the arch and lanterns, the stairs will be part of the terrain.

![temple basic model](/resources/temple_basic.png)

I've been polishing the code and managed to shrink it to about a half by exploiting symmetries of the model, whilst trying to maintain the readability, but I'm still not satisfied. In particular y-positioning depends on the underlying layers, but is not well handled and I don't think I could do better honestly.

I'm going to model the arch without any significant reference.

- Arch and lanterns are complete on a basic level.

I think I could use the `Object3D.clone()` function to spawn more instances of the lantern, which is a composite mesh. I've encountered a few issues using that function, specifically when copying a (composite) _transformed_ object, but this shouldn't be our case.

- Provided I'll have enough time I'm going to add some details to the temple. This will most probably break symmetries so I can't add them wihtout modifying the code, and if I don't they won't come along if I decided to make some changes in the main model, but I guess I have to come to a compromise and go with the second.

Also I think I've used too few colors so far, I really need to make some changes to the materials.