<img src="/docs/sigf.png" align="center" width="100%" />
<br />
<a href="https://opencollective.com/jsmonday" target="_blank">
  <img src="https://opencollective.com/jsmonday/tiers/one-shot-donation.svg?avatarHeight=60&width=600" />
</a>
<br />

SIGF is a simple and powerful service that uses **Puppeteer** in order to generate the OpenGraph image for every JSMonday article. <br />
It's build to work on **Google Cloud Functions**, whose Linux distribution is way better than AWS one (and that solves a lot of common problems).

# Supported Image Formats

At the moment, SIGF supports the following image formats:

- Instagram Story
- Instagram Image
- OpenGraph Image

# Parameters

- Title
- Description
- Image
- Template
- Number (optional)

# Example Call

`POST /my/lambda/endpoint`

```json
{
  "title": "My Awesome Title",
  "description": "Here it is the description",
  "image": "https://url/to/image",
  "template": "all"
}
```

**Response:**

```json
{
  "success": "true",
  "data": {
    "openGraph": "image-link",
    "instagram": {
      "story": "image-link",
      "post": "image-link"
    }
  }
}
```

# License
[Unlicense](/LICENSE.md)
