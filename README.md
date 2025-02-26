# AWS MediaLive Console Plugin for Crafter CMS

Add a AWS MediaLive management console for live video encoding to your project.
The console allows content managers to start, stop and preview MediaLive channels from within Crafter Studio.

# Installation

Install the plugin via Studio's Plugin Management UI under Site Tools > Plugin Management.

**Required parameter:**

- AWS Region where you will run Media Live and Media Player

Ex: `/config/plugins/org/rd/plugin/awsmedialiveconsole/config.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
    <awsRegion>us-east-1</awsRegion>
</config>
```

**Optional parameters:**

- AWS API Key with access to Media Live and Media Player
- AWS API Secret with access to Media Live and Media Player

Ex: `/config/plugins/org/rd/plugin/awsmedialiveconsole/config.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
    <awsApiKey>${enc:CCE-V1#xxxx}</awsApiKey>
    <awsApiSecret>${enc:CCE-V1#xxxx}</awsApiSecret>
    <awsRegion>us-east-1</awsRegion>
</config>
```

*Note: If credentials are not provided, the plugin uses the AWS default profile installed in the server.*