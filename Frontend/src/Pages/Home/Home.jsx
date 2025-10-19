import React from 'react'

import './Home.css'
import Navbar  from '../Navbar/Navbar'
import Spline from '@splinetool/react-spline';
import Footer from '../Footer/Footer'



function Home() {

  
return (
<>
< Navbar />
<div className="home-container">

<div className="hero-section">
{/* <video className="hero-background-video" autoPlay loop muted>
<source src={bgvideo} type="video/mp4" />
</video> */}

 <Spline  scene="https://prod.spline.design/HZCrgBdJRzq-xyIh/scene.splinecode" />


<div className="hero-overlay">
<h1 className="hero-title">MISAI</h1>
<h3 className="hero-subtitle">Your AI Shield Against Misinformation</h3>
</div>

</div>
<div className="cardcontainer">
  <div className="cards">
    <img src="/Images/smartai.png" alt="Smart AI" className="cardimg" />
    <h1>Smarter Than Misinformation</h1>
    <p><strong>MISAI</strong> detects fake or altered data using advanced AI and cross-source verification.</p>
    <p><em>No more believing everything you see.</em></p>
  </div>
  
  <div className="cards">
    <img src="/Images/search.png" alt="Check Anything" className="cardimg" />
    <h1>Check Anything, Anywhere</h1>
    <p>Upload an image, video, or text — MISAI instantly checks reliability and source authenticity.</p>
    <p><em>Your real-time truth companion.</em></p>
  </div>
  
  <div className="cards">
    <img src="/Images/protection.png" alt="Protection" className="cardimg" />
    <h1>Built for the Misinformation Era</h1>
    <p>From deepfakes to hallucinated AI facts — MISAI keeps you safe from digital deception.</p>
    <p><em>Trust restored, instantly.</em></p>
  </div>
  
  <div className="cards">
    <img src="/Images/evolving.png" alt="Evolving With Every Fact" className="cardimg" />
    <h1>Evolving With Every Fact</h1>
    <p>MISAI learns continuously — adapting to new misinformation trends, languages, and formats.</p>
    <p><em>The more it checks, the sharper it gets.</em></p>
  </div>
</div>

</div>
<Footer />
</>
  )
}

export default Home
