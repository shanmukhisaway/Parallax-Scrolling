import { preloadImages } from './utils.js'; 

gsap.registerPlugin(ScrollTrigger); 
gsap.registerPlugin(SplitText);     

const grid = document.querySelector('.grid');
const gridImages = grid.querySelectorAll('.grid__item-imgwrap'); 
const marqueeInner = document.querySelector('.mark > .mark__inner');
const textElement = document.querySelector('.text'); 
var splitTextEl = new SplitText(textElement, {type: 'chars'}); 
const gridFull = document.querySelector('.grid--full'); 
const creditsTexts = document.querySelectorAll('.credits'); 
const isLeftSide = (element) => {
  const elementCenter = element.getBoundingClientRect().left + element.offsetWidth / 2; 
  const viewportCenter = window.innerWidth / 2; 
  return elementCenter < viewportCenter; 
};

const animateScrollGrid = () => {
  gridImages.forEach(imageWrap => {
    const imgEl = imageWrap.querySelector('.grid__item-img'); 
    const leftSide = isLeftSide(imageWrap); 

    gsap.timeline({
      scrollTrigger: {
        trigger: imageWrap,               
        start: 'top bottom+=10%',         
        end: 'bottom top-=25%',           
        scrub: true,                      
      }
    })
    .from(imageWrap, {
      startAt: { filter: 'blur(0px) brightness(100%) contrast(100%)' }, 
      z: 300,                             
      rotateX: 70,                        
      rotateZ: leftSide ? 5 : -5,         
      xPercent: leftSide ? -40 : 40,      
      skewX: leftSide ? -20 : 20,         
      yPercent: 100,                      
      filter: 'blur(7px) brightness(0%) contrast(400%)', 
      ease: 'sine',                       
    })
    .to(imageWrap, {
      z: 300,                             
      rotateX: -50,                       
      rotateZ: leftSide ? -1 : 1,         
      xPercent: leftSide ? -20 : 20,      
      skewX: leftSide ? 10 : -10,         
      filter: 'blur(4px) brightness(0%) contrast(500%)', 
      ease: 'sine.in',                    
    })
    .from(imgEl, {
      scaleY: 1.8,                        
      ease: 'sine',                       
    }, 0)
    .to(imgEl, {
      scaleY: 1.8,                        
      ease: 'sine.in'                     
    }, '>');
  });
};

const animateMarquee = () => {
  gsap.timeline({
    scrollTrigger: {
      trigger: grid,                     
      start: 'top bottom',               
      end: 'bottom top',                 
      scrub: true,                       
    }
  })
  .fromTo(marqueeInner, {
    x: '100vw'                           
  }, {
    x: '-100%',                          
    ease: 'sine',
  });
};

const animateTextElement = () => {
  gsap.timeline({
    scrollTrigger: {
      trigger: textElement,              
      start: 'top bottom',               
      end: 'center center-=25%',         
      scrub: true,                       
    }
  })
  .from(splitTextEl.chars, {
    ease: 'sine',
    yPercent: 300,                       
    autoAlpha: 0,                        
    stagger: {                           
      each: 0.04,                        
      from: 'center'                     
    }
  });
};

const animateGridFull = () => {
  const gridFullItems = gridFull.querySelectorAll('.grid__item'); 
  
  const numColumns = getComputedStyle(gridFull).getPropertyValue('grid-template-columns').split(' ').length;
  const middleColumnIndex = Math.floor(numColumns / 2); 

  const columns = Array.from({ length: numColumns }, () => []); 
  gridFullItems.forEach((item, index) => {
    const columnIndex = index % numColumns; 
    columns[columnIndex].push(item); 
  });

  columns.forEach((columnItems, columnIndex) => {
    const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2; 

    gsap.timeline({
      scrollTrigger: {
        trigger: gridFull,               
        start: 'top bottom',             
        end: 'center center',            
        scrub: true,                     
      }
    })
    .from(columnItems, {
      yPercent: 450,                     
      autoAlpha: 0,                      
      delay: delayFactor,                
      ease: 'sine',
    })
    .from(columnItems.map(item => item.querySelector('.grid__item-img')), {
      transformOrigin: '50% 0%',          
      ease: 'sine',
    }, 0); 
  });
};

const animateCredits = () => {
  creditsTexts.forEach(creditsText => {
    const splitCredits = new SplitText(creditsText, { type: 'chars' }); 

    gsap.timeline({
      scrollTrigger: {
        trigger: creditsText,              
        start: 'top bottom',               
        end: 'clamp(bottom top)',          
        scrub: true,                       
      }
    })
    .fromTo(splitCredits.chars, {
      x: (index) => index * 80 - ((splitCredits.chars.length * 80) / 2),  
    }, {
      x: 0,                               
      ease: 'sine'
    });
  });
};

const init = () => {
  animateScrollGrid();    
  animateMarquee();       
  animateTextElement();   
  animateGridFull();      
  animateCredits();       
};

preloadImages('.grid__item-img').then(() => {
  document.body.classList.remove('loading'); 
  init(); 
  window.scrollTo(0, 0); 
});
