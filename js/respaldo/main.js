var arranca = {
	key: 'arranca',
	active: false,
	preload: carga,
	create: inicio,
	update: actualiza, 
	//extends: Phaser.Scene
};


//××××××××××××××× Juego ××××××××××××\\

var control;
var cam;
var camLargoMax;
var player;
var cielo;
var vel;
var btnDer;
var btnIzq;
var anguloPlayer;
var velRotPlayer;
var rotaDer;
var rotaIzq;
var MISILES;
var ALERTAS;
var EXPLOSIONES;
var cursors;
var texto;
var distAlertas;
var estrella;
var alertaEstrella;
var panel;
var objectivoEstrellas;
var objetivoMisiles;
var objMisilesTemp;
var inicioCronometro;
var timeout;
var panelGameOver;
var particulas;
var partPlayer;
var partMisiles;
var audioAvion;
var audioEstrella;
var audioExplosion;
var audioApareceMisil;
var rate = 0;
var cortina;
	
function carga()
{
	
	this.load.image('cielo', './img/cielo.png');
	this.load.image('avion', './img/avion.png');
	this.load.image('misil', './img/misil.png');
	this.load.image('alerta', './img/alerta.png');
	this.load.image('star', './img/starVerde.png');
	this.load.image('estrella', './img/estrella.png');
	this.load.image('brillo', './img/brillo.png');
	this.load.image('panelEstrellas', './img/panelEstrellas.png');
	this.load.image('panelReloj', './img/panelReloj.png');
	this.load.image('panelMisiles', './img/panelMisiles.png');
	this.load.image('gameOver', './img/gameOver.png');
	this.load.image('panel', './img/panel.png');
	this.load.image('btnPlay', './img/play.png');
	this.load.spritesheet('explosion', './img/explosion.png', { frameWidth: 64, frameHeight: 64 });
	this.load.audio('toca', './audio/toca.mp3');
	this.load.audio('motor', './audio/motor.mp3');
	this.load.audio('explosion', './audio/explosion.mp3');
	this.load.audio('estrella', './audio/estrella.mp3');
	this.load.audio('apareceMisil', './audio/apareceMisil.mp3');
	this.load.atlas('flares', './img/flares.png', './img/flares.json');
}

