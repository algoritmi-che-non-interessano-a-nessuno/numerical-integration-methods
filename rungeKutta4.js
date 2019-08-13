import Vector2D from "./vector2d.js"
import Planet from "./planet.js";

const canvas = document.getElementById( "rungeKutta4_canvas" );
canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext( "2d" );
 
let lastTime = Date.now();
let t = 0;
let dt = 0;

// pianeta
const PLANET_CENTER = new Vector2D( 300,0 );
const PLANET_VELOCITY = new Vector2D( 300, 0 );
const PLANET_RADIUS = 10;
const PLANET_MASS = 1;                          

// sole
const SUN_CENTER = new Vector2D( 300,300 );
const SUN_RADIUS = 50;
const SUN_MASS = 70000000;               

const sun = new Planet( SUN_MASS, SUN_CENTER, SUN_RADIUS, '#ff9900' );
const planet = new Planet( PLANET_MASS, PLANET_CENTER, PLANET_RADIUS, '#0000ff' );
planet.v = PLANET_VELOCITY;
planet.rungeKutta4 = true;
planet.historyIsActive = true;


loop();

function loop()
{
    t = Date.now()
    dt = ( t - lastTime ) / 1000;
    lastTime = t

    planet.move( sun, dt );
    ctx.fillStyle = "black";
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    sun.draw( ctx );
    planet.draw( ctx );

    requestAnimationFrame( loop );
}
