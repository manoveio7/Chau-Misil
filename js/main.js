var arranca = {
	key: 'arranca',
	active: false,
	preload: carga,
	create: inicio,
	update: actualiza, 
	//extends: Phaser.Scene
};


//××××××××××××××× Juego ××××××××××××\\
var listo;
var control;
var cam;
var camLargoMax;
var player;
var cielo;
var vel;
var btnDer;
var btnIzq;
var btnBala;
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
var alertaFuel;
var alertaArma;
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
var partWin;
var audioAvion;
var audioEstrella;
var audioExplosion;
var audioApareceMisil;
var audioPeligro;
var audioArma;
var audioTiroAvion;
var rate = 0;
var cortina;
var fuels;
var aguja;
var anguloAguja = 45;
var tiempoCombustible;
var combustibleTemp;
var scalaGeneral = 0.8;
var BALAS;
var arma;
var maxTiros;
var cantBalas;
var mision;
var misionCumplida;
var cartelVictoria;
var datos;
	
function carga()
{
	
	this.load.image('cielo', './img/cielo.png');
	this.load.image('avion', './img/avion.png');
	this.load.image('misil', './img/misil.png');
	this.load.image('alerta', './img/alerta.png');
	this.load.image('star', './img/starVerde.png');
	this.load.image('estrella', './img/estrella.png');
	this.load.image('fuelAlerta', './img/fuelAlerta.png');
	this.load.image('fuelBase', './img/fuelBase.png');
	this.load.image('brillo', './img/brillo.png');
	this.load.image('panelEstrellas', './img/panelEstrellas.png');
	this.load.image('panelReloj', './img/panelReloj.png');
	this.load.image('panelMisiles', './img/panelMisiles.png');
	this.load.image('gameOver', './img/gameOver.png');
	this.load.image('panel', './img/panel1.png');
	this.load.image('btnMenu', './img/menu.png');
	this.load.image('btnReiniciar', './img/reiniciar.png');
	this.load.image('btnBala', './img/btnBala.png');
	this.load.spritesheet('explosion', './img/explosion.png', { frameWidth: 64, frameHeight: 64 });
	
	// Aqui URL para descargar Audios
	// https://pixabay.com/es/sound-effects/search/laser/
	
	this.load.audio('toca', './audio/toca.mp3');
	this.load.audio('tiroAvion','./audio/AudioTiroAvion.mp3');
	this.load.audio('arma', './audio/audioArma.mp3');
	this.load.audio('motor', './audio/motor.mp3');
	this.load.audio('explosion', './audio/explosion.mp3');
	this.load.audio('estrella', './audio/estrella.mp3');
	this.load.audio('apareceMisil', './audio/apareceMisil.mp3');
	this.load.audio('peligro', './audio/peligro2.mp3');
	this.load.atlas('flares', './img/flares.png', './img/flares.json');
	this.load.image('fuel','./img/fuel.png');
	this.load.image('aguja','./img/aguja.png');
	this.load.image('bala','./img/bala.png');
	this.load.image('arma','./img/arma.png');
	this.load.image('alertaArma','./img/alertaArma.png');
	this.load.image('btnOk','./img/btnOk.png');
}

