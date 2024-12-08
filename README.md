# ProtoVerge

ProtoVerge is a tool to track handle availability, server statuses, and provide a sleek frontpage for your Personal Data Store (PDS).

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Docker](#docker)

## Introduction

ProtoVerge is designed to help you track handle availability, server statuses, and have a sleek frontpage for your PDS (Personal Data Store).

## Features

- Track handle availability
- Monitor server status
- Sleek frontpage

## Installation

To install ProtoVerge, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/siliwan/ProtoVerge.git
    cd ProtoVerge
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Usage

To start the application, use the following command:
    ```sh
    npm run start
    ```

This will start the application in development mode. You can access it at http://localhost:3000. 

## Development
For development purposes, you can use the following commands:  
- Build the application:  
`npm run build`
- Run the application in development mode:  
`npm run dev`
- Format the code:  
`npm run fmt`
- Lint the code:  
`npm run lint`

## Environment Variables
ProtoVerge uses environment variables to configure various aspects of the application.

| Variable             | Description                   | Default |
|----------------------|-------------------------------|---------|
| ORIGIN               | The origin of the application |         |
| PUBLIC_INSTANCE_NAME | The name of the pds instance  |         |
| PUBLIC_INSTANCE_URL  | The URL of the pds instance   |         |

## Docker
ProtoVerge can be run using Docker. Follow these steps:  
1. Build the Docker image:  
`docker-compose build`
2. Run the Docker container:  
`docker-compose up`

The application will be available at http://localhost:3000. 