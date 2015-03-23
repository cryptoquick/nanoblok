The Nanoblok Game Engine will provide a very detailed 'physics' engine.

# Introduction #
Nanoblok was always meant to be more than just a voxel paint program.

In order to create a game engine where meaningful relations can be created from a set of complex rules, in such a way that is fun for players, physics is an important aspect of game development.

Because of the purpose and platform, Nanoblok is not designed to be run in real-time. Instead, hourly updates in a strategy-oriented online universe are probably a good idea. Areas will update only when a user needs to use them, sort of like Schrodinger's Cat.

As for feature implementation, I prefer to be inclusive, but rigorously structured, as things could get out of hand real quickly.

# Constants #
Certain things need to be defined just to lay the groundwork for the engine.

## Time ##
Physics animations displayed in the browser are anachronistic from reality. They happen in realtime, but this change is sent to the server, and represents one step in an hour-long cycle once the simulation is run.

There will only be animations in one setInterval loop, and only when the player is doing something. Otherwise, the program will sit relatively idle, perhaps refreshing every hour. I won't have to worry about DDoS'ing Google's servers, but I do have to worry about taking too much of the user CPU when not being used.

## Scale ##
The smallest scale to be represented by voxel blocks should probably be around 10cm. Users will not have access to elements this small, however, to allow for a decent amount of instancing.
  * Small: 10cm blocks, which build up a 32vx, 3.2m cube.
  * Medium: 3.2m blocks (room-sized), in a 102.4m cube.
  * Large: 102.4m cubes in a 3276.8m cube.

This should be sufficient to build everything from small vehicles to buildings, space stations, and spacecraft.

In terms of memory / performance, if every block on every level used here were unique (basically, noise), then this would be 32768^3, or 35,184,372,088,832 cubes (35 trillion!? you might be thinking). However, there will be no noise of that nature in the game. Instead, the 10cm-3.2m range is restricted to developers. They will have animations (i.e., small-scale voxels will have mechanical physics applied) but will be the basic unit that has any other type of physics.

So, the math comes out to be 1,073,741,824 small-scale voxels for one large-scale voxel. This is more manageable, and space on the server will be sold in these increments. Of course, the player may use them anywhere.

That will mean there will need to be an user ID attached to each medium voxel also.

# Mechanics #
There will undoubtedly be need for a way to assign different voxels momentum figures, checked and performed at certain times for animations, like so:

```
var colorindex = 30000;
var position = {x: 0, y: 20, z: 0};
var momentum = {x: 0, y: -9.8, z: 0};
Field[0] = {pos: position, mass: 1, mom: momentum, moving: true, color: colorindex};
```

This will define a voxel object with a position higher up in the left side of the model, with gravity equivalent to Earth's, and violet in color.

## Collisions ##
Collision detection is simple enough, a check for nonzero values in momentum, and checks if there's a block in that direction, for each block in the field which is moving (moving == true).

There will need to be a way for the database to check if the block will fall into another 32vx cubic model segment.

## Mass ##
Mass is calculated per-voxel, which means that mass happens to also be its density. Density figures are used elsewhere, such as for total model density:

```
var modeldensity = (totalmass += Field[i].mass) / (32 * 32 * 32);
```

Lighter voxels will have buoyancy, and thus, momentum.

## Rotation ##
Because of the quantum nature of voxels, rotation can be tricky. It's most likely that it will need to be calculated based on momentum of different parts of the model, such as a shaft or wheel. Flywheels can generate significant amounts of momentum.

## Failure ##
If forces on the voxel exceed a certain threshold, there will be a probability of deformation or failure. This probability increases as the forces increase.

# Matter #
Matter is much more logic-oriented, dealing more with abstract concepts and less with math.

Solutions might be considered tricky at first, but in reality, with object oriented programming, it's not too bad. It might be tempting to use separate voxels for all substances, but I find this to be rather banal.

Mass is recalculated based on simple reference mass and voxel volume ratios.

