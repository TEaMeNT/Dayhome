import sqlite3
from flask import Flask, request, render_template, make_response
import os
from blueprints.api import api_blueprint

app = Flask(__name__, template_folder='pages')
app.register_blueprint(api_blueprint)

@app.route('/')
def index():
    return render_template('main.html')

if __name__ == "__main__":
    app.run(debug=False)