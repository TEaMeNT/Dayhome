import json
from flask import Blueprint, request, render_template, session
import sqlite3

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route("/api/api_get_daily_lessons", methods=['GET', 'POST'])
def api_get_daily_lessons():
    db = sqlite3.connect('bases/DB.db')
    cur = db.cursor()
    days = cur.execute(f'''SELECT * FROM Schedule''').fetchall()
    dict = {}
    for day in days:
        if(day[0] in dict.keys()):
            dict[day[0]].append(day[1:])
        else:
            dict[day[0]] = [day[1:]]
    cur.close()
    db.close()
    return json.dumps(dict)