## Schematics ##
Although it's possible (and encouraged!) to explore all the different ways to use substances, it will be more practical to create schematics which can be shared and used as a rubber stamp for instances of a device. They can be used as a starting point, and then be modified to better suit their purpose and environment. Instancing should treat this modified model as a new, unique model.

In a game, it will be likely that one must accumulate enough substances in storage in order to build a new instance of a schematic.

There will also need to be labeled areas where substances will flow. For example, a radiator should not be filled with gasoline; it should be filled with water or ammonia (depending on how cold it can get).

## Transportation & Storage ##
Naturally, substances cannot be created out of thin air, nor should they be moved magically. Conduits, tunnels, pipes, trucks, cranes... This is how things are made and moved.

Storage is also important for all substances, in order to keep good amounts of them available for building. This is a micromanager's game engine.

## Examples ##
Some examples, similar to the Falling Sand Game, or even Dwarf Fortress:

  * You start out with some advanced technology, like radar, to clear your Fog of War, which extends in three directions, and is denominated per 32vx cubic model segments.
  * Radar can be used to find resources, such as petroleum.
  * Petroleum can be heated in a vessel to separate gases from liquids. The most efficient vessels would be refractionating towers.
  * Kerosene can be obtained, and used as rocket fuel.
  * Liquid oxygen can be purified from the air, chilled by refrigerators, and stored in insulated containers, or tanks.
  * This can be piped into a combustion chamber, pulled in through a mechanical rotor, which is powered by exhaust gases.
  * Substantial amounts of heat energy and momentum / force are created in this rocket engine.

# Energy #
The game can keep track of electrical, thermal, electromagnetic, and radioactive energy.

## Electrical ##
Generation:
  * Chemical - Electrical energy can be generated from chemical reactions (certain solutions will become electrolytes in batteries).
  * Electromagnetic - Generators, connected to anything that produces rotational motion.
  * Photovoltaic - Solar panels.
  * Thermoelectric - For RTGs, mostly.

Radio:
  * Antennas have an area effect, which can be shaped by reflecting material.
  * Communications
  * Radar

## Thermal ##
This will be complicated.

### Heating ###
  * Combustion
  * Electrical (resistance)

### Cooling ###
  * Conduction
  * Radiative
  * Evaporative

## Electromagnetic ##
This will also be complicated, depending on whether frequencies and wavelengths are considered. It might be a good idea to just have constant values for each type of electromagnetic radiation, as well as a value for special properties, such as, is this ionizing, or is this coherent? (laser / maser)

  * Radio
  * Microwave
  * Infrared
  * Visible
  * Ultraviolet
  * Gamma

## Radiation ##
Radiation spreads in a radius around the source, but probably shouldn't permanently irradiate things, that might be too much. Two radioactive voxels which overlap have twice the radioactivity, and so on.

# Performance #
Only through App Engine could an arrangement of such complexity be attempted, however, the specifics of how it will be run will be interesting to see. In order to provide reasonable performance while still performing within the bounds of App Engine's restriction on no daemon-like processes, it will perform these calculations over how many iterations that have been missed since last seen by a user. This will be done in the background, and provide seamless interaction to the user, as grouped model physics processes take place over separate AJAX requests.

It is fortuitous, then, that areas of high traffic will load quicker, as fewer iterations of calculations need to be done. Hopefully they won't take much longer than 30 seconds!

# Voxel Object #

## Small-scale ##
```
var location = {x: 0, y: 0, z: 0};
var color = 30000;
Field.push([location.x, location.y, location.z, color]); // Current setup
Field[0]({location: location, color: color}); // Future setup
```

## Medium-scale ##
```
var instance = 2; // 
var position = {x: 0, y: 20, z: 0};
var momentum = {x: 0, y: -9.8, z: 0};
var moving = true; 
var owner = 0; // Voxel belongs to game.
var energy = {temp: 20, em: false, rad: false}; // Not an EM or radiation emitter, temp. 20C.
var matter = {matterMethod};

Field.push({pos: position, mass: 1, mom: momentum, moving: true, color: colorindex});
```
