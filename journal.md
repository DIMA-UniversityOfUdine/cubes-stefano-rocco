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

![temple basic model](/resources/temple_basic_model.png)

I've been polishing the code and managed to shrink it to about a half by exploiting symmetries of the model, whilst trying to make it more readable, but I'm still not satisfied. In particular y-positioning depends on the underlying layers, but is not well handled and I don't think I could do better honestly.

I'm going to model the arch without any significant reference.

- Arch and lanterns are complete on a basic level.

I think I could use the `Object3D.clone()` function to spawn more instances of the lantern, which is a composite mesh. I've encountered a few issues using that function, specifically when copying a (composite) _transformed_ object, but this shouldn't be our case.

- Provided I'll have enough time I'm going to add some details to the temple. This will most probably break symmetries so I shouldn't add them wihtout modifying the code, as if I don't they wouldn't come along if I had to make some changes in the main model. Yet, I guess I have to come to a compromise and proceed regardless of the object hierarchy.

Also I think I've used too few colors so far, I really need to make some changes to the materials.

## 03.20

- For the moment I've decided to wrap the code of each model in a function to be called when necessary, this is cleaner.
- Polished some more the model code, added a few details; moving to the animation phase.

_-_
**Luca Bozzetto joined the team.**
_-_

## 03.21

- **S:** I've been working on the animations; I've coded a little class based on the following sketchy class diagram, which should be of help in building simple animations consisting of rotations and translations (that's what we need).

![animation class diagram](/resources/animation_class_diagram.png)

In particular, it shall allow the semantics of the animation to be defined by the caller. In theory this should account for 1) generality and 2) much less code in the render loop.

- **S:** Split `source/drawScene` and moved the model code to its own `source/Model.js` file.
- **S:** I spent the rest of the day debugging the animation classes, which have yet to be properly tested. In particular an improper matrix initialization was one of the most insidious source of defects, much like the strange behavior of the `Object3D.clone()` function.

## 03.22

- I and Luca finished the code for the heightMap() function that builds the terrain; **S:** I kept working on the aesthetics of the terrain whilst Luca began working on the clouds and their animation.
- **S:** I've been going through an issue–once again only made worse by absence of specification–which caused two meshes of the same material to not behave consistently when casting shadows.

## 03.23

- **L:** I've work on the clouds and their animation to make the scene more realistic.

## 03.24

- We overall adjusted code and finished animations. Planning a few details to add to the scene, like fog and mountains.
- **L:** I've added the lanterns with the lights. The result is
![final result](/resources/lightsPartial.png)

## 03.25

- **L:** I've added the fountain with the water to the scene, then we tried to make the animation more realistic possible. It hasn't been simple to recreate the correct animation. 

## 03.26

- We decided to use an orthographic camera, as it matches best the style of the scene. **S:** Added mountains. The results so far:

![partial result](/resources/lightsPartial.png)

## 03.27

- **L:** I've added the fog to the scene and I deleted the class translationAnimation.js because we didn't use it. The final result is: 

![final result](/resources/FinalScene.png)
