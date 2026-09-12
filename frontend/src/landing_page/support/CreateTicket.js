import React from 'react';
function CreateTicket() {
    return ( 
        <div className='container'>
            <div className='row p-5 mt-5'>
                <h1 className='fs-2'>
                    To create a ticket, select a relevant topic
                </h1>
            </div>
            <div className='row'>
                <div className='col-4 p-5 mt-2 mb-2'>
                <h4 className=''>
                    <i class='fa fa-plus-circle fa-lg' aria-hidden='true'></i> {" "}
                    Account Opening 
                </h4>
                <a href='' style={{lineHeight: '2.5'}}>Online Account Opening</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Offline Account Opening</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Company, Partnership and HUF Account</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Opening</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>NRI Account Opening</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Charges at TradeGrid</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>TradeGrid IDFC bank 3 in 1 Account</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Getting Started</a>
                    </div>
                <div className='col-4 p-5 mt-2 mb-2'>
                <h4 className=''>
                    <i class="fa fa-user" aria-hidden="true"></i> {" "}
                    Your TradeGrid Account
                </h4>
                <a href='' style={{lineHeight: '2.5'}}>Login Credentials</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Account Modification and Segment Addition</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>DP ID and Bank details</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Your Profile</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Transfer and conversion of shares</a>
                
                  </div>  
                <div className='col-4 p-5 mt-2 mb-2'>
                <h4 className=''>
                    <i class="fa fa-bar-chart" aria-hidden="true"></i> {" "}
                    Your TradeGrid Account
                </h4>
                <a href='' style={{lineHeight: '2.5'}}>Margin/leverage, Product and Order types</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Kite web & Mobile</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Trading FAQs</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Corporate Actions</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Sentinel</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Kite API</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Pi and other platform</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>Stockreports+</a>
                <br />
                <a href='' style={{lineHeight: '2.5'}}>GTT</a>
                </div>
            
            </div>
            

        </div>
     );
}

export default CreateTicket;