function inicio()
{	
	console.log('inicio el juego');
	//iniciar variables...
	listo = false;
	vel = 3//1.5;
	anguloPlayer = 270;	
	velRotPlayer = 2.5;
	rotaDer = false;
	rotaIzq = false;
	MISILES = [];	
	ALERTAS = [];
	EXPLOSIONES = [];
	BALAS = [];
	maxTiros = 3;
	cantBalas = maxTiros;
	distAlertas = 0;	
	objectivoEstrellas = 3;	
	objetivoMisiles = 5;
	objMisilesTemp = 0;
	inicioCronometro = 0;
	timeout = 0;	
	partMisiles = [];
	tiempoCombustible = 100;
	combustibleTemp = tiempoCombustible;
	mision = 1;
	misionCumplida = false;
	
	//Se elige un color de fondo aleatorio... 
	
	//let colores = ['rgb(100,51,1)','rgb(12,22,98)','rgb(1,45,144)','rgb(18,140,151)', 'rgb(99,18,16)'];
	//this.cameras.main.setBackgroundColor(colores[4])//colores[Phaser.Math.Between(0,colores.length-1)]); 

	let cR = Phaser.Math.Between(0,100);
	let cG = Phaser.Math.Between(0,50);
	let cB = Phaser.Math.Between(0,144);
	
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
	audioArma = this.sound.add('arma');
	audioTiroAvion = this.sound.add('tiroAvion');
	audioEstrella = this.sound.add('estrella');
	audioApareceMisil = this.sound.add('apareceMisil');
	
	audioPeligro = this.sound.add('peligro');
	audioPeligro.setVolume(0.07);
		
	this.input.addPointer(2);
	cursors = this.input.keyboard.createCursorKeys();
	
	cielo = this.add.tileSprite(0,0, window.innerWidth, window.innerHeight,'cielo').setOrigin(0.1);
	cielo.setOrigin(0.5);
	//cielo.setDataEnabled();
	
	//Defenir cual mision empezar....
	let ls = localStorage.getItem("mision")
	
	if(ls > 1)
		mision = ls;
	else
	{
		mision = 1;
		localStorage.setItem("mision", mision);
	}
	
	misiones();
	
	player = this.physics.add.sprite(165,300,'avion').setScale(0.4*scalaGeneral);//scale padrón 0.4.
	player.body.setCircle(30,10,0);
	player.cantEstrellas = 0;
	//player.setOrigin(1,0.5);
	player.setDepth(50);
	
	particulas = this.add.particles('flares');
	partPlayer = particulas.createEmitter({
		frame: 'red',
		x: player.x, y: player.y,
		speed: 0,
		lifespan: 1000,
		quantity: 1,
		scale: { start: 0.5*scalaGeneral, end: 0 },
		alpha: { start: 0.1, end: 0 },
		blendMode: 'ADD',
		//emitZone: { type: 'edge', source: shape1, quantity: 400, yoyo: false }
	});

	for(let i = 0; i < 5; i++)
	{
		var misil = this.physics.add.sprite(Phaser.Math.FloatBetween(player.x - 1500,player.x + 1500 ),Phaser.Math.FloatBetween(player.y - 1500,player.y + 1500) ,'misil').setScale(0.06*scalaGeneral);
		misil.setOrigin(1,0.5);
		misil.anguloMisil = Phaser.Math.FloatBetween(0,360);// -160;
		misil.velRotMisil =  Phaser.Math.Between(10,20)/10// Phaser.Math.FloatBetween(1,1.5)//0.5,1);
		misil.velMisil = Phaser.Math.Between(vel*10,vel*10 + (mision < 3 ? 10 : 20))/10;
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
			scale: { start: 0.15*scalaGeneral, end: 0 },
			alpha: { start: 0.3, end: 0 },
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
	
	//Crear Botón mover avión....
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
	// Crear Alerta de Arma....
	alertaArma = this.add.sprite(100,100,'alertaArma').setScale(0.3);
	alertaArma.texto = this.add.text(alertaArma.x,alertaArma.y,'0').setFontFamily('Arial').setFontSize(10).setColor('White').setOrigin(0.5);
	//Crear Botón de tirar balas
	btnBala = this.add.image(window.innerWidth/1.5,window.innerHeight/3,'btnBala').setOrigin(0);
	btnBala.displayWidth = window.innerWidth/4;
	btnBala.displayHeight = window.innerWidth/4;
	btnBala.setAlpha(0.5).setScrollFactor(0);;
	btnBala.setInteractive();
	
	btnBala.on('pointerdown', tirarBalas);
	btnBala.on('pointerup', sueltaBtnBalas);
	btnBala.visible = false;
	
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
	
	//Alerta estrella y sus componentes....
	alertaEstrella = this.add.sprite(100,100,'star').setScale(0.25);
	alertaEstrella.texto = this.add.text(alertaEstrella.x,alertaEstrella.y,'0').setFontFamily('Arial').setFontSize(10).setColor('White').setOrigin(0.5);
	
	let estrellaAmarilla = this.add.sprite(0,0,'estrella').setScale(0.4).setName('estrellaAmarilla').setTint(0x00ff00);
	let brillo = this.add.sprite(0,0,'brillo').setScale(1).setName('brillo').setAlpha(0.3).setTint(0x00ff00);
		
	estrella = this.add.container(player.x + Phaser.Math.Between(-3000,3000), player.y + Phaser.Math.Between(-3000,3000));
	estrella.add([estrellaAmarilla, brillo]); 
	 let est = estrella.getByName('brillo');
	 
	estrella.est = est;
	
	this.physics.world.enable(estrella);
	this.physics.add.overlap(player, estrella, colisionEstrella, null, this);
	estrella.body.setSize(20, 20).setOffset(-10,-10);
	//list(estrella.body)

	// Alerta sobre el fuel y sus componentes...
	
	fuelAlerta = this.add.sprite(100,100,'fuelAlerta').setScale(0.3);
	fuelAlerta.texto = this.add.text(fuelAlerta.x,fuelAlerta.y,'0').setFontFamily('Arial').setFontSize(10).setColor('White').setOrigin(0.5);
	
	let fuelBase = this.add.sprite(0,0,'fuelBase').setScale(0.4).setName('fuelBase');
	let brilloFuel = this.add.sprite(0,0,'brillo').setScale(1).setName('brilloFuel').setAlpha(0.2);
		
	fuels = this.add.container(player.x + Phaser.Math.Between(-3000,3000), player.y + Phaser.Math.Between(-3000,3000));
	fuels.add([brilloFuel,fuelBase]); 
	 let estFuels = fuels.getByName('brilloFuel');
	 
	 fuels.est = estFuels;
	
	this.physics.world.enable(fuels);
	this.physics.add.overlap(player, fuels, colisionFuel, null, this);
	fuels.body.setSize(20, 20).setOffset(-10,-10);
	
	
	//txt = this.add.text(100,110, 'RUBEN').setFontFamily('Arial').setFontSize(15).setColor('White').setScrollFactor(0).setDepth(1000);
	//paneles UI...
	panel = this.add.container(80,30).setScrollFactor(0);
	//panel.setScrollFactor(0);
		fuel = this.add.sprite(100,85,'fuel').setScale(0.2);
		fuel.setAlpha(0.8).setName('fuel');
		aguja = this.add.sprite(100,85,'aguja').setScale(0.2).setOrigin(0.5,1).setName('aguja').setAngle(anguloAguja);
		aguja.setOrigin(0.5,1.03).setAlpha(0.8);
		panel.add([fuel,aguja]);
		panel.fuel = panel.getByName('fuel');
		panel.aguja = panel.getByName('aguja');
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
		panelGameOver = this.add.container(this.cameras.main.width/2,this.cameras.main.height/2).setScrollFactor(0);
		let panelGO = this.add.image(0,0,'panel').setScale(0.3,0.5).setAlpha(0.6).setScrollFactor(0);
		let img = this.add.image(0,-30,'gameOver').setScale(0.2).setScrollFactor(0);
		let btnReiniciar = this.add.image(0,80,'btnReiniciar').setScale(0.15).setInteractive().setScrollFactor(0);
		btnReiniciar.on('pointerdown', () =>{
			//vel = 0;
			cortina.setActive(true);
			this.tweens.add({
				targets: cortina,
				duration: 500,
				alpha: 1,
				onComplete: () =>{
				this.scene.restart();
				} 
			});
		});
		let btnMenu = this.add.image(100,80,'btnMenu').setScale(0.15).setInteractive().setScrollFactor(0);
		btnMenu.on('pointerdown', () =>{
		//vel = 0;
			cortina.setActive(true);
			this.tweens.add({
				targets: cortina,
				duration: 500,
				alpha: 1,
				onComplete: () =>{
					this.scene.start('entrada');
					} 
			});
		});
		panelGameOver.add([panelGO,img, btnReiniciar, btnMenu]);
		
		
		//inicia cronometro
		empezarDetener(this);

	cortina = this.add.graphics();
	cortina.fillStyle(0x000000,1);
	cortina.fillRect(0,0,window.innerWidth*1.3, window.innerHeight*1.3);
	cortina.setDepth(70);
		
	this.tweens.add({
		targets: cortina,
		duration:500,
		alpha: 0,
		onComplete: () =>{
			cortina.active = false;
			//vel = 3
		} 
	});
	
	//particulas de Vuctoria...
	let par = this.add.particles('estrella');
	partWin = par.createEmitter({
	
	x: 150,
	y: 230,
	speed: 100,
	lifespan: {min:1000,max:2500},
	rotate: {start: 0.1,end: 360},
	quantity: 40,
//	maxParticles: 28,
	frequency: 500,
	//randomFrame: true,
	//timeScale: 1.5, 
	//radial: true, 
	scale: { start: 1, end: 0 },
	tint: [0xffffff],//0xff0000, 0x00ff00,0x0000ff, 0xf0f0f0,0x0f0f0f],
	alpha: { start: 1, end: 0 },
	blendMode: 4// 'ADD',
	//emitZone: { type: 'edge', source: shape1, quantity: 400, yoyo: false }
	});
	
	partWin.stop();
	
// piscar fuel bajo combustible....
	var piscar = this.time.addEvent({
	delay: 100,                // ms
	callback: PiscarFuel,
	//args: [],
	//callbackScope: this,
	loop: true,
	//repeat: 0,
	//startAt: 0,
	//timeScale: 1,
	paused: false
	});
	
	// Sección Bala para avión...
	for(let i = 0; i < maxTiros; i++){
		var bala = this.physics.add.sprite(player.x,player.y,'bala').setScale(1);
			bala.setAngle(player.angle);
			
			bala.ang = player._rotation;		
			bala.setAngle(anguloPlayer);
			bala.visible = false;
			BALAS.push(bala);
	}
	
	for(let i = 0; i < BALAS.length; i++)
	{
		for(let a = 0; a < MISILES.length; a++)
		{		
			this.physics.add.overlap(BALAS[i], MISILES[a], colisionBalas, null, this);
		}
	}

	//Crear Arma....
	let contArma = this.add.sprite(0,0,'arma').setScale(0.2).setName('arma');
	let brilloArma = this.add.sprite(0,0,'brillo').setScale(1.3).setName('brillo').setAlpha(0.3);
	
	arma = this.add.container(player.x + Phaser.Math.Between(-300,300), player.y + Phaser.Math.Between(-300,300));
	arma.add([brilloArma,contArma]);
	arma.brillo = arma.getByName('brillo');
	
	this.physics.world.enable(arma);
	this.physics.add.overlap(player, arma, colisionArma, null, this);
	arma.body.setSize(60, 60).setOffset(-40,-40);

	//Crear Contenedor Cartel de Victoria...
	cartelVictoria = this.add.container(innerWidth+100,160);
	cartelVictoria.setDepth(60);
	cartelVictoria.setScrollFactor(0);
	//Crear cuadrado de fondo para cartel de Victoria...
	let victoriaFondo = this.add.graphics();
	victoriaFondo.fillStyle(0x36ff24, 0.7).setName('victoriaFondo');
	victoriaFondo.fillRoundedRect(0,0, 500, 200, 10);
	//Crear texto para cartel victoria...
	var textoVictoria = this.add.text(30,0,'Victoria!\n Nivel '+mision+' Superado...').setFontFamily('Arial').setFontSize(30).setColor('black').setOrigin(0);	
		textoVictoria.setName('textoVictoria');
	// Crear boton ok para cartel de victoria
	var btnOk = this.add.image(150,150,'btnOk');
	btnOk.setScale(0.2).setInteractive().setScrollFactor(0).setDepth(61);
	btnOk.on('pointerdown', () =>{
		if(!listo)
		{
			listo = true;
			cartelVictoria.setPosition(innerWidth+100,200);
			cartelVictoria.setVisible(false);
		}
		else
		{
			cortina.setActive(true);
			this.tweens.add({
				targets: cortina,
				duration: 500,
				alpha: 1,
				onComplete: () =>{
					mision++;
					localStorage.setItem('mision', mision);
					//alert(localStorage.getItem('mision'));
					this.scene.restart();
				} 
			});
		}
	});

	
	
	cartelVictoria.add([victoriaFondo,textoVictoria,btnOk]);	
	cartelVictoria.fondo = cartelVictoria.getByName('victoriaFondo');
	cartelVictoria.texto = cartelVictoria.getByName('textoVictoria');
	cartelVictoria.setVisible(false);
	/*
	this.tweens.add({
	targets: cartelVictoria,
	duration:1000,
	x:100
	});
	*/
	listo = true
} 

function actualiza(t, dt)
{
	combustible(dt);

	if(cortina.active)
		cortina.setPosition(player.x-window.innerWidth / 1.8, player.y-window.innerHeight / 1.8)*dt;
		
	if(!player.visible)
	{
		if(!panelGameOver.visible)
		{
			if(btnBala.visible)
				btnBala.setVisible(false);
				
			setTimeout(() =>
			{
				panelGameOver.visible = true;
				panelGameOver.setScale(0);
				
				this.tweens.add({
				targets: panelGameOver,
				duration:150,
				scaleX:1,
				scaleY:1
				});
			},1000);		
		}
	} 
	else
		panelGameOver.visible = false;
	
	//partWin.setPosition(player.x,player.y);
	partPlayer.setPosition(player.x,player.y);

	for(let i = 0; i < BALAS.length; i++)
	{
		if(!BALAS[i].visible)
			continue;
		
			let difX = Math.abs(BALAS[i].x - player.x);
			let difY = Math.abs(BALAS[i].y - player.y);
		
		if(difX > innerWidth / 2 || difY > innerHeight / 2 )
		{
			BALAS[i].visible = false;
			console.log(BALAS[i].visible)
			continue;
		}

		BALAS[i].x += Math.cos(BALAS[i].ang) * -10 * dt/10;
		BALAS[i].y += Math.sin(BALAS[i].ang) * -10 * dt/10;
		//BALAS[i].refreshBody();
	}
			
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
			if(player.visible && distanciaEntre(MISILES[i], player) < 100 && !audioPeligro.isPlaying)
				audioPeligro.play();
			
			if(!partMisiles[i].visible)
				partMisiles[i].setVisible(true);
				
			partMisiles[i].setPosition(MISILES[i].x, MISILES[i].y);
		} 
		else
			partMisiles[i].stop();
	}
	
	//panel.x = player.x - window.innerWidth/2 + 100;
	//panel.y = player.y - (window.innerHeight/2-30);
	missilSigueAvion();
	arma.brillo.rotation += 0.0033 * dt;
	estrella.est.rotation += 0.0033 * dt;
	fuels.est.rotation += 0.0033 * dt;
	cielo.x = player.x;
	cielo.y = player.y;
	cielo.tilePositionX += Math.cos(player._rotation) * vel;
	cielo.tilePositionY += Math.sin(player._rotation) * vel;

	
	btnDer.x = player.x;
	btnDer.y = player.y-window.innerHeight/2
	
	btnIzq.x = player.x - window.innerWidth/2;
	btnIzq.y = player.y-window.innerHeight/2;	

	//Config mostrar o no alertaEstrella y sus texto
	
	mostrarTextoAlerta(alertaEstrella, estrella);
	mostrarTextoAlerta(fuelAlerta, fuel);
	mostrarTextoAlerta(alertaArma, arma);

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

