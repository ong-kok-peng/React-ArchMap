import { useState, useRef} from 'react'
import './assets/css/CommandInput.css'

function CommandInput({archObjOut}) {
  const cmdInput = useRef(null)
  const [commandFeedback, setCommandFeedback] = useState("");
  const [archObj, modifyArchObj] = useState({});
  //clean text regex removes new lines, carriage returns, and all common special chars except ';', '{' and '}'
  const cleanTextRegex = new RegExp("(\\n|\\!|\\@|\\#|\\$|\\%|\\^|\\&|\\*|\\<|\\>|\\(|\\))", 'gm');

  function splitArgs(cmdString) {
    return cmdString.split(';').map(arg => arg.trim()).filter(Boolean);
  }

  function createObjFromArg(arg, objAttributes) {
    //check if object to be created contains all attributes inside objAttributes
    const argAttributes = arg.split(',').map(arg => arg.trim()).filter(Boolean);

    if (argAttributes.length != objAttributes.length) { return {result: "failure", value: "Insufficient number of keys"}; }

    const obj = {};

    for (const attribute of argAttributes) {
        //check if each attribute has a key value pair separated by ':'
        if (attribute.indexOf(':') == -1) { return {result: "failure", value: "Key lacks ':'"}; }

        const key = attribute.substring(0, attribute.indexOf(':'));
        let value = attribute.substring(attribute.indexOf(':')+1);

        //check if key to create fulfils the objAttributes
        if (!objAttributes.includes(key)) { return {result: "failure", value: "Invalid key"}; } 
        
        if (!Number.isNaN(parseInt(value))) { value = parseInt(value); } //convert numerical value to int type
        obj[key] = value;
    }

    return {result: "success", value: obj};
  }
  
  function processCmd() {
    const cmdString = cmdInput.current.value.toUpperCase(); //to force beginning of command i.e. CREATE, ADD, DELETE to upper case
    const cleanedCmdString = cmdString.replaceAll(cleanTextRegex, "");

    //CREATE ARCH (architecture) command
    if (cleanedCmdString.startsWith("CREATE ARCH")) {
        modifyArchObj(prev => {
            const overwriteObj = {nodes: [], edges: []};

            archObjOut(overwriteObj);
            setCommandFeedback("Architecture created!");
            return overwriteObj
        });
    }
    //ADD/DELETE/EDIT command; look for multiple arguments which specify node(s) and edge(s)
    else if (["ADD", "DELETE", "EDIT"].some(beginOfCmd => cleanedCmdString.startsWith(beginOfCmd))) {
        if (Object.keys(archObj).length == 0) {
            setCommandFeedback("Architecture isn't created yet!");
            return;
        }

        let cmdArgs = splitArgs(cleanedCmdString); //split arguments by ';'
        if (cmdArgs.length < 2) { setCommandFeedback("ADD, DELETE and EDIT command needs at least 2 arguments"); return; }

        cmdArgs = cmdArgs.splice(1).map(arg => arg.toLowerCase()); //remove the first argument and reset all values to lover case
        let feedbackMessage = "";

        //ADD NODE COMMAND; parse multiple args, each arg is a new node object
        if (cleanedCmdString.startsWith("ADD NODE")) {
            let nodeAttributes = ["id", "position_x", "position_y", "label"];
            let newNodes = [];

            for (const arg of cmdArgs) {
                const parseResult = createObjFromArg(arg, nodeAttributes);
                if (parseResult.result == "success") {  
                    newNodes.push(parseResult.value);  
                    feedbackMessage += `Node ID ${parseResult.value.id} added!\n`;
                }
                else if (parseResult.result == "failure") { 
                    feedbackMessage += `Cannot add node because ${parseResult.value}.\n`;
                }
            }

            modifyArchObj(prev => {
                const overwriteNodes = prev.nodes.concat(newNodes);
                const overwriteObj = {...prev, nodes: overwriteNodes};

                archObjOut(overwriteObj);
                setCommandFeedback(feedbackMessage); 
                return overwriteObj;
            });
        }
        //ADD EDGE command;  parse multiple args, each arg is a new edge object
        else if (cleanedCmdString.startsWith("ADD EDGE")) {
            let edgeAttributes = ["id", "source", "destination"];
            let newEdges = [];

            for (const arg of cmdArgs) {
                const parseResult = createObjFromArg(arg, edgeAttributes);
                if (parseResult.result == "success") {  
                    //check if the edge object source and destination exists in all the nodes prev added
                    //newEdges.push(parseResult.value);  
                    //feedbackMessage += `Edge ID ${parseResult.value.id} added!\n`;
                }
                else if (parseResult.result == "failure") { 
                    feedbackMessage += `Cannot add edge because ${parseResult.value}.\n`;
                }
            }

            modifyArchObj(prev => {
                const overwriteEdges = prev.edges.concat(newEdges);
                const overwriteObj = {...prev, edges: overwriteEdges};

                archObjOut(overwriteObj);
                setCommandFeedback(feedbackMessage); 
                return overwriteObj;
            });
        }
        //DELETE commands
        else if (cleanedCmdString.startsWith("DELETE")) {
            //parse only one arg, which contains all the ids of nodes or edges
            if (cmdArgs.length != 1) { setCommandFeedback("DELETE should take in only one argument."); return; }

            //check if arg syntax has id key and a list of values pair
            if (!cmdArgs[0].startsWith("id:")) { setCommandFeedback("DELETE should specify list of IDs."); return; }

            const idValueStr = cmdArgs[0].substring(cmdArgs[0].indexOf(':')+1);
            const idValues = idValueStr.split(',').map(arg => arg.trim()).filter(Boolean);

            if (idValues.length == 0) { setCommandFeedback("DELETE has no IDs specified."); return; }
            //create a modified copy of exisitng nodes and edges
            let modifiedNodes = archObj.nodes; let modifiedEdges = archObj.edges;

            for (const id of idValues) {
                //find each id in the nodes and edges array. 
                if (archObj.nodes.some(node => node.id == id)) {
                    modifiedNodes = modifiedNodes.filter(node => node.id != id);
                    feedbackMessage += `ID ${id} is deleted in nodes.\n`;
                }
                else if (archObj.edges.some(edge => edge.id == id)) {
                    modifiedEdges = modifiedEdges.filter(edge => edge.id != id);
                    feedbackMessage += `ID ${id} is deleted in edges.\n`;
                }
                else { feedbackMessage += `ID ${id} is not found in existing nodes and edges.\n`; }
            }

            modifyArchObj(prev => {
                let overwriteObj = null; 

                if (cleanedCmdString.startsWith("DELETE NODE")) { overwriteObj = {...prev, nodes: modifiedNodes}; }
                else if (cleanedCmdString.startsWith("DELETE EDGE")) { overwriteObj = {...prev, edges: modifiedEdges}; }
                else { setCommandFeedback("DELETE has neither node nor edge defined."); return prev; }
                
                archObjOut(overwriteObj);
                setCommandFeedback(feedbackMessage); 
                return overwriteObj;
            });
        }
    }
    //Empty command
    else if (cleanedCmdString == "") {
        setCommandFeedback("No command entered!");
    }
    //Invalid command
    else {
        setCommandFeedback("Invalid command entered!");
    }

    cmdInput.current.value = "";   
  }

  return (
    <div className="commandInput">
      <div className='commandField'>
        <textarea defaultValue="" ref={cmdInput} placeholder="Type a commnd i.e CREATE ARCH..., ADD/DELETE NODE..."></textarea>
        <button onClick={processCmd}>Send command</button>
      </div>
      <div className='commandFeedback'>{commandFeedback}</div>
    </div>
  )
}

export default CommandInput