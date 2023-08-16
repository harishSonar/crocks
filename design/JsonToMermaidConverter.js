const convertJsonToMermaidFormat = (jsonObj, mermaid = ['classDiagram']) => {
    if (jsonObj.child) {
        jsonObj.child.map((item) => {
            mermaid.push(`${jsonObj.name} --> ${item.name}`);
            return mermaid;
        });
    }
    if (jsonObj.props) {
        jsonObj.props.map((item) => {
            mermaid.push(`${jsonObj.name}: ${item.name} :: ${item.type}`);
            return mermaid;
        });
    }
    
    if (jsonObj.state) {
        jsonObj.state.map((item) => {
            mermaid.push(`${jsonObj.name}: ${item.name} :: ${item.type}`);
            return mermaid;
        });
    }
    
    if (jsonObj.functions) {
        jsonObj.functions.map((item) => {
            mermaid.push(`${jsonObj.name}: ${item}()`);
            return mermaid;
        });
    }
    
    if (jsonObj.child) {
        jsonObj.child.map((item) => {
            convertJsonToMermaidFormat(item, mermaid);
            return mermaid;
        });
    }
    return mermaid;
};

const convertJsonToMermaid = (jsonObj) => {
    return convertJsonToMermaidFormat(jsonObj).join('\n');
};

export default convertJsonToMermaid;
