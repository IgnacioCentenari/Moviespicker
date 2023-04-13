const formulario = document.getElementById('formulario');
const hero = document.getElementById('hero')

formulario.addEventListener('submit', (event)=>{
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const edad = parseInt(document.getElementById('edad').value);
    const genero = document.getElementById('genero').value;

    if (edad < 0 || edad > 100) {
        swal.fire('La edad ingresada no es válida.');
        return;
    }

    let pelisVistas = JSON.parse(localStorage.getItem('pelisVistas')) || [];


    fetch('data/peliculas.json')
    .then((res)=>{
        return res.json();
    })
    .then(data=>{
        const pelis = (data); 
        recomendarPeli(pelis);
    })
    .catch((err)=>{
        swal.fire("Error");
    })
})

function recomendarPeli(peliculas){
    const contenido = document.querySelector('.recomiendoPeli')
    
    const genero = document.getElementById('genero').value;
    const edad = parseInt(document.getElementById('edad').value);
    let pelisVistas = JSON.parse(localStorage.getItem('pelisVistas')) || [];

const peliculasFiltradas = peliculas.filter(p => (p.generoP === genero && p.edadMinima <= edad && !pelisVistas.includes(p.titulo)));

if (peliculasFiltradas.length > 0){
    const randomPeli = Math.floor(Math.random() * peliculasFiltradas.length);
    const peliRecomendada = peliculasFiltradas[randomPeli];

    let html = `
        <div class="recomendacion">
            <img src="${peliRecomendada.fotoPeli}" alt="">
            <div>
                <h4>${peliRecomendada.titulo}</h4>
                <p>${peliRecomendada.miniDesc}</p>
                <button id="BotonVista">¿Ya la viste?</button>
            </div>
        </div>         
    `;
    contenido.innerHTML = html;
    hero.remove()
    formulario.remove()

    const botonVista = document.getElementById('BotonVista');

    botonVista.addEventListener('click', () => {
        pelisVistas.push(peliRecomendada.titulo);
        localStorage.setItem('pelisVistas', JSON.stringify(pelisVistas));
        peliculasFiltradas.splice(randomPeli, 1);
        if(peliculasFiltradas.length > 0){
            const randomPeliNuevo = Math.floor(Math.random() * peliculasFiltradas.length);
            const peliRecomendadaNueva = peliculasFiltradas[randomPeliNuevo];
            const htmlNuevo = `
                <div class="recomendacion">
                    <img src="${peliRecomendadaNueva.fotoPeli}" alt="">
                    <div>
                        <h4>${peliRecomendadaNueva.titulo}</h4>
                        <p>${peliRecomendadaNueva.miniDesc}</p>
                    </div>
                </div>         
            `;
            contenido.innerHTML = htmlNuevo;
            pelisVistas.push(peliRecomendadaNueva.titulo);
            localStorage.setItem('pelisVistas', JSON.stringify(pelisVistas));
        }else{
            swal.fire("Disculpa de momento no podemos recomendarte otra peli");
            botonVista.remove();
        } 
    });
}else{
    swal.fire("Disculpa de momento no podemos recomendarte ninguna peli.");
}
}