function mostrarTextoAlerta(a ,m)
{
	mostrarAlertas(a,m);

	let et = player.y > a.y ? -1 : 1;

		if(a.texto != null && a.texto.visible != a.visible) 
			a.texto.visible = a.visible;
		
			if(a.texto != null)
			{
				a.texto.x = a.x;
				a.texto.y = a.y-(a.displayWidth/1.4*et);
				a.texto.text = Phaser.Math.FloorTo(distanciaEntre(player, m)/10);
			}
}

function tirarBalas()
{
	if(!player.visible)
		return;
	audioTiroAvion.play();	
	btnBala.setAlpha(0.2);
	
	if(cantBalas < 0)
		return;
	else{
		for(let i = 0; i < BALAS.length; i++)
		{
			if(BALAS[i].visible) 
			{
				continue;
			}else{		
				BALAS[i].ang = player._rotation;
				BALAS[i].setAngle(anguloPlayer);
				BALAS[i].visible = true;
				BALAS[i].body.enable = true;
				BALAS[i].setPosition(player.x,player.y);
				cantBalas--;
				
				if(cantBalas === 0)
				{
					btnBala.setVisible(false);
					let a = Phaser.Math.Between(player.x+innerWidth/2+100,player.x+700);
					let b = Phaser.Math.Between(-700,0);
					let c = Phaser.Math.Between(player.y+innerHeight/2+100,player.y+700);
					arma.x = Phaser.Math.Between(0,1) === 0 ? a : b;
					arma.y = Phaser.Math.Between(0,1) === 0 ? b : c;
					arma.setScale(1);
					arma.setAlpha(1);
					arma.body.enable = true;
					arma.visible = true;
					arma.brillo.visible = true;
					alertaArma.setVisible(true);
				}
					
				break;
			}
		}
	}
}

