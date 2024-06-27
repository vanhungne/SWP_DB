import React, { useRef, useEffect } from 'react';

const GentleSnowfallEffect = ({ minSize = 1, maxSize = 3, snowflakeCount = 100 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Snowflake {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.size = Math.random() * (maxSize - minSize) + minSize;
                this.speed = Math.random() * 1 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.swing = Math.random() * 3 + 1;
                this.swingSpeed = Math.random() * 0.02 + 0.01;
                this.swingOffset = Math.random() * Math.PI * 2;
            }

            update() {
                this.y += this.speed;
                this.x += Math.sin(this.y * this.swingSpeed + this.swingOffset) * this.swing;

                if (this.y > canvas.height) {
                    this.reset();
                }

                this.opacity = Math.sin((this.y / canvas.height) * Math.PI) * 0.3 + 0.2;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
                ctx.restore();
            }
        }

        const snowflakes = Array(snowflakeCount).fill().map(() => new Snowflake());

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snowflakes.forEach(snowflake => {
                snowflake.update();
                snowflake.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [minSize, maxSize, snowflakeCount]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
};

export default GentleSnowfallEffect;