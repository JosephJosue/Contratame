from flask import Flask, render_template, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'mysecretkey'

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