function sueltaBtnBalas()
{
	btnBala.setAlpha(0.5);
}

function colisionArma()
{
	audioArma.play();
	arma.body.enable = false;
	arma.brillo.visible = false;
	cantBalas = maxTiros;
	alertaArma.setVisible(false);
	
	this.tweens.add({
	targets: arma,
	duration:500,
	scaleX:5,
	scaleY:5,
	alpha: 0,
	onComplete: () =>{
	/*
			arma.x = Phaser.Math.Between(player.x+300,player.x-300);
			arma.y = Phaser.Math.Between(player.y+300,player.y-300);
			arma.setScale(1);
			arma.setAlpha(1);
			arma.body.enable = true;
			arma.visible = true;
			arma.brillo.visible = true;
		*/
			arma.setVisible(false);
			btnBala.visible = true;
			btnBala.setAlpha(0.5);
		}
	});
}

function colisionBalas(bala, misil)
{
	explotar(misil);
	audioExplosion.play();
	misil.disableBody(true,true);
	bala.disableBody(true,true);
	//bala.setVisible(false);
	partMisiles[misil.num].stop();
	
	ALERTAS[misil.num].alerta.setVisible(false);
	
	//apanel.misil.text = objMisilesTemp+'/' +objetivoMisiles;
}

function colisionFuel(player, fuels)
{
	audioEstrella.play();

	combustibleTemp += 25;

	if(combustibleTemp > 100)
	combustibleTemp = 100;
	
		 fuels.body.enable = false;
		 fuels.est.visible = false;
		 
		 this.tweens.add({
		 targets: fuels,
		 duration:500,
		 scaleX:5,
		 scaleY:5,
		 alpha: 0,
		 onComplete: () =>{
				
			fuels.x = Phaser.Math.Between(player.x+3000,player.x-3000);
			fuels.y = Phaser.Math.Between(player.y+3000,player.y-3000);
			fuels.setScale(1);
			fuels.setAlpha(1);
			fuels.body.enable = true;
			fuels.est.visible = true;
				 
			 } 
		 });
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
		misionCumplida = true; 
		
		if(btnBala.visible)
			btnBala.visible = false;
			
		for(let i = 0; i < MISILES.length; i++)
		{		
			if(MISILES[i].visible)
			{
				explotar(MISILES[i]);
				audioExplosion.play();
				MISILES[i].disableBody(true,true);
				partMisiles[MISILES[i].num].stop();
				
				ALERTAS[MISILES[i].num].alerta.setVisible(false);
			}
		}	
	}
	
	this.tweens.add({
	targets: estrella,
	duration:500,
	scaleX:5,
	scaleY:5,
	alpha: 0,
	onComplete: () =>{
			if(player.cantEstrellas >= objectivoEstrellas)
			{
					partWin.start();
					setTimeout(() =>{
						partWin.stop();
						
						cartelVictoria.setVisible(true);
						
						this.tweens.add({
						targets: cartelVictoria,
						duration:1000,
						x:100
						});
						//alert('Mision Completa...!');
					}, 2000);
					//alert('Has ganado!');
					partWin.setPosition(player.x,player.y);
					partWin.start(true);
					return;
			}		
			else
			{
				estrella.x = Phaser.Math.Between(player.x+1000,player.x-1000);
				estrella.y = Phaser.Math.Between(player.y+1000,player.y-1000);
				estrella.setScale(1);
				estrella.setAlpha(1);
				estrella.body.enable = true;
				estrella.est.visible = true;
			} 
		} 
	});
	
