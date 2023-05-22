package plugins.org.rd.plugin.awsmedialiveconsole

@Grab(group='com.amazonaws', module='aws-java-sdk-medialive', version='1.12.99', initClass=false)
@Grab(group='com.amazonaws', module='aws-java-sdk-mediapackage', version='1.12.99', initClass=false)

import com.amazonaws.auth.*
import com.amazonaws.auth.AWSCredentialsProvider
import com.amazonaws.services.medialive.AWSMediaLiveClientBuilder
import com.amazonaws.services.medialive.model.StopChannelRequest
import com.amazonaws.services.medialive.model.StartChannelRequest

import com.amazonaws.services.mediapackage.AWSMediaPackageClientBuilder
import com.amazonaws.services.mediapackage.model.ListOriginEndpointsRequest

/**
 * This class is a service class that maps console functionality to AWS MediaLive services
 */
public class MediaLiveConsole {

    def mediaLiveClient
    def mediaPackageClient
    def pluginConfig

    /**
     * constructor
     */
    MediaLiveConsole(pluginConfig) {
        this.pluginConfig = pluginConfig
    }

    /**
     * Look up credentials for AWS from the site
     * @param siteId
     * @return object containing credentials
     */
    def lookupAwsMediaCredentials() {
        def creds = [region: "", apiKey: "", apiSecret: ""]

        creds.region = pluginConfig.getString("awsRegion")
        creds.apiKey = pluginConfig.getString("awsApiKey")
        creds.apiSecret = pluginConfig.getString("awsApiSecret")

        return creds
    }

    /**
     * return the media live client. If one does not exist for the instance, create it.
     * @param siteId
     */
    def createMediaLiveClient(siteId) {

        if(this.mediaLiveClient == null) {
            def creds = this.lookupAwsMediaCredentials()
            AWSCredentialsProvider credProvider = (AWSCredentialsProvider) (new AWSStaticCredentialsProvider( new BasicAWSCredentials(creds.apiKey, creds.apiSecret)))
            this.mediaLiveClient = AWSMediaLiveClientBuilder.standard().withRegion(creds.region).withCredentials(credProvider).build()
        }

        return this.mediaLiveClient
    }

    /**
     * return the media live client. If one does not exist for the instance, create it.
     * @param siteId
     */
    def createMediaPackageClient(siteId) {
        if(this.mediaPackageClient == null) {
            def creds = this.lookupAwsMediaCredentials()
            AWSCredentialsProvider credProvider = (AWSCredentialsProvider) (new AWSStaticCredentialsProvider( new BasicAWSCredentials(creds.apiKey, creds.apiSecret)))
            this.mediaPackageClient = AWSMediaPackageClientBuilder.standard().withRegion(creds.region).withCredentials(credProvider).build()
        }

        return this.mediaPackageClient
    }

    /**
     * list the available AWS MediaLive channels
     * @param siteId Id of the site
     */
    def listChannels(siteId) {
        def channelResults = []

        def mlClient = this.createMediaLiveClient(siteId)
        def mpClient = this.createMediaPackageClient(siteId)
        def mlChannels = mlClient.listChannels(new com.amazonaws.services.medialive.model.ListChannelsRequest())

        mlChannels.channels.each { mlChannel ->
            def channelResult = [:]
            channelResult.id = mlChannel.id
            channelResult.name = mlChannel.name
            channelResult.state = mlChannel.state
            channelResult.destinations = []
            channelResult.mlDestinations = mlChannel.destinations
            channelResult.previewURL = ""

            mlChannel.destinations.each { mlDestination ->
                def destinationResult = [:]
                if(mlDestination.mediaPackageSettings) {
                    def destId = mlDestination.mediaPackageSettings[0].channelId
                    destinationResult.mediaPackageChannelId = destId
                    def channelEndpoints = mpClient.listOriginEndpoints(new ListOriginEndpointsRequest().withChannelId(destId)).originEndpoints

                    destinationResult.endpoints = []
                    channelEndpoints.each { mpEndpoint ->
                        def endpoint = [:]
                        endpoint.id = mpEndpoint.id
                        endpoint.description = mpEndpoint.description
                        endpoint.url = mpEndpoint.url

                        destinationResult.endpoints.add(endpoint)
                    }

                    channelResult.destinations.add(destinationResult)
                }
            }

            channelResults.add(channelResult)
        }

        return channelResults
    }

    /**
     * Start a given channel
     * @param channelId channel to start
     * @param siteId Id of the site
     */
    def startChannel(channelId, siteId) {
        def mlClient = this.createMediaLiveClient(siteId)
        def result = mlClient.startChannel(new StartChannelRequest().withChannelId(channelId))

        return result
    }

    /**
     * Stop a given channel
     * @param channelId channel to stop
     * @param siteId Id of the site
     */
    def stopChannel(channelId, siteId) {
        def mlClient = this.createMediaLiveClient(siteId)
        def result = mlClient.stopChannel(new StopChannelRequest().withChannelId(channelId))

        return result
    }
}