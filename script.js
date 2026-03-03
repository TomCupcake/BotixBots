document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const orbs = [];
    const numParticles = 300;
    const numOrbs = 10;
    const mouse = { x: null, y: null, radius: 260 };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3.2 + 0.7;
            this.speedX = Math.random() * 1.5 - 0.75;
            this.speedY = Math.random() * 1.5 - 0.75;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.hypot(dx, dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                this.x -= (dx / dist) * force * 14;
                this.y -= (dy / dist) * force * 14;
            }
        }
        draw() {
            ctx.fillStyle = 'rgba(190, 170, 255, 0.88)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Orb {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 90 + 50;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.hue = Math.random() * 60 + 230;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.speedX *= -1;
            if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.speedY *= -1;
            this.hue += 0.15;
        }
        draw() {
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            g.addColorStop(0,   `hsla(${this.hue}, 85%, 72%, 0.65)`);
            g.addColorStop(0.6, `hsla(${this.hue + 40}, 90%, 65%, 0.35)`);
            g.addColorStop(1,   'transparent');

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles.length = 0;
        orbs.length = 0;
        for (let i = 0; i < numParticles; i++) particles.push(new Particle());
        for (let i = 0; i < numOrbs; i++) orbs.push(new Orb());
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dist = Math.hypot(
                    particles[a].x - particles[b].x,
                    particles[a].y - particles[b].y
                );
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(210, 190, 255, ${1 - dist/150 * 0.75})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(13, 13, 26, 0.14)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        orbs.forEach(o => { o.update(); o.draw(); });
        particles.forEach(p => { p.update(); p.draw(); });
        connect();

        requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
});