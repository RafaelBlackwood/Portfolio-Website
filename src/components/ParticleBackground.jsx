import React, { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const swordsRef = useRef([]);
  const clashesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    class Sword {
      constructor() {
        this.reset();
      }

      reset() {
        const side = Math.random() > 0.5 ? 'left' : 'right';
        this.x = side === 'left' ? -50 : width + 50;
        this.y = Math.random() * height;
        this.targetX = side === 'left' ? width + 50 : -50;
        this.targetY = Math.random() * height;
        this.speed = Math.random() * 2 + 1;
        this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        this.length = 40;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.rotation = this.angle + (Math.random() - 0.5) * 0.5;
        this.spinSpeed = (Math.random() - 0.5) * 0.1;
      }

      update() {
        const dx = Math.cos(this.angle) * this.speed;
        const dy = Math.sin(this.angle) * this.speed;
        this.x += dx;
        this.y += dy;
        this.rotation += this.spinSpeed;

        if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Sword blade
        ctx.strokeStyle = '#a8a29e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.length / 2, 0);
        ctx.lineTo(this.length / 2, 0);
        ctx.stroke();

        // Sword tip glow
        ctx.strokeStyle = '#c9a227';
        ctx.lineWidth = 1;
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.beginPath();
        ctx.moveTo(this.length / 2 - 5, 0);
        ctx.lineTo(this.length / 2, 0);
        ctx.stroke();

        ctx.restore();
      }

      checkCollision(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.length;
      }
    }

    class Clash {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 30;
        this.opacity = 1;
        this.speed = 2;
        this.sparks = [];

        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8;
          this.sparks.push({
            x: 0,
            y: 0,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            life: 1
          });
        }
      }

      update() {
        this.radius += this.speed;
        this.opacity -= 0.02;

        this.sparks.forEach(spark => {
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.life -= 0.02;
        });

        return this.opacity > 0;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Impact ring
        ctx.strokeStyle = '#c9a227';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Sparks
        this.sparks.forEach(spark => {
          if (spark.life > 0) {
            ctx.globalAlpha = spark.life;
            ctx.fillStyle = '#ff6b35';
            ctx.beginPath();
            ctx.arc(this.x + spark.x, this.y + spark.y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.restore();
      }
    }

    // Initialize swords
    const swordCount = Math.min(15, Math.floor((width * height) / 50000));
    swordsRef.current = Array.from({ length: swordCount }, () => new Sword());
    clashesRef.current = [];

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw swords
      swordsRef.current.forEach((sword, i) => {
        sword.update();
        sword.draw(ctx);

        // Check for collisions
        for (let j = i + 1; j < swordsRef.current.length; j++) {
          const other = swordsRef.current[j];
          if (sword.checkCollision(other) && Math.random() > 0.95) {
            const clashX = (sword.x + other.x) / 2;
            const clashY = (sword.y + other.y) / 2;
            clashesRef.current.push(new Clash(clashX, clashY));
          }
        }
      });

      // Update and draw clashes
      clashesRef.current = clashesRef.current.filter(clash => {
        const alive = clash.update();
        if (alive) clash.draw(ctx);
        return alive;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}