import Vector2D from "./vector2d.js";

const G = 1;                    // costante gravitazionale


export default class Planet
{

    constructor( mass, 
                 center,
                 radius,
                 color )
    {
        this.mass = mass;
        this.p = center;                        // posizione
        this.v = new Vector2D( 0, 0 );          // velocità
        this.radius = radius;
        this.color = color;

        this.rungeKutta4 = false;

        this.historyIsActive = false;
        this.history = [];
        this.history.push( this.p.copy() );
    }


    move( actractorPlanet, dt )
    {
        if ( this.rungeKutta4 ) { this.rungeKutta4Integration( actractorPlanet, dt ); }
        else                             { this.eulerIntegration( actractorPlanet, dt );       }

        // memorizza la storia
        if ( this.historyIsActive ) { this.history.push( this.p.copy() ) }
    }


    eulerIntegration( actractorPlanet, dt )
    {
        console.log("euler")
        // forza
        const f = gravityForce( this.p, this.mass, actractorPlanet );

        // accelerazione
        const a = f.multiply( 1 / this.mass );

        // aggiorna velocità
        const dv = a.multiply( dt );
        this.v = this.v.add( dv );
        
        // aggiorna posizione
        const dp = this.v.multiply( dt );
        this.p = this.p.add( dp ); 
    }


    rungeKutta4Integration( actractorPlanet, dt )
    {
        // step 1
        const p1 = this.p;
        const v1 = this.v;
        const f1 = gravityForce( p1, this.mass, actractorPlanet );
        const a1 = f1.multiply( 1 / this.mass );

        // step 2
        const p2 = p1.add( v1.multiply( dt / 2 ) );
        const v2 = v1.add( a1.multiply( dt / 2 ) );
        const f2 = gravityForce( p2, this.mass, actractorPlanet );
        const a2 = f2.multiply( 1 / this.mass );

        // step 3
        const p3 = p1.add( v2.multiply( dt / 2 ) );
        const v3 = v1.add( a2.multiply( dt / 2 ) );
        const f3 = gravityForce( p3, this.mass, actractorPlanet );
        const a3 = f3.multiply( 1 / this.mass );

        // step 4
        const p4 = p1.add( v3.multiply( dt ) );
        const v4 = v1.add( a3.multiply( dt ) );
        const f4 = gravityForce( p4, this.mass, actractorPlanet );
        const a4 = f4.multiply( 1 / this.mass );

        const vSum = v1.add( v2.multiply( 2 ) ).add( v3.multiply( 2 ) ).add( v4 ).multiply( 1 / 6 );
        const aSum = a1.add( a2.multiply( 2 ) ).add( a3.multiply( 2 ) ).add( a4 ).multiply( 1 / 6 );

        this.p = this.p.add( vSum.multiply( dt ) );
        this.v = this.v.add( aSum.multiply( dt ) );

    }


    draw( ctx )
    {
        //ctx.fillStyle = this.color;
        let grad = ctx.createRadialGradient( this.p.x, this.p.y, 0, this.p.x, this.p.y, this.radius );
        grad.addColorStop( 0, '#ffffff' );    
        grad.addColorStop( 1, this.color );
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.arc( this.p.x, this.p.y, this.radius, 0, 2 * Math.PI, true );
        ctx.closePath();
        ctx.fill();

        // disegna la storia
        if ( this.historyIsActive )
        {
            ctx.strokeStyle  = "white";
            ctx.beginPath();                    // clear path
            ctx.moveTo( this.history[ 0 ].x, this.history[ 0 ].y );
            for ( let i = 1; i < this.history.length; i++ )
            {
                ctx.lineTo( this.history[ i ].x, this.history[ i ].y );
            }     
            ctx.stroke();
            }
        }

}


function gravityForce( planetPos, planetMass, actractorPlanet )
{
    const r = actractorPlanet.p.subtract( planetPos );
    const rModule = r.module();
   
    return r.normalized().multiply( G * actractorPlanet.mass * planetMass / ( rModule * rModule ) );
}


