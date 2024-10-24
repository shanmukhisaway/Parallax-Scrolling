const initSmoothScrolling = () => {
  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => {
      lenis.raf(time * 1000); 
  });
  
  gsap.ticker.lagSmoothing(0);
};

initSmoothScrolling();