/*	if(player.cantEstrellas >= objectivoEstrellas)
	{
		partWin.start();
		partWin.setTint(0x00ff00);
		setTimeout(() =>{
			partWin.stop();
			}, 1000);
			alert('Has ganado!');
			partWin.setPosition(player.x,player.y);
			partWin.start(true);
			return;
	}
	*/
} 

function PiscarFuel()
{
	if(combustibleTemp < 25 && player.visible)
	{
		let a = panel.fuel.alpha > 0.1 ? 0 : 0.8;
		panel.fuel.setAlpha(a);
		panel.aguja.setAlpha(a);
	}
	else {
		if(panel.fuel.alpha < 0.8)
		{
			panel.fuel.setAlpha(0.8);
			panel.aguja.setAlpha(0.8);
		}
	}
}

// Combustible ...
function combustible(dt)
{	
	if(!player.visible || combustibleTemp === 0 || misionCumplida) 
		return

		if(combustibleTemp <= 0)
		{
			finCombustible();
			return;
		}
	
	combustibleTemp -= 0.05 * dt /60;
	anguloAguja = (combustibleTemp / tiempoCombustible * 90) - 45;
	
	
	panel.aguja.setAngle(anguloAguja);
}

function mostrarAlertas(a, m)
{
	if(misionCumplida)
		return;
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
	if(!misionCumplida)
		rotaDer = true;
}

