<img src="/docs/sigf.png" align="center" width="100%" />
<br />
<a href="https://opencollective.com/jsmonday" target="_blank">
  <img src="https://opencollective.com/jsmonday/tiers/one-shot-donation.svg?avatarHeight=60&width=600" />
</a>
<br />

**C E Z A N N E** is a simple and powerful service that uses **Puppeteer** in order to generate the OpenGraph image for every JSMonday article. <br />
It's build to work on **Google Cloud Functions**, whose Linux distribution is way better than AWS one (and that solves a lot of common problems).

# Supported Image Formats

At the moment, SIGF supports the following image formats:

- Instagram Image (1080px * 1080px)
- OpenGraph Image (1920px * 1080px)

# Parameters

- template
- template

# Example Call

`POST /my/lambda/endpoint`

```json
{
  "id": 1,
  "template": "snippet"
}
```

**Response:**

```json
{
  "opengraph": "<url>",
  "instagram": "<url>"
}
```

# License
[Unlicense](/LICENSE.md)
