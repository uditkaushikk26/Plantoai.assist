# Planto.AI

Planto.AI is a VS Code extension that integrates with a Flask backend to provide code generation, explanation, debugging, and execution functionalities using Groq and Google Generative AI.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/planto-ai.git
    cd planto-ai
    ```

2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

3. Create a `.env` file in the root directory and add your API keys:
    ```env
    GROQ_API_KEY=your_groq_api_key
    GOOGLE_API_KEY=your_google_api_key
    ```

4. Run the Flask server:
    ```sh
    python app.py
    ```

5. Open the project in Visual Studio Code and install the necessary extensions.

## Usage

1. Open the Planto.AI sidebar in VS Code.
2. Enter your prompt in the text area.
3. Click on one of the buttons to perform the desired action:
    - **Explain Code**: Provides an explanation of the given code snippet.
    - **Generate Code**: Generates code based on the provided description.
    - **Debug Code**: Debugs the provided code snippet.
    - **Run Code**: Executes the provided code snippet and returns the output.

## API Endpoints

The Flask backend provides the following endpoints:

- **POST /generate-code**: Generates code based on the provided description.
- **POST /explain-code**: Provides an explanation of the given code snippet.
- **POST /debug-code**: Debugs the provided code snippet.
- **POST /run-code**: Executes the provided code snippet and returns the output.
- **GET /test**: A test endpoint to check if the server is running.

## Error Handling

The Flask backend handles the following errors:

- **400 Bad Request**: Returned when the request is malformed or missing required parameters.
- **404 Not Found**: Returned when the requested resource is not found.
- **500 Internal Server Error**: Returned when an unexpected error occurs on the server.

## Logging

The Flask backend uses Python's built-in logging module to log errors and other important information.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.