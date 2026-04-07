//Aqui comando de voz...

if(annyang)
{
	var comandos = {
		'hola': function()
				{
					alert('hola');
				} 
	};
	
	annyang.addCommands(comandos);
	annyang.setLanguage('es-MX');
	annyang.start();
} 