import React, { useEffect, useRef, useState } from "react";
import "./Home.css"; // Your main CSS file for this component
import { auth, onAuthStateChanged, signOut } from "../../firebase/firebase-init";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const testimonialCarouselRef = useRef(null);
  const testimonialWrapperRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleAuthAction = () => {
    if (user) {
      signOut(auth)
        .then(() => {
          localStorage.clear();
          setUser(null);
          navigate("/");
        })
        .catch(console.error);
    } else {
      navigate("/login");
    }
  };

  // Testimonial Carousel Logic (remains the same)
  useEffect(() => {
    const carousel = testimonialCarouselRef.current;
    const wrapper = testimonialWrapperRef.current;
    if (!carousel || !wrapper || testimonials.length === 0) return;
    const cards = [...carousel.children];
    if (cards.length === 0) return;
    const firstCardWidth = cards[0].offsetWidth;
    let timeoutId;
    let isDragging = false, startX, startScrollLeft;
    const arrowBtns = wrapper.querySelectorAll("i.testimonial-arrow");
    const handleArrowClick = (event) => { /* ... */ 
        if (!carousel) return;
        const direction = event.currentTarget.id === "left" ? -1 : 1;
        carousel.scrollBy({ left: direction * firstCardWidth, behavior: 'smooth' });
    };
    arrowBtns.forEach((btn) => btn.addEventListener("click", handleArrowClick));
    const dragStart = (e) => { /* ... */ 
        if (!carousel) return;
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX || e.touches[0].pageX - carousel.offsetLeft;
        startScrollLeft = carousel.scrollLeft;
        clearTimeout(timeoutId);
    };
    const dragging = (e) => { /* ... */ 
        if (!isDragging || !carousel) return;
        e.preventDefault();
        const x = e.pageX || e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = startScrollLeft - walk;
    };
    const dragStop = () => { /* ... */ 
        if (!carousel) return;
        isDragging = false;
        carousel.classList.remove("dragging");
        handleScrollEnd(); 
        autoPlay(); 
    };
    const handleScrollEnd = () => { /* ... */ 
        if (!carousel) return;
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth - 10) { 
            carousel.scrollTo({ left: 0, behavior: 'auto' }); 
        } else if (carousel.scrollLeft <= 0 && carousel.scrollLeft < -10) { 
             carousel.scrollTo({ left: carousel.scrollWidth - carousel.offsetWidth, behavior: 'auto' });
        }
    };
    const autoPlay = () => { /* ... */ 
        if (window.innerWidth < 800 || !carousel || document.hidden || testimonials.length <= (carousel.offsetWidth / firstCardWidth)) return;
        clearTimeout(timeoutId); 
        timeoutId = setTimeout(() => {
            if (!carousel) return;
            let newScrollLeft = carousel.scrollLeft + firstCardWidth;
            if (newScrollLeft >= carousel.scrollWidth - carousel.offsetWidth) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' }); 
            } else {
                carousel.scrollBy({ left: firstCardWidth, behavior: 'smooth' });
            }
        }, 3500); 
    };
    if (cards.length > 0) { /* ... Event listeners ... */ 
        carousel.addEventListener("mousedown", dragStart);
        carousel.addEventListener("touchstart", dragStart, { passive: true });
        carousel.addEventListener("mousemove", dragging);
        carousel.addEventListener("touchmove", dragging, { passive: true });
        document.addEventListener("mouseup", dragStop); 
        document.addEventListener("touchend", dragStop);
        carousel.addEventListener('scroll', () => { 
            clearTimeout(carousel.scrollEndTimer);
            carousel.scrollEndTimer = setTimeout(handleScrollEnd, 150);
        });
        wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
        wrapper.addEventListener("mouseleave", autoPlay);
        autoPlay();
    }
    return () => { /* ... Cleanup ... */ 
        arrowBtns.forEach((btn) => btn.removeEventListener("click", handleArrowClick));
        if (carousel) { /* ... remove listeners ... */ 
            carousel.removeEventListener("mousedown", dragStart);
            carousel.removeEventListener("touchstart", dragStart);
            carousel.removeEventListener("mousemove", dragging);
            carousel.removeEventListener("touchmove", dragging);
            carousel.removeEventListener('scroll', handleScrollEnd);
        }
        document.removeEventListener("mouseup", dragStop);
        document.removeEventListener("touchend", dragStop);
        if (wrapper) { /* ... remove listeners ... */ 
            wrapper.removeEventListener("mouseenter", () => clearTimeout(timeoutId));
            wrapper.removeEventListener("mouseleave", autoPlay);
        }
        clearTimeout(timeoutId);
        clearTimeout(carousel?.scrollEndTimer); 
    };
  }, [testimonials]);

  // --- Visme Script Dynamic Loading (Method 2) ---
  useEffect(() => {
    const vismeScriptId = 'visme-forms-embed-script';

    // Ensure the div is in the DOM before attempting to load/rely on the script
    const vismeDiv = document.querySelector('.visme_d[data-form-id="54173"]');
    if (!vismeDiv) {
        console.warn("Visme target div not found in DOM yet.");
        return; // Wait for next render or ensure div is present
    }

    if (document.getElementById(vismeScriptId)) {
      console.log("Visme script already loaded or loading.");
      // If Visme has a global object and a function to re-scan, you might call it here
      // e.g., if (typeof window.VismeForms !== 'undefined' && window.VismeForms.scan) window.VismeForms.scan();
      return;
    }

    console.log("Loading Visme script dynamically...");
    const script = document.createElement('script');
    script.id = vismeScriptId;
    script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
    script.async = true;
    // script.defer = true; // With async, defer might be redundant or behave differently depending on browser

    script.onload = () => {
      console.log('Visme script loaded dynamically via onload.');
      // Sometimes, even after onload, the script might need a brief moment for its internal setup
      // or it might automatically scan. If it has an explicit scan/init function, call it.
      // e.g., if (typeof window.VismeForms !== 'undefined' && window.VismeForms.scan) {
      //   window.VismeForms.scan();
      // }
    };
    script.onerror = () => {
        console.error("Error loading Visme script dynamically.");
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(vismeScriptId);
      if (existingScript && existingScript.parentNode) { // Check parentNode before removing
        console.log("Cleaning up Visme script.");
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="App">
      <header>
        <div className="logo">Campus Link</div> {/* Corrected typo */}
        <nav>
          <ul>
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contacts">Contact us</a></li>
            <button className="connect-btn nav-btn" onClick={handleAuthAction}>
              {user ? "Sign Out" : "Sign In"}
            </button>
          </ul>
        </nav>
        <label htmlFor="nav_check" className="hamburger">
          <div></div><div></div><div></div>
        </label>
        <input type="checkbox" id="nav_check" style={{display: 'none'}} />
      </header>

      {/* Hero Carousel (Bootstrap) */}
      <div className="hero" id="home">
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active"><img src="/assests/images/4.jpeg" className="d-block w-100" alt="Campus Life 1"/></div>
            <div className="carousel-item"><img src="/assests/images/2.jpeg" className="d-block w-100" alt="Campus Life 2"/></div>
            <div className="carousel-item"><img src="/assests/images/1.jpeg" className="d-block w-100" alt="Campus Life 3"/></div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span><span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span><span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="btn-container">
        <button className="connect-btn" onClick={() => navigate("/main")}>
          Connect With Your Seniors
        </button>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials" id="testimonials">
        <h1>Testimonials</h1>
        <div className="wrapper testimonial-wrapper" ref={testimonialWrapperRef}> {/* Added class */}
          <i id="left" className="fa-solid fa-chevron-left testimonial-arrow"></i>
          <ul className="carousel testimonial-carousel-items" ref={testimonialCarouselRef}>
            {testimonials.map((t, idx) => (
              <li key={idx} className="card">
                <div className="img"><img src={`/${t.image}`} alt={t.name} draggable="false" /></div>
                <h2>{t.name}</h2>
                <span>{t.desc}</span>
              </li>
            ))}
          </ul>
          <i id="right" className="fa-solid fa-chevron-right testimonial-arrow"></i>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container" id="contacts">
        <main className="row">
          <section className="col left">
            <div className="contactTitle"><h2>Get In Touch</h2></div>
            <div className="contactInfo">
              <div className="iconGroup">
                <div className="icon"><i className="fa-solid fa-phone"></i></div>
                <div className="details"><span>Phone</span><span>+00 110 111 00</span></div>
              </div>
              <div className="iconGroup">
                <div className="icon"><i className="fa-solid fa-envelope"></i></div>
                <div className="details"><span>Email</span><span>name.tutorial@gmail.com</span></div>
              </div>
              <div className="iconGroup">
                <div className="icon"><i className="fa-solid fa-location-dot"></i></div>
                <div className="details"><span>Location</span><span>X Street, Y Road, San Fransisco</span></div>
              </div>
            </div>
            <div className="socialMedia">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </section>
          <section className="col right">
           <div
            className="visme_d"
            data-title="Untitled Project"
            data-url="90x8g336-untitled-project"
            data-domain="forms"
            data-full-page="false"
            data-min-height="500px"
            data-form-id="54173"
          ></div>
          </section>
        </main>
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: "ANUJ KUMAR SINGH",
    desc: "Enjoy a plethora of sports facilities including cricket, football, basketball, tennis, badminton, and table tennis. Dive into our Olympic-size indoor swimming pool with daily classes led by experienced trainers.",
    image: "assests/images/anuj.jpeg",
  },
  {
    name: "P VIVEKANANDA",
    desc: "Over four years, the program develops skills, culminating in capstone projects and specialized training for industry placements. Final year focuses on startups.",
    image: "assests/images/vivekananda.png",
  },
  {
    name: "MEHAK JAIN",
    desc: "Experience firsthand learning from a blend of top academics, scholars, and industry leaders hailing from Newton School of Technology and renowned global institutions and companies.",
    image: "assests/images/mehak.png",
  },
  {
    name: "ANKUSH",
    desc: "Our vibrant campus in Sonipat spans 25 acres and is adorned with academic blocks, hostels for 1000+ students, and extensive sports facilities. It serves as a bustling hub for cultural and intellectual pursuits.",
    image: "assests/images/ankush.jpeg",
  },
];

export default Home;
