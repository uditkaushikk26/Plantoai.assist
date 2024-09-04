from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
import os
from langchain_google_genai import ChatGoogleGenerativeAI
import textwrap
from IPython.display import Markdown, display
import markdown2
import logging

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

# Initialize Groq client with API key from environment variables
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

# Initialize Google Generative AI client with API key from environment variables
google_key = os.getenv('GOOGLE_API_KEY')
gen_ai_client = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=google_key)

def convert_to_markdown(text):
    """
    Convert text to Markdown format.
    """
    text = text.replace('•', '  *')
    return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

# Error handler for 400 Bad Request
@app.errorhandler(400)
def handle_bad_request(error):
    return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

# Error handler for 404 Not Found
@app.errorhandler(404)
def handle_not_found(error):
    return jsonify({'error': 'Not Found', 'message': str(error)}), 404

# Error handler for 500 Internal Server Error
@app.errorhandler(500)
def handle_internal_server_error(error):
    return jsonify({'error': 'Internal Server Error', 'message': str(error)}), 500

@app.route("/generate-code", methods=['POST'])
def generate_code():
    """
    Generate code based on the provided description.
    """
    try:
        description = request.form.get('query')
        if not description:
            log.error('No description provided')
            return jsonify({'error': 'No description provided. Please provide a description to generate code.'}), 400
        
        chat_response = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"""
                    Generate code for the following description: {description}.
                    
                    Requirements:
                    - The code should be well-commented and easy to understand.
                    - It should be written in the appropriate programming language based on the description.
                    - Follow best practices and coding standards.
                    - Include necessary imports and setup code.
                    - Ensure the code is modular and reusable.
                    - Handle potential edge cases and errors gracefully.
                    - Optimize for performance where applicable.
                    - Include unit tests to verify the functionality of the code.
                    - Provide a brief explanation of the code's logic and structure in comments.
                    - If the code involves user input, include validation and sanitization.
                    - If the code interacts with external services or APIs, include error handling and retries.
                    - Ensure the code is compatible with the latest version of the language or framework used.
                    """
                }
            ],
            model="llama3-8b-8192"
        )
        generated_code = chat_response.choices[0].message.content
        log.info('Code generated successfully')
        return jsonify({'code': generated_code})
    except Exception as e:
        log.error(f'Error generating code: {e}')
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

@app.route("/explain-code", methods=['POST'])
def explain_code():
    """
    Explain the provided code snippet.
    """
    try:
        code_snippet = request.get_json().get('code')
        if not code_snippet:
            log.error('No code provided')
            return jsonify({'error': 'No code provided. Please provide code to explain.'}), 400
        
        explanation = get_code_explanation(code_snippet)
        return jsonify({'explanation': explanation})
    except Exception as e:
        log.error(f'Error explaining code: {e}')
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

def get_code_explanation(code_snippet):
    """
    Get explanation for the provided code snippet using Groq client.
    """
    chat_response = groq_client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Explain the following code use : {code_snippet}"
            }
        ],
        model="llama3-8b-8192"
    )
    explanation = chat_response.choices[0].message.content
    markdown_explanation = markdown2.markdown(explanation)
    return markdown_explanation

@app.route("/debug-code", methods=['POST'])
def debug_code():
    """
    Debug the provided code snippet.
    """
    try:
        code_snippet = request.get_json().get('code')
        if not code_snippet:
            log.error('No code provided')
            return jsonify({'error': 'No code provided. Please provide code to debug.'}), 400
        
        debugged_code = get_debugged_code(code_snippet)
        return jsonify({'code': debugged_code})
    except Exception as e:
        log.error(f'Error debugging code: {e}')
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

def get_debugged_code(code_snippet):
    """
    Get debugged code for the provided code snippet using Google Generative AI client.
    """
    prompt = f"solve the error of the following code and remember don't add extra code, just debug the errors and return the entire updated with comments showing the changes made:\n\n{code_snippet}"
    result = gen_ai_client.invoke(prompt)
    debugged_code = result.content
    return debugged_code

@app.route("/run-code", methods=['POST'])
def run_code():
    """
    Run the provided code snippet and return the output.
    """
    try:
        data = request.get_json()
        code_snippet = data.get('code')
        if not code_snippet:
            log.error('No code provided')
            return jsonify({'error': 'No code provided. Please provide code to run.'}), 400
        
        chat_response = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"U have to act like a compiler, compile this code:\n\n{code_snippet}\n\nand only give the output this code will give. If any error, also give the error in the way a terminal gives remember DON'T FIX THE CODE"
                }
            ],
            model="llama3-8b-8192"
        )
        output = chat_response.choices[0].message.content
        return jsonify({'output': output})
    except Exception as e:
        log.error(f'Error running code: {e}')
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

@app.route("/test", methods=['GET'])
def test_route():
    """
    Test route to check if the server is running.
    """
    return jsonify({'output': 'the route is working'})

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=False)