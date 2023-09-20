import json
from flask import Blueprint, request, render_template, session
import sqlite3

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route("/api/get_unique_visitors", methods=['GET', 'POST'])
def api_get_daily_lessons():
    db = sqlite3.connect('bases/DB.db')
    cur = db.cursor()
    names = cur.execute(f'''SELECT * FROM Schedule''').fetchall()
    print(names)
    cur.close()
    db.close()
    return json.dumps(names)