import "./style.css";

import React from 'react';
import colors from './colors';


class WhosNext extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            names: [
                {id: this.getNewUID(), v: '', done: false}
            ],
            spinning: false,
            started: false,
            activeId: null
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSpinClick = this.handleSpinClick.bind(this);
    }

    getNewUID() {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    handleNameChange(name, id) {

        this.setState( state => {
            let names = this.state.names;

            names = names.map(n => {
                if(n.id !== id) return n;
                n.v = name;
                return n;
            });

            names = names.filter(n => n.v !== '');
            names.push({id: this.getNewUID(), v: '', done: false});

            return {names};
        });

    }

    handleSpinClick() {

        this.setState( state => {
            let names = state.names;
            names = names.filter(n => n.v !== '');

            names = names.map(n => {
                if(n.id === state.activeId) {
                    n.done = true;
                }
                return n;
            });

            return {names};
        });

        this.setState({spinning: true, started: true});

        this.spinToNext();
        let interval = setInterval(() => {
            this.spinToNext();
        }, 200);

        setTimeout(() => {
            clearInterval(interval);

            this.setState({spinning: false});

        }, 3000);
    }

    spinToNext() {

        const namesNotDone = this.state.names.filter(n => !n.done);

        let randomId;
        if(namesNotDone.length !== 1) {
            do {
                randomId = namesNotDone[Math.floor(Math.random() * namesNotDone.length)].id;
            } while (randomId === this.state.activeId)
        } else {
            randomId = namesNotDone[0].id;
        }

        this.setState({activeId: randomId});
    }


    render() {

        const names = this.state.names;

        let button = "";
        if(names.filter(n => !n.done).length !== 1) {
            button = <button onClick={this.handleSpinClick}>Who's next?</button>;
        }

        return (
            <div>
                {names.map((n,i) =>
                    <Name  key={n.id}
                           id={n.id}
                           value={n.v}
                           color={colors[i % colors.length]}
                           onNameChange={this.handleNameChange}
                           spinning={this.state.spinning}
                           started={this.state.started}
                           active={this.state.activeId === n.id}
                           done={n.done}
                    />
                )}

                {button}
            </div>
        );
    }

}

class Name extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: props.value};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onNameChange(e.target.value, this.props.id);
    }

    render() {

        let content;
        if(this.props.started) {
            content = this.props.value;
        } else {
            content = <input type="text" value={this.props.value} onChange={this.handleChange} />;
        }

        return (
            <div className={ "name" +
                             (this.props.active ? " active" : "") +
                             (this.props.spinning ? " spinning" : "") +
                             (this.props.done ? " done" : "")
                           }
                 style={ {backgroundColor: this.props.color} }
            >
                {content}
            </div>
        );
    }
}

export default WhosNext;