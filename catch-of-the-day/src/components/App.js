import React from 'react';

import base from '../base';

import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import Fish from './Fish';
import sampleFishes from '../sample-fishes.js';

class App extends React.Component {
    constructor () {
        super();
        // methods
        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
        // state
        this.state = {
            fishes: {},
            order: {}
        };
    }

    componentWillMount () {
        // this runs right before the app is rendered
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
        {
            context: this,
            state: 'fishes'
        });
        // order in localStorage?
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
        
        if (localStorageRef) {
            // update app order state based on existing order
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    }

    componentWillUpdate (nextProps, nextState) {
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
    }

    componentWillUnmount () {
        base.removeBinding(this.ref);
    }

    addFish (fish) {
        const fishes = {...this.state.fishes},
            timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        // tell react to update state
        this.setState({fishes});
    }
    
    updateFish (key, updatedFish) {
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({fishes});
    }
    
    removeFish (key) {
        const fishes = {...this.state.fishes};
        fishes[key] = null; // Firebase needs this to be null, not deleted
        // delete fishes[key];
        this.setState({fishes});
    }

    loadSamples () {
        this.setState({
            fishes: sampleFishes
        });
    }

    addToOrder (key) {
        // copy order state
        const order = {...this.state.order};
         // key is key of fish. Add pound of select
        order[key] = order[key] + 1 || 1;
        this.setState({order});
    }
    
    removeFromOrder (key) {
        const order = {...this.state.order};
        delete order[key];
        this.setState({order});
    }
    
    render () { 
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {
                            Object.keys(this.state.fishes)
                            .map(key => <Fish details={this.state.fishes[key]} 
                                             key={key}
                                             index={key}
                                             addToOrder={this.addToOrder}/>)
                        }
                    </ul>
                </div>
                <Order params={this.props.params}
                    fishes={this.state.fishes}
                    order={this.state.order}
                    removeFromOrder={this.removeFromOrder}
                />
                <Inventory addFish={this.addFish} 
                    loadSamples={this.loadSamples}
                    fishes={this.state.fishes}
                    updateFish={this.updateFish}
                    removeFish={this.removeFish}
                    storeId={this.props.params.storeId}
                />
            </div>
        );
    }
}

App.propTypes = {
    params: React.PropTypes.object.isRequired
}

export default App;