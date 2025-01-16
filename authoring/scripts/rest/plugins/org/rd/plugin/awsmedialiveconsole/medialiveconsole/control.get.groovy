import plugins.org.rd.plugin.awsmedialiveconsole.MediaLiveConsole

def channelId = params.channelId
def action = params.action
def result = [:]
result.action = action

// check for channelId, valid action etc
def mediaLiveConsoleServices = new MediaLiveConsole(pluginConfig)

if ("start".equals(action)) {
    def awsResult = mediaLiveConsoleServices.startChannel(channelId)
    result.message = "complete"
    logger.info("Start $channelId " + awsResult)
} else if ("stop".equals(action)) {
    def awsResult = mediaLiveConsoleServices.stopChannel(channelId)
    result.message = "complete"
    logger.info("Stop $channelId " + awsResult)
} else {
    response.status = 400
    result.message = "unknown action"
}

return result
