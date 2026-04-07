var entrada = {
	key: 'entrada',
	active: true,
	preload: carga,
	create: inicio
};

var cortina;
var w;
var h;

function carga()
{
	this.load.image('entrada', './img/entrada.png');
	this.load.image('play', './img/play2.png');
	this.load.image('blanco', './img/estrella.png');
	this.load.image('btnBorrar', './img/btnBorrar.png');
	
/*	var progressBar = this.add.graphics();
	var progressBox = this.add.graphics();
	progressBox.fillStyle(0x998869, 0.8);
	progressBox.fillRect(10, 270, 320, 50);
	
	var width = this.cameras.main.width;
	var height = this.cameras.main.height;
	var loadingText = this.make.text({
		x: width / 2,
		y: height / 2 - 35,
		text: 'Cargando...',
		style: {
			font: '20px monospace',
			fill: '#000000'
		}
	});
	
	loadingText.setOrigin(0.5, 0.5);
	
	var percentText = this.make.text({
		x: width / 2,
		y: height / 2 - 0,
		text: '0%',
		style: {
			font: '18px monospace',
			fill: '#ffffff'
		}
	});
	
	percentText.setOrigin(0.5, 0.5);
	
	var assetText = this.make.text({
		x: width / 2,
		y: height / 2 + 50,
		text: '',
		style: {
			font: '18px monospace',
			fill: '#ffffff'
		}
	});
	
	assetText.setOrigin(0.5, 0.5);
	
	this.load.on('progress', function (value) {
		percentText.setText(parseInt(value * 100) + '%');
		progressBar.clear();
		progressBar.fillStyle(0xffffff , 1);
		progressBar.fillRect(20, 280, 300 * value, 30);
	});
	
	this.load.on('fileprogress', function (file) {
		assetText.setText('Cargando Imagen: ' + file.key);
	});
	
	this.load.on('complete', function () {
		progressBar.destroy();
		progressBox.destroy();
		loadingText.destroy();
		percentText.destroy();
		assetText.destroy();
	});
	
	this.load.image('play', './img/play2.png');
	for (var i = 0; i < 50; i++) {
		this.load.image('play'+i, './img/play2.png');
	}
*/
}

function inicio()
{
	//consola.... 
	//javascript:(function () { var script = document.createElement('script'); script.src="//cdn.jsdelivr.net/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();
	
	
	let entr = this.add.sprite(0,0,'entrada').setOrigin(0);
	entr.displayWidth = window.innerWidth
	entr.displayHeight = window.innerHeight;
	
	let play = this.add.sprite(window.innerWidth / 2,window.innerHeight / 2,'play');
	play.displayWidth = window.innerWidth/2.5;
	play.displayHeight = window.innerWidth/2.5;
	play.setInteractive();
		
	animar(this, play)
	
	cortina = this.add.graphics();
	cortina.fillStyle(0x000000,1);
	cortina.fillRect(0,0,window.innerWidth, window.innerHeight);
	cortina.setDepth(50);
	//cortina.setAlpha(0);
	
	
	this.tweens.add({
		targets: cortina,
		duration:500,
		alpha: 0,
		onComplete: () =>{
		cortina.active = false;
		//vel = 3
		} 
	});
	
	//Borrar datos
		let bw = innerWidth/5;
		let btnBorar = this.add.sprite(window.innerWidth - bw,window.innerHeight / 1.1,'btnBorrar');
	btnBorar.displayWidth = bw;
	btnBorar.displayHeight = bw;
	btnBorar.setInteractive();
	
	btnBorar.on('pointerup',() =>{	
	// Al tocar el boton borrara los datos guardados
		removerDatosGuardados('mision');
		alert('Los datos fueron borrados\n Se reinicia el juego');
	});
	
	play.on('pointerup',() =>{	
		this.tweens.add({
			targets: cortina,
			duration:500,
			alpha: 1,
			onComplete: () =>{
				this.scene.start('arranca');
			} 
		});
	}) ;
	
	let particulas = this.add.particles('blanco');
	pts = particulas.createEmitter({
	
	x: 120,//{min:20,max:200},
	y: 230,
	speedY: {min: 100,max:200},
	speedX: {min:-100,max:140},
	lifespan:  {min:300,max:2500},
	rotate: {start: 0.1,end: 360},
	quantity: 2,// {min:5,max:40},
	//maxParticles: 50,
	//frequency: 200,
	//randomFrame: true,
	//timeScale: 1.5, 
	radial: false, 
	scale: { start: 1, end: 0, ease: 'Sine.easeInOut' },
	tint: 0xeee233,
	alpha: { start: 1, end: 0 },
	blendMode: 4 // 'ADD',
	//emitZone: { type: 'edge', source: shape1, quantity: 400, yoyo: false }
	});
	
	pts.stop(); 
}

function animar(t, play)
{
	t.tweens.add({
	targets: play,
	duration:500,
	alpha: 1,
	scaleX: 0.38,
	scaleY: 0.40,
	repeat: -1,
	ease: 'Sine.easeInOut',
	yoyo: true,
	onComplete: () =>{	
		animar(t, play);
	} 
	});
} 

function randomXY(a)
{
	a = Phaser.Math.FloatBetween(0.4,0.5);
	return a;
} 

function removerDatosGuardados(key)
{
	localStorage.removeItem(key);
}