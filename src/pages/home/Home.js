import React from 'react';
import BasePage from '../basePage/BasePage';

class Home extends BasePage {
	render() 
	{
		return (
			<React.Fragment>
				<div className="card text-white bg-dark">
					<h2 className="card-header text-center text-uppercase">Web Admin</h2>
					<div className="card-body p-4">
						<h3 className="card-title">Descrição</h3>
						<p className="card-text primary-text text-justify" style={{textIndent:"5%"}}>About.
						</p>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default Home;
