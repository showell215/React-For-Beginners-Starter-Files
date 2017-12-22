// let's go!
import React from 'react';

import {getFunName} from '../helpers';

class StorePicker extends React.Component {
    // another option for binding methods to this component
    // constructor() {
    //     super();
    //     this.goToStore = this.goToStore.bind(this);
    // }
    
    goToStore (event) {
        event.preventDefault();
        // grab text from box
        console.log("changed url");
        // transition to /store/:storeId
        console.log(this.storeInput.value);
        // since BrowserRouter is at root levl, we can expose to any component
        // uses HTML5 PushState to change URL w/o reloading page!
        this.context.router.transitionTo(`/store/${this.storeInput.value}`);
    }
    render () {
        return (
            <form className="store-selector" onSubmit={this.goToStore.bind(this)}>
                { /* hello I am a comment */ }
                <h2>Please enter a store</h2>
            <input type="text" required placeholder="Store Name"
                defaultValue={getFunName()} ref={(input) => { this.storeInput = input}}
            />
                <button type="submit">Visit Store</button>
            </form>
        );
    }
}

// React will make 'router' available to this comp
StorePicker.contextTypes = {
    router: React.PropTypes.object
}

export default StorePicker;