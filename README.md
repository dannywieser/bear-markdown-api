# @dannywieser/bear-markdown-api

[![codecov](https://codecov.io/gh/dannywieser/bear-markdown-api/graph/badge.svg?token=DH1ZYKDVVA)](https://codecov.io/gh/dannywieser/bear-markdown-api)

## ✨ Unlock the full power of your Bear notes.

[Bear](https://bear.app) is a joy to write in—simple, beautiful, and built around Markdown.

But because your notes live inside a database, it’s hard to take them anywhere beyond what Bear itself provides.

This app adds an API for interacting with your notes, opening up endless possibilities for new ways to retrieve, query and interact with your notes in Bear.

## Safe & Secure

This application runs locally so your data never leaves your computer. As noted in the[ Bear documentation](https://bear.app/faq/where-are-bears-notes-located/), read only access to the Bear Database is considered safe.

## Installation

`bear-markdown-api` is installed via [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

This application will only run on MacOS and Bear must be installed on the same Mac. If you sync your Bear notes across multiple devices, Bear must also be running to sync the latest notes.

```
npm install -g @dannywieser/bear-markdown-api
```

After installation is complete, run the following command in your terminal:

`bear-markdown-api`

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

#### Example Entry Response

```
  {
    "created": "2025-09-15T12:29:54.389Z",
    "externalUrl": "bear://x-callback-url/open-note?id=037EAC56-916B-4D3C-AFDF-2B532532E947",
    "files": [],
    "id": "037EAC56-916B-4D3C-AFDF-2B532532E947",
    "modified": "2025-09-19T12:51:12.193Z",
    "noteUrl": "/note/037EAC56-916B-4D3C-AFDF-2B532532E947",
    "self": "http://0.0.0.0:4040/api/notes/037EAC56-916B-4D3C-AFDF-2B532532E947",
    "source": "bear",
    "tags": [],
    "text": "# Welcome to `bear-markdown-api`\n\n[Bear](~https://bear.app~) is a joy to write in—simple, beautiful, and built around Markdown.\n\nBut because your notes live inside a database, it’s hard to take them anywhere beyond what Bear itself provides.\n\nThis app adds an API for interacting with your notes, opening up endless possibilities for new ways to retrieve, query and interact with your notes in Bear.\n\n\n",
    "title": "Welcome to bear-markdown-api"
  },
```

### `GET /api/notes/<Bear Unique Identifier>`

Retrieve a specific note via the unique identifier provided by Bear.

The text for the note is returned as plain text, and also as a set of tokens parsed via [Marked](https://marked.js.org/).

#### Example Response

```
{
  "created": "2025-09-15T12:29:54.389Z",
  "externalUrl": "bear://x-callback-url/open-note?id=037EAC56-916B-4D3C-AFDF-2B532532E947",
  "files": [],
  "id": "037EAC56-916B-4D3C-AFDF-2B532532E947",
  "modified": "2025-09-19T12:51:12.193Z",
  "noteUrl": "/note/037EAC56-916B-4D3C-AFDF-2B532532E947",
  "self": "http://0.0.0.0:4040/api/notes/037EAC56-916B-4D3C-AFDF-2B532532E947",
  "source": "bear",
  "tags": [],
  "text": "# Welcome to `bear-markdown-api`\n\n[Bear](~https://bear.app~) is a joy to write in—simple, beautiful, and built around Markdown.\n\nBut because your notes live inside a database, it’s hard to take them anywhere beyond what Bear itself provides.\n\nThis app adds an API for interacting with your notes, opening up endless possibilities for new ways to retrieve, query and interact with your notes in Bear.\n\n\n",
  "title": "Welcome to bear-markdown-api",
  "tokens": [
    {
      "type": "heading",
      "raw": "# Welcome to `bear-markdown-api`\n\n",
      "depth": 1,
      "text": "Welcome to `bear-markdown-api`",
      "tokens": [
        {
          "type": "text",
          "raw": "Welcome to ",
          "text": "Welcome to ",
          "escaped": false
        },
        {
          "type": "codespan",
          "raw": "`bear-markdown-api`",
          "text": "bear-markdown-api"
        }
      ]
    },
    {
      "type": "paragraph",
      "raw": "[Bear](~https://bear.app~) is a joy to write in—simple, beautiful, and built around Markdown.",
      "text": "[Bear](~https://bear.app~) is a joy to write in—simple, beautiful, and built around Markdown.",
      "tokens": [
        {
          "href": "~https://bear.app~",
          "raw": "[Bear](~https://bear.app~)",
          "type": "link"
        },
        {
          "type": "text",
          "raw": " is a joy to write in—simple, beautiful, and built around Markdown.",
          "text": " is a joy to write in—simple, beautiful, and built around Markdown.",
          "escaped": false
        }
      ]
    },
    {
      "type": "space",
      "raw": "\n\n"
    },
    {
      "type": "paragraph",
      "raw": "But because your notes live inside a database, it’s hard to take them anywhere beyond what Bear itself provides.",
      "text": "But because your notes live inside a database, it’s hard to take them anywhere beyond what Bear itself provides.",
      "tokens": [
        {
          "type": "text",
          "raw": "But because your notes live inside a database, it’s hard to take them anywhere beyond what Bear itself provides.",
          "text": "But because your notes live inside a database, it’s hard to take them anywhere beyond what Bear itself provides.",
          "escaped": false
        }
      ]
    },
    {
      "type": "space",
      "raw": "\n\n"
    },
    {
      "type": "paragraph",
      "raw": "This app adds an API for interacting with your notes, opening up endless possibilities for new ways to retrieve, query and interact with your notes in Bear.",
      "text": "This app adds an API for interacting with your notes, opening up endless possibilities for new ways to retrieve, query and interact with your notes in Bear.",
      "tokens": [
        {
          "type": "text",
          "raw": "This app adds an API for interacting with your notes, opening up endless possibilities for new ways to retrieve, query and interact with your notes in Bear.",
          "text": "This app adds an API for interacting with your notes, opening up endless possibilities for new ways to retrieve, query and interact with your notes in Bear.",
          "escaped": false
        }
      ]
    },
    {
      "type": "space",
      "raw": "\n\n\n"
    }
  ]
}
```

### `GET /api/notes/random`

Retrieve a single random note.

The text for the note is returned as plain text, and also as a set of tokens parsed via [Marked](https://marked.js.org/).

## Issues? Ideas for Improvement?

I'd love to hear your feedback and ideas for features - feel free to [open an issue.](https://github.com/dannywieser/bear-markdown-api/issues)
