import React from 'react';

import AddFishForm from './AddFishForm.js'
import base from '../base';

class Inventory extends React.Component {
    constructor () {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            uid: null,
            owner: null
        }
    }
    
    componentDidMount () {
        base.onAuth((user) => {
            if (user) {
                this.authHandler(null, {user});
            }
        });
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

    renderLogin () {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign in to manage your store's inventory</p>
                <button className="github" onClick={() => this.authenticate('github')}>
                    Log in with Github
                </button>
            </nav>
        )
    }
    
    authenticate (provider) {
        console.log(`Logging in with ${provider}.`);
        base.authWithOAuthPopup(provider, this.authHandler);
    }
    
    logout () {
        base.unauth();
        this.setState({uid: null});
    }
    
    authHandler (err, authData) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(authData);
        const storeRef = base.database().ref(this.props.storeId);
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};
            
            if (!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                });
            }
            
            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            })
        });
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
        const logout = <button onClick={this.logout}>Log out</button>;
        // check if user is not logged in
        if (!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }
        
        if (this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry you aren't the owner of this store.</p>
                    {logout}
                </div>
            )
        }
        return (
            <div>
                <h2>Inventory</h2>
                {logout}
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
    updateFish: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired
}

export default Inventory;