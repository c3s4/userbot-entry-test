# Userbot test

Userbot first test project.

## Prerequisites

To run this project, you will need to have `node.js` installed on your machine.
The minimum required version is 18.0.0. You also need `npm` or `yarn`.

## Installation

The very first step is to clone this repository. Once you have done that, you can install the dependencies by
running the following command on your terminal:

```bash
npm install
```

or if you prefer `yarn`:

```bash
yarn
```

## Usage

To start the analysis script, you can run the following command:

```bash
npm start <path-to-file>
```

or if you prefer `yarn`:

```bash
yarn start <path-to-file>
```

The `<path-to-file>` argument is mandatory and should be the path to the file you want to analyze.
This path can be either relative or absolute, or even a URL. In case of a URL, you can use the `http` or `https` protocols.

Example:

```bash
yarn start README.md
```

or

```bash
yarn start https://raw.githubusercontent.com/c3s4/userbot-entry-test/main/README.md
```

## Development

To run the tests, you can use the following command:

```bash
yarn test
```

If you like to add analysis, you can create a proper component inside the `src/analysis` folder implementing the
`AnalyzerComponent` interface and adding to the `ContentAnalyzer` controller.

If you like to read files from other sources, you can create a proper class inside the `src/file-reader` folder
extending the `FileReaderHandler` abstract class and implementing the `match` and the `getContents` methods.

This class is part of a chain of responsibility pattern, so you can add as many readers as you want. To minimize the
code needed to add a new reader, the abstract class provides the methods to add and get the successor of the chain and
the method to handle the request, using a Template Method pattern.

The `match` method is used to check if the reader can handle the request, and the `getContents` method is used to read
the file and return its contents. So you only to have to implement the logic needed to check if the reader can handle and
the logic to read the file.