function inicio()
{
	//iniciar variables...
	vel = 3;
	anguloPlayer = 180;	
	velRotPlayer = 2.5;
	rotaDer = false;
	rotaIzq = false;
	MISILES = [];	
	ALERTAS = [];
	EXPLOSIONES = [];
	distAlertas = 0;	
	objectivoEstrellas = 10;	
	objetivoMisiles = 5;
	objMisilesTemp = 0;
	inicioCronometro = 0;
	timeout = 0;	
	partMisiles = [];
	
	//Se elige un color de fondo aleatorio... 
	let cR = Phaser.Math.Between(0,100);
	let cG = Phaser.Math.Between(0,100);
	let cB = Phaser.Math.Between(0,100);
	
	this.cameras.main.setBackgroundColor('rgb('+cR+',' +cG+',' +cB+')' );
	
	controlJuego();
		
		
	/*let sfx = this.sound.add('toca');
	//sfx.setDetune(1000)
	sfx.setRate(4);
	sfx.play();
	*/
	
	audioAvion = this.sound.add('motor');
//	audioAvion.setDetune(50);
	audioAvion.play();
	audioAvion.setLoop(true);
	audioAvion.setVolume(0.2);
	 
	audioExplosion = this.sound.add('explosion');
	audioEstrella = this.sound.add('estrella');
	audioApareceMisil = this.sound.add('apareceMisil');
	//audioApareceMisil.play();
	
	this.input.addPointer(2);
	cursors = this.input.keyboard.createCursorKeys();
	
	cielo = this.add.tileSprite(0,0, window.innerWidth, window.innerHeight,'cielo').setOrigin(0.1);
	cielo.setOrigin(0.5);
	
	player = this.physics.add.sprite(165,300,'avion').setScale(0.4);
	player.body.setCircle(30,10,0);
	player.cantEstrellas = 0;
	//player.setOrigin(1,0.5);
	
	particulas = this.add.particles('flares');
	partPlayer = particulas.createEmitter({
		frame: 'red',
		x: player.x, y: player.y,
		speed: 0,
		lifespan: 1000,
		quantity: 1,
		scale: { start: 0.5, end: 0 },
		alpha: { start: 0.1, end: 0 },
		blendMode: 'ADD',
		//emitZone: { type: 'edge', source: shape1, quantity: 400, yoyo: false }
	});

	for(let i = 0; i < 5; i++)
	{
		var misil = this.physics.add.sprite(Phaser.Math.FloatBetween(player.x - 1500,player.x + 1500 ),Phaser.Math.FloatBetween(player.y - 1500,player.y + 1500) ,'misil').setScale(0.06);
		misil.setOrigin(1,0.5);
		misil.anguloMisil = Phaser.Math.FloatBetween(0,360);// -160;
		misil.velRotMisil =  Phaser.Math.FloatBetween(1,2);
		misil.velMisil = Phaser.Math.FloatBetween(vel,vel+1);
		misil.dist = 0;
		misil.seVe = false;
		misil.disableBody(true,true);
		//misil.setActive(false);
		misil.num = i;
		misil.setCircle(100, 550,20);
	//	misil.body.setOrigin(1)
		
		MISILES.push(misil);
		
		let pM = particulas.createEmitter({
			frame: 'green',
			x: misil.x, y: misil.y,
			speed: 0,
			lifespan: 4000,
			quantity: 1,
			scale: { start: 0.15, end: 0 },
			alpha: { start: 1, end: 0 },
			blendMode: 'ADD',
			//emitZone: { type: 'edge', source: shape1, quantity: 400, yoyo: false }
		});
		
		partMisiles.push(pM);
		partMisiles[i].setVisible(false) 
		partMisiles[i].stop();
		
		var alerta = this.add.sprite(Phaser.Math.FloatBetween(0,window.innerWidth-100),Phaser.Math.FloatBetween(0,window.innerHeight-100),'alerta').setScale(0.25);
		var t = this.add.text(alerta.x,alerta.y,'0').setFontFamily('Arial').setFontSize(10).setColor('White').setOrigin(0.5);	
		ALERTAS.push({alerta, t});	
		
		//Crear explosiones....
		explosion = this.add.sprite(200,200,'explosion').setScale(1.5);
		explosion.setVisible(false);
		
		EXPLOSIONES.push(explosion);
	}
	
	btnDer = this.add.image(0,0,'cielo').setOrigin(0);
	btnDer.displayWidth = window.innerWidth/2;
	btnDer.displayHeight = window.innerHeight;
	btnDer.setAlpha(0.001);
	btnDer.setInteractive();
	
	btnDer.on('pointerdown', funBtnDer);

	btnIzq = this.add.image(0,0,'cielo').setOrigin(0);
	btnIzq.displayWidth = window.innerWidth/2;
	btnIzq.displayHeight = window.innerHeight;
	btnIzq.setAlpha(0.001);
	btnIzq.setInteractive();
	btnIzq.on('pointerdown', funBtnIzq);
	
	this.input.on('pointerup', () => {
		rotaDer = false;
		rotaIzq = false;
		});

	cam = this.cameras.main;
	camLargoMax = Math.max(cam.width,cam.height);
	cam.startFollow(player);
	
	//texto = this.add.text(cam.x, cam.y, 'Avion jdjdjuejjejejeududu').setFontFamily('Arial').setFontSize(20).setColor('red').setAlign('center');

	animacionExplosion();
	
	for(let i = 0; i < MISILES.length; i++)
	{
		this.physics.add.overlap(player, MISILES[i], colisionPlayer, null, this);
		for(let a = 0; a < MISILES.length; a++)
		{
			if(a === i)
				continue;
			else
				this.physics.add.overlap(MISILES[a], MISILES[i], colisionMisiles, null, this);
		} 
	}
	
	alertaEstrella = this.add.sprite(100,100,'star').setScale(0.25);
	alertaEstrella.texto = this.add.text(alertaEstrella.x,alertaEstrella.y,'0').setFontFamily('Arial').setFontSize(10).setColor('White').setOrigin(0.5);
	
	let estrellaAmarilla = this.add.sprite(0,0,'estrella').setScale(0.4).setName('estrellaAmarilla').setTint(0x00ff00);
	let brillo = this.add.sprite(0,0,'brillo').setScale(1).setName('brillo').setAlpha(0.3).setTint(0x00ff00);
		
	estrella = this.add.container(200,200);
	estrella.add([estrellaAmarilla, brillo]); 
	 let est = estrella.getByName('brillo');
	 
	estrella.est = est;
	
	this.physics.world.enable(estrella);
	this.physics.add.overlap(player, estrella, colisionEstrella, null, this);
	estrella.body.setSize(20, 20).setOffset(-10,-10);
	//list(estrella.body)
	//paneles UI...
	panel = this.add.container(player.x,player.y - (window.innerHeight/2-30));
	let panelEstrellas = this.add.sprite(0,0,'panelEstrellas').setScale(0.15);
	let textEstrellas = this.add.text(0,-10, '0/' +objectivoEstrellas+'').setFontFamily('Arial').setFontSize(15).setColor('White');
		//mtextEstrellas.setOrigin(0.5,0.5);
		textEstrellas.setAlign('center').setName('textEstrellas');
		//textEstrellas.setShadow(2,2,'#333333', 2,true,true);
		panel.add([panelEstrellas, textEstrellas]);
		panel.estrella = panel.getByName('textEstrellas');
		
		let panelReloj = this.add.sprite(100,0,'panelReloj').setScale(0.15);
		let textReloj = this.add.text(97,-10, '00:00').setFontFamily('Arial').setFontSize(15).setColor('White');
		textReloj.setAlign('center').setName('textReloj');
		//textEstrellas.setShadow(2,2,'#333333', 2,true,true);
		panel.add([panelReloj, textReloj]);
		panel.reloj = panel.getByName('textReloj');
		
		let panelMisiles = this.add.sprite(200,0,'panelMisiles').setScale(0.15);
		let textMisiles = this.add.text(197,-10, '0/'+objetivoMisiles).setFontFamily('Arial').setFontSize(15).setColor('White');
		textMisiles.setAlign('center').setName('textMisiles');
		//textEstrellas.setShadow(2,2,'#333333', 2,true,true);
		panel.add([panelMisiles, textMisiles]);
		panel.misil = panel.getByName('textMisiles');
		
		//====== gameOver ======\\
		panelGameOver = this.add.container(0,0);
		let panelGO = this.add.image(0,0,'panel').setScale(0.3,0.5).setAlpha(0.6);
		let img = this.add.image(0,-30,'gameOver').setScale(0.2);
		let btnPlay = this.add.image(0,80,'btnPlay').setScale(0.12).setInteractive();
		btnPlay.on('pointerdown', () =>{
			this.tweens.add({
				targets: cortina,
				duration:1000,
				alpha: 1,
				onComplete: () =>{
				this.scene.restart();
				} 
			});
			//this.scene.restart()
		});
		panelGameOver.add([panelGO,img, btnPlay]);
		
		
		//inicia cronometro
		empezarDetener(this);
	//this.physics.world.enable(estrella);
//verPropiedadesFull(this.physics.add.overlap)
//list(estrella.body)

	cortina = this.add.graphics();
	cortina.fillStyle(0x000000,1);
	cortina.fillRect(0,0,window.innerWidth, window.innerHeight);
	cortina.setDepth(50);
	
	this.tweens.add({
	targets: cortina,
	duration:1000,
	alpha: 0,
	onComplete: () =>{
		cortina.active = false;
	} 
	});
} 

