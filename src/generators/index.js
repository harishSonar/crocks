/* eslint-disable */

// import "babel/polyfill";
import path from 'path';
// import { Logger } from '../utils';
import fs from 'fs';
import fse from 'fs-extra';
// import beautify from 'js-beautify';
// import {Logger, Messages, ApiHelper } from '../utils';

const sourcePath = path.join(__dirname, '../../data/');
const outputJs = path.join(__dirname, '../../src/templates');
const allFolders = fs.readdirSync(sourcePath);

export class InitGenerator {
	constructor() {
		// this.logger = new Logger;
		// console.initiallizeLoggerFile();
		this.timeout = 500;
		this.initialize();
	}
    initialize() {
        let hasSubDir = false;
        console.log(allFolders);
        allFolders.map((subFolder) => {
            if (subFolder.split('.').length === 1) {
                hasSubDir = true;
                const subDirPath = path.join(sourcePath, subFolder + '/');
                this.methodContent = '';
				this.classContent = '';
				console.log('subDirPath11', subDirPath);
				this.syncJsonRead(subDirPath, subFolder);
			}
		});
		if (!hasSubDir) {
			console.log('sourcePath', sourcePath);
			this.syncJsonRead(sourcePath, '');
		}
	}
	
    syncJsonRead(subDirPath, subDirName) {
        // const apiName = subDirName ? subDirName.charAt(0).toUpperCase() + subDirName.slice(1).toLowerCase() + 'ApiHelper.apiServiceFileName' : 'ApiHelper.apiServiceFileName';
		// const apiFileName = apiName + '.' + 'Messages.JS_EXT';
        // const destDirPath = path.join(outputJs, apiFileName);
        const allFiles = fs.readdirSync(subDirPath);
        // console.info(`${Messages.PROCESSING_API} ${Messages.MASTER_JSON_TO_API}@ ${destDirPath} >> @ ${subDirPath}`);
		console.log('allFiles',allFiles);
        allFiles.map((jsonFile, index) => {
            const jsonPath = `${subDirPath}${jsonFile}`;
            if (allFiles.length === index + 1) {
				this.createFile(jsonPath, index);
				// this.createApiClass(subDirName);
			}
		});
	}

	createFile(jsonPath, index){
        // console.message(`${index + 1}. ${Messages.PROCESSING_API} ${jsonPath}`);
        const content = fs.readFileSync(jsonPath);
		const contentJson = content ? JSON.parse(content) : [];
		this.createFilesFromJSONObj(contentJson.view_configuration);
	}

	createFilesFromJSONObj(contentJsonObj) {
		const componentName = contentJsonObj.name;
		if (componentName) {
			console.log('componentName', componentName);
			const childState = contentJsonObj.state;
			if (childState && childState.length > 0) {
				const childStateBoiler = this.getChildStateBoiler(childState);
				const classContent = this.createBoilerReactClassCode(componentName, childStateBoiler, contentJsonObj);
				this.printJSFile(componentName, classContent);
			} else {
				const classContent = this.getBoilerFunctionalConponent(componentName, contentJsonObj);
				this.printJSFile(componentName, classContent);
			}
		}
		if (contentJsonObj.child && contentJsonObj.child.length > 0) {
			contentJsonObj.child.forEach(childElement => {
				this.createFilesFromJSONObj(childElement);
			});
		}
	}

	printJSFile(fileName, classContent) {
		const completeJSFilePath = path.join(outputJs, `${fileName}.js`);
		console.info(`PRINTING API @ ${completeJSFilePath}`);
        fse.outputFile(completeJSFilePath, classContent, err => {
            if (err) {
                // console.error(`${Messages.JSON_UPDATE_FAILURE} ${completeJSFilePath}`);
                // console.error(err);
                this.reject();
            }
        });
	}

	getChildStateBoiler(childState = []) {
		console.log('childState', childState);
		let returnString = '';
		for (let index = 0; index < childState.length; index++) {
			returnString += `${childState[index].name}: ''`;
			if (index + 1 < childState.length) {
				returnString += `,
				`;
			}
		}
		// childState.forEach((item) =>{
		// 	const commaReqd = returnString ? `${returnString},` : "";
		// 	returnString =  `${commaReqd}
		// 	${item.name}: ''
		// 	`;
		// });
		console.log(returnString);

		return `{${returnString}}`;
	}

	generateFatArrowFunctions(contentJsonObj) {
		let fatArrowFunctions = '';
		if(contentJsonObj.functions) {
			contentJsonObj.functions.forEach((func) => {
				fatArrowFunctions += `${func} = () => {\n}; \n\t`;
			});
		}
		return fatArrowFunctions;
	}

    getSubViewProps(parentView, childView) {
        let subProps = '';
        if(childView.props) {
            childView.props.forEach((item) => {
                const proptype = (parentView.state ? 'this.props': 'props');
                subProps += `${item.name}={${proptype}.${item.propsMapping}} \n`
            });
        }
        return subProps;
    }

	generateImportsAndUsage(contentJsonObj) {
		let imports = '';
		let subViews = '';
		console.log("contentJsonObj.child", contentJsonObj.child);
		if(contentJsonObj.child) {
			contentJsonObj.child.forEach((subView) => {
                const subProps = this.getSubViewProps(contentJsonObj, subView);
				imports += `import ${subView.name} from './${subView.name}';\n\t`;
				subViews += `<${subView.name} ${subProps}/>\n\t\t\t\t`;
			});
		}
		return { imports, subViews};
	}

	getBoilerFunctionalConponent(mainFileName, contentJsonObj) {
		let importsAndSubViews = this.generateImportsAndUsage(contentJsonObj);
        return( 
            `import React from 'react';
            ${importsAndSubViews.imports}

            const ${this.generateFatArrowFunctions(contentJsonObj)}
            function ${mainFileName}(props) {
                return (
                    <div className="${mainFileName}" style={{border: '2px solid red'}}>
                            <h1>${mainFileName}</h1>
                            ${importsAndSubViews.subViews}
                    </div>
                );
            }

            export default ${mainFileName};
`);
	}

	createBoilerReactClassCode(mainClassName, state = {}, contentJsonObj = {}) {
		let importsAndSubViews = this.generateImportsAndUsage(contentJsonObj);
		return (`import React, {Component} from 'react';
${importsAndSubViews.imports}
class ${mainClassName} extends Component {
	
    constructor(props) {
        super(props);
        this.state = ${state};
    }

	${this.generateFatArrowFunctions(contentJsonObj)}

    render() {
        return (
			<div className="${mainClassName}" style={{border: '2px solid red'}}>
				<h1>${mainClassName}</h1>
				${importsAndSubViews.subViews}
            </div>

        );
    }
}

export default ${mainClassName};

`);
	}

}

new InitGenerator();
