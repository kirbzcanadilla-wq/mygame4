const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("gameCanvas")});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Player
const playerGeometry = new THREE.BoxGeometry(1,1,1);
const playerMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);
player.position.y = 0.5;

// Arena floor
const floorGeometry = new THREE.PlaneGeometry(20,20);
const floorMaterial = new THREE.MeshBasicMaterial({color: 0x444444});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Enemies
let enemies = [];
for(let i=0;i<5;i++){
    const enemyGeo = new THREE.BoxGeometry(1,1,1);
    const enemyMat = new THREE.MeshBasicMaterial({color: 0xff0000});
    const enemy = new THREE.Mesh(enemyGeo, enemyMat);
    enemy.position.set(Math.random()*10-5,0.5,Math.random()*10-5);
    enemies.push(enemy);
    scene.add(enemy);
}

// Camera
camera.position.set(0,10,10);
camera.lookAt(0,0,0);

// Player movement
let keys = {};
document.addEventListener('keydown', (e)=> keys[e.code]=true);
document.addEventListener('keyup', (e)=> keys[e.code]=false);

// Projectiles
let bullets = [];
document.addEventListener('keydown', (e)=>{
    if(e.code==='Space'){
        const bulletGeo = new THREE.SphereGeometry(0.2,8,8);
        const bulletMat = new THREE.MeshBasicMaterial({color:0xffff00});
        const bullet = new THREE.Mesh(bulletGeo, bulletMat);
        bullet.position.copy(player.position);
        bullet.velocity = new THREE.Vector3(0,0,-0.5);
        bullets.push(bullet);
        scene.add(bullet);
    }
});

// Score
let score = 0;
const scoreDisplay = document.getElementById("score");

// Animate
function animate(){
    requestAnimationFrame(animate);

    // Player movement
    if(keys['ArrowLeft'] || keys['KeyA']) player.position.x -=0.1;
    if(keys['ArrowRight'] || keys['KeyD']) player.position.x +=0.1;
    if(keys['ArrowUp'] || keys['KeyW']) player.position.z -=0.1;
    if(keys['ArrowDown'] || keys['KeyS']) player.position.z +=0.1;

    // Move bullets
    bullets.forEach((b, i)=>{
        b.position.add(b.velocity);
        // Check collisions with enemies
        enemies.forEach((e, j)=>{
            if(b.position.distanceTo(e.position)<0.75){
                scene.remove(e);
                enemies.splice(j,1);
                scene.remove(b);
                bullets.splice(i,1);
                score+=10;
                scoreDisplay.textContent=score;
            }
        });
        // Remove bullets if out of bounds
        if(Math.abs(b.position.x)>20 || Math.abs(b.position.z)>20) {
            scene.remove(b);
            bullets.splice(i,1);
        }
    });

    // Move enemies randomly
    enemies.forEach(e=>{
        e.position.x += (Math.random()-0.5)*0.05;
        e.position.z += (Math.random()-0.5)*0.05;
    });

    renderer.render(scene, camera);
}
animate();