function funBtnIzq(e)
{
	//player.x = e.x;
	//player.y = e.y;
	if(!misionCumplida)
		rotaIzq = true;
}

function seguirAvion(avion,misil)
    {
        const targetAngle = Phaser.Math.Angle.Between(misil.x, misil.y,avion.x, avion.y)
		let dx = player.x - misil.x;
		let dy = player.y - misil.y;
		let distancia = Math.floor(Math.sqrt(dx*dx + dy*dy));
		let angGuiaRadianes = Math.atan2(dy,dx);
		let	angGuiaGrados =  angGuiaRadianes * 180/Math.PI;//Math.abs(angGuiaRadianes * 180/Math.PI);
		
		misil.dist = distancia;
		// clamp to -180 to 180 for smart turning
		let diff = Phaser.Math.Angle.Wrap(targetAngle - misil.rotation)

		// set to targetAngle if less than turnDegreesPerFrame
		if (Math.abs(diff) < Phaser.Math.DegToRad(misil.velRotMisil))
		{
			misil.rotation = targetAngle;
			//this.body.rotation = targetAngle
        }
		else
		{
			let angle = misil.angle
			if (diff > 0)
			{
				// turn clockwise
				angle += misil.velRotMisil
			}
			else
			{
				// turn counter-clockwise
				angle -= misil.velRotMisil
			}
			
			misil.setAngle(angle)
			//this.body.angle = angle
		}
		distAlertas = distancia;
		// move missile in direction facing
		misil.x += Math.cos(misil.rotation) * misil.velMisil;
		misil.y += Math.sin(misil.rotation) * misil.velMisil;

		//this.body.velocity.x = vx
    	//this.body.velocity.y = vy
        //this.avion.y += 1;
		
    }

