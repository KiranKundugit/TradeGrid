import React from 'react';
function Team() {
    return ( 
        <div className='container'>
            <div className='row p-5 mt-5 border-top'>
                <h1 className='text-center'>People</h1>
            </div>

            <div className='row p-5 text-muted' style={{lineHeight: "1.8", fontSize: "1.2em"}}>
                <div className='col-6 p-5 text-center'>
                    <img src='media/images/imgleet2.jpg' style={{borderRadius: "100%",width: "60%"}} />
                    <h4 className='mt-5'>Kiran</h4>
                    <h6>Founder, CEO</h6>
                </div>
                <div className='col-6 p-5'>
                    <p>Kiran bootstrapped and built TradeGrid project in 2026 to overcome the hurdles she documented during her research as a computer science student. </p>
                    <p>She is a computer science graduate with excellent academics profile.</p>
                    <p>Playing chess is her hobby.</p>
                    <p>Connect on Homepage / TradeGrid / Twitter</p>
                </div>
            </div>
        </div>
     );
}

export default Team;