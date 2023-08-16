/* 

    We are using Declarative Pipeline build approach to
    run application, for more information please refer to
    https://jenkins.io/doc/book/pipeline/      
*/
node('master') {
    def buildHelpers;
    def performCleanBuild = "false";
    def tagRelease = "true";
    def NPM_INSTALL_REGISTRY = "http://inceasd013:8081/nexus/content/groups/dex-npm-group/";
    // def NPM_PUBLISH_REGISTRY = "http://inceasd013:8081/nexus/content/repositories/dex-npm-local/";
    
	try {
		
		stage('Initialize') {
            branchName = "${PULL_REQUEST_FROM_BRANCH}".trim().replaceAll(/\s/, '')
                                                
            try{
                performCleanBuild = "${PERFORM_CLEAN_BUILD}"
            }
            catch(err){
                println("Perform Clean Build was not provided in Input setting to false, incase of Release Build it will be set to true")
            }
			
			try{
                tagRelease = "${TAG_RELEASE}"
            }
            catch(err){
                println("Tag Release was not specified, setting to false")
            }
			
			println("performCleanBuild :: ${performCleanBuild}");
			println("tagRelease :: ${tagRelease}");
		}
		
		stage('Clean Workspace') {
            try{
                if(performCleanBuild == "true"){
                    deleteDir()
                }else{
                   println("Running Without Clean Build Option !!!");
                }
            }
            catch(err){
                println("Parameter PERFORM_CLEAN_BUILD was not passed, so setting it to default value = false")    
            }   
        } 
		
		stage('Pull Changes from Git') {
            checkout scm
        }
		
		stage('Load Helper Files') {
            load "cfg/jenkins/pipeline.groovy"
            load "cfg/jenkins/notifications.groovy"
            buildHelpers = load "cfg/jenkins/buildHelpers.groovy"

            println("localRepoPath ::  ${localRepoPath}");
		}                         
        
		stage('install') {
           sh "npm install --registry ${NPM_INSTALL_REGISTRY}"
        }

		stage('build') { 
           sh "npm run build"
        }
		
		parallel Mocha:{ 
            stage('Mocha and IT Cases') {
               sh "npm run test"
            }     
            stage('Sonar') {
                println("Place Holder For Sonar Scan");
            }
        }
				
		if (branchName == "master") {
            stage('Change npm package Version') {
               	// sh "npm version ${env.masterBuildArtifacts}"
                println("To manage version");
            }
						
			stage('Create and Upload Artifacts'){
                // sh "npm publish --verbose --registry ${NPM_PUBLISH_REGISTRY}" 
                println("Create and Upload Artifacts");
            }
			
			parallel ReleaseNotes:{
				stage('Create Release Notes') {
					println("Place Holder For Release Notes Generation");
				}
				
				stage('Send Notification') {
					println("Place Holder For Sending Notification about Release; Release Notes as Attachment");
				}
			},
			TagRelease: {
				stage('Tag Release in Git') {        
					if(tagRelease == "true"){
						sh "git tag ${env.masterBuildArtifacts}"
						sh "git push --tags"
					}
				}
			}
			TriggerDeployment: {
				stage('Trigger Kentico Build') {
					println("Place Holder To trigger Kentico build");
				}
			}
		}
		
		currentBuild.result = 'SUCCESS'
        buildHelpers.notifySuccessful()
	}
	catch(err){
		println("Failed due to ${err}")
        currentBuild.result = 'FAILED'
		buildHelpers.notifyFailed()		
	}
}