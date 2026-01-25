import { useState, useRef} from 'react'
//import './UserInput.css'

function CommandInput({nodesObjOut}) {
  const cmdInput = useRef(null)
  const [commandFeedback, setCommandFeedback] = useState("");
  const [nodesObj, modifyNodesObj] = useState({});
  //clean text regex removes new lines, carriage returns, and all common special chars except ';', '{' and '}'
  const cleanTextRegex = new RegExp("(\\n|\\!|\\@|\\#|\\$|\\%|\\^|\\&|\\*|\\<|\\>|\\(|\\))", 'gm');

  function splitArgs(cmdString) {
    return cmdString.split(';').map(arg => arg.trim()).filter(Boolean);
  }

  function parseNodeArgToObject(arg) {
    //check if argument contains id, position_x, position_y and label attributes 
    const nodeAttributes = ["id", "position_x", "position_y", "label"];
    const argAttributes = arg.split(',').map(arg => arg.trim()).filter(Boolean);

    if (argAttributes.length != nodeAttributes.length) { return {result: "failure", value: "Insufficient key."}; }

    const nodeObj = {};

    for (const attribute of argAttributes) {
        if (attribute.indexOf(':') == -1) { return {result: "failure", value: "Key lacks ':'."}; }

        const key = attribute.substring(0, attribute.indexOf(':'));
        let value = attribute.substring(attribute.indexOf(':')+1);
        console.log(key+"; "+value);

        if (!nodeAttributes.includes(key)) { return {result: "failure", value: "Invalid key."}; }
        
        if (!Number.isNaN(parseInt(value))) { value = parseInt(value); } //convert numerical value to int type
        nodeObj[key] = value;
    }

    return {result: "success", value: nodeObj};
  }

  function parseEdgeArgToObject(arg) {
    //check if argument contains id, position_x, position_y and label attributes 
    const edgeAttributes = ["id", "source", "destination"];
    const argAttributes = arg.split(',').map(arg => arg.trim()).filter(Boolean);

    if (argAttributes.length != edgeAttributes.length) { return {result: "failure", value: "Insufficient key."}; }

    const edgeObj = {};

    for (const attribute of argAttributes) {
        if (attribute.indexOf(':') == -1) { return {result: "failure", value: "Key lacks ':'."}; }

        const key = attribute.substring(0, attribute.indexOf(':'));
        let value = attribute.substring(attribute.indexOf(':')+1);
        console.log(key+"; "+value);

        if (!edgeAttributes.includes(key)) { return {result: "failure", value: "Invalid key."}; }
        
        if (!Number.isNaN(parseInt(value))) { value = parseInt(value); } //convert numerical value to int type
        edgeObj[key] = value;
    }

    return {result: "success", value: edgeObj};
  }
  
  function processCmd() {
    const cmdString = cmdInput.current.value.toUpperCase();
    const cleanedCmdString = cmdString.replaceAll(cleanTextRegex, "");

    if (cleanedCmdString.startsWith("CREATE ARCH")) {
        modifyNodesObj(prev => {
            const overwriteObj = {nodes: [], edges: []};

            nodesObjOut(overwriteObj);
            setCommandFeedback("Architecture created!");
            return overwriteObj
        });
    }
    else if (cleanedCmdString.startsWith("ADD NODE")) {
        if (Object.keys(nodesObj).length == 0) {
            setCommandFeedback("Architecture isn't created yet!");
            return;
        }

        const cmdArgs = splitArgs(cleanedCmdString);
        let newNodes = []; //contains only new nodes
        
        if (cmdArgs.length < 2) { setCommandFeedback("ADD NODE needs at least 2 arguments") }
        else {
            const nodeArgs = cmdArgs.slice(1);
            let commandResult = true;
            let errorMessage = " Node must contain id, position_x, position_y and label";

            for (const nodeArg of nodeArgs) {
                const parseResult = parseNodeArgToObject(nodeArg.toLowerCase());
                if (parseResult.result == "success") {  newNodes.push(parseResult.value); }
                else if (parseResult.result == "failure") { commandResult = false; errorMessage = parseResult.value + errorMessage; break; }
            }

            if (commandResult) { 
                modifyNodesObj(prev => {
                    const overwriteNodes = prev.nodes.concat(newNodes);
                    const overwriteObj = {...prev, nodes: overwriteNodes};

                    nodesObjOut(overwriteObj);
                    setCommandFeedback(`Added ${nodeArgs.length-1} node(s), totalling to ${overwriteNodes.length} node(s).`); 
                    return overwriteObj;
                });
            }
            else {
                setCommandFeedback(`ADD NODE failure; ${errorMessage}`);
            }
        }
    }
    else if (cleanedCmdString.startsWith("DELETE NODE")) {

    }
    else if (cleanedCmdString.startsWith("ADD EDGE")) {

    }
    else if (cleanedCmdString.startsWith("DELETE EDGE")) {

    }
    else if (cleanedCmdString == "") {
        setCommandFeedback("No command entered!");
    }
    else {
        setCommandFeedback("Invalid command entered!");
    }

    cmdInput.current.value = "";   
  }

  return (
    <div>
      <textarea defaultValue="" ref={cmdInput}></textarea>
      <button onClick={processCmd}>Send command</button>
      <label>{commandFeedback}</label>
    </div>
  )
}

export default CommandInput