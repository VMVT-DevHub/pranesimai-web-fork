# Pranešimai WEB

[![License](https://img.shields.io/github/license/vmvt-devhub/pranesimai-web)](https://github.com/vmvt-devhub/pranesimai-web/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/vmvt-devhub/pranesimai-web)](https://github.com/vmvt-devhub/pranesimai-web/issues)
[![GitHub stars](https://img.shields.io/github/stars/vmvt-devhub/pranesimai-web)](https://github.com/vmvt-devhub/pranesimai-web/stargazers)

This repository contains the source code and documentation for the Pranešimai WEB, developed by the Valstybinė maisto ir veterinarijos tarnyba

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About the Project

The Pranešimai WEB is designed to provide functionalities of collecting surveys about different food and vetinary services

This is a client application that utilizes
the [Pranešimai API](https://github.com/vmvt-devhub/pranesimai-api-fork).

## Getting Started

To get started with the Pranešimai WEB, follow the instructions below.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vmvt-devhub/pranesimai-web-fork.git
   ```

2. Install the required dependencies:

   ```bash
   cd pranesimai-web
   yarn install
   ```

### Usage

1. Set up the required environment variables. Copy the `.env.example` file to `.env` and provide the necessary values for the variables.

2. Start the WEB server:

   ```bash
   yarn start
   ```

The WEB will be available at `http://localhost:8080`.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a
pull request. For more information, see the [contribution guidelines](./CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](./LICENSE).
