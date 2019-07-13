# SIGF - Serverless Image Generation Function

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
- Number (optional) 

# License
[Unlicense](/LICENSE.md)