import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

// Objects
function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
        x: 0,
        y: 3
    }
    this.friction = 0.8
    this.gravity = 0.3
}

Star.prototype.draw = function() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
}

Star.prototype.update = function() {
    this.draw()

    // When ball hits bottom of screen
    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y *= -this.friction
        this.shatter()
    } else {
        this.velocity.y += this.gravity
    }

    this.y += this.velocity.y
}

Star.prototype.shatter = function() {
    this.radius -= 3;
    for (let i = 0 ; i < 8 ; i++){
        miniStars.push( new MiniStar(this.x, this.y, 2) )
    }
}


function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color)
    this.velocity = {
        x: utils.randomIntFromRange(-5, 5),
        y: utils.randomIntFromRange(-15, 15)
    }
    this.friction = 0.8
    this.gravity = 0.1
    this.ttl = 500;
    this.opacity = 1;
}

MiniStar.prototype.draw = function() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(255, 0, 0, ${this.opacity})`
    c.fill()
    c.closePath()
}

MiniStar.prototype.update = function() {
    this.draw()

    // When ball hits bottom of screen
    if (this.y + this.radius + this.velocity.y > canvas.height) {
        this.velocity.y *= -this.friction;
    } else {
        this.velocity.y += this.gravity;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.ttl -= 1;
    this.opacity -= 1 / this.ttl;
}

// Implementation
let stars
let miniStars
function init() {
    stars = []
    miniStars = []

    for (let i = 0; i < 1; i++) {
        stars.push(new Star(canvas.width/2, 30, 30, "blue"))
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    stars.forEach( (star, i) => {
        star.update()
        if (star.radius < 1) {
            stars.splice(i, 1);
        }
    })

    miniStars.forEach( (miniStar, i) => {
        miniStar.update();
        if (miniStar.ttl < 1) {
            miniStars.splice(i, 1)
        }
    })
}

init()
animate()