function actualiza(t, dt)
{
	if(cortina.active)
		cortina.setPosition(player.x-window.innerWidth /2, player.y-window.innerHeight /2);
		
	if(!player.visible)
	{
		if(!panelGameOver.visible)
		{
			setTimeout(() =>
			{
				panelGameOver.visible = true;
				panelGameOver.setScale(0);
				
				this.tweens.add({
				targets: panelGameOver,
				duration:200,
				scaleX:1,
				scaleY:1
				});
			},1100);		
		}
		gameOver();
	} 
	else
		panelGameOver.visible = false;
	
	partPlayer.setPosition(player.x,player.y);
	
	for(let i = 0; i < MISILES.length; i++)
	{		
		if(MISILES[i].visible)
		{	
		/*	if(!MISILES[i].seVe && MISILES[i].x < player.x + window.innerWidth/2 && MISILES[i].x > player.x - window.innerWidth/2) //&& MISILES[i].y < player.y + window.innerHeight/2 && MISILES[i].y > player.y - Window.innerHeight/2)
			{
				MISILES[i].seVe = true;
				alert('MISIL ' +i+ 'esta en pantalla')
			}
		*/	
			
			if(!partMisiles[i].visible)
				partMisiles[i].setVisible(true);
				
			partMisiles[i].setPosition(MISILES[i].x, MISILES[i].y);
		} 
		else
			partMisiles[i].stop();
	}
	
	panel.x = player.x - window.innerWidth/2 + 100;
	panel.y = player.y - (window.innerHeight/2-30);
	missilSigueAvion();
	estrella.est.rotation += 0.05;
	cielo.x = player.x;
	cielo.y = player.y;
	cielo.tilePositionX += Math.cos(player._rotation) * vel;
	cielo.tilePositionY += Math.sin(player._rotation) * vel;

	
	btnDer.x = player.x;
	btnDer.y = player.y-window.innerHeight/2
	
	btnIzq.x = player.x - window.innerWidth/2;
	btnIzq.y = player.y-window.innerHeight/2;	
		
//	texto.x = player.x;
//	texto.y = player.y - (window.innerHeight/2-30);
	
	//Config mostrar o no alertaEstrella
	mostrarAlertas(alertaEstrella, estrella);
	let et = player.y > alertaEstrella.y ? -1 : 1;
	
	if(alertaEstrella.texto.visible != alertaEstrella.visible) 
		alertaEstrella.texto.visible = alertaEstrella.visible;
		
	alertaEstrella.texto.x = alertaEstrella.x;
	alertaEstrella.texto.y = alertaEstrella.y-(alertaEstrella.displayWidth/1.4*et);
	alertaEstrella.texto.text = Phaser.Math.FloorTo(distanciaEntre(player, estrella)/10);	
	
	playerRota();
	
	
	
	for(let a = 0; a < ALERTAS.length; a++)
	{
		mostrarAlertas(ALERTAS[a].alerta, MISILES[a]);
		
		if(!ALERTAS[a].alerta.visible)
		{
			if(!MISILES[a].seVe && MISILES[a].x < (player.x - player.displayWidth/2) + window.innerWidth/2 && MISILES[a].x > (player.x + player.displayWidth/2) - window.innerWidth/2 && MISILES[a].y < player.y + window.innerHeight/2 && MISILES[a].y > player.y - window.innerHeight/2)
			{
				MISILES[a].seVe = true;
				audioApareceMisil.play();//alert('MISIL ' +a+ 'esta en pantalla')
			}
	
			ALERTAS[a].t.setVisible(false);
			continue;
		}
		else
		{
			if(!ALERTAS[a].t.visible) ALERTAS[a].t.setVisible(true);
			
			if(MISILES[a].seVe)
			MISILES[a].seVe = false;
		} 
		
		
		//Define si texto se muetra	arriba o abajo de la alerta.... 
		let e = player.y > ALERTAS[a].alerta.y ? -1 : 1;
		
		ALERTAS[a].t.x = ALERTAS[a].alerta.x;
		ALERTAS[a].t.y = ALERTAS[a].alerta.y-(ALERTAS[a].alerta.displayWidth/1.2*e);
		ALERTAS[a].t.text = Phaser.Math.FloorTo(MISILES[a].dist/10);
	}

/*	if (cursors.left.isDown)
    {
        rotaIzq = true;
    }
    else if (cursors.right.isDown)
    {
        rotaDer = true;
	}
	else
	{
		rotaIzq = false;
		rotaDer = false;
	}
*/
}

