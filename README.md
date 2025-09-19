# @dannywieser/bear-markdown-api

[![codecov](https://codecov.io/gh/dannywieser/bear-markdown-api/graph/badge.svg?token=DH1ZYKDVVA)](https://codecov.io/gh/dannywieser/bear-markdown-api)

## ✨ Unlock the full power of your Bear notes.

[Bear](https://bear.app) is a joy to write in—simple, beautiful, and built around Markdown.

But because your notes live inside a database, it’s hard to take them anywhere beyond what Bear itself provides.

This app adds an API for interacting with your notes, opening up endless possibilities for new ways to retrieve, query and interact with your notes in Bear.

## Safe & Secure

This application runs locally so your data never leaves your computer. As noted in the[ Bear documentation](https://bear.app/faq/where-are-bears-notes-located/), read only access to the Bear Database is considered safe.

This application will make a backup of your Bear Database before any interactions - and will only ever interact with the backup copy of the database.

## Installation

`bear-markdown-api` is installed via [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

This application will only run on MacOS and Bear must be installed on the same Mac. If you sync your Bear notes across multiple devices, Bear must also be running to sync the latest notes.

```
npm install -g @dannywieser/bear-markdown-api
```

After installation is complete, run the following command in your terminal:

`bear-api`

```
# 🤖🐻 Bear Markdown API 🐻🤖
> server running: http://0.0.0.0:4040
> root directory: ~/.bear-markdown-api
> config file: ~/.bear-markdown-api/config.json
```

At this point, you can see all your notes by opening this URL: http://0.0.0.0:4040/api/notes

## Endpoints

### `GET /api/notes`

This endpoint retrieves all your notes.

The results of this endpoint can be filtered via passing query parameters to the API endpoint.
Multiple filters can be used at once - the endpoint will return matches for all of the provided filters

#### Date Filtering

These filters will match for the created or modified date on your notes.

Matches will also be found for note content which matches a date format.

- `y` - Year (YYYY)
- `m` - Month (1-12)
- `d` - Day (1-31)

**Examples**

- All entries with dates in 2023: http://0.0.0.0:4040/api/notes?y=2023
- All entries on the 10th day of any month: http://0.0.0.0:4040/api/notes?d=10
- Entries on September 10, 2023: http://0.0.0.0:4040/api/notes?y=2023&m=9&d=10

#### Other Filters

- `text` will allow for search for a the provided text string in your notes: http://0.0.0.0:4040/api/notes?text=foo
- `tag` will search for notes with the given tag. This parameter can be used multiple times to lookup multiple tags: http://0.0.0.0:4040/api/notes?tag=foo&tag=bar

## Issues? Ideas for Improvement?

I'd love to hear your feedback and ideas for features - feel free to [open an issue.](https://github.com/dannywieser/bear-markdown-api/issues)
