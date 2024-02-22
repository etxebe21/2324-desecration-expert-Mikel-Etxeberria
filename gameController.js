const { getSuperheroes } = require('./gameService');

let heroesObject = {}; 
let junkpileHeroObject;
let randomHeroObject;
let eruditoHeroObject = {};

async function getHeroes(req, res) {
    try {
        const superheroes = await getSuperheroes();
        if (!superheroes || superheroes.length === 0) {
            return res.status(500).json({ error: 'No se pudieron encontrar superhéroes.' });
        }
        
        superheroes.forEach(hero => {
            heroesObject[hero.name] = hero;
        });

        //console.log('HEROES', heroesObject)

        // Una vez que se han obtenido los datos, llamar a createNewHeroes
        await createNewHeroes();

    } catch (error) {
        console.error('Error al obtener superhéroes:', error.message);
        return res.status(500).json({ error: error.message });
    }
}

//Funcion para crear los dos jugadores
async function createNewHeroes() {
    try {
        // Buscar el héroe con nombre "JunkPile"
        const junkPileHero = heroesObject['Junkpile'];
        
        // Crear un nuevo objeto con el héroe encontrado
        junkpileHeroObject = {
            JunkPile: junkPileHero
        };

          // Añadir el nuevo atributo hitPoints al héroe JunkPile
          junkPileHero.powerstats.hitPoints = junkPileHero.powerstats.strength * 10;
          junkPileHero.powerstats.hitPoints = junkPileHero.powerstats.hitPoints > 666 ? 666 : junkPileHero.powerstats.hitPoints;
        
        console.log('Nuevo héroe:', junkpileHeroObject);
        
        // Obtener un héroe aleatorio del objeto heroesObject
        const randomHeroIndex = Math.floor(Math.random() * Object.keys(heroesObject).length);
        const randomHeroName = Object.keys(heroesObject)[randomHeroIndex];
        const randomHero = heroesObject[randomHeroName];
        
        // Crear un nuevo objeto con el héroe aleatorio
        randomHeroObject = {
            RandomHero: randomHero
        };

         // Añadir el nuevo atributo hitPoints al héroe aleatorio
         randomHero.powerstats.hitPoints = randomHero.powerstats.strength * 10;
         randomHero.powerstats.hitPoints = randomHero.powerstats.hitPoints > 666 ? 666 : randomHero.powerstats.hitPoints;
        
        console.log('Héroe aleatorio:', randomHeroObject);

         // Crear al nuevo héroe "Erudito"
            const eruditoHero = {
                name: "El Erudito X.G.",
                angerLevel: 0,
                hitPointsGlasses: 1,
                hitPoints: "invincible"
            };

            // Crear un nuevo objeto con el héroe Erudito
            eruditoHeroObject = {
                Erudito: eruditoHero
            };

            console.log('Nuevo héroe Erudito:', eruditoHeroObject)

        // Una vez que se han creado los objetos de los héroes, llamar a calculateStart
        calculateStart();

        simulateCombat(eruditoHero)
    } catch (error) {
        console.error('Error al inicializar:', error.message);
    }
}

// Función para calcular el valor total de (INT + COMB) para un jugador
function calculateStart() {
    if (!junkpileHeroObject || !randomHeroObject) {
        console.error('Uno o ambos héroes no están definidos.');
        return;
    }

    const junkPileStats = junkpileHeroObject.JunkPile.powerstats.intelligence  + junkpileHeroObject.JunkPile.powerstats.combat;
    const randomHeroStats = randomHeroObject.RandomHero.powerstats.intelligence  + randomHeroObject.RandomHero.powerstats.combat ;
    console.log('JunkPile Stats:', junkPileStats);
    console.log('Random Hero Stats:', randomHeroStats);
}
getHeroes();


// Función para lanzar un dado de 100 caras (1D100)
function rollD100() {
    return Math.floor(Math.random() * 100) + 1;
}

// Función para lanzar un dado de 20 caras (1D20)
function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}


function rollD3() {
    return Math.floor(Math.random() * 3) + 1;
}

function rollD5() {
    return Math.floor(Math.random() * 5) + 1;
}

// Función para lanzar cuatro dados de 3 caras (4D3)
function roll4D3() {
    let total = 0;
    for (let i = 0; i < 4; i++) {
        total += Math.floor(Math.random() * 3) + 1;
    }
    return total;
}

// Función para determinar quién comienza el combate
function determineStartingHero(junkPileStats, randomHeroStats) {
    return junkPileStats >= randomHeroStats ? 'JunkPile' : 'RandomHero';
}

