//import main from './main2.js';
function verPropiedadesFull(obj)
{
	var w =''		
	for (var i in obj){
		 w += console.log(i, obj[i])
		 w += '\n' 
	 }
	 return console.log(w);
} 

var j = '', c = 0;
var list = function(object) {
	   for(var key in object) {
	     j +=key;
	     j += '\n';
	     c++;
	   }
	   return console.log(j+ 'total: '+c );
	}
	
function lerp (start, end, amt)
{
  return (1-amt)*start+amt*end
}

var config = {
	type: Phaser.AUTO,
	scale: {
        mode: Phaser.Scale.ENVELOP, // 'ENVELOP' asegura que cubra TODA la pantalla sin dejar bordes
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
	width: window.innerWidth,
	height: window.innerHeight,
	
	fps: {
	target: 60,
	forceSetTimeOut: true
	},
	
	
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene:[entrada, arranca] 
};

var juego = new Phaser.Game(config);