function colisionEstrella(player, estrella)
{
	audioEstrella.play();
	player.cantEstrellas++;
	panel.estrella.text = player.cantEstrellas+'/'+objectivoEstrellas;
	estrella.body.enable = false;
	estrella.est.visible = false;
	
	if(player.cantEstrellas >= objectivoEstrellas)
	{
		alert('Has ganado!');
		return;
	}
	
	this.tweens.add({
	targets: estrella,
	duration:500,
	scaleX:5,
	scaleY:5,
	alpha: 0,
	onComplete: () =>{
		estrella.x = Phaser.Math.Between(player.x+1000,player.x-1000);
		estrella.y = Phaser.Math.Between(player.y+1000,player.y-1000);
		estrella.setScale(1);
		estrella.setAlpha(1);
		estrella.body.enable = true;
		estrella.est.visible = true;
		} 
	});
} 

function mostrarAlertas(a, m)
{
	/*if(distAlertas > 1000)
		{
			ALERTAS.setVisible(false);
			return;
		}
	*/
		
		//Mostrar o no respectiva alerta...
		if(m.visible && m.x < player.x - window.innerWidth/2 - m.displayWidth ||m.visible && m.x > player.x + window.innerWidth/2 + m.displayWidth ||m.visible && m.y < player.y - window.innerHeight/2 - m.displayHeight ||m.visible && m.y > player.y + window.innerHeight/2 + m.displayHeight) 
			a.setVisible(true);
		else
		{
			if(a.visible === true) 
				a.setVisible(false);
			
			return;
		} 
		//Alertas siguen a sus misiles...
	
		a.x = m.x;
		a.y = m.y;
		
		//Limitar alertas dentro de la pantalla... 
		let awX = a.displayWidth/2;
		let ahY = a.displayHeight/2;
		
		let px = window.innerWidth/2;
		let py = window.innerHeight/2;
			
		a.x = Phaser.Math.Clamp(a.x,player.x - px + awX, player.x + px - awX);
		a.y = Phaser.Math.Clamp(a.y,player.y - py + ahY, player.y + py - ahY);		
} 


