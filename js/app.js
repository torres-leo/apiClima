const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
	formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
	e.preventDefault();
	// console.log('Buscando el clima');

	// validar
	const ciudad = document.querySelector('#ciudad').value.trimEnd();
	const pais = document.querySelector('#pais').value;
	document.getElementById('ciudad').style.textTransform = 'capitalize';

	if (ciudad === '' || pais === '') {
		mostrarError('Ingresa la información requerida');

		return;
	}
	// console.log(ciudad, pais);
	//consultando API
	consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
	// console.log(mensaje);
	// creando la alerta
	const alerta = document.querySelector('.alerta');

	if (!alerta) {
		const alerta = document.createElement('div');
		alerta.classList.add(
			'bg-red-600',
			'border-red-400',
			'text-white',
			'px-4',
			'py-3',
			'rounded',
			'max-w-md',
			'mx-auto',
			'mt-6',
			'text-center',
			'alerta'
		);

		alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;

		container.appendChild(alerta);

		setTimeout(() => {
			alerta.remove();
		}, 3000);
	}
}

function consultarAPI(ciudad, pais) {
	const appID = 'e042097c0584d802a51bd619979dd1f3';
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;
	// console.log(url);

	// mostrando el spinner
	spinner();

	fetch(url)
		.then((respuesta) => respuesta.json())
		.then((datos) => {
			// limpiar el html primero
			limpiarHTML();

			console.log(datos);
			if (datos.cod === '404') {
				mostrarError('Ciudad no encontrada');
				return;
			}

			// Imprime la respuesta en el html
			mostrarClima(datos);
		});
}

function mostrarClima(datos) {
	// Aplicando destructuring de un objeto que está dentro de otro
	const {
		name,
		main: { temp, temp_max, temp_min, humidity },
		sys: { country },
	} = datos;

	// console.log(temp - 273.15);
	const centigrados = kelvinACentigrados(temp);
	const max = kelvinACentigrados(temp_max);
	const min = kelvinACentigrados(temp_min);

	const nombreCiudad = document.createElement('p');
	nombreCiudad.textContent = `Clima en ${name}`;
	nombreCiudad.classList.add('font-bold', 'text-2xl');

	// creando scripting
	const actual = document.createElement('p');
	actual.innerHTML = `
        Temperatura: ${centigrados}&#8451;
    `;
	actual.classList.add('font-bold', 'text-6xl');

	const tempMax = document.createElement('p');
	tempMax.innerHTML = `Temp. máxima: 
    ${max}&#8451;
    `;
	tempMax.classList.add('text-xl');

	const tempMin = document.createElement('p');
	tempMin.innerHTML = `Temp. mínima: 
    ${min}&#8451;
    `;
	tempMax.classList.add('text-xl');

	// agregandolo a un div para centrarlo correctamente
	const resultadoDiv = document.createElement('div');
	resultadoDiv.classList.add('text-center', 'text-white');
	resultadoDiv.appendChild(nombreCiudad);
	resultadoDiv.appendChild(actual);
	resultadoDiv.appendChild(tempMax);
	resultadoDiv.appendChild(tempMin);

	// insertandolo en el div principal de los resultados
	resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

function limpiarHTML() {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}
}

function spinner() {
	limpiarHTML();

	const divSpinner = document.createElement('div');
	divSpinner.classList.add('sk-fading-circle');

	divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

	resultado.appendChild(divSpinner);
}
