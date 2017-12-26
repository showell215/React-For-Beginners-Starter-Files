import React from 'react';

import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import Fish from './Fish';
import sampleFishes from '../sample-fishes.js';

class App extends React.Component {
    constructor () {
        super();
        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.state = {
            fishes: {},
            order: {}
        };
    }

    addFish (fish) {
        const fishes = {...this.state.fishes},
            timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        // tell react to update state
        this.setState({fishes});
    }

    loadSamples () {
        this.setState({
            fishes: sampleFishes
        });
    }

    render () { 
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {
                            Object.keys(this.state.fishes)
                            .map(fishId => <Fish details={this.state.fishes[fishId]} key={fishId}/>)
                        }
                    </ul>
                </div>
                <Order/>
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
            </div>
        );
    }
}

export default App;