function funBtnDer(e)
{
	//player.x = e.x;
	//player.y = e.y;
	rotaDer = true;
}

function funBtnIzq(e)
{
	//player.x = e.x;
	//player.y = e.y;
	rotaIzq = true;
}

function missilSigueAvion()
{		
	player.setAngle(anguloPlayer); 
	player.x += Math.cos(player._rotation) * vel;//player._rotation) * vel;
	player.y += Math.sin(player._rotation) * vel;//player._rotation) * vel;	

	for(let i = 0; i < MISILES.length; i++)
	{
		let misil = MISILES[i];
		
		let dx = player.x - misil.x;
		let dy = player.y - misil.y;
		let distancia = Math.floor(Math.sqrt(dx*dx + dy*dy));
		let angGuiaRadianes = Math.atan2(dy,dx);
		let	angGuiaGrados =  angGuiaRadianes * 180/Math.PI;//Math.abs(angGuiaRadianes * 180/Math.PI);
		
		misil.dist = distancia;
		
		if(misil.x > player.x && Math.sign(misil._rotation) === -1 && Math.sign(angGuiaRadianes) === 1) 
		{
			if(angGuiaGrados > 0)
				angGuiaGrados -= 360;
		}
		else if(misil.x > player.x && Math.sign(misil._rotation) === 1 && Math.sign(angGuiaRadianes) === 1) 
		{
			if(misil.anguloMisil < 0)
				misil.anguloMisil += 360;
		}
		else if(misil.x > player.x && Math.sign(misil._rotation) === 1 && Math.sign(angGuiaRadianes) === -1) 
		{
			if(angGuiaGrados < 0)
			angGuiaGrados += 360;
			
			if(misil.anguloMisil > 0)
			 	misil.anguloMisil -= 360;
		}
		

		//let distancia = Math.floor(Math.sqrt(dx*dx + dy*dy));
			distAlertas = distancia;
	
		if(misil.anguloMisil < angGuiaGrados)
		{
			misil.anguloMisil += misil.velRotMisil;
			misil.setAngle(misil.anguloMisil);
		} 
		else if(misil.anguloMisil > angGuiaGrados)
		{
			misil.anguloMisil -= misil.velRotMisil;
			misil.setAngle(misil.anguloMisil);
		}
		
		//misil.setAngle(anguloMisil);
		misil.x += Math.cos(misil._rotation) * misil.velMisil;
		misil.y += Math.sin(misil._rotation) * misil.velMisil;
	
	//	texto.text = 'Distancia: '+distancia+ '\n'+ ' angGuia '+ Math.floor(angGuiaGrados) +'\n' +'misil angulo ' + Math.floor(misil.anguloMisil)+'\n' +'angMisilRadianes '+Math.sign(misil._rotation)+'\n' +'anguloGuiaRadianes '+Math.sign(angGuiaRadianes);;
	}	
}

function distanciaEntre(a, b)
{
	let dx = a.x - b.x;
	let dy = a.y - b.y;
	let distancia = Math.floor(Math.sqrt(dx*dx + dy*dy));
	
	return distancia;
}

