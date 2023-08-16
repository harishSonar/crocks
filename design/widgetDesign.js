import React, {Component} from 'react';
import mermaidAPI from 'mermaid';
import jsonObj from '../data/designConfig.json';
import convertJsonToMermaid from './JsonToMermaidConverter';

export default class WidgetDesign extends Component {
    componentDidMount() {
        const output = document.getElementById('output');
        const txt = convertJsonToMermaid(jsonObj.view_configuration);
        mermaidAPI.render('graph', txt, (svgCode) => {
            this.svgCode = svgCode;
            output.innerHTML = svgCode;
        });
    }

    render() {
        return (
            <div id="output" style={{padding: '2% 20%'}} />
        );
    }
}

