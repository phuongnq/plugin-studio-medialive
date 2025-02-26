package plugins.org.rd.plugin.awsmedialiveconsole

@Grab(group='software.amazon.awssdk', module='medialive', version='2.29.52', initClass=false)
@Grab(group='software.amazon.awssdk', module='mediapackage', version='2.29.52', initClass=false)
@Grab(group='software.amazon.awssdk', module='auth', version='2.29.52', initClass=false)
@Grab(group='software.amazon.awssdk', module='regions', version='2.29.52', initClass=false)

import software.amazon.awssdk.auth.credentials.*
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.medialive.MediaLiveClient
import software.amazon.awssdk.services.medialive.model.*
import software.amazon.awssdk.services.mediapackage.MediaPackageClient
import software.amazon.awssdk.services.mediapackage.model.*

/**
 * This class is a service class that maps console functionality to AWS MediaLive services
 */
public class MediaLiveConsole {

    MediaLiveClient mediaLiveClient
    MediaPackageClient mediaPackageClient
    def pluginConfig

    /**
     * constructor
     */
    MediaLiveConsole(pluginConfig) {
        this.pluginConfig = pluginConfig
    }

    /**
     * Look up credentials for AWS from the site
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
     * Return the MediaLive client. If one does not exist for the instance, create it.
     */
    def createMediaLiveClient() {
        if (this.mediaLiveClient == null) {
            def creds = this.lookupAwsMediaCredentials()
            AwsCredentialsProvider credProvider

            if (creds.apiKey && creds.apiSecret) {
                AwsBasicCredentials awsCreds = AwsBasicCredentials.create(creds.apiKey, creds.apiSecret)
                credProvider = StaticCredentialsProvider.create(awsCreds)
            } else {
                credProvider = ProfileCredentialsProvider.create()
            }

            this.mediaLiveClient = MediaLiveClient.builder()
                .region(Region.of(creds.region))
                .credentialsProvider(credProvider)
                .build()
        }

        return this.mediaLiveClient
    }

    /**
     * Return the MediaPackage client. If one does not exist for the instance, create it.
     */
    def createMediaPackageClient() {
        if (this.mediaPackageClient == null) {
            def creds = this.lookupAwsMediaCredentials()
            AwsCredentialsProvider credProvider

            if (creds.apiKey && creds.apiSecret) {
                AwsBasicCredentials awsCreds = AwsBasicCredentials.create(creds.apiKey, creds.apiSecret)
                credProvider = StaticCredentialsProvider.create(awsCreds)
            } else {
                credProvider = ProfileCredentialsProvider.create()
            }

            this.mediaPackageClient = MediaPackageClient.builder()
                .region(Region.of(creds.region))
                .credentialsProvider(credProvider)
                .build()
        }

        return this.mediaPackageClient
    }

    /**
     * List the available AWS MediaLive channels.
     */
    def listChannels() {
        def channelResults = []

        def mlClient = this.createMediaLiveClient()
        def mpClient = this.createMediaPackageClient()

        def listChannelsResponse = mlClient.listChannels(ListChannelsRequest.builder().build())

        listChannelsResponse.channels().each { mlChannel ->
            def channelResult = [:]
            channelResult.id = mlChannel.id()
            channelResult.name = mlChannel.name()
            channelResult.state = mlChannel.state().toString()
            channelResult.destinations = []
            channelResult.mlDestinations = mlChannel.destinations().collect { destination ->
                [
                    id: destination.id(),
                    settings: destination.mediaPackageSettings().collect { setting ->
                        [channelId: setting.channelId()]
                    }
                ]
            }

            channelResult.previewURL = ""

            mlChannel.destinations().each { mlDestination ->
                def destinationResult = [:]
                if (mlDestination.mediaPackageSettings()) {
                    def destId = mlDestination.mediaPackageSettings().get(0).channelId()
                    destinationResult.mediaPackageChannelId = destId

                    def listOriginEndpointsResponse = mpClient.listOriginEndpoints(
                        ListOriginEndpointsRequest.builder().channelId(destId).build()
                    )

                    destinationResult.endpoints = []
                    listOriginEndpointsResponse.originEndpoints().forEach { mpEndpoint ->
                        def endpoint = [:]
                        endpoint.id = mpEndpoint.id()
                        endpoint.description = mpEndpoint.description()
                        endpoint.url = mpEndpoint.url()

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
     * Start a given channel.
     * @param channelId Channel to start
     */
    def startChannel(channelId) {
        def mlClient = this.createMediaLiveClient()
        def startChannelResponse = mlClient.startChannel(
            StartChannelRequest.builder().channelId(channelId).build()
        )

        return startChannelResponse
    }

    /**
     * Stop a given channel.
     * @param channelId Channel to stop
     */
    def stopChannel(channelId) {
        def mlClient = this.createMediaLiveClient()
        def stopChannelResponse = mlClient.stopChannel(
            StopChannelRequest.builder().channelId(channelId).build()
        )

        return stopChannelResponse
    }
}
