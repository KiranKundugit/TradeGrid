import React from 'react';

function Hero() {
    return ( 
        <div className='container p-5'>
            <div className='row text-center d-flex justify-content-center'>
                <img src='media/images/img_hero.png' alt='Hero Image' className='mb-5' style={{width: "50%"}} />
                <h1 className='mt-5'>Invest in everything</h1>
                <p>Online platform to invest in stocks, derivatives, mutual funds, and more</p>
                <button className='p-2 btn fs-5 mb-5' style={{width: "20%", margin:"0 auto", backgroundColor: "#86C760"}}>Signup Now</button>
            </div>
        </div>
     );
}

export default Hero;