function missilSigueAvion()
{		
	player.setAngle(anguloPlayer); 
	player.x += Math.cos(player._rotation) * vel;//player._rotation) * vel;
	player.y += Math.sin(player._rotation) * vel;//player._rotation) * vel;	

	for(let i = 0; i < MISILES.length; i++)
	{
		let misil = MISILES[i];
		
		seguirAvion(player,misil);
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
		
		if(audioPeligro.isPlaying)
			audioPeligro.stop();
			
		empezarDetener(this);
		partPlayer.stop();
		player.disableBody(true,true);
		misil.disableBody(true, true);
		partMisiles[misil.num].stop() //setVisible(false);
		explotar(player, misil);
	
		audioAvion.setLoop(false);
		audioAvion.stop();
}

function finCombustible()
{
	audioExplosion.setRate(1.8);
	audioExplosion.play();
	
	if(audioPeligro.isPlaying)
	audioPeligro.stop();
	
	empezarDetener(this);
	partPlayer.stop();
	player.disableBody(true,true);
	//misil.disableBody(true, true);
	//partMisiles[misil.num].stop() //setVisible(false);
	explotar(player, player);
	
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
			if(revisarCantMisilPantalla() < mision < 4 ? 2 : 4)
				agregarMisil();
			
			revisarNivelFuel();	
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
		if(mision === 1 || misionCumplida || !listo)
			return;
			
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
	
	function revisarNivelFuel()
	{
		if(combustibleTemp < 30 || Math.abs(distanciaEntre(player,fuels)) > 2700)
			hacercarObjAlPlayer(player,fuels);
		
		if(Math.abs(distanciaEntre(player,fuels)) > 3000)
			hacercarObjAlPlayer(player,arma);
		
	}
	
	function hacercarObjAlPlayer(player,obj)
	{
		let a = Phaser.Math.Between(player.x+innerWidth/2+100,player.x+700);
		let b = Phaser.Math.Between(-700,0);
		let c = Phaser.Math.Between(player.y+innerHeight/2+100,player.y+700);
		obj.x = Phaser.Math.Between(0,1) === 0 ? a : b;
		obj.y = Phaser.Math.Between(0,1) === 0 ? b : c;
	}
	
	function misiones()
	{
		let m =	localStorage.getItem('mision');
		
		if(mision === 1)
		{
			objectivoEstrellas = 1;
			
		}
	}
	//======== fin cronometro ==========\\