env.masterBuildArtifacts="1.0.${env.BUILD_NUMBER}"
env.localRepoPath = "${PULL_REQUEST_FROM_BRANCH}".trim().replaceAll("\\W", "")
env.npmRegistry = "http://inceasd013:8081/nexus/content/groups/dex-npm-group/"

/*Sonar Properties Better to keep them in different File*/
env.sonarEnv = 'Sonar_CatalogOne'