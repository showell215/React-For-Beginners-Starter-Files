import React from 'react';

import AddFishForm from './AddFishForm.js'

class Inventory extends React.Component {
    constructor () {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange (e, key) {
        const fish = this.props.fishes[key],
            updatedFish = {
                ...fish,
                [e.target.name]: e.target.value
            }  
        console.log('something changed ', fish);
        this.props.updateFish(key, updatedFish);
        
    }
    renderInventory (key) {
        const fish = this.props.fishes[key];
        return (
            <div className="fish-edit" key={key}>
                <input type="text" name="name" onChange={(e) => this.handleChange(e, key)} defaultValue={fish.name} placeholder="Fish name"/>
                <input type="text" name="price" onChange={(e) => this.handleChange(e, key)} defaultValue={fish.price} placeholder="Fish price"/>
                <select type="text" name="status" onChange={(e) => this.handleChange(e, key)} defaultValue={fish.status} placeholder="Fish status">
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold out!!</option>
                </select>
                <textarea type="text" name="desc" onChange={(e) => this.handleChange(e, key)} defaultValue={fish.desc} placeholder="Fish desc"></textarea>
                <input type="text" name="image" onChange={(e) => this.handleChange(e, key)} defaultValue={fish.image} placeholder="Fish image"/>
                <button onClick={() => this.props.removeFish(key)}>Remove fish</button>
            </div>
        )
    }
    render () {
        return (
            <div>
                <h2>Inventory</h2>
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish}></AddFishForm>
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
                
            </div>
        );
    }
}

Inventory.propTypes = {
    fishes: React.PropTypes.object.isRequired,
    addFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    updateFish: React.PropTypes.func.isRequired
}

export default Inventory;