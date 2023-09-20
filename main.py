import sqlite3
from flask import Flask, request, render_template, make_response
import os
from blueprints.api import api_blueprint

app = Flask(__name__, template_folder='pages')
app.register_blueprint(api_blueprint)

@app.route('/')
def index():
    db = sqlite3.connect('bases/DB.db')
    cur = db.cursor()
    names = cur.execute(f'''SELECT * FROM Schedule''').fetchall()
    print(names)
    return render_template('main.html')

if __name__ == "__main__":
    app.run(debug=False)