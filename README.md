# NxtEp

NxtEp is a web application that provides information on various hearings and permissions from different Norwegian authorities. The application is built using TypeScript, JavaScript, React, and Next.js.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/nxtep.git
    cd nxtep
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

The application provides links to different sections, including:

- Statsforvalterens høringer
- Tillatelser fra Norske Utslipp
- Login

You can navigate through these sections using the buttons on the homepage.

## Project Structure

The project structure is as follows:

## Features

- **Scraping and Parsing**: The application scrapes data from various Norwegian government websites and parses the information.
- **PDF Processing**: Extracts and processes text data from PDFs.
- **Date Parsing**: Converts Norwegian date formats to ISO 8601 format.
- **User Interface**: Provides a user-friendly interface for navigating different sections.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.