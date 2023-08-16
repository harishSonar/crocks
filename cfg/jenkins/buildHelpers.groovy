def notifySuccessful() {
	 if (env.bitbucketNotification.toBoolean()) {
        step([$class: 'StashNotifier'])
    }
}

def notifyFailed() {
    if (params.PULL_REQUEST_FROM_BRANCH == "master" || params.PULL_REQUEST_FROM_BRANCH.startsWith("feature/")) {
        emailext(
            subject: "Job '${env.JOB_NAME}' (${env.BUILD_NUMBER}) branch: (${params.PULL_REQUEST_FROM_BRANCH}) failed",
            body: "See results at: ${env.BUILD_URL}.",
            to: "${emailAddressesMasterRelease}",
            recipientProviders: [[$class: 'DevelopersRecipientProvider']]
        )
    }
    else {
        emailext(
            subject: "Job '${env.JOB_NAME}' (${env.BUILD_NUMBER}) branch: (${params.PULL_REQUEST_FROM_BRANCH}) failed",
            body: "See results at: ${env.BUILD_URL}.",
            to: "",
            recipientProviders: [[$class: 'DevelopersRecipientProvider']]
        )
    }
}

return this