function playerRota()
{
	if(!player.active)
		return;
		
	if(rotaDer)
	{
		anguloPlayer += velRotPlayer;
		player.setAngle(anguloPlayer);
	}
	else if(rotaIzq)
	{
		anguloPlayer -= velRotPlayer;
		player.setAngle(anguloPlayer);
	} 
}

function animacionExplosion()
{
	juego.anims.create({
	key: 'explosion',
	frames: juego.anims.generateFrameNumbers('explosion', {start:0,end:15}),
	frameRate: 15,
	//repeat: -1
	hideOnComplete: true
	});
	
	explosion.anims.play('explosion', true);
	
}

function explotar(ab, bc)
{
	for(a of EXPLOSIONES)
	{
		if(a.visible)
			continue;
		else
		{
			a.setVisible(true);
			a.setPosition(ab.x,ab.y);
			a.anims.play('explosion', true);
	
			break;
		}
	}  
}

function colisionPlayer(player, misil)
{
	//=== detener Cronometro
	
		audioExplosion.setRate(1.8);
		audioExplosion.play();
		
		empezarDetener(this);
		partPlayer.setVisible(false);
		player.disableBody(true,true);
		misil.disableBody(true, true);
		partMisiles[misil.num].stop() //setVisible(false);
		explotar(player, misil);
	
		audioAvion.setLoop(false);
		audioAvion.stop();
}

function colisionMisiles(a, b)
{
	audioExplosion.setRate(1.8);
	audioExplosion.play();
	
	explotar(a, b);
	a.disableBody(true,true);
	b.disableBody(true, true);
	
	partMisiles[a.num].stop();
	partMisiles[b.num].stop();
	
	ALERTAS[a.num].alerta.setVisible(false);
	ALERTAS[b.num].alerta.setVisible(false);
	
	objMisilesTemp += 2;
	panel.misil.text = objMisilesTemp+'/' +objetivoMisiles;
} 

//========= Cronometro =========
function empezarDetener(elemento)
	{
		if(timeout==0)
		{
			// empezar el cronometro
 
			elemento.value="Detener";
 
			// Obtenemos el valor actual
			inicioCronometro=vuelta=new Date().getTime();
 
			// iniciamos el proceso
			funcionando();
		}else{
			// detemer el cronometro
 
			elemento.value="Empezar";
			clearTimeout(timeout);
			timeout=0;
		}
	}
 
	function funcionando()
	{
		// obteneos la fecha actual
		var actual = new Date().getTime();
 
		// obtenemos la diferencia entre la fecha actual y la de inicio
		var diff=new Date(actual-inicioCronometro);
 
		// mostramos la diferencia entre la fecha actual y la inicial
		var result=LeadingZero(diff.getUTCMinutes())+":"+LeadingZero(diff.getUTCSeconds());
		panel.reloj.text = result;
 
		// Indicamos que se ejecute esta función nuevamente dentro de 1 segundo
		timeout=setTimeout("funcionando()",1000);
	}
 
	/* Funcion que pone un 0 delante de un valor si es necesario */
	function LeadingZero(Time) {
		return (Time < 10) ? "0" + Time : + Time;
	}
	
	//Funcion control del juego... 
	function controlJuego()
	{
		control = setTimeout(() => {
			if(revisarCantMisilPantalla() < 4)
				agregarMisil();
				
			controlJuego();
		}, (Phaser.Math.Between(5,10)*1000)) ;
	}
	
	function revisarCantMisilPantalla()
	{
		let misilAct = 0;
		
		for(let i = 0; i < MISILES.length; i++)
		{
			if(MISILES[i].active)
				misilAct++;	
		}
		return misilAct;
	}
	
	function agregarMisil()
	{
		for(let i = 0; i < MISILES.length; i++)
		{
			if(MISILES[i].active)
				continue;
			else
			{
				let v = Phaser.Math.Between(0,1); 
				MISILES[i].setActive(true);
				MISILES[i].setVisible(true);
				MISILES[i].enableBody(true);
				MISILES[i].setPosition(player.x+(v===0?1000:-1000),player.y+(v===0?1000:-1000));
				partMisiles[i].setVisible(true);
				partMisiles[i].start();	
				break;
			} 
		} 
	}
	//======== fin cronometro ==========\\
	
	function gameOver()
	{
		panelGameOver.x = player.x;
		panelGameOver.y = player.y;
	} 