function simulateTurn(attacker, defender) {
    console.log(`                                   `);
    console.log(`${attacker} comienza el turno.`);
    const attackRoll = rollD100();
    console.log(`${attacker} lanza un dado de 100 caras y obtiene ${attackRoll}.`);
    
    // Verificar si el ataque es exitoso comparando con la estadística de combate del atacante
    if (attackRoll <= (attacker === 'JunkPile' ? junkpileHeroObject.JunkPile.powerstats.combat : randomHeroObject.RandomHero.powerstats.combat)) {
        console.log(`El ataque de ${attacker} tiene éxito.`);
        
        const damageRoll = rollD20();
        
        let damageInflicted = damageRoll;
        
        if (damageRoll <= 2) {
            
            console.log(`${attacker} ha cometido una pifia.`);
            
            // Calcular el daño por pifia
            let pifiaDamage;
            if (damageRoll === 1) {
                
                pifiaDamage = Math.floor(attacker === 'JunkPile' ? junkpileHeroObject.JunkPile.powerstats.speed / rollD3() : randomHeroObject.RandomHero.powerstats.speed / rollD3());
            } else {
                
                pifiaDamage = Math.floor(attacker === 'JunkPile' ? junkpileHeroObject.JunkPile.powerstats.speed / roll4D3() : randomHeroObject.RandomHero.powerstats.speed / roll4D3());
            }
            
             
            console.log(`FAIL!! ${attacker} obtiene ${damageRoll} y se clava el arma en su pierna izquierda. Recibe un daño de ${pifiaDamage} puntos por pifia.`);
            
            // Reducir los puntos de vida del héroe que realiza la pifia
            if (attacker === 'JunkPile') {
                junkpileHeroObject.JunkPile.powerstats.hitPoints -= pifiaDamage;
            } else {
                randomHeroObject.RandomHero.powerstats.hitPoints -= pifiaDamage;
            }
            
            // Asignar el daño por pifia al daño total infligido
            damageInflicted = pifiaDamage;
        }
         else if (damageRoll >= 3 && damageRoll <= 17) {
            
            const powerStrengthDamage = Math.ceil((attacker === 'JunkPile' ? (junkpileHeroObject.JunkPile.powerstats.power + junkpileHeroObject.JunkPile.powerstats.strength) : (randomHeroObject.RandomHero.powerstats.power + randomHeroObject.RandomHero.powerstats.strength)) * (damageRoll / 100));
            console.log(`${attacker} inflige ${powerStrengthDamage} puntos de daño a ${defender}.`);
            damageInflicted = powerStrengthDamage;
        }

        else if (damageRoll >= 18 && damageRoll <= 20) {
            let criticalDamage;
            
            if (damageRoll === 18) {
                criticalDamage = Math.ceil((attacker === 'JunkPile' ? junkpileHeroObject.JunkPile.powerstats.intelligence * junkpileHeroObject.JunkPile.powerstats.durability : randomHeroObject.RandomHero.powerstats.intelligence * randomHeroObject.RandomHero.powerstats.durability) / 100) * rollD3();
            } else if (damageRoll === 19) {
                criticalDamage = Math.ceil((attacker === 'JunkPile' ? junkpileHeroObject.JunkPile.powerstats.intelligence * junkpileHeroObject.JunkPile.powerstats.durability : randomHeroObject.RandomHero.powerstats.intelligence * randomHeroObject.RandomHero.powerstats.durability) / 100) * (rollD3() + rollD3());
            } else {
                criticalDamage = Math.ceil((attacker === 'JunkPile' ? junkpileHeroObject.JunkPile.powerstats.intelligence * junkpileHeroObject.JunkPile.powerstats.durability : randomHeroObject.RandomHero.powerstats.intelligence * randomHeroObject.RandomHero.powerstats.durability) / 100) * (rollD5() + rollD5() + rollD5());
            }
            
            console.log(`¡CRITICAL HIT! ${attacker} inflige ${criticalDamage} puntos de daño crítico a ${defender}.`);
            
            // Calcular el daño normal
            const powerStrengthDamage = Math.ceil((attacker === 'JunkPile' ? (junkpileHeroObject.JunkPile.powerstats.power + junkpileHeroObject.JunkPile.powerstats.strength) : (randomHeroObject.RandomHero.powerstats.power + randomHeroObject.RandomHero.powerstats.strength)) * (damageRoll / 100));
            
            console.log(`${attacker} inflige ${powerStrengthDamage} puntos de daño normal a ${defender}.`);
            
            // Sumar el daño crítico y el daño normal al daño total infligido
            const totalDamage = criticalDamage + powerStrengthDamage;
        
            // Reducir los puntos de vida del defensor según el daño infligido
            if (defender === 'JunkPile') {
                junkpileHeroObject.JunkPile.powerstats.hitPoints -= totalDamage;
            } else {
                randomHeroObject.RandomHero.powerstats.hitPoints -= totalDamage;
            }
        } else {
            console.log(`El ataque de ${attacker} falla.`);
        }
    }
    console.log(`                                   `);
    // Mostrar los powerStats de cada jugador antes de cambiar de turno
    console.log(`PowerStats de ${junkpileHeroObject.JunkPile.name}:`, junkpileHeroObject.JunkPile.powerstats);
    console.log(`PowerStats de ${randomHeroObject.RandomHero.name}:`, randomHeroObject.RandomHero.powerstats);
    
    // Verificar si alguno de los héroes tiene 0 o menos hitPoints
    if (junkpileHeroObject.JunkPile.powerstats.hitPoints <= 0 || randomHeroObject.RandomHero.powerstats.hitPoints <= 0) {
    
        console.log('Fin del combate.');
        // Mostrar el resultado del combate
        if (junkpileHeroObject.JunkPile.powerstats.hitPoints <= 0 && randomHeroObject.RandomHero.powerstats.hitPoints <= 0) {
            console.log('El combate termina en empate.');
        } else if (junkpileHeroObject.JunkPile.powerstats.hitPoints <= 0) {
            console.log('El héroe RandomHero gana el combate.');
            console.log('El héroe JankPile ha sido derrotado.');
        } else {
            console.log('El héroe JunkPile gana el combate.');
            console.log('El héroe RandomHero ha sido derrotado.');
        }
        return;
    }
    
    // Cambiar el turno al otro héroe solo si el combate no ha terminado
    const nextTurn = attacker === 'JunkPile' ? 'RandomHero' : 'JunkPile';
    console.log(`Turno cambiado a ${nextTurn}.`);
    
    return nextTurn;
}



