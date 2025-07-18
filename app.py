import os
import json
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'mysecretkey'

try:
    genai.configure(api_key="AIzaSyAe0WNP-J7FjfSe1OesVqfJcPYp0q8bnQ0")
except KeyError:
    print("Error: La variable de entorno GOOGLE_API_KEY no está configurada.")
    exit()

# Configuración del modelo de IA
generation_config = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/profile-form')
def profile_form():
    return render_template('profileForm.html')

@app.route('/cv-generate')
def cv_generate():
    return render_template('cvGenerate.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/api/optimize-cv', methods=['POST'])
def optimize_cv_with_ai():
    """
    Punto de entrada de la API para optimizar el CV.
    Recibe los datos del CV y la descripción del trabajo, los procesa con la IA
    y devuelve los datos del CV optimizados.
    """
    data = request.get_json()
    if not data or 'cvData' not in data or 'jobDescription' not in data:
        return jsonify({"error": "Datos incompletos"}), 400

    cv_data_str = data['cvData']
    job_description = data['jobDescription']

    # --- El Corazón de la IA: El Prompt ---
    # Este prompt es la instrucción que le damos a la IA. Es crucial ser detallado.
    prompt = f"""
    Eres un asistente experto en Recursos Humanos y redacción de CVs. Tu tarea es optimizar el siguiente currículum (en formato JSON) para que se ajuste perfectamente a la descripción de trabajo proporcionada.

    Reglas importantes:
    1.  **Analiza la descripción del trabajo:** Identifica las habilidades clave, palabras clave, experiencia y cualificaciones más importantes que buscan.
    2.  **Modifica el CV:** Reescribe sutilmente el 'professionalProfile', las descripciones de 'experience', y los 'achievements' para resaltar cómo el candidato cumple con los requisitos del trabajo.
    3.  **Ajusta Habilidades y Fortalezas:** Si es necesario, sugiere leves cambios o reordenamientos en las listas de 'skills' y 'coreStrengths' para que coincidan con lo que pide la vacante, basándote en la información ya existente.
    4.  **Corrige ortografía:**Si es necesario corrige errores de sintaxis, acentuaciones y otros errores ortográficos.
    4.  **NO inventes información:** Trabaja únicamente con los datos proporcionados en el CV original. No añadas experiencias o habilidades que no existan.
    5.  **Mantén la estructura JSON:** Tu respuesta DEBE ser un objeto JSON VÁLIDO y COMPLETO que siga exactamente la misma estructura que el JSON del CV original. No incluyas explicaciones, solo el JSON.

    **Descripción del Trabajo:**
    ---
    {job_description}
    ---

    **CV Original (en formato JSON):**
    ---
    {cv_data_str}
    ---

    **Tu Tarea:** Devuelve el CV optimizado en formato JSON.
    """

    try:
        # Llama a la API de Gemini
        response = model.generate_content(prompt)
        
        # Limpia la respuesta para asegurarnos de que sea un JSON válido
        # La IA a veces envuelve el JSON en bloques de código (```json ... ```)
        cleaned_response = response.text.strip().replace('```json', '').replace('```', '').strip()
        
        # Convierte la respuesta de texto a un objeto JSON
        optimized_data = json.loads(cleaned_response)
        
        # Devuelve los datos optimizados al frontend
        return jsonify(optimized_data)

    except Exception as e:
        print(f"Error al procesar con la IA o al parsear JSON: {e}")
        # Si la IA falla, devuelve los datos originales para no romper la aplicación
        return jsonify(json.loads(cv_data_str)), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