function simulateCombat(eruditoHero) {
    let turnCounter = 1; 
    let eruditoTurn = false; // Variable para controlar si es el turno del Erudito
    let firstEruditoTurn = true;
    const startingHero = determineStartingHero(junkpileHeroObject.JunkPile.powerstats.junkPileStats, randomHeroObject.RandomHero.powerstats.junkPileStats);
    let currentHero = startingHero;
    const oppositeHero = startingHero === 'JunkPile' ? 'RandomHero' : 'JunkPile';
    
     //MENSAJE INICIAL DE BATALLA
     console.log(`                                   `);
     console.log(`///////////////////////////////////`);
     console.log('WELCOME TO THE COMBAT ARENA');
     console.log(`///////////////////////////////////`);
     console.log(`Hoy combatiran ${startingHero} y ${oppositeHero}`);
     console.log(`///////////////////////////////////`);
     console.log(`                                   `);
     console.log(`Lista de atributos`);
     console.log('JunkPile: ', junkpileHeroObject.JunkPile.powerstats);
     console.log('RandomHero: ', randomHeroObject.RandomHero.powerstats);
     console.log(`///////////////////////////////////`);
     console.log(`El combate comienza con turno para ${startingHero}.`);

     function nextTurn() {
       
        console.log(`                                   `);
        console.log(`///////////////////////////////////`);
        // Mostrar el número de turno actual
        console.log(`ASALTO ${turnCounter}:`);
        console.log(`///////////////////////////////////`);

        if (eruditoTurn) {
            if (eruditoHero.hitPointsGlasses <= 0) {
                //console.log(`El Erudito ha muerto.`);
                eruditoTurn = false;
            }else{
            console.log(`Es turno del Erudito.`);
           
                if (eruditoHero.hitPointsGlasses > 0) {
                    const nextHero = simulateTurn('Erudito', currentHero === 'JunkPile' ? 'RandomHero' : 'JunkPile');
                    currentHero = nextHero || currentHero;
                    turnCounter++;
                }
                eruditoTurn = false;
            } 
        }
        else {
            console.log(`Es turno de ${currentHero}.`);
    
            let attacker;
            let isRogue = false;
    
            if (currentHero !== 'Erudito' && isRogue) {
                console.log(`Las gafas del Erudito pasan al héroe rival.`);
                isRogue = false;
            }
    
               // Actualizar el intervalo de aparición del Erudito
               let  eruditoAppearanceInterval = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
            // Verificar si es el turno del Erudito
            if (turnCounter % eruditoAppearanceInterval === 0 && eruditoHero.hitPointsGlasses > 0) {
                console.log(`El Erudito entra en escena.`);
                console.log(eruditoHero);
                eruditoTurn = true;
        
            } else {
                eruditoTurn = false;
            }
    
            // Si es el turno del Erudito, aplicar sus efectos
            if (eruditoTurn && eruditoHero.hitPointsGlasses > 0) {
                const eruditoPowerRoll = rollD20();
    
                if (firstEruditoTurn) {
                    eruditoHero.angerLevel = eruditoPowerRoll;
                    eruditoHero.hitPointsGlasses = 1 + eruditoHero.angerLevel;
                    console.log(`El Erudito utiliza su poder por primera vez.`);
                    firstEruditoTurn = false;
                }
    
                console.log(`El Erudito utiliza su poder. Tira 1D20 y obtiene ${eruditoPowerRoll}.`);
    
            
            // Aplicar los efectos del poder del Erudito según el resultado del dado
            switch (true) {
                case eruditoPowerRoll >= 1 && eruditoPowerRoll <= 3:
                    console.log(`PIFIA, El atacante se lesiona el brazo izquierdo, quedando su atributo STR dañado.`);
                    
                    attacker = currentHero === 'JunkPile' ? junkpileHeroObject.JunkPile : randomHeroObject.RandomHero;
                    console.log(`Antes de la pifia - Damage Roll del héroe atacante: ${eruditoPowerRoll}, Strength: ${attacker.powerstats.strength}`);
                    
                    attacker.damageRoll = Math.max(1, attacker.damageRoll - 1); 
                    attacker.powerstats.strength = Math.floor(attacker.powerstats.strength / 2); 
                    
                    console.log(`Después de la pifia - Damage Roll del héroe atacante: ${eruditoPowerRoll}, Strength: ${attacker.powerstats.strength}`);
                    break;
                case eruditoPowerRoll >= 4 && eruditoPowerRoll <= 6:
                    console.log(`PIFIA, El atacante se lesiona el brazo derecho, quedando su atributo STR dañado.`);
                    
                    attacker = currentHero === 'JunkPile' ? junkpileHeroObject.JunkPile : randomHeroObject.RandomHero;
                    console.log(`Antes de la pifia - Damage Roll del héroe atacante: ${eruditoPowerRoll}, Strength: ${attacker.powerstats.strength}`);
                    
                    attacker.damageRoll = Math.max(1, attacker.damageRoll - 1); 
                    attacker.powerstats.strength = Math.floor(attacker.powerstats.strength / 2); 
                    
                    console.log(`Después de la pifia - Damage Roll del héroe atacante: ${eruditoPowerRoll}, Strength: ${attacker.powerstats.strength}`);
                    break;
                case eruditoPowerRoll >= 7 && eruditoPowerRoll <= 9:
                    console.log(`CAOS, El atacante pierde la memoria y no ataca.`);
                    
                    currentHero = currentHero === 'JunkPile' ? 'RandomHero' : 'JunkPile';
                    console.log(`Turno cambiado a ${currentHero}.`);
                    break;
                case eruditoPowerRoll >= 10 && eruditoPowerRoll <= 13:
                    console.log(`AULLIDO, El erudito grita "TU ERES TONTO" y el atacante descubre donde se encuentra, momento que aprovechara para atacarle.`);
                    // Aplicar daño al Erudito con un dado de 100 caras (1D100)
                    const eruditoDamage = rollD100();
                    console.log(`El Erudito sufre ${eruditoDamage} puntos de daño.`);
                    // Reducir los puntos de vida del Erudito según el daño infligido
                    eruditoHero.hitPointsGlasses -= eruditoDamage;
                    break;
                    
                case eruditoPowerRoll >= 14 && eruditoPowerRoll <= 16:
                    console.log(`GRANUJA, El atacante aprovechara un despiste del enemigo para colocalrle las gafas.`);
                    // Aplicar efectos de granuja al héroe atacante
                    isRogue = true; 
                    break;
                    
                case eruditoPowerRoll >= 17 && eruditoPowerRoll <= 18:
                    console.log(`PERSPICAZ, El erudito detecta al atacante y le atrae con su famoso "tu eres tonto", momento que aprovecha para recuperar sus gafas.Sin embargo, la furia caotica del atacante se desata y embiste al Erudito.`);
                    console.log(`El Erudito ni se inmuta, parece invencible.`);
                    break;
                case eruditoPowerRoll >= 19 && eruditoPowerRoll <= 20:
                    console.log(`ENDEMONIADO, El atacante desata todo el caos de EL Erudito, persiguiendole y cortandole la cabeza.`);
                    console.log(`MUERTE, El Erudito desaparece de la partida y con el sus gafas se desvanecen.`);
                    eruditoTurn = false;
                    break;
                default:
                    console.log(`El Erudito no logra desencadenar un poder efectivo.`);
            }
            console.log(``);
            console.log('Atributos erudito actuales', eruditoHero);
            if (eruditoHero.hitPointsGlasses <= 0) {
                console.log(`El Erudito ha muerto.`);
                //eruditoTurn = false;
            }
             console.log(`///////////////////////////////////`);
            }
        }
    
        const nextHero = simulateTurn(currentHero, currentHero === 'JunkPile' ? 'RandomHero' : 'JunkPile');
    
        if (nextHero) {
            currentHero = nextHero;
            turnCounter++;
            setTimeout(nextTurn, 2000);
        } else {
            // Fin del combate
        }
    }

    nextTurn();
}

module.exports = { getHeroes };
